import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { styleshome } from "../src/styles/styleshome";
import CustomModal from "./components/Modal"; 

// Importaciones de Firebase
import { db } from "../src/firebaseConfig"; 
import { collection, query, getDocs, orderBy, addDoc, where } from "firebase/firestore";

export default function Home() {
  const [mo, setMo] = useState(false);
  const [opciones, setOpciones] = useState([]);
  const [Registrador, setRegistrador] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Seleccionar...");
  const [selectedRegistrador, setSelectedRegistrador] = useState("Seleccionar...");
  const [mostrarListado, setMostrarListado] = useState(false);
  const [mostrarListadoReg, setMostrarListadoReg] = useState(false);
  
  const [formData, setFormData] = useState({
    tipoActa: '',
    ciudadano: '',
    nroActa: '',
    nroTomo: '',
    registrador: '',
    descripcion: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  }

  const guardarDatos = async() => {
    try {
      if (!formData.tipoActa || !formData.ciudadano || !formData.nroActa || !formData.nroTomo || !formData.registrador) {
        alert("Por favor, completa los campos obligatorios.");
        return;
      }

      const actaRef =collection(db, "registro_actas");
      const qDuplica = query(actaRef,
        where("tipoActa", "==", formData.tipoActa),
        where("nroActa", "==", formData.nroActa),
        where("nroTomo", "==", formData.nroTomo)
      );
      const snapshotDuplica = await getDocs(qDuplica);
      if (!snapshotDuplica.empty) {
        alert("Ya existe un acta con ese Nro. de Acta en ese Nro. de Tomo.");
        return;
      }

      const docRef = await addDoc(collection(db, "registro_actas"), {
        ...formData,
        time: new Date(),
      });
      alert("Datos guardados exitosamente.");
      setMo(false);
    } catch (error) {
      console.error("Error al guardar: ", error);
    }
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const qActas = query(collection(db, "tipo_actas"), orderBy("nombre", "asc"));
        const SnapshotActas = await getDocs(qActas);
        setOpciones(SnapshotActas.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const qRegistradores = query(collection(db, "nombre_registrador"), orderBy("nombre", "asc"));
        const SnapshotRegistrador = await getDocs(qRegistradores);
        setRegistrador(SnapshotRegistrador.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener datos: ", error);
      }
    };
    obtenerDatos();
  }, []);

  return (
    <View style={styleshome.body}>
      <View style={styleshome.container}>
        <Text style={styleshome.title}>Bienvenido</Text>
        
        <TouchableOpacity style={styleshome.buttonRegister} onPress={() => setMo(true)}>
          <Image source={require('../assets/IconSuma.png')} style={{width: 30, height: 30}} />
        </TouchableOpacity>

        <CustomModal 
            visible={mo} 
            onClose={() => setMo(false)} 
            title="Registro de Nuevas Actas"
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                
                {/* --- SECCIÓN TIPO DE ACTA --- */}
                <View style={{ zIndex: 2000 }}> 
                    <Text style={styleshome.label}>Tipo de Acta</Text>
                    <TouchableOpacity 
                      style={styleshome.inputField} 
                      onPress={() => {
                        setMostrarListado(!mostrarListado);
                        setMostrarListadoReg(false);
                      }}
                    >
                        <Text style={styleshome.inputText}>{selectedOption}</Text>
                        <Text>{mostrarListado ? "▲" : "▼"}</Text>
                    </TouchableOpacity>

                    {mostrarListado && (
                      <View style={styleshome.dropdownContainer}>
                        <ScrollView nestedScrollEnabled={true} style={{maxHeight: 150}}>
                          {opciones.map((item) => (
                            <TouchableOpacity 
                              key={item.id} 
                              style={styleshome.dropdownItem}
                              onPress={() => {
                                setSelectedOption(item.nombre);
                                handleInputChange('tipoActa', item.nombre);
                                setMostrarListado(false);
                              }}
                            >
                              <Text style={styleshome.inputText}>{item.nombre}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                </View>

                {/* --- SECCIÓN CIUDADANO --- */}
                <View style={{ zIndex: 1 }}>
                    <Text style={styleshome.label}>Ciudadano Solicitante</Text>
                    <TextInput 
                        style={styleshome.inputField} 
                        placeholder="Nombre Completo" 
                        value={formData.ciudadano}
                        onChangeText={(text) => handleInputChange('ciudadano', text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, zIndex: 1 }}>
                    <View style={{ width: '48%' }}>
                        <Text style={styleshome.label}>Nro. Acta</Text>
                        <TextInput 
                          style={styleshome.inputField} 
                          placeholder="001" 
                          keyboardType="numeric"
                          onChangeText={(text) => handleInputChange('nroActa', text)} 
                        />
                    </View>
                    <View style={{ width: '48%' }}>
                        <Text style={styleshome.label}>Nro. Tomo</Text>
                        <TextInput 
                          style={styleshome.inputField} 
                          placeholder="01" 
                          keyboardType="numeric"
                          onChangeText={(text) => handleInputChange('nroTomo', text)}
                        />
                    </View>
                </View>

                {/* --- SECCIÓN REGISTRADOR --- */}
                <View style={{ zIndex: 1000, marginTop: 15 }}>
                    <Text style={styleshome.label}>Registrador</Text>
                    <TouchableOpacity 
                      style={styleshome.inputField} 
                      onPress={() => {
                        setMostrarListadoReg(!mostrarListadoReg);
                        setMostrarListado(false);
                      }}
                    >
                        <Text style={styleshome.inputText}>{selectedRegistrador}</Text>
                        <Text>{mostrarListadoReg ? "▲" : "▼"}</Text>
                    </TouchableOpacity>

                    {mostrarListadoReg && (
                      <View style={styleshome.dropdownContainer}>
                        <ScrollView nestedScrollEnabled={true} style={{maxHeight: 150}}>
                          {Registrador.map((Reg) => (
                            <TouchableOpacity 
                              key={Reg.id} 
                              style={styleshome.dropdownItem}
                              onPress={() => {
                                setSelectedRegistrador(Reg.nombre);
                                handleInputChange('registrador', Reg.nombre);
                                setMostrarListadoReg(false);
                              }}
                            >
                              <Text style={styleshome.inputText}>{Reg.nombre}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                </View>

                <View style={{ zIndex: 1 }}>
                    <Text style={styleshome.label}>Descripción</Text>
                    <TextInput 
                        style={[styleshome.inputField, { height: 80 }]}
                        placeholder="Detalles adicionales..."
                        multiline={true}
                        onChangeText={(text) => handleInputChange('descripcion', text)}
                    />

                    <TouchableOpacity 
                        style={[styleshome.buttonGuardar, { marginTop: 20 }]} 
                        onPress={guardarDatos}
                    >
                        <Text style={styleshome.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </CustomModal>

        <Text style={styleshome.containerGrey}>Total de Actas</Text>
        <Text style={styleshome.containerBlue}>Gráfica</Text>
      </View>
    </View>
  );
}