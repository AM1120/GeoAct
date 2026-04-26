import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, ScrollView } from "react-native";
import { styleshome } from "../../src/styles/styleshome";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";

import CustomModal from "./components/Modal";
import { stylesmodal } from "../styles/stylesmodal";

export default function Ajustes() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const [mo, setMo] = useState(false);

  const [userNombre, setUserNombre] = useState("");
  const [newUserNombre, setNewUserNombre] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
    

  const handleLogout = async () => {
  try {

    await signOut(auth);

    setMo(false);

  } catch (error) {

    console.log("Error al cerrar sesión:", error);

  }
};
useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            setUserNombre(data.nombre || user.displayNombre || "Usuario");
            setNewUserNombre(data.nombre || user.displayNombre || "Usuario");
            setEmail(data.email || user.email);
            setNewEmail(data.email || user.email);
          }
        } catch (error) {
          console.error("Error al obtener perfil:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styleshome.body}>        
      <View style={styleshome.container}>
        <Text style={styleshome.title}>Ajustes</Text>

        
        {/* Sección de Perfil */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
        </View>
        <View style={styleshome.separator} />
          <Text style={styleshome.optionText}>Datos de Usuario</Text>
      <View style={styleshome.containerGrey}>
        <Text style={styleshome.userName}> {userNombre} </Text>
        <TouchableOpacity onPress={() => {}}>
          <Image source={require('../../assets/edit.png')} style={styleshome.actionIcon, {flexDirection: 'row'}} />
        </TouchableOpacity>

        <Text style={styleshome.userEmail}>{email}</Text>
          <TouchableOpacity onPress={() => {}}>
          <Image source={require('../../assets/edit.png')} style={styleshome.actionIcon, {flexDirection: 'row' }} />
        </TouchableOpacity>
        </View>
        {/* El contenedor gris del prototipo */}
        <View style={styleshome.containerGrey}>
          
          <View style={styleshome.optionLeft}>
            <Text style={styleshome.optionText}>Modo Oscuro</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#657e8dff", true: "#5c9bd1" }}
              thumbColor={"#fff"}
            />
          </View>


          <TouchableOpacity style={[styleshome.optionLeft, { marginTop: 20 }]}>
            <Text style={styleshome.optionText}>Acerca de la Aplicación</Text>
            <Text style={{ fontSize: 24, color: '#333' }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMo(true)}>
            <Text style={styleshome.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
          

          <CustomModal visible={mo} onClose={() => setMo(false)} title="Cerrar Sesión">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>          
                {/* sección del modal*/}
                <View style={{ zIndex: 2000 }}> 
                    <Text style={styleshome.label}>¿Está seguro de cerrar sesión?</Text>
                    <TouchableOpacity 
                      style={styleshome.buttonGuardar} 
                      onPress={handleLogout}
                    >
                      <Text style={styleshome.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </CustomModal>
        </View>
      </View>
    </View>
  );
}