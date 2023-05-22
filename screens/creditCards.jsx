import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../components/auth";
import {
  checkIfUserIsRegistered,
  getCreditCards,
  registerUser,
  saveAddresses,
  saveCreditCards,
} from "../localDb/localDb";
import { Button, Input, Text } from "react-native-elements";
import { Overlay } from "react-native-elements";
import { YELLOW } from "../styles/COLORS.JS";
import { PURPLE } from "../styles/COLORS.JS";
import { HeaderComponent } from "../components/header";

export function CreditCards({ navigation, route }) {
  const [cards, setCards] = useState([]);
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState({});
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(false);
  const [saved, setSaved] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCards = async () => {
      const registeredUser = await checkIfUserIsRegistered(user.email);
      console.log(registeredUser);
      setRegisteredUser(registeredUser)
      if (registeredUser) {
        const cards = await getCreditCards(user.email);
        setCards(cards);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    setSaved(false);
  }, [cards]);

  const handleAddCard = () => {
    const card = { holder, number, month, year, cvc };
    const cardErrors = {};
    let isValid = true;

    // Validate holder
    if (!holder) {
      cardErrors.holder = "Holder name is required";
      isValid = false;
    }

    // Validate number
    if (!number) {
      cardErrors.number = "Card number is required";
      isValid = false;
    } else if (!/^\d{16}$/.test(number)) {
      cardErrors.number = "Card number must be 16 digits";
      isValid = false;
    }

    // Validate month
    if (!month) {
      cardErrors.month = "Expiration month is required";
      isValid = false;
    } else if (
      !/^\d{2}$/.test(month) ||
      parseInt(month) < 1 ||
      parseInt(month) > 12
    ) {
      cardErrors.month =
        "Expiration month must be a two-digit number between 01 and 12";
      isValid = false;
    }

    // Validate year
    if (!year) {
      cardErrors.year = "Expiration year is required";
      isValid = false;
    } else if (
      !/^\d{4}$/.test(year) ||
      parseInt(year) < new Date().getFullYear()
    ) {
      cardErrors.year =
        "Expiration year must be a four-digit number in the future";
      isValid = false;
    }

    // Validate cvc
    if (!cvc) {
      cardErrors.cvc = "CVC is required";
      isValid = false;
    } else if (
      !/^\d{3}$/.test(cvc) ||
      parseInt(cvc) < 100 ||
      parseInt(cvc) > 999
    ) {
      cardErrors.cvc = "CVC must be a three-digit number between 100 and 999";
      isValid = false;
    }

    // Add card to array if valid
    if (isValid) {
      setCards([...cards, card]);
      setHolder("");
      setNumber("");
      setMonth("");
      setYear("");
      setCvc("");
      setErrors({});
      setShowAddCardForm(false);
    } else {
      setErrors(cardErrors);
    }
  };

  function setDefaultCard(index) {
    const newCreditCards = [...cards];
    const defaultCard = newCreditCards[0];
    newCreditCards[0] = newCreditCards[index];
    newCreditCards[index] = defaultCard;
    setCards(newCreditCards);
  }

  const handleDeleteCard = (index) => {
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  const handleContinue = async () => {
    await saveCreditCards(user.email, cards);
    await registerUser(user.email);
    navigation.replace("Food");
  };  

  const handleSave = async () => {
    await saveCreditCards(user.email, cards);
    setSaved(true);
  };

  return (
    <View style={{flex:1}}>
       {registeredUser?(<HeaderComponent navigation={navigation} backPressLeft={true}/>):null}
    <View style={styles.container}>
     <Text style={styles.heading}>Credit Cards</Text>
      <ScrollView style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <View style={styles.cardContainer} key={index}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHolder}>{card.holder}</Text>
              {index === 0 && <Text style={styles.defaultText}>Default</Text>}
            </View>
            <View style={styles.cardBody}>
              <Text
                style={styles.cardNumber}
              >{`**** **** **** ${card.number.slice(-4)}`}</Text>
              <Text
                style={styles.cardExpiration}
              >{`${card.month}/${card.year}`}</Text>
            </View>
            <View style={styles.cardFooter}>
              {index !== 0 && (
                <Button
                  title="Set as Default"
                  onPress={() => setDefaultCard(index)}
                  buttonStyle={styles.defaultButton}
                  titleStyle={styles.defaultButtonText}
                />
              )}
              <Button
                title="Delete"
                onPress={() => handleDeleteCard(index)}
                buttonStyle={styles.deleteButton}
                titleStyle={styles.deleteButtonText}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <Button
        title="Add Card"
        onPress={() => setShowAddCardForm(true)}
        buttonStyle={styles.addButton}
        titleStyle={styles.addButtonText}
      />
    {registeredUser?<Button
      title={saved?"Saved":"Save"}
      onPress={handleSave}
      disabled={saved}
      buttonStyle={styles.continueButton}
      titleStyle={styles.continueButtonText}
    />:<Button
    title="Continue"
    onPress={handleContinue}
    buttonStyle={styles.continueButton}
    titleStyle={styles.continueButtonText}
  />    }    
      
      <Overlay
        isVisible={showAddCardForm}
        onBackdropPress={() => setShowAddCardForm(false)}
      >
        <View style={styles.overlayContainer}>
          <Input
            placeholder="Holder Name"
            value={holder}
            onChangeText={setHolder}
            errorMessage={errors.holder}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
          <Input
            placeholder="Card Number"
            value={number}
            onChangeText={setNumber}
            errorMessage={errors.number}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            keyboardType="number-pad"
          />
          <View style={styles.expirationContainer}>
            <Input
              placeholder={"MM"}
              value={month}
              onChangeText={setMonth}
              errorMessage={errors.month}
              containerStyle={[styles.inputContainer, styles.expirationInput]}
              inputStyle={styles.input}
              keyboardType="number-pad"
            />
            <Text style={styles.expirationText}>/</Text>
            <Input
              placeholder="YYYY"
              value={year}
              onChangeText={setYear}
              errorMessage={errors.year}
              containerStyle={[styles.inputContainer, styles.expirationInput]}
              inputStyle={styles.input}
              keyboardType="number-pad"
            />
          </View>
          <Input
            placeholder="CVC"
            value={cvc}
            onChangeText={setCvc}
            errorMessage={errors.cvc}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            keyboardType="number-pad"
          />
          <Button
            title="Add Card"
            onPress={() => {
              handleAddCard();
            }}
            buttonStyle={styles.addButton}
            titleStyle={styles.addButtonText}
          />
        </View>
      </Overlay>
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
  heading: {
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
  cardsContainer: {
    marginTop: 20,
    width: "100%",
    marginBottom: 30,
  },
  cardContainer: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardHolder: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(235,51,152)",
  },
  defaultText: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
    alignSelf: "center",
    backgroundColor: "rgb(245, 218, 28)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardExpiration: {
    fontSize: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  defaultButton: {
    backgroundColor: YELLOW,
    borderRadius: 5,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 5,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  defaultButtonText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
    width: "100%",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  expirationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  expirationInput: {
    width: "40%",
  },
  expirationText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: PURPLE,
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
  continueButton: {
    backgroundColor: "rgb(235, 51, 152)",
    width:150,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  overlayContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  overlayHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
