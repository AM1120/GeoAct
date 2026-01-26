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
});