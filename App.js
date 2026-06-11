import 'react-native-gesture-handler'; 
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import * as ExpoSplashScreen from 'expo-splash-screen'; // Renombrado para no chocar
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';

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
    async function prepare() {
      try {
        // Escuchamos a Firebase
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          // Simula un pequeño tiempo extra 
          setTimeout(() => {
            setAppIsReady(true);
          }, 5000); // 5 segundos 
          unsubscribe();
        });
      } catch (e) {
        console.warn(e);
        setAppIsReady(true);
      }
    }
    prepare();

    const authListener = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => authListener();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Oculta el splash de Expo y deja ver el tuyo
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
            <Stack.Screen name="MainApp" component={MyTab} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}