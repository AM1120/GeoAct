import 'react-native-gesture-handler'; 
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';
import { View, ActivityIndicator } from 'react-native';

// Importa tus pantallas
import Login from './src/screens/Authentication/login'; 
import Signup from './src/screens/Authentication/signup'
import MyTab from './src/navigation/MainTab'; 

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function AuthNavigator (){
  return(
    <AuthStack.Navigator screenOptions={{headerShown:false}}>
      <AuthStack.Screen name="login" component={Login}/>
      <AuthStack.Screen name="signup" component={Signup}/>
    </AuthStack.Navigator>
  );
}

export default function App() {

  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
useEffect(() => {
    // onAuthStateChanged detecta automáticamente la sesión guardada en AsyncStorage
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C2D5E8' }}>
        <ActivityIndicator size="large" color="#9BB1A4" />
      </View>
    );
  }


return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Si hay usuario, mostramos el Tab Navigator
          <Stack.Screen name="MainApp" component={MyTab} />
        ) : (
          // Si no, mostramos el Login
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


