import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState, useEffect } from "react";
import { PieChart } from "react-native-chart-kit"; // Asegúrate de importar esto
import { View, Text, Dimensions } from "react-native";

export default function POA() {
  const [datosGrafica, setDatosGrafica] = useState([]);
  const [loading, setLoading] = useState(true);

  const trimestreActual = "T1";
  const anioActual = 2026;

  useEffect(() => {
    // Escuchamos las METAS del POA
    const qPoa = query(
      collection(db, "poa"),
      where("trimestre", "==", trimestreActual),
      where("anio", "==", anioActual)
    );

    // Escuchamos los REGISTROS reales
    const qActas = query(
      collection(db, "registro_solicitud"),
      where("trimestre", "==", trimestreActual),
      where("anio", "==", anioActual)
    );

    // Usamos onSnapshot para que sea tiempo real
    const unsubscribePoa = onSnapshot(qPoa, (snapshotPoa) => {
      const metas = snapshotPoa.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const unsubscribeActas = onSnapshot(qActas, (snapshotActas) => {
        const progreso = {};
        snapshotActas.forEach((doc) => {
          const data = doc.data();
          progreso[data.tipoActa] = (progreso[data.tipoActa] || 0) + 1;
        });

        // Mapeamos los datos para la gráfica
        const datosCocinados = metas.map((meta) => ({
          name: meta.tipoActa,
          population: progreso[meta.tipoActa] || 0, // Lo que llevamos hecho
          meta: meta.meta, // Opcional: para mostrar cuánto falta
          color: meta.color || "#ccc",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        }));

        setDatosGrafica(datosCocinados);
        setLoading(false);
      });

      return () => unsubscribeActas();
    });

    return () => unsubscribePoa();
  }, []);

  if (loading) return <Text>Cargando indicadores POA...</Text>;
  if (datosGrafica.length === 0) return <Text>No hay metas configuradas para {trimestreActual}</Text>;

  return (
    <View>
      <PieChart
        data={datosGrafica}
        width={Dimensions.get("window").width - 40}
        height={220}
        chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />
    </View>
  );
}