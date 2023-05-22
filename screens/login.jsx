import React, { useState, useEffect, useContext } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "../components/auth";
import { checkIfUserIsRegistered } from "../localDb/localDb";

export function Login({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [registeredUser, setRegisteredUser] = useState(false);
  const { user } = useContext(AuthContext);
  GoogleSignin.configure({
    webClientId:
      "X",
  });

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log("GOOGLE BUTTON PRESS CALLED");
    return await auth().signInWithCredential(googleCredential);
  }

  useEffect(() => {
    const getUserStatus = async (user) => {
      const registeredUser = await checkIfUserIsRegistered(user.email);
      setRegisteredUser(registeredUser);
      setInitializing(false);
    };
    if (user) {
      console.log("CALLED GETUSERSTATUS");
      getUserStatus(user);
    }
  }, [user]);

  if (user && !initializing) {
    if (!registeredUser) {
      console.log("NEW USER");
      navigation.replace("Addresses");
    } else navigation.replace("Food");
    return null;
  }

  console.log("LOGIN SCREEN " + user);
  return (
    <View style={styles.container}>
      <Text h1 h1Style={styles.title}>
        Fast Food
      </Text>
      <Image
        source={{
          uri: "https://thumbs.dreamstime.com/b/enjoy-comic-text-collection-sound-effects-pop-art-style-set-speech-bubble-word-short-phrase-cartoon-expression-134687161.jpg",
        }}
        style={styles.image}
      />
      <Button
        title="Sign in with Google"
        icon={{ name: "google", type: "font-awesome", color: "#fff" }}
        onPress={onGoogleButtonPress}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitle}
      />
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
