import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { getOrders } from "../localDb/localDb";
import { AuthContext } from "../components/auth";
import { YELLOW } from "../styles/COLORS.JS";
import { PURPLE } from "../styles/COLORS.JS";
import { HeaderComponent } from "../components/header";

export function PastOrders({ navigation }) {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getOrders(user.email);
      setOrders(orders);
    };

    fetchOrders();
  }, []);

  const handleOrderPress = (order) => {
    navigation.navigate("PastOrder", { order });
  };

  return (
    <View style={{flex:1}}> 
      <HeaderComponent navigation={navigation} backPressLeft={true}/>
    <View style={styles.container}>
      <Text style={styles.header}>Order History</Text>
      {orders.map((order) => (
        <View style={styles.orderContainer}>
          <Text style={styles.orderDate}>
            {new Date(order.date).toLocaleString()}
          </Text>
          <TouchableOpacity
            onPress={() => handleOrderPress(order)}
            style={styles.detailsButton}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: YELLOW,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 32,
    color: "rgb(235,51,152)",
    marginTop: 20,
    marginBottom: 20,
    textAlign:'center',
    fontWeight: "bold",
    fontFamily: "Arial",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  orderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailsButton: {
    backgroundColor: PURPLE,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
