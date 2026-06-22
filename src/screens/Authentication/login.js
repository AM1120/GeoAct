import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image, Alert, ScrollView } from 'react-native';
import { stylesauth } from '../../styles/stylesauth';
import { sendPasswordResetEmail, signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: "68120710551-8luelknn12lbbqvaadk6v008kq2eagou.apps.googleusercontent.com",
    clientId: "68120710551-pp2q7qqokqdobo36srvgnnkbtq8uljub.apps.googleusercontent.com"
  }); 

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUSerInfo();
    }
  }, [response, accessToken]);

  async function fetchUSerInfo() {
    try {
      let response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const useInfo = await response.json();
      setUser(useInfo);
    } catch (error) {
      console.error("Error al obtener info de Google:", error);
    }
  }

  // 🔑 Función de Inicio de Sesión limpia y unificada
  const handleSignIn = async () => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Validaciones de campos vacíos
    if (cleanEmail === '' || password === '') {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    // 2. Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      Alert.alert("Error", "Tu correo electrónico es inválido.");
      return;
    }

    try {

      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const loggedUser = userCredential.user;


      if (!loggedUser.emailVerified) {
        Alert.alert(
          "Cuenta no verificada",
          "Tu cuenta no ha sido verificada. Por favor, revisa tu correo y confirma tu cuenta antes de iniciar sesión.",
          [
            {
              text: "Reenviar correo",
              onPress: async () => {
                try {
                  await sendEmailVerification(loggedUser);
                  Alert.alert("Correo reenviado", "Hemos enviado un nuevo enlace de verificación a tu correo.");
                } catch (error) {
                  console.error(error);
                  Alert.alert("Error", "No se pudo reenviar el correo en este momento. Inténtalo más tarde.");
                }
              }
            },
            {
              text: "Ok",
              style: "cancel"
            }
          ]
        );

        // Expulsamos de la sesión activa inmediatamente para que no pase las rutas protegidas
        await signOut(auth);
        return; 
      } 
      
      // 5. Si la cuenta está verificada, le permitimos pasar
      else {
        console.log('Sesión iniciada correctamente:', loggedUser.email);
        if (onLogin) onLogin(loggedUser); 
      }

    } catch (error) {
      console.log("Error al iniciar sesión:", error.code, error.message);
      
      // Manejador de errores del Catch estructurado
      switch (error.code) {
        case "auth/user-not-found":
          Alert.alert("Error", "Usuario no registrado.");
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential": // Captura el error unificado moderno de Firebase
          Alert.alert("Error", "Correo o contraseña incorrectos.");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "El formato del correo es inválido.");
          break;
        default:
          Alert.alert("Error", "Credenciales incorrectas o problemas de conexión.");
          break;
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Ingresa tu correo para recuperar la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      Alert.alert("Correo enviado", "Revisa tu bandeja de entrada.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo enviar el correo de recuperación.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#C2D5E8' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={stylesauth.ScrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo de GeoAct */}
          <View style={stylesauth.logoContainer}>
            <Image source={require('../../../assets/geoacta.png')} style={stylesauth.logoCircle} />
          </View>

          <Text style={stylesauth.welcomeText}>Bienvenido</Text>

          {/* Tarjeta Blanca del Formulario */}
          <View style={stylesauth.card}>
            
            <View style={stylesauth.inputGroup}>
              <Image source={require('../../../assets/user.png')} style={stylesauth.icon} />
              <TextInput
                style={stylesauth.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={stylesauth.inputGroup}>
              <Image source={require('../../../assets/password.png')} style={stylesauth.icon} />
              <TextInput
                style={stylesauth.input}
                placeholder="Contraseña"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={stylesauth.forgotButton} onPress={handlePasswordReset}>
              <Text style={stylesauth.forgotText}>¿Olvidaste tu Contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignIn} style={stylesauth.buttonBlue}>
              <Text style={stylesauth.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('signup')} style={stylesauth.buttonGreen}>
              <Text style={stylesauth.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <View style={stylesauth.separatorContainer}>
              <View style={stylesauth.separatorLine} />
              <Text style={stylesauth.separatorText}>o</Text>
              <View style={stylesauth.separatorLine} />
            </View>

            {/* ----- BOTÓN DE GOOGLE ----- */}
            <TouchableOpacity 
              disabled={!request}
              onPress={() => promptAsync()} 
              style={stylesauth.buttonGoogle}
            >
              <Image source={require('../../../assets/google.png')} style={stylesauth.googleIcon} />
              <Text style={stylesauth.buttonTextGoogle}>Iniciar con Google</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}