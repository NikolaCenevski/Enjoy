// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
X
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();

// Initialize Firebase
//export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();

export { db };
