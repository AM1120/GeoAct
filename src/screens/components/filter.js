import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { stylesfilter } from "../../styles/stylesfilter";

export default function Filter({ mesSeleccionado, onSelectMonth }) {
    const [isOpen, setIsOpen] = useState(false);

const MESES = [
  { id: 1, nombre: "Enero" }, { id: 2, nombre: "Febrero" }, { id: 3, nombre: "Marzo" },
  { id: 4, nombre: "Abril" }, { id: 5, nombre: "Mayo" }, { id: 6, nombre: "Junio" },
  { id: 7, nombre: "Julio" }, { id: 8, nombre: "Agosto" }, { id: 9, nombre: "Septiembre" },
  { id: 10, nombre: "Octubre" }, { id: 11, nombre: "Noviembre" }, { id: 12, nombre: "Diciembre" }
];

  const nombreMesActual = MESES.find(m => m.id === mesSeleccionado)?.nombre || "Mes";

  return (
    <View style={stylesfilter.container}>
      <TouchableOpacity style={stylesfilter.button} onPress={() => setIsOpen(!isOpen)}>
        <Text style={stylesfilter.buttonText}>{nombreMesActual} ▼</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={stylesfilter.dropdown}>
          <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 500 }}>
            {MESES.map((mes) => (
              <TouchableOpacity
                key={mes.id}
                style={stylesfilter.item}
                onPress={() => {
                  onSelectMonth(mes.id);
                  setIsOpen(false);
                }}
              >
                <Text style={stylesfilter.itemText}>{mes.nombre}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
