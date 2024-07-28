// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJhMBwLwHza-CtUvz9Zdw7PDsH4fvk-lM",
  authDomain: "resultms.firebaseapp.com",
  projectId: "resultms",
  storageBucket: "resultms.appspot.com",
  messagingSenderId: "1000628755585",
  appId: "1:1000628755585:web:daad250aa84e1b18df8180"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
