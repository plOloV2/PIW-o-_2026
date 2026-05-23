import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMnUflWox_l5nwYWumWDryGD6msObrdKw",
  authDomain: "piwo-lab4-fde27.firebaseapp.com",
  projectId: "piwo-lab4-fde27",
  storageBucket: "piwo-lab4-fde27.firebasestorage.app",
  messagingSenderId: "1035153019691",
  appId: "1:1035153019691:web:9a5f0f90a7009032a6eb6e"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
