import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { Alert } from 'react-native';

// --- GENERADOR DE PDF (SÓLO ESTADÍSTICAS) ---
export const exportToPDF = async (metas, seguimiento, trimestre, anio) => {
  try {
    const categorias = ['nacimientos', 'matrimonios', 'defunciones', 'otros'];
    
    const tableRows = categorias.map(cat => {
      const metaVal = metas[cat] || 0;
      const segVal = seguimiento[cat] || 0;
      const porcentaje = metaVal > 0 ? ((segVal / metaVal) * 100).toFixed(1) : '0.0';
      
      // Lógica de estado de cumplimiento

      return `
        <tr>
          <td style="text-transform: capitalize; font-weight: bold;">${cat}</td>
          <td>${metaVal}</td>
          <td>${segVal}</td>
          <td>${porcentaje}%</td>
        </tr>
      `;
    }).join('');

    const totalMetas = categorias.reduce((sum, cat) => sum + (metas[cat] || 0), 0);
    const totalSeg = categorias.reduce((sum, cat) => sum + (seguimiento[cat] || 0), 0);
    const avanceGlobal = totalMetas > 0 ? ((totalSeg / totalMetas) * 100).toFixed(1) : '0.0';
    const estadoGlobal = totalSeg >= totalMetas && totalMetas > 0 ? 'Completado' : 'Faltante';

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica', Arial, sans-serif; padding: 25px; color: #333; background-color: #fff; }
            .header-container { text-align: center; border-bottom: 3px solid #4A90E2; padding-bottom: 10px; margin-bottom: 20px; }
            h1 { color: #1E3A8A; margin: 0; font-size: 22px; text-transform: uppercase; }
            h2 { color: #4B5563; margin: 5px 0 0 0; font-size: 15px; }
            .meta-info { margin-bottom: 25px; font-size: 13px; background: #F3F4F6; padding: 12px; border-radius: 6px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #D1D5DB; padding: 12px; text-align: left; font-size: 13px; }
            th { background-color: #1E3A8A; color: white; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            tr:nth-child(even) { background-color: #F9FAFB; }
            .total-row { background-color: #E5E7EB !important; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header-container">
            <h1>GeoAct - Seguimiento</h1>
            <h2>Plan Operativo Anual (POA)</h2>
          </div>
          
          <div class="meta-info">
            <strong>Institución:</strong> Registro Civil de Palmira, municipio Guásimos<br/>
            <strong>Periodo de Evaluación:</strong> Trimestre ${trimestre} - Año ${anio}<br/>
            <strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-ES')}<br/>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tipo de Acta</th>
                <th>Meta Establecida</th>
                <th>Seguimiento (Logro)</th>
                <th>% Avance</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr class="total-row">
                <td>TOTAL METAPOA</td>
                <td>${totalMetas}</td>
                <td>${totalSeg}</td>
                <td>${avanceGlobal}%</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            Reporte Estadístico Automatizado - Sistema GeoAct.
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `Balance_POA_T${trimestre}` });
    } else {
      Alert.alert("Error", "La función de compartir no está disponible.");
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo estructurar el PDF.");
  }
};

// --- GENERADOR DE EXCEL (SÓLO ESTADÍSTICAS) ---
export const exportToExcel = async (metas, seguimiento, trimestre, anio) => {
  try {
    const categorias = ['nacimientos', 'matrimonios', 'defunciones', 'otros'];

    // 1. Matriz base con un diseño de espaciado limpio
    const estrucRows = [
      ["GeoAct - Reporte de Gestión del Registro Civil de Palmira"],
      [`Plan Operativo Anual (POA) - Trimestre ${trimestre} - Año ${anio}`],
      [], // Fila vacía de separación estética
      ["Tipo de Acta", "Meta Establecida", "Seguimiento Real", "% Avance"]
    ];
    
    // 2. Inyección de datos desde Firebase
    categorias.forEach(cat => {
      const metaVal = metas[cat] || 0;
      const segVal = seguimiento[cat] || 0;
      const porcentaje = metaVal > 0 ? (segVal / metaVal) : 0;

      estrucRows.push([
        cat.toUpperCase(),
        metaVal, 
        segVal, 
        porcentaje
      ]);
    });

    // 3. NUEVO: Cálculo e Inyección de la Fila de Totales Consolidada
    const totalMetas = categorias.reduce((sum, cat) => sum + (metas[cat] || 0), 0);
    const totalSeg = categorias.reduce((sum, cat) => sum + (seguimiento[cat] || 0), 0);
    const avanceGlobal = totalMetas > 0 ? (totalSeg / totalMetas) : 0;

    estrucRows.push([]); // Línea en blanco para separar los datos de los totales
    estrucRows.push([
      "TOTAL CONSOLIDADO",
      totalMetas,
      totalSeg,
      avanceGlobal
    ]);

    // Generar la hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(estrucRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `POA T${trimestre}`);

    // 4. CONFIGURACIÓN VISUAL A: Forzar formato numérico de porcentaje con un decimal
    // Ahora formateamos de la fila 5 a la 8 (datos) y también la fila 10 (Total Consolidado)
    const filasAFormatear = [5, 6, 7, 8, 10]; 
    filasAFormatear.forEach(fila => {
      const cellMeta = `D${fila}`;
      if (ws[cellMeta]) {
        ws[cellMeta].t = 'n';
        ws[cellMeta].z = '0.0%'; // Formato nativo de Excel
      }
    });

    // 5. CONFIGURACIÓN VISUAL B: Definir anchos fijos de columnas (Evita el texto cortado)
    // 'wch' representa el ancho aproximado en caracteres de la columna
    ws['!cols'] = [
      { wch: 22 }, // Columna A: Tipo de Acta
      { wch: 18 }, // Columna B: Meta Establecida
      { wch: 18 }, // Columna C: Seguimiento Real
      { wch: 15 }  // Columna D: % Avance
    ];

    // 6. CONFIGURACIÓN VISUAL C: Asegurar líneas de cuadrícula visibles en Excel
    ws['!views'] = [{ showGridLines: true }];

    // Convertidor del archivo a binario Base64
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const fileUri = `${FileSystem.cacheDirectory}POA_Trimestre_${trimestre}_${anio}.xlsx`;

    // Escribir en el almacenamiento del dispositivo
    await FileSystem.writeAsStringAsync(fileUri, wbout, { 
      encoding: FileSystem.EncodingType.Base64 
    });

    // Compartir el archivo XLSX real pulido
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: `POA_Excel_Trimestre${trimestre}`
      });
    } else {
      Alert.alert("Error", "La función de compartir no se encuentra disponible");
    }
  } catch (error) {
    console.error("Error al generar el archivo XLSX:", error);
    Alert.alert("Error", "No es posible compilar el archivo en formato .xlsx");
  }
};