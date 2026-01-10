import { CartItem, Tables } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/lib/supabase";

type Product = Tables<"products">;
type PaymentMethod = "cash" | "card";
type DeliveryType = "delivery" | "collection";

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: (paymentMethod: PaymentMethod, deliveryType: DeliveryType) => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartType>({} as CartType);

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  /* ---------------- Cart mutations ---------------- */

  const addItem = (product: Product, size: CartItem["size"]) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_id === product.id && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [
        {
          id: randomUUID(),
          product,
          product_id: product.id,
          size,
          quantity: 1,
        },
        ...prev,
      ];
    });
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  /* ---------------- Checkout ---------------- */

  const checkout = async (
    paymentMethod: PaymentMethod,
    deliveryType: DeliveryType
  ) => {
    if (items.length === 0) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    /* ---------- CASH FLOW (still client-driven) ---------- */
    if (paymentMethod === "cash") {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total,
          payment: "cash",
          //delivery_type: deliveryType,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Cash order failed:", error);
        return;
      }

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        size: item.size,
        quantity: item.quantity,
      }));

      await supabase.from("order_items").insert(orderItems);

      clearCart();
      router.replace(`/(user)/orders/${order.id}`);
      return;
    }

    /* ---------- CARD FLOW (Paystack + webhook) ---------- */
    try {
      const { data, error } = await supabase.functions.invoke(
        "initialize-paystack",
        {
          body: {
            amount: total,
            currency: "ZAR",
            email: user.email,
            user_id: user.id,
            cart_items: items.map((i) => ({
              product_id: i.product_id,
              size: i.size,
              quantity: i.quantity,
            })),
          },
        }
      );

      if (error) throw error;
      if (!data?.authorization_url) {
        throw new Error("Missing Paystack authorization URL");
      }

      await WebBrowser.openBrowserAsync(data.authorization_url);

      // Important: payment is NOT confirmed here
      clearCart();
      router.replace("/payment/pending"); // show "Verifying payment..."

    } catch (err) {
      console.error("Paystack init failed:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        total,
        checkout,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
