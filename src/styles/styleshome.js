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
        marginTop: 50,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
        margin: 20,
        marginTop:50,
        borderRadius: 10,
    },
    containerBlue: {
        backgroundColor: '#4A90E2',
        borderRadius: 35,
        padding: 25,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
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
    //sección para el perfil
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#4A90E2',
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 15,
        color: '#666',
    },
    cardProfile: {
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
        backgroundColor: '#D6DBD2', // El verde/gris 
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
        backgroundColor: '#000', // Botón negro 
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
        top: 55, 
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 10,
        maxHeight: 150,
        zIndex: 5000, 
        elevation: 5, 
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#999',
},
totalCard: { 
    backgroundColor: '#D9D9D9', // Color gris 
    borderRadius: 30, 
    flexDirection: 'row',       
    paddingVertical: 25, 
    paddingHorizontal: 30,
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
    elevation: 4,             
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },


  cardLabel: { 
    fontSize: 22, 
    fontWeight: '500', 
    color: '#333', 
    lineHeight: 28,         
  },

  numberBadge: { 
    backgroundColor: '#9BB1A4', 
    borderRadius: 50,          
    paddingHorizontal: 25, 
    paddingVertical: 15,
    minWidth: 100,            
    alignItems: 'center',
    justifyContent: 'center',
  },

  totalNumber: { 
    fontSize: 48,               
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
  width: 25,
  height: 25,
  tintColor: '#C2D5E8',
},

//sección de MetaPOA
subtitlePOA: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
},
graphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  percentageWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 50,
    fontWeight: '300', // Más delgado como tu imagen
    fontFamily: 'monospace', // Para un look administrativo
    color: '#000',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  card: {
    width: '48%', // Dos tarjetas por fila
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minHeight: 250,
  },
  shadow: {
    // Sombra para Android
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '400',
    fontFamily: 'monospace',
  },
  dataRow: {
    marginBottom: 15,
  },
  rowNumber: {
    fontSize: 30,
    fontFamily: 'monospace',
    color: '#000',
  },
  rowLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: -5,
  },
  filterContainer: {
    padding: 15,
    alignItems: 'center',
  },
  filterLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 10,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#829682', // El verde de tu gráfica
    borderColor: '#829682',
  },
  filterButtonText: {
    fontFamily: 'monospace',
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});