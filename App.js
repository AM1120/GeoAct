import 'react-native-gesture-handler'; 
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged, reload } from 'firebase/auth'; 
import { db,auth } from './src/firebaseConfig';
import {doc, updateDoc} from 'firebase/firestore';

// 1. Importa tu componente personalizado (la pantalla que diseñaste)
import SplashScreen from './src/navigation/splash'; 

// Importa tus pantallas
import Login from './src/screens/Authentication/login'; 
import Signup from './src/screens/Authentication/signup';
import MyTab from './src/navigation/MainTab';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="login" component={Login} />
      <AuthStack.Screen name="signup" component={Signup} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          try {
            // 1. Forzamos la recarga desde los servidores de Firebase
            await reload(currentUser);
            // 2. Traemos el nuevo token de seguridad actualizado
            await currentUser.getIdToken(true);

            console.log("Correo actual en Auth tras recargar:", currentUser.email);

            if (currentUser.emailVerified) {
              const userRef = doc(db, "users", currentUser.uid);
              
              // 3. Sincronizamos el nuevo correo confirmado en Firestore
              await updateDoc(userRef, {
                email: currentUser.email 
              });

              // 🔑 EL TRUCO PARA DESATASCAR LA APP:
              // En lugar de pasar 'currentUser' directamente (que React ignora porque cree que es el mismo objeto),
              // pasamos un clon nuevo con el correo actualizado. Esto fuerza el refresco de la navegación.
              setUser({ ...currentUser, email: currentUser.email });

            } else {
              setUser(null); 
            }
          } catch (error) {
            console.error("Error al sincronizar el cambio de correo:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }

        setTimeout(() => {
          setAppIsReady(true);
        }, 5000);
      });

      return () => unsubscribe();
    }, []);

const onLayoutRootView = useCallback(async () => {
  if (appIsReady) {
    // Oculta el splash nativo de Expo y deja ver tu app
    await ExpoSplashScreen.hideAsync();
  }
}, [appIsReady]);

// MIENTRAS CARGA: Mostramos tu componente personalizado diseñado con ImageBackground
if (!appIsReady) {
  return <SplashScreen />;
}

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // 🛡️ Esta pantalla solo se montará si 'user' no es null (verificado con éxito)
            <Stack.Screen name="MainApp" component={MyTab} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}