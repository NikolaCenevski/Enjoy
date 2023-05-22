import AsyncStorage from "@react-native-async-storage/async-storage";

export async function registerUser(email) {
  try {
    const key = `${email}/registered`;
    await AsyncStorage.setItem(key, "true");
    console.log("User registered successfully");
  } catch (e) {
    console.log("Failed to register user", e);
  }
}

export async function saveAddresses(email, addresses) {
  try {
    const key = `${email}/addresses`;
    const jsonValue = JSON.stringify(addresses);
    await AsyncStorage.setItem(key, jsonValue);
    console.log("Addresses stored successfully");
  } catch (e) {
    console.log("Failed to store addresses", e);
  }
}

export async function saveCreditCards(email, creditCards) {
  try {
    const key = `${email}/creditCards`;
    const jsonValue = JSON.stringify(creditCards);
    await AsyncStorage.setItem(key, jsonValue);
    console.log("Credit cards stored successfully");
  } catch (e) {
    console.log("Failed to store credit cards", e);
  }
}

export async function addInCart(email, item) {
  try {
    const key = `${email}/cart`;
    const value = await AsyncStorage.getItem(key);
    const cart = value ? JSON.parse(value) : {};
    cart[item.id] = item;
    await AsyncStorage.setItem(key, JSON.stringify(cart));
    console.log("Added in cart successfully");
  } catch (e) {
    console.log("Failed to add in Cart", e);
  }
}

export async function getCart(email) {
  try {
    const key = `${email}/cart`;
    const value = await AsyncStorage.getItem(key);
    const cart = value ? JSON.parse(value) : {};
    console.log(cart);
    return cart;
  } catch (e) {
    console.log("Failed to get Cart", e);
  }
}

export async function removeFromCart(email, id) {
  try {
    const key = `${email}/cart`;
    const value = await AsyncStorage.getItem(key);
    const cart = value ? JSON.parse(value) : {};
    delete cart[id];
    await AsyncStorage.setItem(key, JSON.stringify(cart));
    console.log("Removed from cart successfully");
  } catch (e) {
    console.log("Failed to remove from Cart", e);
  }
}

export async function clearCart(email) {
  try {
    const key = `${email}/cart`;
    await AsyncStorage.setItem(key, JSON.stringify({}));
    console.log("Cleared cart successfully");
  } catch (e) {
    console.log("Failed to clear Cart", e);
  }
}

export async function checkIfUserIsRegistered(email) {
  try {
    const key = `${email}/registered`;
    const value = await AsyncStorage.getItem(key);
    if (value !== null) return true;
    else {
      console.log("New user");
      return false;
    }
  } catch (e) {
    console.log("Failed to check if user is new", e);
  }
}

export async function saveOrder(email, order) {
  try {
    const key = `${email}/orders`;
    const dbItem = await AsyncStorage.getItem(key);
    const orders = dbItem ? JSON.parse(dbItem) : [];
    orders.unshift(order);
    console.log(orders);
    await AsyncStorage.setItem(key, JSON.stringify(orders));
    console.log("Order added successfully");
  } catch (e) {
    console.log("Failed to add Order", e);
  }
}

export async function getOrders(email) {
  try {
    const key = `${email}/orders`;
    const dbItem = await AsyncStorage.getItem(key);
    const orders = dbItem ? JSON.parse(dbItem) : [];
    console.log(orders);
    console.log("Orders fetched successfully");
    return orders;
  } catch (e) {
    console.log("Failed to add Order", e);
  }
}

export async function getAddresses(email) {
  try {
    const key = `${email}/addresses`;
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      const addresses = JSON.parse(jsonValue);
      console.log("Addresses retrieved successfully:", addresses);
      return addresses;
    } else {
      console.log("No addresses found for this user");
      return [];
    }
  } catch (e) {
    console.log("Failed to retrieve addresses", e);
  }
}

export async function getCreditCards(email) {
  try {
    const key = `${email}/creditCards`;
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      const creditCards = JSON.parse(jsonValue);
      console.log("Credit cards retrieved successfully:", creditCards);
      return creditCards;
    } else {
      console.log("No credit cards found for this user");
      return [];
    }
  } catch (e) {
    console.log("Failed to retrieve addresses", e);
  }
}

export async function deleteUser(email) {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const userKeys = allKeys.filter(key => key.startsWith(email));
    await AsyncStorage.multiRemove(userKeys);
  } catch (error) {
    console.error(error);
  }
  }