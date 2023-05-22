import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Button, Icon, Overlay, Text } from "react-native-elements";
import { AuthContext } from "../components/auth";
import { HeaderComponent } from "../components/header";
import { YELLOW } from "../styles/COLORS.JS";
import { PURPLE } from "../styles/COLORS.JS";
import { deleteUser } from "../localDb/localDb";
//import { UserContext } from "./login";

export function Menu({ navigation }) {
  const { user, signOut } = useContext(AuthContext);
  const [deleteUserPopup, setDeleteUserPopup]=useState(false);

  console.log("FORWARD NIKOLA" + JSON.stringify(user));
  if (!user) {
    console.log("FORWARD NO USER" + user);
    navigation.navigate("LogOut");
    return null;
  }

  async function handleLogout() {
    try {
      await signOut(navigation);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteUser() {
    try {
      await deleteUser(user.email);
      await handleLogout();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: YELLOW }}>
      <HeaderComponent navigation={navigation} backPressRight={true} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          margin: 20,
          height: 180,
          backgroundColor: "white",
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Avatar
          rounded
          size="large"
          source={{
            uri: user.photoURL,
          }}
          containerStyle={{
            borderWidth: 2,
            borderColor: "#fff",
            marginBottom: 10,
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
          {user.displayName}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 5, color: "#666" }}>
          {user.email}
        </Text>
      </View>
      <View style={menuItemStyle}>
        <TouchableOpacity
            onPress={() => navigation.navigate('Addresses')}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <View style={{ width: 30, alignItems: "center" }}>
            <Icon
              name="map-marker-alt"
              type="font-awesome-5"
              color="#2d3436"
              size={20}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              Addresses
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={menuItemStyle}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreditCards')}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <View style={{ width: 30, alignItems: "center" }}>
            <Icon
              name="credit-card"
              type="font-awesome-5"
              color="#2d3436"
              size={20}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              Credit Cards
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={menuItemStyle}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PastOrders")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <View style={{ width: 30, alignItems: "center" }}>
            <Icon
              name="utensils"
              type="font-awesome-5"
              color="#2d3436"
              size={20}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              Order History
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={menuItemStyle}>
        <TouchableOpacity
          onPress={() => setDeleteUserPopup(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <View style={{ width: 30, alignItems: "center" }}>
            <Icon
              name="user-slash"
              type="font-awesome-5"
              color="#2d3436"
              size={20}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              Delete Account
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={menuItemStyle}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <View style={{ width: 30, alignItems: "center" }}>
            <Icon
              name="sign-out-alt"
              type="font-awesome-5"
              color="#2d3436"
              size={20}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Overlay
  isVisible={deleteUserPopup}
  onBackdropPress={() => setDeleteUserPopup(false)}
  overlayStyle={{
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '70%',
    alignItems: 'center',
  }}
>
  <Text style={{ fontSize: 20,fontWeight:'400' ,marginBottom: 20, textAlign:'center' }}>
    Are you sure that you want to delete your account?
  </Text>
  <View style={{ flexDirection: 'row' }}>
    <Button
      title="Yes"
      onPress={handleDeleteUser}
      buttonStyle={{ backgroundColor: 'red', marginRight: 10, width:70, borderRadius:15 }}
    />
    <Button
      title="No"
      onPress={() => setDeleteUserPopup(false)}
      buttonStyle={{ backgroundColor: 'gray',marginLeft: 10, width:70, borderRadius:15 }}
    />
  </View>
</Overlay>
    </View>
  );
}

const menuItemStyle = {
  alignItems: "flex-start",
  justifyContent: "center",
  margin: 20,
  marginTop: 0,
  height: 50,
  backgroundColor: "white",
  borderRadius: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
};
