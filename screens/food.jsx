import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  Icon,
  Overlay,
  Tab,
  TabView,
  Text,
} from "react-native-elements";
import { AuthContext } from "../components/auth";
import { onValue, ref } from "firebase/database";
import { db } from "../components/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderComponent } from "../components/header";
import { PURPLE } from "../styles/COLORS.JS";
import { YELLOW } from "../styles/COLORS.JS";

export function Food({ navigation }) {
  const { user } = useContext(AuthContext);
  const [foodTypes, setFoodTypes] = React.useState([]);
  const [foods, setFoods] = React.useState(() => []);
  const [initialized, setInitialized] = React.useState(false);

  if (!user) {
    navigation.navigate("LogOut");
    return null;
  }

  function prepareFoodsFormat(data) {
    let localFoods = [];
    for (let i = 0; i < foodTypes.length; i++) {
      localFoods[i] = Object.entries(data[foodTypes[i]]).map(
        ([key, value]) => ({
          id: key,
          ...value,
        })
      );
    }
    setFoods(localFoods);
  }

  useEffect(() => {
    const refer = ref(db, "/");
    onValue(refer, (snapshot) => {
      setInitialized(false);
      const data = snapshot.val();
      setFoodTypes(Object.keys(data));
      prepareFoodsFormat(data);
      setInitialized(true);
    });
  }, [initialized]);

  const renderFood = ({ item }) => (
    <Card containerStyle={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("FoodItem", { item })}
      >
        <Image source={{ uri: item.url }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.price}>{item.price} DEN</Text>
        </View>
      </TouchableOpacity>
    </Card>
  );

  if (initialized) {
    return (
      <View style={styles.container}>
        <HeaderComponent navigation={navigation} />
        <ScrollView style={{ flex: 1 }}>
          {foodTypes.map((foodType, index) => (
            <SafeAreaView key={index} style={{borderBottomColor:PURPLE, borderBottomWidth:1}}>
              <Text style={styles.category}>
                {String(foodType).toUpperCase()}
              </Text>
              <FlatList
                horizontal
                data={foods[index]}
                renderItem={renderFood}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
                style={{ marginBottom: 50 }}
              />
            </SafeAreaView>
          ))}
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: YELLOW,
  },
  category: {
    paddingLeft:10,
    fontSize: 25,
    fontWeight: "bold",
    marginTop:10,
    color: PURPLE,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 }
  },
  card: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    marginLeft:10,
    width: 150,
    backgroundColor: PURPLE,
  },
  image: {
    borderRadius: 20,
    height: 140,
    resizeMode: "cover",
  },
  detailsContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  title: {
    height: 40,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  price: {
    fontSize: 13,
    color: "white",
    fontWeight:'normal',
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonStyle: {
    height: 60,
    backgroundColor: "rgb(235, 51, 152)",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
