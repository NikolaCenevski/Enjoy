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
import { YELLOW } from "../styles/COLORS.JS";
import { HeaderComponent } from "../components/header";
import { PURPLE } from "../styles/COLORS.JS";

export function PastOrder({ navigation, route }) {
  const { address, card, cartItems } = route.params.order;
  const { user } = useContext(AuthContext);
  const [openItem, setOpenItem] = useState({});

  const switchOpenById = (id) => {
    const openItemTemp = { ...openItem };
    openItemTemp[id] = openItemTemp[id] ? !openItemTemp[id] : true;
    setOpenItem(openItemTemp);
    console.log(openItemTemp);
    console.log("SET OPEN ITEM");
  };

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
            style={{ textAlign: "right"}}
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
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Address:
              </Text>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {address}
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
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Credit card:
              </Text>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {cardLabel(card)}
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    </View>
  );
}
