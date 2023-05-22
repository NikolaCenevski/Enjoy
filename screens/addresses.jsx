import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../components/auth";
import { checkIfUserIsRegistered, getAddresses, saveAddresses } from "../localDb/localDb";
import { Button, Icon, ListItem } from "react-native-elements";
import { HeaderComponent } from "../components/header";

export function Addresses({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [registeredUser, setRegisteredUser] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAddresses = async () => {
      const registeredUser = await checkIfUserIsRegistered(user.email);
      console.log(registeredUser);
      setRegisteredUser(registeredUser);
      if (registeredUser) {
        const addresses = await getAddresses(user.email);
        setAddresses(addresses);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    setSaved(false);
  }, [addresses]);

  function setDefaultAddress(index) {
    const newAddresses = [...addresses];
    const defaultAddress = newAddresses[0];
    newAddresses[0] = newAddresses[index];
    newAddresses[index] = defaultAddress;
    setAddresses(newAddresses);
  }

  const handleAddAddress = () => {
    if (newAddress !== "") {
      setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
      setNewAddress("");
    }
  };

  const handleDeleteAddress = (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  const handleContinue = async () => {
    await saveAddresses(user.email, addresses); // call saveAddresses function
    navigation.navigate("CreditCards");
  };

  const handleSave = async () => {
    await saveAddresses(user.email, addresses);
    setSaved(true);
  };

  function renderAddressItem(address, index) {
    const isDefault = index === 0;
    const iconColor = isDefault ? "#8BC34A" : "#757575";

    return (
      <ListItem key={index} containerStyle={styles.addressContainer}>
        <Icon
          name={isDefault ? "home" : "place"}
          type="material"
          color={iconColor}
          onPress={() => setDefaultAddress(index)}
        />
        <ListItem.Content style={styles.addressContent}>
          <ListItem.Title
            style={styles.addressTitle}
            onPress={() => setDefaultAddress(index)}
          >
            {address}
            {isDefault && (
              <Text style={styles.defaultAddressText}> (Default)</Text>
            )}
          </ListItem.Title>
        </ListItem.Content>
        <View style={styles.addressButtons}>
          <Icon
            name="delete"
            type="material"
            color="#F44336"
            onPress={() => handleDeleteAddress(index)}
          />
        </View>
      </ListItem>
    );
  }

  return (
    <View style={{flex:1}}>
{registeredUser?(<HeaderComponent navigation={navigation} backPressLeft={true}/>):null}
    <View style={styles.container}>
      <Text style={styles.title}>Addresses</Text>

      <ScrollView style={styles.listContainer}>
        {addresses.map((address, index) => (
          <View key={index}>{renderAddressItem(address, index)}</View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter a new address"
          value={newAddress}
          onChangeText={(text) => setNewAddress(text)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
{
  registeredUser? (<Button title={saved?"Saved":"Save"} buttonStyle={styles.continueButton} disabled={saved} titleStyle={styles.continueButtonText} onPress={handleSave}/>):
  (<Button title='Continue' buttonStyle={styles.continueButton} titleStyle={styles.continueButtonText} onPress={handleContinue}/>)
}
    </View>
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
  listContainer: {
    flex: 1,
    width: "100%",
  },
  addressContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  addressTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  defaultAddressText: {
    color: "green",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "rgb(235, 51, 152)",
    borderRadius: 5,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  continueButton: {
    marginTop:30,
    backgroundColor: "rgb(235, 51, 152)",
    width:150,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
