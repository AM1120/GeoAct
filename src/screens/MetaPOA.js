import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { styleshome } from "../../src/styles/styleshome";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import CustomModal from "./components/Modal";

// Importaciones de Firebase
import { db } from "../../src/firebaseConfig"; 
import { auth } from "../../src/firebaseConfig";
import { collection, query, getDocs, orderBy, addDoc, onSnapshot, doc, getDoc, where, serverTimestamp } from "firebase/firestore";

const screenWidth =Dimensions.get("window").width
export default function MetaPOA() {
  //Estados para la gráfica
  const [datosGraficaTrimestre, setDatosGraficaTrimestre] =useState([]);
  const [actasPOA, setActasPOA] = useState([]);
  const [actas, setActas] = useState([]);
  const [totalActas, setTotalActas] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
      const q = query(collection(db, "registro_actas"), orderBy("time", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setActas(docs);
      });
      return () => unsubscribe();
    }, []);

  useEffect (() =>{
    const q=query(collection(db, "registro_actas"));
    const unsubscribe =onSnapshot(q,(snapshot) =>{
      const actasCargadas =[];
      snapshot.forEach (doc => {
        actasCargadas.push({id: doc.id, ...doc.data()});
      });
      setActasPOA(actasCargadas); //guarda las actas
      setTotalActas(snapshot.size) //actualiza el contador

      //calcula aquí los dtaos de la gráfica
      setDatosGraficaTrimestre(calcularDatosTrimestres(actasCargadas));
    });
    return () => unsubscribe
  }, []);

const calcularDatosTrimestres = (actasCargadas) => {
  let conteoTrimestres = { 'T1': 0, 'T2': 0, 'T3': 0, 'T4': 0 };

  actasPOA.forEach(acta => {
    if (acta.trimestre) { // Usamos el campo 'trimestre' que ya guardamos
      conteoTrimestres[acta.trimestre]++;
    }
  });

  // Formateamos los datos para la gráfica de Pie
  // Los colores pueden ser los de tu marca GeoAct
  return [
    { name: "T1", population: conteoTrimestres['T1'], color: "#9BB1A4", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "T2", population: conteoTrimestres['T2'], color: "#C2D5E8", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "T3", population: conteoTrimestres['T3'], color: "#A2CCB6", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "T4", population: conteoTrimestres['T4'], color: "#E4D9B6", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ];
};

  return (
    <View style={styleshome.body}>
      <Text style={styleshome.title}>Trimestres (POA)</Text>
          <TouchableOpacity style={styleshome.buttonRegister} onPress={()=> setModalVisible(true)}>
            <Image source={(require('../../assets/IconSuma.png'))} style={{width: 30, height: 30}}/>
          </TouchableOpacity>
      <View style={styleshome.container}>
          <CustomModal
            visible={modalVisible} 
            onClose={() => setModalVisible(false)} 
            title="Registro de Nuevas Actas"
            >
            <Text>abierto</Text>
          </CustomModal>
          <PieChart
            data={calcularDatosTrimestres()}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute // Esto hace que muestre el número real y no el porcentaje
          />
        </View>
        <View style={{ flexDirection:'row'}}>
        <View style={styleshome.container}>
            <Text>Meta del POA</Text>
        </View>
                <View style={styleshome.container}>
            <Text>Seguimiento</Text>
        </View>
        </View>
    </View>
  );
}
