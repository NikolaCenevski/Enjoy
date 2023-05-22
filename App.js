import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./screens/login";
import { StatusBar, StyleSheet } from "react-native";
import { Food } from "./screens/food";
import { AuthProvider } from "./components/auth";
import { Addresses } from "./screens/addresses";
import { CreditCards } from "./screens/creditCards";
import { FoodItem } from "./screens/foodItem";
import { Cart } from "./screens/cart";
import { PastOrders } from "./screens/pastOrders";
import { PastOrder } from "./screens/pastOrder";
import { Menu } from "./screens/menu";
import { PURPLE } from "./styles/COLORS.JS";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar backgroundColor={PURPLE} />
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              headerStyle: styles.headerStyle,
              headerTitleStyle: styles.headerTitleStyle,
              headerTintColor: "#fff",
            }}
          >
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Addresses" component={Addresses} 
              options={{ animation: "slide_from_right" }}/>
            <Stack.Screen name="CreditCards" component={CreditCards} 
              options={{ animation: "slide_from_right" }}/>
            <Stack.Screen
              name="Menu"
              component={Menu}
              options={{ animation: "slide_from_left" }}
            />
            <Stack.Screen name="Food" component={Food} />
            <Stack.Screen name="FoodItem" component={FoodItem} />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="PastOrders" component={PastOrders} 
              options={{ animation: "slide_from_right" }}/>
            <Stack.Screen name="PastOrder" component={PastOrder} 
              options={{ animation: "slide_from_right" }}/>
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "rgb(248, 207, 70)",
  },
  headerTitleStyle: {
    fontSize: 24,
    color: "rgb(235, 51, 152)",
    fontFamily: "Arial",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
