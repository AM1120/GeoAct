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

const [actasFiltradas, setActasFiltradas] = useState([]); // Estado local para actas filtradas


useEffect(() => {
  const anioActual = new Date().getFullYear();
  const mesActual = new Date().getMonth() + 1;

  // CONSULTA EN TIEMPO REAL
  const q = query(
    collection(db, "registro_actas"),
    where("stats.anio", "==", anioActual)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
  const actas = snapshot.docs.map(doc => doc.data());
  const mesActual = new Date().getMonth() + 1;

  // 1. FILTRAR: Solo actas del mes actual
  const actasDelMes = actas.filter(a => a.stats.mes === mesActual);

  // 2. INICIALIZAR: Si no pones los ceros primero, el IF de abajo falla
  const conteoSemanas = { "Sem 1": 0, "Sem 2": 0, "Sem 3": 0, "Sem 4": 0, "Sem 5": 0 };

  // 3. CONTAR: Usamos un pequeño truco para convertir el 14 en semana del mes
  // o simplemente leemos el campo si ya lo tienes como 1-5
  actasDelMes.forEach(a => {
    // Si tu 'stats.semana' es del año (ej. 14), hay que calcular su semana del mes.
    // Si ya es del 1 al 5, solo haz: const numSemana = a.stats.semana;
    const numSemana = a.stats.semana > 5 ? Math.ceil(a.stats.diaDelMes / 7) : a.stats.semana;
    
    const llave = `Sem ${numSemana}`;
    if (conteoSemanas[llave] !== undefined) {
      conteoSemanas[llave]++;
    }
  });

  setDataSemanal({
    labels: Object.keys(conteoSemanas),
    datasets: [{ 
      data: Object.values(conteoSemanas)
    }]
  });

      // --- PROCESAR MENSUAL ---
  const mesesArr = new Array(12).fill(0);
    actas.forEach(a => {
      if (a.stats.mes) mesesArr[a.stats.mes - 1]++;
    });

    setDataMensual({
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      datasets: [{ data: mesesArr }]
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
    collection(db, "registro_actas"),
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
    // 3. ESTILO: Reduce un poco la fuente de las etiquetas X para que quepa "Dic"
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
);
}
