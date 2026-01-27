import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, Keyboard } from "react-native";
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { styleshome } from "../styles/styleshome";
import { stylesmodal } from "../styles/stylesmodal";
import CustomModal from "./components/Modal";

export default function Search() {
  const [actas, setActas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // Para saber qué acta editar/borrar

  // Estado unificado para el formulario de edición
  const [formData, setFormData] = useState({
    tipoActa: '',
    ciudadano: '',
    nroActa: '',
    nroTomo: '',
    descripcion: ''
  });

  //buscador
  const SearchBar = () => {
    const [buscar, setBuscar] = useState('');

    const handleSearch =() => {
    }
  }

  useEffect(() => {
    const q = query(collection(db, "registro_actas"), orderBy("time", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setActas(docs);
    });
    return () => unsubscribe();
  }, []);

  // Función para abrir el modal con los datos cargados
  const handleOpenModal = (acta) => {
    setSelectedId(acta.id);
    setFormData({
      tipoActa: acta.tipoActa || '',
      ciudadano: acta.ciudadano || '',
      nroActa: acta.nroActa || '',
      nroTomo: acta.nroTomo || '',
      descripcion: acta.descripcion || ''
    });
    setModalVisible(true);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Función para Actualizar
  const handleUpdate = async () => {
    try {
      const actaRef = doc(db, "registro_actas", selectedId);
      await updateDoc(actaRef, { 
        ...formData,
        updatedAt: new Date() 
      });
      setModalVisible(false);
      Alert.alert("Éxito", "Acta actualizada correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar.");
    }
  };

  // Función para Eliminar
  const handleDelete = async () => {
    Alert.alert(
      "Eliminar", 
      "¿Estás seguro de que quieres borrar esta Acta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "registro_actas", selectedId));
              setModalVisible(false);
              Alert.alert("Eliminado", "El registro ha sido borrado.");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar.");
            }
          },
        },
      ]
    );
  };

  return (
     <View style={styleshome.body}>
          <View style={styleshome.container}>
            <Text style={styleshome.title}>Bienvenido</Text>
                    <TouchableOpacity style={styleshome.buttonRegister} onPress={() => setModalVisible(true)}>
                      <Image source={require('../../assets/searche.png')} style={{width: 40, height: 40, zIndex: 2000}} />
                    </TouchableOpacity>
    <ScrollView>
      {actas.map((item) => (
        <View key={item.id} style={styleshome.actaCard}>
          <View style={styleshome.actaInfo}>
            <Text style={styleshome.actaTipo}>{item.tipoActa}</Text>
            <Text style={styleshome.actaCiudadano}>{item.ciudadano}</Text>
            <Text style={styleshome.actaDetalle}>Acta: {item.nroActa} | Tomo: {item.nroTomo}</Text>
          </View>
          
          <View style={styleshome.actaActions}>
            <TouchableOpacity onPress={() => handleOpenModal(item)}>
              {/* Usamos un icono de edición o configuración */}
              <Image source={require('../../assets/close.png')} style={styleshome.actionIcon} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <CustomModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        title="Editar Acta"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styleshome.label}>Ciudadano</Text>
          <TextInput 
            style={styleshome.inputField} 
            value={formData.ciudadano}
            onChangeText={(t) => handleInputChange('ciudadano', t)}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <View style={{ width: '48%' }}>
              <Text style={styleshome.label}>Nro. Acta</Text>
              <TextInput 
                style={styleshome.inputField} 
                keyboardType="numeric"
                value={formData.nroActa}
                onChangeText={(t) => handleInputChange('nroActa', t)}
              />
            </View>
            <View style={{ width: '48%' }}>
              <Text style={styleshome.label}>Nro. Tomo</Text>
              <TextInput 
                style={styleshome.inputField} 
                keyboardType="numeric"
                value={formData.nroTomo}
                onChangeText={(t) => handleInputChange('nroTomo', t)}
              />
            </View>
          </View>

          <Text style={[styleshome.label, {marginTop: 10}]}>Descripción</Text>
          <TextInput 
            style={[styleshome.inputField, { height: 60 }]} 
            multiline
            value={formData.descripcion}
            onChangeText={(t) => handleInputChange('descripcion', t)}
          />
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:15,zIndex:1}}>
          <TouchableOpacity 
            style={[styleshome.buttonGuardar, { backgroundColor:'#FF4444', width:'40%' }]} 
            onPress={handleDelete}
          >
            <Text style={styleshome.buttonText}>Eliminar Acta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styleshome.buttonGuardar, {backgroundColor: '#38a704', width:'40%' }]} 
            onPress={handleUpdate}
          >
            <Text style={styleshome.buttonText}>Guardar Acta</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </CustomModal>
    </ScrollView>
      </View>
    </View>
  );
}