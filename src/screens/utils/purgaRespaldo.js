import { db } from '../../firebaseConfig';
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { Alert } from 'react-native';
import { exportToExcel } from './exporter'; 
import { styleshome } from '../../styles/styleshome';

export const ejecutarRespaldoYPurgado = async (trimestre, anio, metasTotal, seguimientoTotal) => {
  try {
    // 1. PASO CRÍTICO: Primero forzar la descarga del resumen consolidado en XLSX
    // Pasamos los estados actuales para que el usuario guarde su respaldo físico primero
    await exportToExcel(metasTotal, seguimientoTotal, trimestre, anio);

    // 2. Solicitar confirmación doble y explícita del usuario
    Alert.alert(
      "Confirmación de Seguridad",
      "¿Has verificado y guardado el archivo Excel de respaldo con éxito? Esta acción eliminará permanentemente los datos en la base de datos para este trimestre.",
      [
        { text: "No, cancelar", style: "cancel" },
        { 
          text: "Sí, proceder a purgar", 
          style: "destructive",
          onPress: () => procederAlBorradoFisico(trimestre, anio)
        }
      ]
    );
  } catch (error) {
    Alert.alert("Error", "No se pudo iniciar el ciclo de purgado de datos.");
  }
};

const procederAlBorradoFisico = async (trimestre, anio) => {
  try {
    const batch = writeBatch(db);

    // A. Buscar los documentos de las solicitudes del trimestre/año específico
    const qActas = query(
      collection(db, "registro_solicitud"),
      where("stats.trimestre", "==", Number(trimestre)),
      where("stats.anio", "==", Number(anio))
    );
    const snapshotActas = await getDocs(qActas);

    // B. Buscar la planificación del POA de ese mismo período
    const qPoa = query(
      collection(db, "poa"),
      where("trimestre", "==", Number(trimestre)),
      where("anio", "==", Number(anio))
    );
    const snapshotPoa = await getDocs(qPoa);

    // Si no hay datos, salir de inmediato
    if (snapshotActas.empty && snapshotPoa.empty) {
      Alert.alert("Aviso", "No se encontraron registros activos para depurar en este período.");
      return;
    }

    // C. Añadir las eliminaciones de actas al lote (Batch)
    snapshotActas.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // D. Añadir las eliminaciones del POA al lote
    snapshotPoa.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // E. Confirmar la transacción atómica en Firebase
    await batch.commit();

    Alert.alert("Éxito", `El ciclo del Trimestre T${trimestre}-${anio} ha sido purgado por completo de la base de datos.`);
  } catch (error) {
    console.error("Error en la transacción de purgado: ", error);
    Alert.alert("Error Crítico", "Ocurrió un error al intentar vaciar las colecciones en el servidor.");
  }
};