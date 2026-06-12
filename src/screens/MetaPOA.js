import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Dimensions, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Image, 
  TextInput 
} from "react-native";
import { ProgressChart } from "react-native-chart-kit"; 

// Estilos e Inyecciones de Componentes
import { styleshome } from "../styles/styleshome";
import { stylesmodal } from "../styles/stylesmodal";
import CustomModal from "./components/Modal";

// Importaciones de Firebase
import { db } from "../firebaseConfig";
import { 
  collection, 
  query, 
  onSnapshot, 
  where, 
  doc, 
  setDoc, 
  orderBy, 
  getDocs 
} from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

export default function POA() {
  const [metasTotal, setMetasTotal] = useState({ nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 });
  const [seguimientoTotal, setSeguimientoTotal] = useState({ nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 });
  const [porcentajeGlobal, setPorcentajeGlobal] = useState(0);
  const [porcentajeTexto, setPorcentajeTexto] = useState(0);
  const [loading, setLoading] = useState(true);

  const [trimestre, setTrimestre] = useState(1);
  const [anio, setAnio] = useState(2026);

  const [mo, setMo] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Seleccionar tipo de acta");
  const [metaValue, setMetaValue] = useState("");
  const [mostrarListado, setMostrarListado] = useState(false);
  const [opciones, setOpciones] = useState([]); 

  // 1. Cargar catálogo estático de tipos de actas disponibles
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const qActas = query(collection(db, "tipo_actas"), orderBy("nombre", "asc"));
        const snapshotActas = await getDocs(qActas);
        setOpciones(snapshotActas.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error al obtener tipos de actas: ", error);
      }
    };
    obtenerDatos();
  }, []);

    // Limpieza absoluta del modal y selectores visuales
  const cerrarModal = () => {
    setMo(false);
    setSelectedOption("Seleccionar...");
    setMostrarListado(false);
  };

  // 2. Listener en Tiempo Real para Metas y Seguimiento
  useEffect(() => {
    setLoading(true);

    const qPoa = query(
      collection(db, "poa"),
      where("trimestre", "==", Number(trimestre)),
      where("anio", "==", Number(anio))
    );

    const qActas = query(
      collection(db, "registro_solicitud"),
      where("stats.trimestre", "==", Number(trimestre)),
      where("stats.anio", "==", Number(anio))
    );

    let metasMapAux = { nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 };
    let segMapAux = { nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 };

    const calcularTotalesYProgreso = (metas, seguimiento) => {
      const sumaMetas = metas.nacimientos + metas.matrimonios + metas.defunciones + metas.otros;
      const sumaSeg = seguimiento.nacimientos + seguimiento.matrimonios + seguimiento.defunciones + seguimiento.otros;
      
      const resultadoCalculado = sumaMetas > 0 ? sumaSeg / sumaMetas : 0;
      setPorcentajeTexto(resultadoCalculado);
      setPorcentajeGlobal(resultadoCalculado > 1 ? 1 : resultadoCalculado);
    };

    const unsubscribePoa = onSnapshot(qPoa, (snapshotPoa) => {
      const metasMap = { nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 };
      snapshotPoa.docs.forEach(doc => {
        const d = doc.data();
        const valormeta = Number(d.meta) || 0; // Asegura que sea un número, incluso si el campo es una cadena vacía o no existe
        
        if (d.tipoActa && d.tipoActa.includes("Nacimiento")) {
              metasMap.nacimientos = valormeta;
            } else if (d.tipoActa && d.tipoActa.includes("Matrimonio")) {
              metasMap.matrimonios = valormeta;
            } else if (d.tipoActa && d.tipoActa.includes("Defunción")) {
              metasMap.defunciones = valormeta;
            } else {
              metasMap.otros += valormeta; 
            }
          });
      metasMapAux = metasMap;
      setMetasTotal(metasMap);
      calcularTotalesYProgreso(metasMapAux, segMapAux);
    }, (error) => console.error("Error en Metas:", error));

    const unsubscribeActas = onSnapshot(qActas, (snapshotActas) => {
      const segMap = { nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 };
      
      snapshotActas.forEach((doc) => {
        const d = doc.data();
        
        // Leemos el campo exacto que tu Home genera: 'tipoActa'
        const nombreActa = d.tipoActa; 

        if (nombreActa && typeof nombreActa === "string") {
          
          if (nombreActa.includes("Nacimiento")) {
            segMap.nacimientos++;
          } else if (nombreActa.includes("Matrimonio")) {
            segMap.matrimonios++;
          } else if (nombreActa.includes("Defunción")) {
            segMap.defunciones++;
          } else {
            // Al no ser ninguna de las anteriores, cualquier otra acta 
            // (Residencia, Divorcio, Unión Estable) se sumará correctamente aquí.
            segMap.otros++; 
          }

        }
      });

      segMapAux = segMap;
      setSeguimientoTotal(segMap);
      calcularTotalesYProgreso(metasMapAux, segMapAux);
      setLoading(false);
    }, (error) => {
      console.error("Error en Seguimiento:", error);
      setLoading(false);
    });

    return () => {
      unsubscribePoa();
      unsubscribeActas();
    };
  }, [trimestre, anio]);

  const guardarMetaPOA = async (anio, trimestre, tipo, cantidad) => {
    if (!tipo || tipo === "Seleccionar tipo de acta" || !cantidad) {
      alert("Por favor selecciona un tipo de acta y define una cantidad.");
      return;
    }
    try {
      const tipoLimpiado = tipo.normalize("NFD").replace(/\s+/g, ''); // Elimina espacios para el ID
      const docId = `${anio}_T${trimestre}_${tipoLimpiado}`;

      const valorNumerico = parseInt(cantidad, 10);
    if (isNaN(valorNumerico)) {
      alert("La cantidad ingresada no es un número válido.");
      return;
    }
      await setDoc(doc(db, "poa", docId), {
        anio: Number(anio),
        trimestre: Number(trimestre),
        tipoActa: tipo,
        meta: valorNumerico,
        fechaActualizacion: new Date()
      });
      alert("¡Meta guardada exitosamente!");
      setMetaValue("");
      setSelectedOption("Seleccionar tipo de acta");
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar meta: ", error);
    }
  };



  const formatearNumero = (num) => {
    if (num === undefined || num === null) return "00";
    return num.toString().padStart(2, '0');
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(130, 150, 130, ${opacity})`, 
    strokeWidth: 3,
    barPercentage: 0.5,
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 100 }} />;
  }


  //control de caracteres y números no aceptados en el input
  const handleCantidadChange = (text) => {
  // Expresión regular que busca CUALQUIER cosa que NO sea un número del 0 al 9
  // [^0-9] significa "todo lo que no sea un dígito"
  const textoLimpio = text.replace(/[^0-9]/g, '');
  
  // Guardamos solo el número limpio en el estado
  setMetaValue(textoLimpio);
};

  return (
    <ScrollView style={styleshome.body}>
      <View style={styleshome.container}>
        <Text style={styleshome.title}>Plan Operativo Anual</Text>
        <Text style={styleshome.subtitlePOA}>T{trimestre} - {anio}</Text>

        {/* Fila de Filtros Trimestrales */}
        <View style={styleshome.filterContainer}>
            <Text style={styleshome.filterLabel}>Seleccionar Trimestre:</Text>
            <View style={styleshome.buttonRow}>
              {[1, 2, 3, 4].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styleshome.filterButton,
                    trimestre === t && styleshome.filterButtonActive
                  ]}
                  onPress={() => setTrimestre(t)}
                >
                  <Text style={[
                    styleshome.filterButtonText,
                    trimestre === t && styleshome.filterButtonTextActive
                  ]}>
                    T{t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
        </View>

        {/* Botón flotante para Registrar */}
        <TouchableOpacity style={styleshome.buttonRegister} onPress={() => setMo(true)}>
          <Image source={require('../../assets/IconSuma.png')} style={{width: 30, height: 30}} />
        </TouchableOpacity>

        {/* Modal de Registro de Metas */}
        <CustomModal visible={mo} onClose={cerrarModal} title={`Registrar Meta`}>
          <Text style={stylesmodal.modalTitle}>Para T{trimestre}-{anio}</Text>
          
          {/* CAMBIO CLAVE: ScrollView interno flexible para contener el espacio del modal */}
          <ScrollView 
            nestedScrollEnabled={true} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ width: '100%', maxHeight: 400 }}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <View style={styleshome.modalFormContainer}>
              
              {/* SECCIÓN DEL SELECTOR TIPO DE ACTA */}
              <View style={{ zIndex: 99999, position: 'relative' }}> 
                <Text style={styleshome.label}>Tipo de Acta</Text>
                
                <TouchableOpacity 
                  style={[styleshome.inputField, mostrarListado && styleshome.inputFieldActive]} 
                  onPress={() => setMostrarListado(!mostrarListado)}
                  activeOpacity={0.7}
                >
                  <Text style={styleshome.inputText}>{selectedOption}</Text>
                  <Text>{mostrarListado ? "▲" : "▼"}</Text>
                </TouchableOpacity>

                {/* LISTA DESPLEGABLE OPTIMIZADA */}
                {mostrarListado && (
                  <View style={styleshome.dropdownContainer}>
                    <ScrollView 
                      nestedScrollEnabled={true} 
                      keyboardShouldPersistTaps="always"
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

              {/* UN SOLO ESPACIADOR LIMPIO CONTROLADO POR EL ESTADO */}
              <View style={{ height: mostrarListado ? 165 : 20 }} />

              {/* SECCIÓN INFERIOR DEL FORMULARIO */}
              <View pointerEvents={mostrarListado ? 'none' : 'auto'} style={{ zIndex: 1 }}>
                <Text style={styleshome.label}>Cantidad Meta</Text>
                <TextInput 
                  placeholder="Cantidad meta (ej. 50)"
                  keyboardType="numeric"
                  value={metaValue}
                  onChangeText={handleCantidadChange}
                  style={styleshome.inputField}
                  placeholderTextColor="#aaa"
                />

                <TouchableOpacity 
                  onPress={() => guardarMetaPOA(anio, trimestre, selectedOption, metaValue)}
                  style={styleshome.buttonGuardar}
                  activeOpacity={0.8}
                >
                  <Text style={styleshome.buttonText}>Establecer Meta</Text>
                </TouchableOpacity>
              </View>

            </View>
          </ScrollView>
        </CustomModal>

        {/* Gráfica Circular de Progreso */}
        <View style={styleshome.graphContainer}>
          <ProgressChart
            data={[porcentajeGlobal]} 
            width={screenWidth - 60}
            height={200}
            strokeWidth={16}
            radius={80}
            chartConfig={chartConfig}
            hideLegend={true}
          />
          <View style={styleshome.percentageWrapper}>
            <Text style={styleshome.percentageText}>
              {Math.round(porcentajeTexto * 100)}
              <Text style={{ fontSize: 30 }}>%</Text>
            </Text>
          </View>
        </View>

        {/* Tarjetas de Datos de Doble Columna */}
        <View style={styleshome.cardsRow}>
          <View style={[styleshome.card, styleshome.shadow]}>
            <Text style={styleshome.cardTitle}>Meta</Text>
            <DataRow number={formatearNumero(metasTotal.nacimientos)} label="Nacimientos" />
            <DataRow number={formatearNumero(metasTotal.matrimonios)} label="Matrimonios" />
            <DataRow number={formatearNumero(metasTotal.defunciones)} label="Defunciones" />
            <DataRow number={formatearNumero(metasTotal.otros)} label="Otros" />
          </View>

          <View style={[styleshome.card, styleshome.shadow]}>
            <Text style={styleshome.cardTitle}>Seguimiento</Text>
            <DataRow number={formatearNumero(seguimientoTotal.nacimientos)} label="Nacimientos" />
            <DataRow number={formatearNumero(seguimientoTotal.matrimonios)} label="Matrimonios" />
            <DataRow number={formatearNumero(seguimientoTotal.defunciones)} label="Defunciones" />
            <DataRow number={formatearNumero(seguimientoTotal.otros)} label="Otros" />
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const DataRow = ({ number, label }) => (
  <View style={styleshome.dataRow}>
    <Text style={styleshome.rowNumber}>{number}</Text>
    <Text style={styleshome.rowLabel}>{label}</Text>
  </View>
);