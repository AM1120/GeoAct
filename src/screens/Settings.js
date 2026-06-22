import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Switch, ScrollView, TextInput, Alert } from "react-native";
import { styleshome } from "../../src/styles/styleshome"; 
import { auth, db } from "../firebaseConfig";
import { 
  signOut, 
  updateProfile, 
  verifyBeforeUpdateEmail, 
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

import CustomModal from "./components/Modal";
import { stylesmodal } from "../styles/stylesmodal";

export default function Ajustes() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Modales
  const [modalLogout, setModalLogout] = useState(false);
  const [modalEdit, setModalEdit] = useState(false); 
  const [editType, setEditType] = useState(""); // "nombre" o "correo"

  // Datos actuales en pantalla
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  // Estados para inputs de edición
  const [newNameInput, setNewNameInput] = useState("");
  const [newEmailInput, setNewEmailInput] = useState("");
  
  // 🔑 Guarda la contraseña ingresada para la reautenticación
  const [currentPassword, setCurrentPassword] = useState("");

  // Cargar datos de usuario al iniciar con Snapshot Realtime sintonizado de forma segura
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    
    // 🛡️ Añadimos un manejador de error nativo al final del onSnapshot para mutear el error de permisos.
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.nombre || user.displayName || "Usuario");
        setEmail(data.email || user.email);
      } }, (error) => {
      // 💡 Capturamos el código 403 (permission-denied) de manera silenciosa
      console.log("Listener de Ajustes desmontado o bloqueado controladamente al desloguear.");
    });

    return () => unsubscribe();
  }, [auth.currentUser?.email]); // Dependencia en el correo para actualizar si cambia

  const handleLogout = async () => {
    try {
      setModalLogout(false);
      // Desconectamos al usuario. La app volverá al Login gracias a la protección del App.js
      await signOut(auth);
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  const openEditModal = (type) => {
    setEditType(type);
    setCurrentPassword(""); // Limpia la contraseña por seguridad cada vez que se abre el modal
    if (type === "nombre") {
      setNewNameInput(userName);
    } else if (type === "correo") {
      setNewEmailInput(email);
    }
    setModalEdit(true);
  };

  // Manejador único para guardar (Nombre o Correo con Reautenticación)
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (editType === "nombre") {
      if (newNameInput.trim() === "") {
        Alert.alert("Error", "El nombre no puede estar vacío.");
        return;
      }
      try {
        await updateProfile(user, { displayName: newNameInput.trim() });
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { nombre: newNameInput.trim() });
        
        setUserName(newNameInput.trim());
        setModalEdit(false);
        Alert.alert("Éxito", "Nombre actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar nombre:", error);
        Alert.alert("Error", "No se pudo actualizar el nombre.");
      }

    } else if (editType === "correo") {
      if (newEmailInput.trim() === "" || currentPassword.trim() === "") {
        Alert.alert("Error", "Por favor completa el nuevo correo y tu contraseña actual.");
        return;
      }

      try {
        // 🔑 PASO 1: Reautenticar al usuario de forma explícita en Firebase
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // 🔑 PASO 2: Si la contraseña fue correcta, procede a enviar la solicitud de cambio
        await verifyBeforeUpdateEmail(user, newEmailInput.trim().toLowerCase());
        
        // PASO 3: Opcional - No alteramos Firestore de inmediato para que mantenga correspondencia 
        // con las credenciales activas del Login hasta que verifique el buzón, pero mostramos el aviso correcto:
        setModalEdit(false);
        setCurrentPassword(""); // Limpieza de seguridad
        
        Alert.alert(
          "Verificación enviada", 
          `Hemos enviado un enlace de confirmación a ${newEmailInput.trim().toLowerCase()}. Tu cuenta de GeoAct seguirá asociada a ${user.email} para el inicio de sesión hasta que pulses el link recibido.`
        );
      } catch (error) {
        console.error("Error en la actualización de correo:", error);
        if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
          Alert.alert("Acceso Denegado", "La contraseña actual introducida es incorrecta.");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Error", "El formato del nuevo correo no es válido.");
        } else {
          Alert.alert("Error", "Ocurrió un problema de seguridad. Inténtalo de nuevo más tarde.");
        }
      }
    }
  };

  const handlePasswordResetLink = async () => {
    const user = auth.currentUser;
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        Alert.alert(
          "Restablecimiento Enviado", 
          `Hemos enviado un enlace de recuperación directo a tu dirección de correo activa: ${user.email}`
        );
      } catch (error) {
        console.error("Error al enviar correo de restablecimiento:", error);
        Alert.alert("Error", "No se pudo enviar el correo de restablecimiento.");
      }
    }
  };

  return (
    <View style={styleshome.body}>        
      <View style={styleshome.container}>
        <Text style={styleshome.title}>Ajustes</Text>
        <View style={styleshome.separator} />
        
        <Text style={[styleshome.optionText, { fontWeight: 'bold', fontSize: 16, marginBottom: 10, color: '#333' }]}>
          Datos de Usuario
        </Text>
        
        <View style={[styleshome.containerGrey, { padding: 16, margin: 0, marginBottom: 20, flex: 0, backgroundColor: '#f1f5f9' }]}>
          
          {/* Fila: Nombre */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, backgroundColor: '#fff', padding: 12, borderRadius: 10 }}>
            <View>
              <Text style={styleshome.optionText}>Nombre</Text>
              <Text style={[styleshome.userName, { marginTop: 0 }]}>{userName}</Text>
            </View>
            <TouchableOpacity 
              style={{ backgroundColor: '#E2E8F0', padding: 8, borderRadius: 8 }} 
              onPress={() => openEditModal("nombre")}
            >
              <Image source={require('../../assets/edit.png')} style={{ width: 16, height: 16, tintColor: '#4A90E2' }} />
            </TouchableOpacity>
          </View>

          {/* Fila: Correo Electrónico */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, backgroundColor: '#fff', padding: 12, borderRadius: 10 }}>
            <View>
              <Text style={styleshome.optionText}>Correo Electrónico</Text>
              <Text style={styleshome.userEmail}>{email}</Text>
            </View>
            <TouchableOpacity 
              style={{ backgroundColor: '#E2E8F0', padding: 8, borderRadius: 8 }} 
              onPress={() => openEditModal("correo")}
            >
              <Image source={require('../../assets/edit.png')} style={{ width: 16, height: 16, tintColor: '#4A90E2' }} />
            </TouchableOpacity>
          </View>

          {/* Botón Cambiar Contraseña */}
          <TouchableOpacity 
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e0eeff', padding: 12, borderRadius: 10, marginTop: 4 }} 
            onPress={handlePasswordResetLink}
          >
            <Text style={[styleshome.optionText, { color: '#4A90E2', fontSize: 14, fontWeight: '600' }]}>Cambiar Contraseña (Enviar Link)</Text>
            <Text style={{ fontSize: 18, color: '#4A90E2', fontWeight: 'bold' }}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Contenedor de Preferencias */}
        <View style={[styleshome.containerGrey, { padding: 16, margin: 0, flex: 0, backgroundColor: '#f1f5f9' }]}>

          <TouchableOpacity style={[styleshome.optionLeft, { marginTop: 12, backgroundColor: '#fff', padding: 12, borderRadius: 10 }]}>
            <Text style={[styleshome.optionText, { fontSize: 14 }]}>Acerca de la Aplicación</Text>
            <Text style={{ fontSize: 18, color: '#64748b' }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setModalLogout(true)} 
            style={[styleshome.buttonGuardar, { backgroundColor:'#ee5454', width:'100%', alignItems: 'center', marginTop: 20 }]}
          >
            <Text style={styleshome.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= MODAL DE EDICIÓN DINÁMICO ================= */}
      <CustomModal 
        visible={modalEdit} 
        onClose={() => setModalEdit(false)} 
        title={`Modificar ${editType}`}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={stylesmodal.container}>
            {editType === "nombre" ? (
              <View style={{ marginBottom: 15, width: '100%' }}>
                <Text style={stylesmodal.label}>Nuevo Nombre:</Text>
                <TextInput
                  style={styleshome.inputField}
                  placeholder="Ingrese su nuevo nombre"
                  value={newNameInput}
                  onChangeText={setNewNameInput}
                />
              </View>
            ) : (
              <View style={{ marginBottom: 15, width: '100%' }}>
                <Text style={stylesmodal.label}>Nuevo Correo Electrónico:</Text>
                <TextInput
                  style={styleshome.inputField}
                  placeholder="Ingrese su nuevo correo"
                  value={newEmailInput}
                  onChangeText={setNewEmailInput}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Text style={[stylesmodal.label, { marginTop: 15 }]}>Ingrese su contraseña antes de continuar:</Text>
                <TextInput
                  style={styleshome.inputField}
                  placeholder="Escriba su contraseña actual para verificar"
                  secureTextEntry={true}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  autoCapitalize="none"
                />
              </View>
            )}
            
            <TouchableOpacity style={[styleshome.buttonGuardar, {backgroundColor: '#81d659', width:'100%' }]} onPress={handleSave}>
              <Text style={stylesmodal.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </CustomModal>

      {/* ================= MODAL CERRAR SESIÓN ================= */}
      <CustomModal visible={modalLogout} onClose={() => setModalLogout(false)} title="Cerrar Sesión">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>          
          <View style={{ zIndex: 2000, padding: 10 }}> 
            <Text style={[styleshome.label, { textTransform: 'none', textAlign: 'center', fontSize: 14, marginBottom: 15 }]}>
              ¿Está seguro de que desea cerrar sesión en GeoAct?
            </Text>
            <TouchableOpacity style={[styleshome.buttonGuardar, { backgroundColor:'#ee5454', width:'100%' }]} onPress={handleLogout}>
              <Text style={styleshome.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </CustomModal>
    </View>
  );
}