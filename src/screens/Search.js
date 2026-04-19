import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, Keyboard } from "react-native";
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { styleshome } from "../styles/styleshome";
import { stylesmodal } from "../styles/stylesmodal";
import {stylesSearch} from "../styles/stylessearch";
import CustomModal from "./components/Modal";
import {useNavigation} from "@react-navigation/native";

export default function Search() {
  const [actas, setActas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);// Estado del modal normal de edición
  const [modalCopyVisible, setModalCopyVisible] = useState(false); //Estado el modal de Copias
  const [selectedId, setSelectedId] = useState(null); // Para saber qué acta editar/borrar
  const [copias, setCopias]= useState(null);
  //para la búsqueda
  const [searchText, setSearchText] = useState ("");

  // Estado unificado para el formulario de edición
  const [formData, setFormData] = useState({
    actaId: '',
    tipoActa: '',
    ciudadano: '',
    nroActa: '',
    nroTomo: '',
    descripcion: ''
  });

  //buscador
  const SearchFil = actas.filter( item => {
    const nombre = item.ciudadano ? item.ciudadano.toLowerCase() :"";
    const acta = item.nroActa ? item.nroActa.toString(): "";
    const tomo = item.nroTomo ? item.nroTomo.toString(): "";
    const busqueda = searchText.toLowerCase();

    return nombre.includes(busqueda) || acta.includes(busqueda) || tomo.includes(busqueda); 
  });

  useEffect(() => {
    const q = query(collection(db, "registro_solicitud"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      // console.log("Actas cargadas: ", docs.length);

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

  const handleOpenCopy = (acta) => {
    setSelectedId(acta.id);
    setCopias("");
    setModalCopyVisible(true);
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Función para Actualizar
  const handleUpdate = async () => {
    try {
      const actaRef = doc(db, "registro_solicitud", selectedId);
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
  
const saveCopy = async () => {
    // 1. Validación básica
    if (!copias || isNaN(parseInt(copias))) {
      Alert.alert("Error", "Por favor, ingresa un número válido de copias.");
      return;
    }

    try {
      // 2. Referencia al documento específico usando el ID seleccionado
      const actaRef = doc(db, "registro_solicitud", selectedId);

      // 3. Actualizamos solo el campo de copias
      await updateDoc(actaRef, {
        cantCopy: parseInt(copias),
        updatedAt: new Date() // Opcional: para saber cuándo se actualizó
      });

      // 4. Limpieza y cierre
      setModalCopyVisible(false);
      setCopias(""); 
      Alert.alert("Éxito", "Cantidad de copias actualizada.");
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert("Error", "No se pudo actualizar la cantidad de copias.");
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
              await deleteDoc(doc(db, "registro_solicitud", selectedId));
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
    <Text style={styleshome.title}>Búsqueda</Text>
      <View style={styleshome.container}>

            <View style={stylesSearch.searchContainer}>
              <Image source={(require('../../assets/searche.png'))} style={stylesSearch.searchIcon} />
              <TextInput
                style={ stylesSearch.searchInput}
                placeholder="Busca por nombre, acta o tomo..."
                value={searchText}
                onChangeText={setSearchText}/>

              {searchText.length >0 && (
                <TouchableOpacity onPress={() => setSearchText ("")}>
                  <Image source={(require('../../assets/close.png'))} style={stylesSearch.searchButtom}/>
                </TouchableOpacity>
              )}
            </View>
      <ScrollView>
          {SearchFil.map((item) => (
            <View key={item.id} style={styleshome.actaCard}>
              <View style={styleshome.actaInfo}>
                <Text style={styleshome.actaTipo}>{item.tipoActa}</Text>
                <Text style={styleshome.actaCiudadano}>{item.ciudadano}</Text>
                <Text style={styleshome.actaDetalle}>Acta: {item.nroActa} | Tomo: {item.nroTomo}</Text>
              </View>
              
          <View style={styleshome.actaActions}>
            <TouchableOpacity onPress={() => handleOpenModal(item)}>
              {/* Usamos un icono de edición o configuración */}
              <Image source={require('../../assets/edit.png')} style={styleshome.actionIcon} />
            </TouchableOpacity>
          </View>

          <View style={styleshome.actaActions}>
            <TouchableOpacity onPress={() => handleOpenCopy(item)}>
              <Image source={require('../../assets/IconCopy.png')} style={styleshome.actionIcon} />
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
            style={[styleshome.buttonGuardar, { backgroundColor:'#ee5454', width:'40%' }]} 
            onPress={handleDelete}
          >
            <Text style={styleshome.buttonText}>Eliminar Acta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styleshome.buttonGuardar, {backgroundColor: '#81d659', width:'40%' }]} 
            onPress={handleUpdate}
          >
            <Text style={styleshome.buttonText}>Guardar Acta</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </CustomModal>

      <CustomModal
        visible={modalCopyVisible}
        onClose={() => setModalCopyVisible(false)}
        title="Registrar Copias">
        <Text style={styleshome.label}>Cantidad de Copias Certificadas</Text>
        <TextInput 
          style={styleshome.inputField} 
          keyboardType="numeric"
          value={copias}
          onChangeText={setCopias}
        />
        <TouchableOpacity 
          style={[styleshome.buttonGuardar, { backgroundColor: '#81d659', marginTop: 20 }]} 
          onPress={saveCopy}
        >
          <Text style={styleshome.buttonText}>Guardar Copias</Text>
        </TouchableOpacity>
      </CustomModal>
    </ScrollView>
      {SearchFil.length === 0 &&(
            <Text style={{textAlign:'center', marginTop:20, color:'#555'}}>No se encontraron resultados</Text>
          )}
      </View>
    </View>
  );
}