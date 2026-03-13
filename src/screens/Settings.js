import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch } from "react-native";
import { styleshome } from "../../src/styles/styleshome";
import { auth, db } from "../firebaseConfig";

export default function Ajustes() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(false);

  return (
    <View style={styleshome.body}>        
    <Text style={styleshome.title}>Ajustes</Text>
      <View style={styleshome.container}>

        
        {/* Sección de Perfil */}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Image 
            source={require('../../assets/IconAjuste.png')} 
            style={styleshome.profileImage} 
          />
          <Text style={styleshome.userName}>Juan Pérez</Text>
          <Text style={styleshome.userEmail}>juan.perez@ejemplo.com</Text>
        </View>

        <View style={styleshome.separator} />

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

          <View style={styleshome.optionLeft}>
            <Text style={styleshome.optionText}>Notificaciones</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#657e8dff", true: "#5c9bd1" }}
              thumbColor={"#fff"}
            />
          </View>

          <TouchableOpacity style={[styleshome.optionLeft, { marginTop: 20 }]}>
            <Text style={styleshome.optionText}>Acerca de la Aplicación</Text>
            <Text style={{ fontSize: 24, color: '#333' }}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => auth.signOut()}>
            <Text style={styleshome.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );
}