import React, { useState } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, Image, Alert 
} from 'react-native';
import { stylesauth } from '../../styles/stylesauth';

// Importamos la configuración que ya tienes lista
import { db, auth } from '../../firebaseConfig';
import {doc, setDoc} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup({ navigation }) {
  const [nombre, setNombre] = useState ('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // Validación básica de contraseñas
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    if (email === '' || password === '') {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }


    createUserWithEmailAndPassword(auth, email, password)
  
    .then(async (userCredential) => {
    
      const user = userCredential.user;
    // GUARDAR PERFIL AUTOMÁTICAMENTE
    await setDoc(doc(db, "users", user.uid, "profile", "info"), {
      nombre: nombre, // Este estado debes agregarlo al formulario
      email: email,
      rol: "Doctor/Registrador",
      createdAt: new Date()
    });

    Alert.alert("Éxito", "Usuario y Perfil creados.");
    navigation.goBack();
})
      .catch(error => {
        console.log(error);
        Alert.alert("Error", "No se pudo registrar.");
      });
  };

  return (
    <SafeAreaView style={stylesauth.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={stylesauth.container}
      >
        <Text style={stylesauth.welcomeText}>Registro</Text>

        <View style={stylesauth.card}>
          {/* Campo Nombre */}
          <View style={stylesauth.inputGroup}>
            <Image source={require('../../../assets/user.png')} style={stylesauth.icon} />
            <TextInput
              style={stylesauth.input}
              placeholder="Nombre Completo"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          {/* Campo Email */}
          <View style={stylesauth.inputGroup}>
            <Image source={require('../../../assets/gmail.png')} style={stylesauth.icon} />
            <TextInput
              style={stylesauth.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo Contraseña */}
          <View style={stylesauth.inputGroup}>
            <Image source={require('../../../assets/password.png')} style={stylesauth.icon} />
            <TextInput
              style={stylesauth.input}
              placeholder="Contraseña"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirmar Contraseña */}
          <View style={stylesauth.inputGroup}>
            <Image source={require('../../../assets/password.png')} style={stylesauth.icon} />
            <TextInput
              style={stylesauth.input}
              placeholder="Confirme Contraseña"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity style={stylesauth.buttonBlue} onPress={handleSignup}>
            <Text style={stylesauth.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.goBack()}>
            <Text style={stylesauth.forgotText}>¿Ya tienes cuenta? Volver</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}