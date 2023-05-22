import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  clearCart,
  getAddresses,
  getCart,
  getCreditCards,
  removeFromCart,
  saveOrder,
} from "../localDb/localDb";
import { AuthContext } from "../components/auth";
import { Button, Icon, Input } from "react-native-elements";
import { CreditCard } from "../components/creditCard";
import { Address } from "../components/address";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderComponent } from "../components/header";
import { YELLOW } from "../styles/COLORS.JS";
import { PURPLE } from "../styles/COLORS.JS";

export function Cart({ navigation }) {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cards, setCards] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [card, setCard] = useState(null);
  const [address, setAddress] = useState("");
  const [temporaryCard, setTemporaryCard] = useState(false);
  const [temporaryAddress, setTemporaryAddress] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [itemsCard, setItemsCard] = useState([]);
  const [cardId, setCardId] = useState();
  const [openAddress, setOpenAddress] = useState(false);
  const [itemsAddress, setItemsAddress] = useState([]);
  const [openItem, setOpenItem] = useState({});
  const [addressId, setAddressId] = useState();
  const [purchaseEligible, setPurchaseEligible] = useState(false);

  const refreshCart = async () => {
    const cart = await getCart(user.email);
    const items = Object.values(cart);
    setCartItems(items);
  };

  const addCardById = (id) => {
    console.log(id);
    setCard(cards[Number(id)]);
    console.log(card);
    console.log("SET CARD");
  };

  useEffect(() => {
    addCardById(cardId);
  }, [cardId]);

  const addAddressById = (id) => {
    console.log("SET ADDRESS ID " + JSON.stringify(id));
    setAddress(addresses[Number(id)]);
    console.log("SET ADDRESS");
  };

  useEffect(() => {
    addAddressById(addressId);
  }, [addressId]);

  const addTemporaryCard = (cardDetails) => {
    setCard(cardDetails);
    console.log("ADDED TEMPORARY CARD");
    setTemporaryCard(false);
  };

  const addTemporaryAddress = (address) => {
    setAddress(address);
    console.log("ADDED TEMPORARY ADDRESS");
    setTemporaryAddress(false);
  };

  useEffect(() => {
    if (card && address !== "" && cartItems.length > 0)
      setPurchaseEligible(true);
    else setPurchaseEligible(false);
    console.log("ELIGIBLE TO PAY");
  }, [card, address, cartItems]);

  const switchOpenById = (id) => {
    const openItemTemp = { ...openItem };
    openItemTemp[id] = openItemTemp[id] ? !openItemTemp[id] : true;
    setOpenItem(openItemTemp);
    console.log(openItemTemp);
    console.log("SET OPEN ITEM");
  };

  const handleDelete = async (id) => {
    await removeFromCart(user.email, id);
    refreshCart();
  };

  useEffect(() => {
    const fetchAll = async () => {
      const cart = await getCart(user.email);
      const items = Object.values(cart);
      setCartItems(items);
      const addresses = await getAddresses(user.email);
      setAddresses(addresses);
      setItemsAddress(
        addresses.map((address, index) => {
          return { label: address, value: index };
        })
      );
      const cards = await getCreditCards(user.email);
      setCards(cards);
      setItemsCard(
        cards.map((card, index) => {
          return {
            label: cardLabel(card),
            value: index,
          };
        })
      );
      if (cards.length > 0) setCardId(0);
      if (addresses.length > 0) setAddressId(0);
    };

    fetchAll();
  }, []);

  function cardLabel(card) {
    return (
      card.holder +
      " *" +
      card.number.substring(12, 16) +
      " " +
      card.month +
      "/" +
      card.year
    );
  }

  const handlePurchase = async () => {
    if (!purchaseEligible) return null;
    await saveOrder(user.email, {
      card,
      address,
      cartItems,
      date: Date().toLocaleString(),
    });
    await clearCart(user.email);
    console.log("DONE ORDER");
    navigation.replace("Food");
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          padding:10,
          backgroundColor: PURPLE,
          margin:5,
          marginBottom:15,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ flex: 1, color:'white', textAlign: "left", fontWeight: "bold", fontSize:15}}>
            {item.name}
          </Text>
          <Text style={{ flex: 1, color:'white', textAlign: "center", fontWeight: "bold", marginLeft:35 }}>
            {item.quantity}
          </Text>
          <Text style={{ flex: 1, color:'white', textAlign: "right", fontWeight: "bold" }}>
            {item.price * item.quantity} DEN
          </Text>
          <Icon
            name={
              openItem[item.id] ? "keyboard-arrow-up" : "keyboard-arrow-down"
            }
            type="MaterialIcons"
            size={40}
            onPress={() => switchOpenById(item.id)}
            style={{ textAlign: "right" }}
            color="white"
          />
        </View>
        {openItem[item.id] && openItem[item.id] === true ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ flex: 1, textAlign: "left", color:'white' }}>
              Note: {item.note !== "" ? item.note : "None"}
            </Text>
            <Button
              title={"Edit"}
              onPress={() => {
                navigation.navigate("FoodItem", { item, refreshCart });
              }}
              style={{ textAlign: "right" }}
              buttonStyle={{
                backgroundColor: YELLOW,
                marginRight: 5,
                borderRadius: 10,
              }}
              titleStyle={{color:'black'}}
            />
            <Button
              title={"Delete"}
              onPress={() => handleDelete(item.id)}
              style={{ textAlign: "right" }}
              buttonStyle={{
                backgroundColor: "red",
                marginRight: 10,
                borderRadius: 10,
              }}
            />
          </View>
        ) : null}
      </View>
    );
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <View style={{ backgroundColor: YELLOW, flex: 1 }}>
      <HeaderComponent navigation={navigation} backPressLeft={true} />
      <ScrollView style={{ backgroundColor: YELLOW }}>
        <View>
          <Text style={{fontSize:25, margin:15, paddingVertical:10,color:'white', fontWeight:"bold", textAlign:'center', backgroundColor:PURPLE, borderRadius:20}}>Your Food Cart</Text>
          <View
            style={{
              paddingBottom: 10,
              backgroundColor: YELLOW,
              marginBottom: 5,
              borderBottomColor:PURPLE,
              borderBottomWidth:1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                flex: 1,
                textAlign: "left",
                fontWeight: "bold",
                fontSize: 17,
                marginLeft: 10,
              }}
            >
              NAME
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 17,
              }}
            >
              QUANTITY
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: "right",
                fontWeight: "bold",
                fontSize: 17,
                marginRight: 10,
              }}
            >
              PRICE
            </Text>
          </View>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View>
          <SafeAreaView>
            <View
              style={{
                backgroundColor: YELLOW,
                marginVertical:5,
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopColor:PURPLE,
                borderTopWidth:1,
                borderBottomColor:PURPLE,
                borderBottomWidth:1
              }}
            >
              <Text
                style={{
                  verticalAlign: "middle",
                  flex: 1,
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginLeft: 10,
                }}
              >
                Total:
              </Text>
              <Text
                style={{
                  verticalAlign: "middle",
                  flex: 1,
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: 17,
                  marginRight: 10,
                }}
              >
                {totalAmount} DEN
              </Text>
            </View>

            <View
              style={{
                marginTop: 20,
                paddingTop: 20,
                marginHorizontal:10,
                marginBottom: 20,
                paddingBottom: 20,
                borderRadius: 10,
                borderWidth: 2,
                backgroundColor:PURPLE
              }}
            >
              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Choose Address
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <View style={{ flex: 1, marginHorizontal: 5 }}>
                  {addresses.length > 0 ? (
                    <DropDownPicker
                      open={openAddress}
                      value={addressId}
                      items={itemsAddress}
                      setOpen={setOpenAddress}
                      setValue={setAddressId}
                      setItems={setItemsAddress}
                      containerStyle={{ width: "100%" }}
                      labelStyle={{ color: "black", fontSize: 16 }}
                      itemStyle={{ justifyContent: "flex-start" }}
                      dropDownDirection="TOP"
                      style={{
                        height: 55,
                      }}
                    />
                  ) : (
                    <Text>No saved addresses</Text>
                  )}
                </View>
                <View >
                  <Button
                    title="Or Temporary One"
                    onPress={() => setTemporaryAddress(true)}
                    color="yellow"
                    titleStyle={{ color: "black" }}
                    buttonStyle={{
                      backgroundColor: "rgb(245, 218, 28)",
                      marginRight: 5,
                      borderRadius: 10,
                      height: 55
                    }}
                  />
                </View>
                {temporaryAddress ? (
                  <Address onAdd={addTemporaryAddress} />
                ) : null}
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Address selected:
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {address ?? "None"}
              </Text>
            </View>
            <View
              style={{
                marginTop: 20,
                paddingTop: 20,
                marginBottom: 20,
                paddingBottom: 20,
                borderRadius: 10,
                borderWidth: 2,
                marginHorizontal:10,
                backgroundColor:PURPLE
              }}
            >
              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Choose Credit Card
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <View style={{ flex: 1, marginHorizontal:5 }}>
                  {cards.length > 0 ? (
                    <DropDownPicker
                      open={openCard}
                      value={cardId}
                      items={itemsCard}
                      setOpen={setOpenCard}
                      setValue={setCardId}
                      setItems={setItemsCard}                      
                      containerStyle={{ width: "100%" }}
                      labelStyle={{ color: "black", fontSize: 16 }}
                      itemStyle={{ justifyContent: "flex-start" }}
                      dropDownDirection="TOP"
                      style={{
                        height: 55
                      }}
                    />
                  ) : (
                    <Text>No saved cards</Text>
                  )}
                </View>
                <Button
                  title="Or Temporary One"
                  onPress={() => setTemporaryCard(true)}
                  color="yellow"
                  titleStyle={{ color: "black" }}
                  buttonStyle={{
                    backgroundColor: "rgb(245, 218, 28)",
                    marginRight: 5,
                    borderRadius: 10,
                    height: 55
                  }}
                />
                {temporaryCard ? <CreditCard onAdd={addTemporaryCard} /> : null}
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Credit card selected:
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {card ? cardLabel(card) : "None"}
              </Text>
            </View>
            <View style={{ marginBottom: 30 }}>
              <Button
                title="Make Purchase"
                disabled={!purchaseEligible}
                onPress={handlePurchase}
                titleStyle={{ color: "white" }}
                buttonStyle={{
                  backgroundColor: PURPLE,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  height: 55,
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    </View>
  );
}
