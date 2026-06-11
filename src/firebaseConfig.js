import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2ikm9zhCKfNFCWX45a_nFIGWVzhKBWag",
  authDomain: "geoact-6e772.firebaseapp.com",
  projectId: "geoact-6e772",
  storageBucket: "geoact-6e772.firebasestorage.app",
  messagingSenderId: "575071320252",
  appId: "1:575071320252:web:2dbce02df90be37bd938b9",
  measurementId: "G-RJXGSQE1QV"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Robustez: Inicializamos Auth con persistencia de una forma más directa
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };