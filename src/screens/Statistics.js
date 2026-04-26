import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

import { db } from "../../src/firebaseConfig";
import { collection, query, getDocs, where, onSnapshot } from "firebase/firestore";
import { styleshome } from "../styles/styleshome";

const screenWidth = Dimensions.get("window").width;

export default function Stadistics() {

const [dataSemanal, setDataSemanal] = useState(null);
const [dataMensual, setDataMensual] = useState(null);
const [filtro, setFiltro] = useState("mes");

const [copiasSemanal, setCopiasSemanal] = useState(null);
const [copiasMensual, setCopiasMensual] = useState(null);

const [actasFiltradas, setActasFiltradas] = useState([]); // Estado local para actas filtradas


useEffect(() => {
  const anioActual = new Date().getFullYear();
  const mesActual = new Date().getMonth() + 1;

  // CONSULTA EN TIEMPO REAL
  const q = query(
    collection(db, "registro_solicitud"),
    where("stats.anio", "==", anioActual)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
        const actas = snapshot.docs.map(doc => doc.data());
        const mesActual = new Date().getMonth() + 1;

        // 1. REINICIAR TODOS LOS CONTADORES (Variables locales)
        const conteoSemanas = { "Sem 1": 0, "Sem 2": 0, "Sem 3": 0, "Sem 4": 0, "Sem 5": 0 };
        const conteoCopiasSemanas = { "Sem 1": 0, "Sem 2": 0, "Sem 3": 0, "Sem 4": 0, "Sem 5": 0 };
        
        const mesesArr = new Array(12).fill(0);     // Para solicitudes anuales
        const mesesArrCopy = new Array(12).fill(0); // Para copias anuales

        // 2. UN SOLO RECORRIDO PARA TODA LA DATA
        actas.forEach(a => {
          const m = a.stats?.mes;
          const nCopias = parseInt(a.cantCopy || 0);

          // --- PROCESAMIENTO MENSUAL (ANUAL) ---
          if (m >= 1 && m <= 12) {
            mesesArr[m - 1]++;             // Suma 1 trámite al mes correspondiente
            mesesArrCopy[m - 1] += nCopias; // SUMA la cantidad de copias, no solo 1
          }

          // --- PROCESAMIENTO SEMANAL (SOLO MES ACTUAL) ---
          if (m === mesActual) {
            const numSemana = a.stats?.semana > 5 ? Math.ceil(a.stats.diaDelMes / 7) : a.stats.semana;
            const llave = `Sem ${numSemana}`;

            if (conteoSemanas[llave] !== undefined) {
              conteoSemanas[llave]++;              // Conteo de trámites
              conteoCopiasSemanas[llave] += nCopias; // Suma de copias
            }
          }
        });

        // 3. GUARDAR ESTADOS DE SOLICITUDES
        setDataSemanal({
          labels: Object.keys(conteoSemanas),
          datasets: [{ data: Object.values(conteoSemanas) }]
        });

        setDataMensual({
          labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
          datasets: [{ data: mesesArr }]
        });

        // 4. GUARDAR ESTADOS DE COPIAS
        setCopiasSemanal({
          labels: Object.keys(conteoCopiasSemanas),
          datasets: [{ data: Object.values(conteoCopiasSemanas) }]
        });

        setCopiasMensual({
          labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
          datasets: [{ data: mesesArrCopy }]
        });
      });

      return () => unsubscribe();
    }, []);



// CONFIGURACIÓN VISUAL MEJORADA
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0, 
  color: (opacity = 1) => `rgba(79, 129, 189, ${opacity})`, // Azul profesional
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" }
};

const chartConfigCopias = {
  ...chartConfig,
  color: (opacity = 1) => `rgba(34, 177, 76, ${opacity})`, // Verde para copias
};

useEffect(() => {
  const ahora = new Date();
  const anioActual = ahora.getFullYear();
  
  // Determinamos qué valor buscar según el filtro seleccionado
  let valorActual;
  if (filtro === 'semana') valorActual = getWeekNumber(ahora);
  else if (filtro === 'mes') valorActual = ahora.getMonth() + 1;
  else valorActual = Math.floor(ahora.getMonth() / 3) + 1;

  // ESTA ES LA QUERY CLAVE
  const q = query(
    collection(db, "registro_solicitud"),
    where("stats.anio", "==", anioActual),
    where(`stats.${filtro}`, "==", valorActual) // Busca dinámicamente en el campo 'semana', 'mes' o 'trimestre'
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const datosFiltrados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setActasFiltradas(datosFiltrados); // Estado local de esta pantalla
  });

  return () => unsubscribe();
}, [filtro]); 

return(
  <ScrollView>
      <View style={styleshome.body}>
      <View style={styleshome.container}>
      <Text style={styleshome.title}>Estadísticas de Actas</Text>

    {dataSemanal && (
    <>
    <Text style={styleshome.label}>
    Registro semanal
    </Text>

    <BarChart
        data={dataSemanal}
        width={screenWidth-60}
        height={220}
        yAxisLabel=""
        segments={3}
        chartConfig={chartConfig}
        fromZero={true}
        showValuesOnTopOfBars={true}
        style={{
          marginVertical:8,
          borderRadius:16,
          marginLeft: -20,
        }}
        />
        </>
    )}

    {dataMensual && (
    <>
    <Text style={styleshome.label}>
    Registro mensual
    </Text>

    <BarChart
        data={dataMensual}
        width={screenWidth-80}
        height={230}
        yAxisLabel=""
        yAxisSuffix=""
        segments={3}
        chartConfig={{
    ...chartConfig,
    propsForLabels: {
      fontSize: 10,
    },
    decimalPlaces: 0,
    barPercentage:0.5,
  }}
        verticalLabelRotation={90}
        fromZero={true}
        showValuesOnTopOfBars={true}
        style={{
          marginVertical:15,
          borderRadius:16,
          paddingRight: 0,
          marginLeft: -10,
          alignSelf: 'center', 
        }}
        />
        </>
    )}

    {copiasSemanal && (
    <>
    <Text style={styleshome.label}>
    Registro semanal de Copias Certificadas
    </Text>

    <BarChart
        data={copiasSemanal}
        width={screenWidth-60}
        height={220}
        yAxisLabel=""
        segments={3}
        chartConfig={chartConfigCopias}
        fromZero={true}
        showValuesOnTopOfBars={true}
        style={{
          marginVertical:8,
          borderRadius:16,
          marginLeft: -20,
        }}
        />
        </>
    )}
    {copiasMensual && (
    <>
    <Text style={styleshome.label}>
    Registro mensual de Copias Certificadas
    </Text>

    <BarChart
        data={copiasMensual}
        width={screenWidth-80}
        height={230}
        yAxisLabel=""
        yAxisSuffix=""
        segments={3}
        chartConfig={{
    ...chartConfigCopias,
    propsForLabels: {
      fontSize: 10,
    },
    decimalPlaces: 0,
    barPercentage:0.5,
  }}
        verticalLabelRotation={90}
        fromZero={true}
        showValuesOnTopOfBars={true}
        style={{
          marginVertical:15,
          borderRadius:16,
          paddingRight: 0,
          marginLeft: -10,
          alignSelf: 'center', 
        }}
        />
        </>
    )}


    </View>
    </View>
  </ScrollView>
);
}
