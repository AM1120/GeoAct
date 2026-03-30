import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

import { db } from "../../src/firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";

const screenWidth = Dimensions.get("window").width;

export default function Stadistics() {

const [dataSemanal, setDataSemanal] = useState(null);
const [dataMensual, setDataMensual] = useState(null);

useEffect(() => {

const cargarDatos = async () => {

try {

const fechaActual = new Date();
const mesActual = fechaActual.getMonth() + 1;
const anioActual = fechaActual.getFullYear();

//sección de las semanas

const qSemanas = query(
collection(db, "registro_actas"),
where("mes", "==", mesActual),
where("anio", "==", anioActual)
);

const snapshotSemanas = await getDocs(qSemanas);

const semanas = {
  1:0,
  2:0,
  3:0,
  4:0,
  5:0};

snapshotSemanas.forEach((doc) => {

const data = doc.data();

if(data.semana){
semanas[data.semana]++;
}

});

setDataSemanal({
labels:["Semana 1","Semana 2","Semana 3","Semana 4","Semana 5"],
datasets:[{
data:[
semanas[1],
semanas[2],
semanas[3],
semanas[4],
semanas[5]
]
}]
});


//Sección de los meses

const qMeses = query(
collection(db, "registro_actas"),
where("anio","==",anioActual)
);

const snapshotMeses = await getDocs(qMeses);

const meses={
1:0,
2:0,
3:0,
4:0,
5:0,
6:0,
7:0,
8:0,
9:0,
10:0,
11:0,
12:0
};

snapshotMeses.forEach((doc)=>{

const data = doc.data();

if(data.mes){
meses[data.mes]++;
}

});

setDataMensual({
labels:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
datasets:[{
data:Object.values(meses)
}]
});

}catch(error){

console.log("Error cargando estadísticas:",error);

}

};

cargarDatos();

},[]);

const chartConfig = {
backgroundGradientFrom:"#fff",
backgroundGradientTo:"#fff",
decimalPlaces:0,
color:(opacity=1)=>`rgba(0,0,0,${opacity})`,
labelColor:(opacity=1)=>`rgba(0,0,0,${opacity})`
};

return(

<ScrollView>

<Text style={{fontSize:18,fontWeight:"bold",textAlign:"center",marginVertical:20}}>
Estadísticas de Actas
</Text>

{dataSemanal && (
<>
<Text style={{textAlign:"center",marginBottom:10}}>
Registro semanal
</Text>

<BarChart
data={dataSemanal}
width={screenWidth-20}
height={220}
chartConfig={chartConfig}
/>
</>
)}

{dataMensual && (
<>
<Text style={{textAlign:"center",marginVertical:20}}>
Registro mensual
</Text>

<BarChart
data={dataMensual}
width={screenWidth-20}
height={220}
chartConfig={chartConfig}
/>
</>
)}

</ScrollView>

);

}
