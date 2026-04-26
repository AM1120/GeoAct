import { collection, query, onSnapshot, where, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState, useEffect } from "react";
import { ProgressChart } from "react-native-chart-kit"; 
import { View, Text, Dimensions, ScrollView, ActivityIndicator, styleshomeheet, TouchableOpacity, Image, TextInput } from "react-native";
import { styleshome } from "../styles/styleshome";
import { stylesmodal } from "../styles/stylesmodal";
import CustomModal from "./components/Modal";
import {Picker} from "@react-native-picker/picker";

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

  useEffect(() => {
    setLoading(true);
    // 1. Escuchamos las METAS
    const qPoa = query(
      collection(db, "poa"),
      where("trimestre", "==", trimestre),
      where("anio", "==", anio)
    );

    const unsubscribePoa = onSnapshot(qPoa, (snapshotPoa) => {
      const metasMap = { nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 };
      snapshotPoa.docs.forEach(doc => {
        const d = doc.data();
        if (d.tipoActa.includes("Nacimiento")) metasMap.nacimientos = d.meta;
        else if (d.tipoActa.includes("Matrimonio")) metasMap.matrimonios = d.meta;
        else if (d.tipoActa.includes("Defunción")) metasMap.defunciones = d.meta;
        else metasMap.otros = d.meta;
        
      });
      setMetasTotal(metasMap);

      

      // 2. Escuchamos los REGISTROS REALES (SEGUIMIENTO)
      const qActas = query(
        collection(db, "registro_solicitud"),
        where("stats.trimestre", "==", trimestre),
        where("stats.anio", "==", anio)
      );

      const unsubscribeActas = onSnapshot(qActas, (snapshotActas) => {
        const segMap = { nacimientos: 0, matrimonios: 0, defunciones: 0, otros: 0 };
        snapshotActas.forEach((doc) => {
          const d = doc.data();
          if (d.tipoActa.includes("Nacimiento")) segMap.nacimientos++;
          else if (d.tipoActa.includes("Matrimonio")) segMap.matrimonios++;
          else if (d.tipoActa.includes("Defunción")) segMap.defunciones++;
          else segMap.otros++;
        });
        setSeguimientoTotal(segMap);

        // 3. Cálculo de Porcentaje Global
        const sumaMetas = metasMap.nacimientos + metasMap.matrimonios + metasMap.defunciones + metasMap.otros;
        const sumaSeg = segMap.nacimientos + segMap.matrimonios + segMap.defunciones + segMap.otros;
        setPorcentajeGlobal(sumaMetas > 0 ? sumaSeg / sumaMetas : 0);

        let resultadoGrafica = sumaMetas > 0 ? sumaSeg / sumaMetas : 0;
        const porcentajeParaGrafica = resultadoGrafica >1 ? 1 : resultadoGrafica; // Con esto la gráfica y solamente la gráfica no se desbordará si el seguimiento supera la meta
        setPorcentajeGlobal(porcentajeParaGrafica);

        setPorcentajeTexto(resultadoGrafica);
        setLoading(false);
      });

      return () => unsubscribeActas();
    }, (error) => {
      console.error("Error al escuchar POA:", error);
      setLoading(false);
    });

    return () => unsubscribePoa();
  }, [trimestre,anio]); // Re-escucha si cambia trimestre o año

  if (loading) {
    return <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 100 }} />;
  }

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(130, 150, 130, ${opacity})`, // Verde grisáceo como tu imagen
    strokeWidth: 3,
    barPercentage: 0.5,
  };

const guardarMetaPOA = async (anio, trimestre, tipo, cantidad) => {
  try {
    // Creamos un ID único para que no se dupliquen metas del mismo periodo
    const docId = `${anio}_T${trimestre}_${tipo.replace(/\s+/g, '')}`;
    
    await setDoc(doc(db, "poa", docId), {
      anio: Number(anio),
      trimestre: Number(trimestre),
      tipoActa: tipo,
      meta: Number(cantidad),
      fechaActualizacion: new Date()
    });
    
    alert("¡Meta guardada exitosamente!");
  } catch (error) {
    console.error("Error al guardar meta: ", error);
  }
};

const formatearNumero = (num) => {
  if (num === undefined || num === null) return "00";
  return num.toString().padStart(2, '0');
};

  return (
    <ScrollView style={styleshome.body}>
      <View style={styleshome.container}>
        <Text style={styleshome.title}>Plan Operativo Anual</Text>
        <Text style={styleshome.subtitlePOA}>T{trimestre} - {anio}</Text>

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

            <TouchableOpacity style={styleshome.buttonRegister} onPress={() => setMo(true)}>
              <Image source={require('../../assets/IconSuma.png')} style={{width: 30, height: 30}} />
            </TouchableOpacity>

            {/*Modal para registro de metas*/}
            <CustomModal 
            visible={mo} 
            onClose={() => setMo(false)}
            title="Registar Metas"
            >
              <Text style={stylesmodal.modalTitle}>Para T{trimestre}-{anio}</Text>
<View style={{ zIndex: 2000, marginBottom: 10 }}> 
    <Text style={styleshome.label}>Tipo de Acta</Text>
    
    <TouchableOpacity 
        style={styleshome.inputField} 
        onPress={() => setMostrarListado(!mostrarListado)}
    >
        <Text style={styleshome.inputText}>{selectedOption}</Text>
        <Text>{mostrarListado ? "▲" : "▼"}</Text>
    </TouchableOpacity>

          {mostrarListado && (
              <View style={styleshome.dropdownContainer}>
                  {["Acta de Defunción", "Acta de Matrimonio", "Acta de Nacimiento"].map((item) => (
                      <TouchableOpacity 
                          key={item} 
                          style={styleshome.dropdownItem}
                          onPress={() => {
                              setSelectedOption(item); // Aquí asignas el valor para Firebase
                              setMostrarListado(false); // Cierras la lista
                          }}
                      >
                          <Text style={styleshome.inputText}>{item}</Text>
                      </TouchableOpacity>
                  ))}
              </View>
          )}
      </View>

                <TextInput 
                  placeholder="Cantidad meta (ej. 50)"
                  keyboardType="numeric"
                  value={metaValue}
                  onChangeText={setMetaValue}
                  style={styleshome.inputField}
                />

                <TouchableOpacity 
                  onPress={() => guardarMetaPOA(anio, trimestre, selectedOption, metaValue)}
                  style={styleshome.buttonGuardar}
                >
                  <Text style={styleshome.buttonText}>Establecer Meta</Text>
                </TouchableOpacity>

              
            </CustomModal>

        {/* --- GRÁFICA CIRCULAR DE PROGRESO --- */}
        <View style={styleshome.graphContainer}>
          <ProgressChart
            data={[porcentajeGlobal]} // Un solo anillo
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

        {/* --- TARJETAS DE DATOS (Row) --- */}
        <View style={styleshome.cardsRow}>
          
          {/* TARJETA META */}
          <View style={[styleshome.card, styleshome.shadow]}>
            <Text style={styleshome.cardTitle}>Meta</Text>
            <DataRow number={formatearNumero(metasTotal.nacimientos)} label="Nacimientos" />
            <DataRow number={formatearNumero(metasTotal.matrimonios)} label="Matrimonios" />
            <DataRow number={formatearNumero(metasTotal.defunciones)} label="Defunciones" />
            <DataRow number={formatearNumero(metasTotal.otros)} label="Otros" />
          </View>

          {/* TARJETA SEGUIMIENTO */}
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

// Componente pequeño reutilizable para las filas de datos
const DataRow = ({ number, label }) => (
  <View style={styleshome.dataRow}>
    <Text style={styleshome.rowNumber}>{number}</Text>
    <Text style={styleshome.rowLabel}>{label}</Text>
  </View>
);