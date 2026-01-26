import React, { useState } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, Image, Alert 
} from 'react-native';
import { stylesauth } from '../../styles/stylesauth';

// Importamos la configuración que ya tienes lista
import { auth } from '../../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup({ navigation }) {
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
      .then((userCredential) => {
        Alert.alert("¡Éxito!", "Cuenta creada para Registro Civil.");
        console.log('Usuario registrado:', userCredential.user.email);
        // Volvemos al login para que el usuario inicie sesión formalmente
        navigation.goBack(); 
      })
      .catch(error => {
        Alert.alert("Error de Registro", "No se pudo crear la cuenta. Revisa los datos.");
        console.log(error.message);
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
          {/* Campo Email (Icono de sobre según tu boceto) */}
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

          {/* Campo Confirmar Contraseña */}
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

          {/* Botón de Confirmar Registro */}
          <TouchableOpacity style={stylesauth.buttonBlue} onPress={handleSignup}>
            <Text style={stylesauth.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          {/* Botón para volver al Login */}
          <TouchableOpacity style={{ marginTop: 15 }} onPress={() => navigation.goBack()}>
            <Text style={stylesauth.forgotText}>¿Ya tienes cuenta? Volver</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}