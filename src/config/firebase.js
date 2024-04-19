// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUTE0cE78C-LnMl1vHNvo5QB3la3D4TAk",
  authDomain: "ml-internal-tools-b19c4.firebaseapp.com",
  projectId: "ml-internal-tools-b19c4",
  storageBucket: "ml-internal-tools-b19c4.appspot.com",
  messagingSenderId: "851632419697",
  appId: "1:851632419697:web:2a7944e0d7434b033f3cd0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
