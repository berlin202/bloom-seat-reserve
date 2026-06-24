import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUIupZfJxvHZTImCjpdU_ooOSyUlGNBvo",
  authDomain: "passion-nerve-dinner.firebaseapp.com",
  databaseURL: "https://passion-nerve-dinner-default-rtdb.firebaseio.com",
  projectId: "passion-nerve-dinner",
  storageBucket: "passion-nerve-dinner.firebasestorage.app",
  messagingSenderId: "271337229825",
  appId: "1:271337229825:web:cee016625afa2cbe07fa00",
  measurementId: "G-4FJQZN96PE",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
