import React, { createContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    // Handle user state changes
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [initializing]);

  const signOut = async (navigation) => {
    try {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      const currentUser = auth().currentUser;
      if (currentUser) {
        await auth().signOut();
        await GoogleSignin.revokeAccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (initializing) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
