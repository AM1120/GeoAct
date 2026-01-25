import { StyleSheet } from 'react-native';

export const stylesmodal = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(193, 210, 230, 0.85)', // Fondo azulado semitransparente
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '85%', // Evita que el modal se salga de la pantalla
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center', // Centra el título
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 0, // Posiciona la X a la derecha del título
    },
    closeIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    body: {
        width: '100%',
    }
});