import React, { ReactNode } from "react";
import { PaystackProvider as RNPaystackProvider } from "react-native-paystack-webview";

// Import the env variable
const PUBLIC_KEY = process.env.EXPO_PUBLIC_PAYSTACK_KEY;

interface PaystackProviderProps {
  children: ReactNode;
}

const PaystackProvider: React.FC<PaystackProviderProps> = ({ children }) => {
  if (!PUBLIC_KEY) {
    throw new Error("Paystack public key is missing! Check your .env file.");
  }

  return (
    <RNPaystackProvider
      publicKey={PUBLIC_KEY}
      currency="ZAR"
      defaultChannels={["card"]}
    >
      {children}
    </RNPaystackProvider>
  );
};

export default PaystackProvider;
