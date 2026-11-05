// src/firebase.js
// Firebase configuration for STEMify
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAehc3IR1dhZt6mmzLEcKh0EFeSYQuqX1s",
  authDomain: "stemify-dashboard.firebaseapp.com",
  databaseURL: "https://stemify-dashboard-default-rtdb.firebaseio.com",
  projectId: "stemify-dashboard",
  storageBucket: "stemify-dashboard.firebasestorage.app",
  messagingSenderId: "711595453144",
  appId: "1:711595453144:web:d4f4f3351ed7ee811b05ad",
  measurementId: "G-RTRLW8MM9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const realtimeDb = getDatabase(app);
const auth = getAuth(app);

// Password Reset Function
const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export { realtimeDb, auth, resetPassword };
