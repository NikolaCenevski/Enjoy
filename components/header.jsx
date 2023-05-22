import React from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, Icon, Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { PURPLE } from "../styles/COLORS.JS";

export function HeaderComponent({ navigation, backPressLeft, backPressRight }) {
  return (
    <View style={styles.headerContainer}>
      {backPressLeft ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="white" style={styles.icon} />
        </TouchableOpacity>
      ) : backPressRight ? (
        <Text style={{ paddingHorizontal: 25 }}></Text>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Icon name="menu" size={30} color="white" style={styles.icon} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => navigation.navigate("Food")}>
        <Image
          source={{
            uri: "https://thumbs.dreamstime.com/b/enjoy-comic-text-collection-sound-effects-pop-art-style-set-speech-bubble-word-short-phrase-cartoon-expression-134687161.jpg",
          }}
          style={styles.logo}
        />
      </TouchableOpacity>
      {backPressRight ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="arrow-forward"
            size={30}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : backPressLeft ? (
        <Text style={{ paddingHorizontal: 25 }}></Text>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Icon
            name="shopping-cart"
            size={30}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: PURPLE,
    height: 70,
  },
  logo: {
    height: 55,
    width: 55,
    borderRadius: 20,
    verticalAlign: "middle",
  },
  icon: {
    paddingHorizontal: 10,
  },
});
