import { View, Text, Platform, FlatList } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useCart } from "@/providers/CartProvider";
import React from "react";
import CartListItem from "@/components/CartListItem";
import Button from "@/components/Button";

const CartScreen = () => {
    const { items, total, checkout } = useCart();
    return (
        <View style={{ padding: 10 }}>
            <FlatList 
                data={items}
                renderItem={({ item }) => <CartListItem cartItem={item} />}
                contentContainerStyle={{padding: 10, gap: 10}} 
            />
            <Text style={{ color: 'green', marginTop: 10}}>Total: R{total}</Text>
            <Button onPress={checkout} text="Checkout" />
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );

};

export default CartScreen;