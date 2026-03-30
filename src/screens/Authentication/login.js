import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView,KeyboardAvoidingView,Platform, Image, Alert, ScrollView} from 'react-native';
import { stylesauth } from '../../styles/stylesauth';
import {createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../../firebaseConfig';
import { db } from '../../firebaseConfig';

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const cleanEmail = email.trim().toLowerCase();
  const [loading, setLoading] = useState(false);



  const handleSignIn = async() => {

    if (email === '' || password === '') {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Tu correo electrónico es inválido.");
      return;
    }

    signInWithEmailAndPassword(auth, cleanEmail, password)
    .then((userCredential) =>{
        console.log('Sesión iniciada correctamente:', userCredential.user.email)
    })
    .catch(error =>{
        console.log("Error al iniciar sesión",error.message);
        alert("credenciales incorrectas");
    });

    try {
      console.log('Sesión iniciada correctamente:', userCredential.user.email);
      onLogin(userCredential.user); // Llama a la función de callback para actualizar el estado en App.js
    } catch (error) {
      switch (error.code) {
      case "auth/user-not-found":
        Alert.alert("Error", "Usuario no registrado.");
        break;

      case "auth/wrong-password":
        Alert.alert("Error", "Contraseña incorrecta.");
        break;

      case "auth/invalid-email":
        Alert.alert("Error", "Correo inválido.");
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

          Alert.alert("Error", "No se pudo enviar el correo.");

        }

      };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#C2D5E8' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex:1}}
      >
        <ScrollView
          contentContainerStyle={stylesauth.ScrollContainer}
          keyboardShouldPersistTaps="handled"
        >
        {/*Logo de GeoAct */}
        <View style={stylesauth.logoContainer}>
          <View>
            <Image source={(require('../../../assets/geoacta.png'))}  style={stylesauth.logoCircle} />
          </View>
        </View>

        <Text style={stylesauth.welcomeText}>Bienvenido</Text>

        {/* Tarjeta Blanca del Formulario */}
        <View style={stylesauth.card}>
          
          <View style={stylesauth.inputGroup}>
            <Image source={(require('../../../assets/user.png'))}  style={stylesauth.icon} />
            <TextInput
              style={stylesauth.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
            />
          </View>

          <View style={stylesauth.inputGroup}>
            <Image source={(require('../../../assets/password.png'))}  style={stylesauth.icon} />
            <TextInput
              style={stylesauth.input}
              placeholder="Contraseña"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
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

        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
