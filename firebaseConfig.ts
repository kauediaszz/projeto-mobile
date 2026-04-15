// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCelUNuGFf_tcLzhlZTJIp5i2XXu9Kqd5s",
  authDomain: "dietaia-5558c.firebaseapp.com",
  projectId: "dietaia-5558c",
  storageBucket: "dietaia-5558c.firebasestorage.app",
  messagingSenderId: "204608348071",
  appId: "1:204608428071:web:24465ea9c64c5a17b72082",
  measurementId: "G-QMNGQCLJYW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with default persistence
// Firebase v12+ automatically handles persistence for React Native
export const auth = getAuth(app);
export const db = getFirestore(app);