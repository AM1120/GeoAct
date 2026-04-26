import { initializeApp, getApps } from "firebase/app";
import {initializeAuth, getReactNativePersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2ikm9zhCKfNFCWX45a_nFIGWVzhKBWag",
  authDomain: "geoact-6e772.firebaseapp.com",
  projectId: "geoact-6e772",
  storageBucket: "geoact-6e772.firebasestorage.app",
  messagingSenderId: "575071320252",
  appId: "1:575071320252:web:2dbce02df90be37bd938b9",
  measurementId: "G-RJXGSQE1QV"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app)