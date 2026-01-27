import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvgePoY-amVWQBnC0zsM8qQKyLi-3y4ZU",
  authDomain: "geoact-6e772.firebaseapp.com",
  projectId: "geoact-6e772",
  storageBucket: "geoact-6e772.firebasestorage.app",
  messagingSenderId: "575071320252",
  appId: "1:575071320252:web:545bfaf900c6bb2ed938b9",
  measurementId: "G-GH6E21BRXJ"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// 👇 Auth SOLO se inicializa una vez
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app)