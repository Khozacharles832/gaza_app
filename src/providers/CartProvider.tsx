import { CartItem, Tables } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "@/api/order-items";
import * as WebBrowser from "expo-web-browser";

type Product = Tables<"products">;

type PaymentMethod = "cash" | "card";

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: (paymentMethod: PaymentMethod, deliveryType: "delivery" | "collection") => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();

  const addItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product_id === product.id && item.size === size
    );
    if (existingItem) return updateQuantity(existingItem.id, 1);

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };
    setItems([newCartItem, ...items]);
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems(
      items
        .map((item) =>
          item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const clearCart = () => setItems([]);

  const saveOrderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess() {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
  };

  const checkout = async (
    paymentMethod: PaymentMethod,
    deliveryType: "delivery" | "collection"
  ) => {
    if (paymentMethod === "cash") {
      // Cash flow
      insertOrder(
        { total },
        {
          onSuccess: saveOrderItems,
        }
      );
    } else if (paymentMethod === "card") {
      try {
        // Call your edge function to initialize Paystack
        const res = await fetch(
          "https://your-domain.com/.netlify/functions/initialize-paystack",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: Math.floor(total * 100), // Paystack expects kobo
              deliveryType,
            }),
          }
        );

        const data = await res.json();
        if (!data?.paymentUrl) throw new Error("Failed to initialize Paystack");

        // Open the browser for payment
        const result = await WebBrowser.openBrowserAsync(data.paymentUrl);

        // After closing, you could optionally verify payment status on your backend
        /*if (result.type === "success" || result.type === "dismiss") {
          insertOrder(
            { total, deliveryType, paymentMethod },
            {
              onSuccess: saveOrderItems,
            }
          );
        }*/
      } catch (err) {
        console.error("Paystack payment failed:", err);
      }
    }
  };

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
