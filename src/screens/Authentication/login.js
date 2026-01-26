import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView,KeyboardAvoidingView,Platform, Image} from 'react-native';
import { stylesauth } from '../../styles/stylesauth';
import { initializeApp } from 'firebase/app';
import {firebaseConfig} from '../../firebaseConfig'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../../firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';

export default function Login({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(() =>{
        console.log('Cuenta creada')
        const user = userCredential.user;
        console.log(user)
    })
    .catch(error =>{
        console.log(error)
    })
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then(() =>{
        console.log('registrado')
        const user = userCredential.user;
        console.log(user)
    })
    .catch(error =>{
        console.log(error)
    })
  }

  return (
    <SafeAreaView style={stylesauth.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={stylesauth.container}
      >
        {/* Círculo superior para el Logo de GeoAct */}
        <View style={stylesauth.logoContainer}>
          <View style={stylesauth.logoCircle}>
            <Text style={{fontSize: 40}}></Text> 
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

          <TouchableOpacity style={stylesauth.forgotButton}>
            <Text style={stylesauth.forgotText}>¿Olvidaste tu Contraseña?</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={handleSignIn} style={stylesauth.buttonBlue}>
            <Text style={stylesauth.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('signup')} style={stylesauth.buttonGreen}>
            <Text style={stylesauth.buttonText}>Registrarse</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
