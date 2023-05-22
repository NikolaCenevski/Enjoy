import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import { Overlay } from "react-native-elements";

export function Address({ onAdd }) {
  const [address, setAddress] = useState("");

  const handleAddAddress = () => {
    if (address !== "") onAdd(address);
  };

  return (
    <View style={styles.container}>
      <Overlay
        onBackdropPress={() => onAdd("")}
        overlayStyle={styles.overlayStyle}
      >
        <View style={styles.overlayContainer}>
          <Input
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            multiline={true}
          />
          <Button
            title="Add Address"
            onPress={() => {
              handleAddAddress();
            }}
            buttonStyle={styles.addButton}
            titleStyle={styles.addButtonText}
          />
        </View>
      </Overlay>
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
  inputContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
    width: "100%",
  },
  input: {
    height: 80,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "rgb(235, 51, 152)",
    borderRadius: 5,
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  overlayContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  overlayStyle: {
    width: "80%",
    height: "auto",
    borderRadius: 5,
  },
});
