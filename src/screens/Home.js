import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { styleshome } from "../../src/styles/styleshome";
import CustomModal from "./components/Modal"; 
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

// Importaciones de Firebase
import { db } from "../../src/firebaseConfig"; 
import { auth } from "../../src/firebaseConfig";
import { collection, query, getDocs, orderBy, addDoc, onSnapshot, doc, getDoc, where, serverTimestamp } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";

export default function Home() {
  const [mo, setMo] = useState(false);
  const [opciones, setOpciones] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Seleccionar...");
  const [selectedRegistrador, setSelectedRegistrador] = useState([]);
  const [mostrarListado, setMostrarListado] = useState(false);

  const [loading, setLoading] = useState(false);

  const [actasPOA, setActasPOA] = useState([]);
  const [datosGraficaTrimestre, setDatosGraficaTrimestre] = useState([]);
  //
  const [editId, setEditId] = useState(null);
  const [totalActas, setTotalActas] = useState(0);
  
  const [formData, setFormData] = useState({
    tipoActa: '',
    ciudadano: '',
    nroActa: '',
    nroTomo: '',
    registrador: selectedRegistrador,
    descripcion: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  }

  useEffect(() =>{
    const q=query(collection(db, "registro_actas"));
    const unsubscribe =onSnapshot(q, (snapshot) => {
      setTotalActas(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

useEffect(() => {
  const cargarNombreUsuario = async () => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const nombre = userSnap.data().nombre || "Registrador";

        setSelectedRegistrador(nombre);
        setFormData(prev => ({
          ...prev,
          registrador: nombre,
        }));
      }
    } catch (error) {
      console.error("Error al obtener nombre del usuario:", error);
    }
  };

  cargarNombreUsuario();
}, []);

  const cerrarModal = () => {
    setMo(false);
    setEditId(null);
    setFormData({ tipoActa: '', ciudadano: '', nroActa: '', nroTomo: '', registrador: selectedRegistrador, descripcion: '' });
  };


  const guardarDatos = async() => {
    const fechaActual = new Date();
    const diaDelMes = fechaActual.getDate();
    const semanaDelMes = Math.ceil(fechaActual.getDate() / 7);
    try {
      if (!formData.tipoActa || !formData.ciudadano || !formData.nroActa) {
        alert("Completa los campos obligatorios.");
        return;
      }

      const ahora = new Date();

      const MesNumero = (d) => {
        d= new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
        var IncioAnio= new Date(Date.UTC(d.getUTCFullYear(),0,1));
        return Math.ceil((((d-IncioAnio)/86400000)+1)/7);
      };

      const dataSave = {
        ...formData,
        createdAt: serverTimestamp(),

        stats: {
          semana: semanaDelMes,
          mes: ahora.getMonth() + 1,
          trimestre: Math.floor((ahora.getMonth()) / 3) + 1,
          anio: ahora.getFullYear(),
          diaDelMes: ahora.getDate(),
          diaDeLaSemana: ahora.getDay() + 1,
        }
      };

      if (editId) {
        // MODO EDICIÓN
        const docRef = doc(db, "registro_actas", editId);
        await updateDoc(docRef, { ...dataSave, updatedAt: serverTimestamp() });
        alert("Acta actualizada correctamente.");
      } else {
        await addDoc(collection(db, "registro_actas"), dataSave);
      }
      alert("Acta registrada correctamente.");
      cerrarModal();
    } catch (error) { console.error(error); }
  }

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const qActas = query(collection(db, "tipo_actas"), orderBy("nombre", "asc"));
        const SnapshotActas = await getDocs(qActas);
        setOpciones(SnapshotActas.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener datos: ", error);
      }
    };
    obtenerDatos();
  }, []);

  const CalcularDatosTrimestre = (actas) => {

    const conteo ={};
    actas.forEach((acta) => {
        conteo[acta.tipoActa] = (conteo[acta.tipoActa] || 0) + 1;
      });
      
      return Object.keys(conteo).map((tipo, index) => {
        let nombreCortoActa = tipo.replace("Acta de ", "");
      

    return {
      name: `${nombreCortoActa}`,
      population: conteo[tipo],
      color: ["#93B1A5","#62766E","#284265","#C3D1C2"][index % 4],
      legendFontColor: "#555",
      legendFontSize: 13
    };
  });
}

useEffect(() => {
  const anioActual = new Date().getFullYear();

  const q = query(collection(db, "registro_actas"), where("stats.anio", "==", anioActual));
const unsubscribe = onSnapshot(q, (snapshot) => {
    //Aquí se extraen los datos
    const actasCargadas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //Se actualiza 
    setActasPOA(actasCargadas);
    setTotalActas(actasCargadas.length);
    setLoading(false);
    
    
    //solo se ve la gráfica cuando tenga datos
    if (actasCargadas.length > 0) {
      setDatosGraficaTrimestre(CalcularDatosTrimestre(actasCargadas));
    } else {
      setDatosGraficaTrimestre([]);
    }
  }, (error) => {
    console.error("Error en el listener:", error);
  });

  return () => unsubscribe();
}, []);

  return (
    <View style={styleshome.body}>
      <View style={styleshome.container}>
        <Text style={styleshome.title}>Bienvenido</Text>
        
        <TouchableOpacity style={styleshome.buttonRegister} onPress={() => setMo(true)}>
          <Image source={require('../../assets/IconSuma.png')} style={{width: 30, height: 30}} />
        </TouchableOpacity>
        
        <View style={styleshome.totalCard}>
        <Text style={styleshome.cardLabel}>Actas{"\n"}Totales</Text>
        <View style={styleshome.numberBadge}>
         {loading ? <ActivityIndicator /> : <Text style={styleshome.totalNumber}>{totalActas}</Text>}
        </View>
      </View>

        <CustomModal 
            visible={mo} 
            onClose={() => setMo(false)} 
            title="Registro de Nuevas Actas"
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                
                {/* sección del acta*/}
                <View style={{ zIndex: 2000 }}> 
                    <Text style={styleshome.label}>Tipo de Acta</Text>
                    <TouchableOpacity 
                      style={styleshome.inputField} 
                      onPress={() => {
                        setMostrarListado(!mostrarListado);
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
                    <Text style={styleshome.label}>Registrador Responsable</Text>
                    <Text style={styleshome.inputField}>
                      <Text style={styleshome.inputText}>{selectedRegistrador}</Text>
                    </Text>
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
        <View style={[styleshome.containerBlue, {alignItems: 'center', justifyContent: 'center', width: '100%'}]}>
        <Text style={styleshome.title}>Gráfica</Text>
          <PieChart
            data={datosGraficaTrimestre}
            width={screenWidth * 0.8}
            height={210}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="20"
            center={[10,0]}
            absolute
            hasLegend={true}
            avoidFalseZero={true}
          />
          <View style={{
            position: 'absolute',
            left: '29%',
            top: '62%',
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#4A90E2',
          }}/>

        </View>
      </View>
    </View>
  );
}