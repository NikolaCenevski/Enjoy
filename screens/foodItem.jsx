import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import { addInCart, clearCart, getCart } from "../localDb/localDb";
import { AuthContext } from "../components/auth";
import { HeaderComponent } from "../components/header";
import { PURPLE } from "../styles/COLORS.JS";
import { YELLOW } from "../styles/COLORS.JS";

export function FoodItem({ navigation, route }) {
  const item = route.params.item;
  const refreshCart = route.params.refreshCart;
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(item.quantity ?? 1);
  const [note, setNote] = useState(item.note ?? "");
  const [totalPrice, setTotalPrice] = useState(item.totalPrice ?? item.price);
  const [added, setAdded] = useState(false);

  if (!user) {
    navigation.navigate("LogOut");
    return null;
  }

  const handleNewQuantity = (newQuantity) => {
    setAdded(false);
    if (newQuantity >= 1) setQuantity(newQuantity);
    setTotalPrice(newQuantity * item.price);
    getCart(user.email);
  };

  const handleNoteChange = (text) => {
    setAdded(false);
    setNote(text);
  };

  const handleAddToCart = async () => {
    const cartItem = {
      ...item,
      note,
      quantity,
    };
    await addInCart(user.email, cartItem);
    if (refreshCart !== undefined) await refreshCart();
    setAdded(true);
  };

  return (
    <View style={{ backgroundColor: YELLOW, flex: 1 }}>
      <HeaderComponent navigation={navigation} backPressLeft={true} />
      <ScrollView>
        <View>
          <View
            style={{
              backgroundColor: PURPLE,
              borderRadius: 20,
              margin: 20,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: item.url }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginBottom: 20,
              }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 24,
                color: "white",
                marginBottom: 10,
              }}
            >
              {item.name}
            </Text>
            <Text style={{ fontSize: 16, color: "white", marginBottom: 10 }}>
              {item.ingredients}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "white",
                marginBottom: 20,
              }}
            >
              {item.price} DEN
            </Text>
          </View>
          <View
            style={{
              borderRadius: 20,
              margin: 20,
              marginTop: 0,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              disabled={quantity === 1}
              onPress={() => handleNewQuantity(quantity - 1)}
              style={{ padding: 10 }}
            >
              <Icon
                name="minus"
                type="font-awesome-5"
                size={20}
                color={PURPLE}
              />
            </TouchableOpacity>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginHorizontal: 20 }}
            >
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleNewQuantity(quantity + 1)}
              style={{ padding: 10 }}
            >
              <Icon
                name="plus"
                type="font-awesome-5"
                size={20}
                color={PURPLE}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#FFF",
              borderRadius: 20,
              padding: 20,
              marginHorizontal: 20,
            }}
          >
            <Input
              placeholder="Additional Requests here..."
              value={note}
              onChangeText={handleNoteChange}
              multiline={true}
              numberOfLines={4}
              style={{ textAlignVertical: "top", fontSize: 16, lineHeight: 20 }}
              inputContainerStyle={{ borderBottomWidth: 0 }}
            />
          </View>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              margin: 20,
              marginBottom: 0,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
            >
              Total Price
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: PURPLE }}>
              {totalPrice} DEN
            </Text>
          </View>
          <View style={{ margin: 20 }}>
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={added}
              style={{
                backgroundColor: added ? "#808080" : PURPLE,
                borderRadius: 20,
                paddingVertical: 15,
                paddingHorizontal: 30,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>
                {added ? "Added to Cart" : "Add to Cart"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
