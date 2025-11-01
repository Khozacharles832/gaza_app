import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function MenuStack() {
    return (
    <Stack
        screenOptions={{
                      headerRight: () => (
                        <Link href="/cart" asChild>
                          <Pressable>
                            {({ pressed }) => (
                              <FontAwesome
                                name="shopping-bag"
                                size={25}
                                color={'#084137'}
                                style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                              />
                            )}
                          </Pressable>
                        </Link>
                      ),
                        headerTitleStyle: {
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: '#FE8C00',
                          fontFamily: 'inter',
                        },

                        //headerTransparent: true,
        }}
    >
        <Stack.Screen name="index" options={{ title: 'Menu'}} />
    </Stack>
    )
}