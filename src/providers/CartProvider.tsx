import { CartItem, Tables } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "@/api/order-items";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";

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

  const checkout = async (paymentMethod: 'cash' | 'card', deliveryType: 'delivery' | 'collection') => {
  if (paymentMethod === 'cash') {
    // existing cash flow
    insertOrder({ total }, { onSuccess: saveOrderItems });
  } else if (paymentMethod === 'card') {
    try {
      // call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('initialize-paystack', {
        body: JSON.stringify({
          amount: Math.floor(total * 100), // convert to kobo
        }),
      });

      if (error) throw error;
      if (!data.paymentUrl) throw new Error('No payment URL returned');

      // open browser for Paystack payment
      await WebBrowser.openBrowserAsync(data.paymentUrl);

      // optionally verify payment on your backend
    } catch (err) {
      console.error('Paystack payment failed:', err);
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
