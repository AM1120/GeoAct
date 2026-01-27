import { StyleSheet } from "react-native";

export const styleshome = StyleSheet.create({

//contenedor
    body: {
        flex: 1,
        backgroundColor: '#C1D2E6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    containerBlue: {
        flex: 1,
        backgroundColor: '#4A90E2',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    containerGrey: {
        flex: 1,
        backgroundColor: '#D3D3D3',
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    buttonRegister: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#4A90E2',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 20,
        width: '100%',
    },
    optionLeft: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
    logoutText: {
        color: '#E74C3C', // Rojo para cerrar sesión
        fontFamily: 'monospace',
        marginTop: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(193, 210, 230, 0.9)', // Fondo azulado semitransparente
        justifyContent: 'center',
        paddingVertical: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        zIndex: 1,
    },
    closeText: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        fontFamily: 'monospace',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
    },
    inputField: {
        backgroundColor: '#D6DBD2', // El verde/gris suave de tus inputs
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputText: {
        fontFamily: 'monospace',
        color: '#333',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        justifyContent: 'flex-start',
    },
    buttonGuardar: {
        backgroundColor: '#000', // Botón negro según prototipo
        borderRadius: 8,
        padding: 15,
        marginTop: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: 16,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 55, // Esto lo coloca justo debajo del botón
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 10,
        maxHeight: 150,
        zIndex: 5000, // Un número muy alto para que nada lo tape
        elevation: 5, // Importante para que en Android flote sobre los inputs
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#999',
},
totalCard: { 
    backgroundColor: '#D9D9D9', // Color gris del prototipo
    borderRadius: 30, 
    flexDirection: 'row',       // Alinea texto y número en horizontal
    paddingVertical: 25, 
    paddingHorizontal: 30,
    alignItems: 'center', 
    justifyContent: 'space-between', // Separa el texto a la izquierda y el número a la derecha
    marginVertical: 20,
    width: '100%',
    elevation: 4,               // Sombra en Android
    shadowColor: '#000',        // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },

  // Estilo del texto "Actas Totales"
  cardLabel: { 
    fontSize: 22, 
    fontWeight: '500', 
    color: '#333', 
    lineHeight: 28,             // Para que el salto de línea {"\n"} se vea espaciado
  },

  // El círculo/óvalo que contiene el número (Verde oliva)
  numberBadge: { 
    backgroundColor: '#9BB1A4', // Color verde del prototipo
    borderRadius: 50,           // Hace que sea circular/redondeado
    paddingHorizontal: 25, 
    paddingVertical: 15,
    minWidth: 100,              // Asegura que no se deforme con pocos números
    alignItems: 'center',
    justifyContent: 'center',
  },

  // El número "00"
  totalNumber: { 
    fontSize: 48,               // Tamaño grande y legible
    fontWeight: 'bold', 
    color: '#000', 
  },
  actaCard: {
  backgroundColor: '#FFF',
  padding: 15,
  borderRadius: 12,
  marginBottom: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  elevation: 3, // Sombra en Android
  shadowColor: '#000', // Sombra en iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
},
actaTipo: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#2C3E50',
},
actaCiudadano: {
  fontSize: 14,
  color: '#7F8C8D',
  marginVertical: 2,
},
actaDetalle: {
  fontSize: 12,
  color: '#9BB1A4',
  fontWeight: '600',
},
actionIcon: {
  width: 24,
  height: 24,
  tintColor: '#C2D5E8',
}
});