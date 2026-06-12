import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { styleshome } from "../../src/styles/styleshome";
import Filter from "./components/filter";
import CustomModal from "./components/Modal"; 
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

// Importaciones de Firebase
import { db, auth } from "../../src/firebaseConfig"; 
import { collection, query, getDocs, orderBy, addDoc, onSnapshot, doc, getDoc, where, serverTimestamp, updateDoc } from "firebase/firestore";

export default function Home() {
  const [mo, setMo] = useState(false);
  const [opciones, setOpciones] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Seleccionar...");
  const [selectedRegistrador, setSelectedRegistrador] = useState("");
  const [mostrarListado, setMostrarListado] = useState(false);
  const [loading, setLoading] = useState(false);

  const [actasPOA, setActasPOA] = useState([]);
  const [datosGraficaTrimestre, setDatosGraficaTrimestre] = useState([]);
  const [editId, setEditId] = useState(null);
  const [totalActas, setTotalActas] = useState(0);

  // Estado para el filtro (Mes actual del sistema)
  const [mesfiltro, setMesFiltro] = useState(new Date().getMonth() + 1);
  
  const [formData, setFormData] = useState({
    tipoActa: '',
    ciudadano: '',
    nroActa: '',
    nroTomo: '',
    descripcion: '',
  });

  const handleInputChange = (name, value) => {
  let textoLimpio = value;

  // 1. Si está escribiendo el Nro. de Acta o el Nro. de Tomo: SOLO números puritos
  if (name === "nroActa" || name === "nroTomo") {
    textoLimpio = value.replace(/[^0-9]/g, '');
  }

  // 2. Si está escribiendo el nombre del Ciudadano: SOLO letras y espacios 
  // (Permite tildes, mayúsculas, minúsculas y la Ñ)
  if (name === "ciudadano") {
  textoLimpio = value
    // 1. Borra cualquier cosa que no sea letra o espacio (Tu regla actual)
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')
    
    // 2. 🛠️ TRUCO NUEVO: Evita que el texto empiece con un espacio en blanco
    .replace(/^\s+/g, '')
    
    // 3. 🛠️ TRUCO NUEVO: Si detecta dos o más espacios seguidos, los convierte en uno solo
    .replace(/\s{2,}/g, ' ');
}

  // 3. Para la descripción puedes dejar que use puntuación normal, 
  // o si quieres bloquear caracteres extraños (como #, $, %, etc.) puedes activar esto:
  if (name === "descripcion") {
    // Permite letras, números, espacios, puntos, comas y signos de interrogación/exclamación
    textoLimpio = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ .,!?()\n]/g, '');
  }

  // Guardamos el texto ya sanitizado en el estado del formulario
  setFormData({ ...formData, [name]: textoLimpio });
};

  // Cargar perfil del Registrador autenticado
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
        }
      } catch (error) {
        console.error("Error al obtener nombre del usuario:", error);
      }
    };
    cargarNombreUsuario();
  }, []);

  // Limpieza absoluta del modal y selectores visuales
  const cerrarModal = () => {
    setMo(false);
    setEditId(null);
    setSelectedOption("Seleccionar...");
    setMostrarListado(false);
    setFormData({ 
      tipoActa: '', 
      ciudadano: '', 
      nroActa: '', 
      nroTomo: '', 
      descripcion: '' 
    });
  };

  const guardarDatos = async () => {
    const fechaActual = new Date();
    const diaDelMes = fechaActual.getDate();
    const semanaDelMes = Math.ceil(diaDelMes / 7);

    // Forzar que el estado tenga el tipo de acta seleccionado antes de validar
    if (!selectedOption || selectedOption === "Seleccionar..." || !formData.ciudadano || !formData.nroActa || !formData.nroTomo) {
      alert("Completa los campos obligatorios.");
      return;
    }

    const usuarioActual = auth.currentUser;
    if (!usuarioActual) {
      alert("Usuario no autenticado.");
      return;
    }

    try {
      // Verificar duplicados en tiempo real (Modo creación)
      if (!editId) {
        const qDuplicado = query(
          collection(db, "registro_solicitud"),
          where("tipoActa", "==", selectedOption),
          where("nroActa", "==", formData.nroActa),
          where("nroTomo", "==", formData.nroTomo)
        );

        const querySnapshot = await getDocs(qDuplicado);
        if (!querySnapshot.empty) {
          alert(`¡Error! Ya existe un registro de ${selectedOption} con el Acta Nro. ${formData.nroActa} y Tomo ${formData.nroTomo}.`);
          return;
        }
      }

      // Re-estructuración limpia de los datos eliminando ambigüedades
      const dataSave = {
        tipoActa: selectedOption,
        ciudadano: formData.ciudadano,
        nroActa: formData.nroActa,
        nroTomo: formData.nroTomo,
        descripcion: formData.descripcion,
        nombre_registrador: selectedRegistrador,
        creadorId: usuarioActual.uid,
        cantCopy: 0,
        createdAt: serverTimestamp(),
        stats: {
          semana: Number(semanaDelMes),
          mes: Number(fechaActual.getMonth() + 1),
          trimestre: Number(Math.floor(fechaActual.getMonth() / 3) + 1), 
          anio: Number(fechaActual.getFullYear()),
          diaDelMes: Number(diaDelMes),
          diaDeLaSemana: Number(fechaActual.getDay() + 1),
        }
      };

if (editId) {
      const docRef = doc(db, "registro_solicitud", editId);
      // Al actualizar conservamos el creador original, solo actualizamos datos y fecha
      await updateDoc(docRef, { 
        tipoActa: selectedOption,
        ciudadano: formData.ciudadano,
        nroActa: formData.nroActa,
        nroTomo: formData.nroTomo,
        descripcion: formData.descripcion,
        updatedAt: serverTimestamp() 
      });
      alert("Acta actualizada correctamente.");
    } else {
      await addDoc(collection(db, "registro_solicitud"), dataSave);
      alert("Acta registrada correctamente.");
    }
    cerrarModal();
  } catch (error) { 
    console.error("Error al guardar datos:", error); 
    alert("Hubo un error al guardar en la base de datos.");
  }
};

  // Cargar catálogo de tipos de actas disponibles
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const qActas = query(collection(db, "tipo_actas"), orderBy("nombre", "asc"));
        const SnapshotActas = await getDocs(qActas);
        setOpciones(SnapshotActas.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener tipos de actas: ", error);
      }
    };
    obtenerDatos();
  }, []);

  const CalcularDatosTrimestre = (actas) => {
    const conteo = {};
    actas.forEach((acta) => {
      if (acta.tipoActa) {
        conteo[acta.tipoActa] = (conteo[acta.tipoActa] || 0) + 1;
      }
    });
      
    return Object.keys(conteo).map((tipo, index) => {
      let nombreCortoActa = tipo.replace("Acta de ", "");
      return {
        name: `${nombreCortoActa}`,
        population: conteo[tipo],
        color: ["#93B1A5", "#62766E", "#284265", "#C3D1C2", "#D9D9D9", "#F0F0F0"][index % 6],
        legendFontColor: "#555",
        legendFontSize: 13
      };
    });
  };

  // Listener principal en Tiempo Real (Filtrado eficiente por mes)
  useEffect(() => {
    setLoading(true);
    const anioActual = new Date().getFullYear();

    const q = query(
      collection(db, "registro_solicitud"), 
      where("stats.anio", "==", Number(anioActual)),
      where("stats.mes", "==", Number(mesfiltro)) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const actasCargadas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setActasPOA(actasCargadas);
      setTotalActas(snapshot.size); 
      
      if (actasCargadas.length > 0) {
        setDatosGraficaTrimestre(CalcularDatosTrimestre(actasCargadas));
      } else {
        setDatosGraficaTrimestre([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error en el listener de Home:", error);
      setLoading(false);
    });

    return () => { unsubscribe(); }; 
  }, [mesfiltro]);

  return (
    <ScrollView style={styleshome.body} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styleshome.container}>
        <Filter mesSeleccionado={mesfiltro} onSelectMonth={(mes) => setMesFiltro(Number(mes))} />
        <Text style={styleshome.title}>Bienvenido</Text>
        
        <TouchableOpacity style={styleshome.buttonRegister} onPress={() => setMo(true)}>
          <Image source={require('../../assets/IconSuma.png')} style={{width: 30, height: 30}} />
        </TouchableOpacity>
        
        <View style={styleshome.totalCard}>
          <Text style={styleshome.cardLabel}>Actas{"\n"}Totales</Text>
          <View style={styleshome.numberBadge}>
            {loading ? <ActivityIndicator color="#4A90E2" /> : <Text style={styleshome.totalNumber}>{totalActas}</Text>}
          </View>
        </View>

        {/* Modal para Registro de Solicitudes */}
        <CustomModal visible={mo} onClose={cerrarModal} title="Registro de Solicitud">
              
{/* Sección para el Tipo de Acta */}
<View style={{ zIndex: 9999, position: 'relative' }}> 
    <Text style={styleshome.label}>Tipo de Acta</Text>
    <TouchableOpacity 
      style={styleshome.inputField} 
      onPress={() => setMostrarListado(!mostrarListado)}
      activeOpacity={0.7}
    >
        <Text style={styleshome.inputText}>{selectedOption}</Text>
        <Text>{mostrarListado ? "▲" : "▼"}</Text>
    </TouchableOpacity>

    {mostrarListado && (
      <View style={styleshome.dropdownContainer}>
        <ScrollView 
          nestedScrollEnabled={true} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          style={{ width: '100%' }}
        >
          {opciones.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styleshome.dropdownItem}
              onPress={() => {
                setSelectedOption(item.nombre);
                setMostrarListado(false);
              }}
            >
              <Text style={[styleshome.inputText, { color: '#333' }]}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
</View>

{/* Espacio controlado */}
<View style={{ height: 15 }} />

{/* Espacio controlado para separar este bloque del siguiente input sin que se encimen */}
<View style={{ height: 15 }} />

              <View style={{ zIndex: 1, marginTop: 0 }}>
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
                        value={formData.nroActa}
                        onChangeText={(text) => handleInputChange('nroActa', text)} 
                      />
                  </View>
                  <View style={{ width: '48%' }}>
                      <Text style={styleshome.label}>Nro. Tomo</Text>
                      <TextInput 
                        style={styleshome.inputField} 
                        placeholder="01" 
                        keyboardType="numeric"
                        value={formData.nroTomo}
                        onChangeText={(text) => handleInputChange('nroTomo', text)}
                      />
                  </View>
              </View>

              <View style={{ zIndex: 1000, marginTop: 15 }}>
                  <Text style={styleshome.label}>Registrador Responsable</Text>
                  <View style={styleshome.inputField}>
                    <Text style={styleshome.inputText}>{selectedRegistrador || "Cargando registrador..."}</Text>
                  </View>
              </View>

              <View style={{ zIndex: 1, marginTop: 15 }}>
                  <Text style={styleshome.label}>Descripción</Text>
                  <TextInput 
                      style={[styleshome.inputField, { height: 80 }]}
                      placeholder="Detalles adicionales..."
                      multiline={true}
                      value={formData.descripcion}
                      onChangeText={(text) => handleInputChange('descripcion', text)}
                  />

                  <TouchableOpacity 
                      style={[styleshome.buttonGuardar, { marginTop: 20 }]} 
                      onPress={guardarDatos}
                  >
                      <Text style={styleshome.buttonText}>Guardar</Text>
                  </TouchableOpacity>
              </View>
        </CustomModal>

        {/* Sección de la Gráfica */}
        <View style={[styleshome.containerBlue, {alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20}]}>
          <Text style={styleshome.title}>Gráfica</Text>
          {datosGraficaTrimestre && datosGraficaTrimestre.length > 0 ? (
            <>
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
            </>
          ) : (
            <View style={{
              width: screenWidth * 0.8,
              height: 210,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 16,
              marginTop: 10,
            }}>
              <Text style={{
                color: "#ffffff",
                fontSize: 15,
                fontWeight: "600",
                textAlign: "center",
                paddingHorizontal: 20
              }}>
                No hay actas registradas para este mes
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}