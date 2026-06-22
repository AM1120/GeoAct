import React, { useState } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, KeyboardAvoidingView, Platform, Image, Alert, ScrollView
} from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { stylesauth } from '../../styles/stylesauth';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export default function Signup({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    // 1. Validaciones básicas de inputs
    if (nombre.trim() === '' || email.trim() === '' || password === '' || confirmPassword === '') {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // 2. Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const user = userCredential.user;

      // 3. Enviar el enlace de verificación al correo ingresado
      await sendEmailVerification(user);

      // 4. Guardar el perfil en Firestore con el estado de verificación inicializado en false
      await setDoc(doc(db, "users", user.uid), {
        nombre: nombre.trim(), 
        email: email.trim().toLowerCase(),
        rol: "Doctor/Registrador",
        emailVerificado: false, // Control local opcional
        createdAt: new Date()
      });

      // 5. ⚠️ ¡PASO CLAVE! Como 'createUserWithEmailAndPassword' loguea automáticamente al usuario,
      // debemos cerrarle la sesión de inmediato para que no se salte el Login sin haberse verificado.
      await signOut(auth);

      Alert.alert(
        "Verificación Enviada", 
        "Tu cuenta ha sido pre-registrada. Hemos enviado un enlace a tu correo electrónico. Por favor, confírmalo antes de iniciar sesión en GeoAct.",
        [
          { text: "Entendido", onPress: () => navigation.goBack() }
        ]
      );

    } catch (error) {
      console.log("Error en Registro:", error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Error", "Este correo electrónico ya está registrado.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert("Error", "El formato del correo electrónico no es válido.");
      } else {
        Alert.alert("Error", "No se pudo completar el registro. Inténtalo de nuevo.");
      }
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}