import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";

export default function SplashScreen() {
  return (
    <ImageBackground
      source={require("../../assets/Splash.png")}
      style={styles.fondo}
      resizeMode="cover"
    >
    </ImageBackground>
  );
}

// Tus estilos del splash (como los definimos anteriormente)
//Falta aplicar más eventos de animación

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
