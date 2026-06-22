import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // 🛠️ Importamos auth para saber quién está conectado
import { styleshome } from "../styles/styleshome";
import { stylesSearch } from "../styles/stylessearch";
import CustomModal from "./components/Modal";

export default function Search() {
  const [actas, setActas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCopyVisible, setModalCopyVisible] = useState(false); 
  const [selectedId, setSelectedId] = useState(null); 
  const [copias, setCopias] = useState("");
  const [searchText, setSearchText] = useState("");
  
  // Guardamos el objeto completo seleccionado para validar permisos fácilmente
  const [selectedActa, setSelectedActa] = useState(null); 

  const [formData, setFormData] = useState({
    tipoActa: '',
    ciudadano: '',
    nroActa: '',
    nroTomo: '',
    descripcion: ''
  });

  // Buscador inteligente en tiempo real
  const SearchFil = actas.filter(item => {
    const nombre = item.ciudadano ? item.ciudadano.toLowerCase() : "";
    const acta = item.nroActa ? item.nroActa.toString() : "";
    const tomo = item.nroTomo ? item.nroTomo.toString() : "";
    const busqueda = searchText.toLowerCase();

    return nombre.includes(busqueda) || acta.includes(busqueda) || tomo.includes(busqueda); 
  });

  useEffect(() => {
    const usuariologeado = auth.currentUser;

    if (!usuariologeado) return;
    
    const q = query(collection(db, "registro_solicitud"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setActas(docs);
    }, (error) => {
      Alert.alert("Error", "No se pudieron cargar los registros.");
    });
    return () => unsubscribe();
  }, []);

  // Interceptador para limpiar inputs en tiempo real en la edición
  const handleInputChange = (name, value) => {
    let textoLimpio = value;

    if (name === "nroActa" || name === "nroTomo") {
      textoLimpio = value.replace(/[^0-9]/g, '');
    }
    if (name === "ciudadano") {
      textoLimpio = value
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')
        .replace(/^\s+/g, '')
        .replace(/\s{2,}/g, ' ');
    }

    setFormData({ ...formData, [name]: textoLimpio });
  };

  const handleOpenModal = (acta) => {
    setSelectedId(acta.id);
    setSelectedActa(acta); // Guardamos la info del acta completa para validar autoría
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
    setSelectedActa(acta);
    setCopias(acta.cantCopy ? acta.cantCopy.toString() : "");
    setModalCopyVisible(true);
  };

  // Función para Actualizar con validación de creador
  const handleUpdate = async () => {
    const usuarioLogueado = auth.currentUser;
    
    // 🛡️ CONTROL DE SEGURIDAD: Compara el operador actual con el que guardó el registro
    if (selectedActa && selectedActa.creador_uid && selectedActa.creador_uid !== usuarioLogueado.uid) {

      Alert.alert("Acceso denegado", "Solo el registrador que creó este registro puede modificarlo.");
      return;
    }

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
    const valorLimpio = copias.replace(/[^0-9]/g, '');
    if (!valorLimpio || isNaN(parseInt(valorLimpio))) {
      Alert.alert("Error", "Por favor, ingresa un número válido de copias.");
      return;
    }

    try {
      const actaRef = doc(db, "registro_solicitud", selectedId);
      await updateDoc(actaRef, {
        cantCopy: parseInt(valorLimpio, 10),
        updatedAt: new Date()
      });

      setModalCopyVisible(false);
      setCopias(""); 
      Alert.alert("Éxito", "Cantidad de copias actualizada.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la cantidad de copias.");
    }
  };

  // Función para Eliminar con validación de creador
  const handleDelete = async () => {
    const usuarioLogueado = auth.currentUser;

    // CONTROL DE SEGURIDAD ANTES DE ELIMINAR
    if (selectedActa && selectedActa.creador_uid && selectedActa.creador_uid !== usuarioLogueado.uid) {
      Alert.alert("Acceso denegado", "No tienes permisos para eliminar este registro porque fue creado por otro usuario.");
      return;
    }

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
      <View style={styleshome.container}>
        <Text style={styleshome.title}>Búsqueda</Text>

        <View style={stylesSearch.searchContainer}>
          <Image source={require('../../assets/searche.png')} style={stylesSearch.searchIcon} />
          <TextInput
            style={stylesSearch.searchInput}
            placeholder="Busca por nombre, acta o tomo..."
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Image source={require('../../assets/close.png')} style={stylesSearch.searchButtom}/>
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
                {/* 💡 Agregamos una pequeña etiqueta visual para saber quién lo hizo */}
                <Text style={{fontSize: 10, color: '#999', marginTop: 2}}>Registrado por: {item.nombre_registrador || 'Desconocido'}</Text>
              </View>
              
              <View style={{flexDirection: 'row', gap: 20, backgroundColor: '#fff', padding: 8, borderRadius: 10}}>
                <View>
                  <TouchableOpacity onPress={() => handleOpenModal(item)}>
                    <Image source={require('../../assets/edit.png')} style={styleshome.actionIcon} />
                  </TouchableOpacity>
                </View>

                <View>
                  <TouchableOpacity onPress={() => handleOpenCopy(item)}>
                    <Image source={require('../../assets/IconCopy.png')} style={styleshome.actionIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* Modal Editar */}
          <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} title="Editar Acta">
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

              <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:15}}>
                <TouchableOpacity 
                  style={[styleshome.buttonGuardar, { backgroundColor:'#ee5454', width:'45%' }]} 
                  onPress={handleDelete}
                >
                  <Text style={styleshome.buttonText}>Eliminar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styleshome.buttonGuardar, {backgroundColor: '#81d659', width:'45%' }]} 
                  onPress={handleUpdate}
                >
                  <Text style={styleshome.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </CustomModal>

          {/* Modal Copias */}
          <CustomModal visible={modalCopyVisible} onClose={() => setModalCopyVisible(false)} title="Registrar Copias">
            <Text style={styleshome.label}>Cantidad de Copias Certificadas</Text>
            <TextInput 
              style={styleshome.inputField} 
              keyboardType="numeric"
              value={copias} // 🛠️ Corregido: Ahora usa la variable del estado correspondiente
              onChangeText={(text) => setCopias(text.replace(/[^0-9]/g, ''))} // 🛠️ Sanitización directa
            />
            <TouchableOpacity 
              style={[styleshome.buttonGuardar, { backgroundColor: '#81d659', marginTop: 20 }]} 
              onPress={saveCopy}
            >
              <Text style={styleshome.buttonText}>Guardar Copias</Text>
            </TouchableOpacity>
          </CustomModal>
        </ScrollView>

        {SearchFil.length === 0 && (
          <Text style={{textAlign:'center', marginTop:20, color:'#555'}}>No se encontraron resultados</Text>
        )}
      </View>
    </View>
  );
}