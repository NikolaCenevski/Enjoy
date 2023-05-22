import React, { useState, useEffect, createContext, useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "react-native-elements";
import { AuthContext } from "../components/auth";
//import { UserContext } from "./login";

export function Forward({ navigation }) {
  const { user } = useContext(AuthContext);
  console.log("FORWARD NIKOLA" + JSON.stringify(user));
  if (!user) {
    console.log("FORWARD NO USER" + user);
    navigation.navigate("LogOut");
    return null;
  }

  return (
    <View style={styles.container}>
      <Text h1 h1Style={styles.title}>
        WELCOME TO FORWARD {user.displayName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(245, 218, 28)",
    padding: 30,
  },
  title: {
    fontSize: 32,
    color: "rgb(235,51,152)",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    fontFamily: "Arial",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    borderRadius: 50,
  },
  buttonContainer: {
    width: "100%",
    height: 100,
    marginTop: 100,
  },
  buttonStyle: {
    height: 60,
    backgroundColor: "rgb(235, 51, 152)",
    borderRadius: 10,
    padding: 10,
  },
  buttonTitle: {
    fontWeight: "bold",
  },
});
