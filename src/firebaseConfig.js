//ID Androd: 68120710551-t99hs2q9rv36ak7urkutdsojbun7pj7t.apps.googleusercontent.com 
//ID Web: 68120710551-pp2q7qqokqdobo36srvgnnkbtq8uljub.apps.googleusercontent.com

import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, _getProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2ikm9zhCKfNFCWX45a_nFIGWVzhKBWag",
  authDomain: "geoact-6e772.firebaseapp.com",
  projectId: "geoact-6e772",
  storageBucket: "geoact-6e772.firebasestorage.app",
  messagingSenderId: "575071320252",
  appId: "1:575071320252:web:2dbce02df90be37bd938b9",
  measurementId: "G-RJXGSQE1QV"
};

// 1. Inicializar App de forma segura
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Inicializar Auth de forma definitiva con persistencia fija
let auth;
if (app.container.getProvider("auth").isInitialized()) {
  // Si Firebase ya inicializó Auth internamente, tomamos esa instancia exacta
  auth = app.container.getProvider("auth").getImmediate();
} else {
  // Si no está inicializada, la creamos EXCLUSIVAMENTE con la persistencia de Expo
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// 3. Inicializar Firestore
const db = getFirestore(app);

export { auth, db };