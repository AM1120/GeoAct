import { StyleSheet } from "react-native";

export const stylesauth = StyleSheet.create ({
  ScrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoCircle: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 25,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFF',
    width: '85%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 30,
    width: '100%',
    height: 60,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  forgotButton: {
    alignSelf: 'flex-start',
    marginBottom: 30,
    marginLeft: 10,
  },
  forgotText: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'underline',
  },
  buttonBlue: {
    backgroundColor: '#C9D9E8', // Azul pastel
    width: '80%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonGreen: {
    backgroundColor: '#D1D9CD', // Verde pastel
    width: '80%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
  },

  buttonGreen: {
    backgroundColor: '#D1D9CD', // Verde pastel
    width: '80%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12, // Añadido un margen inferior para separar del divisor
  },
  buttonText: {
    fontSize: 16,
    color: '#444',
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    verticalAlign: 'center',
    width: '80%',
    marginVertical: 15,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD', // Línea gris sutil
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  buttonGoogle: {
    flexDirection: 'row', // Por si agregas el icono de Google al lado del texto
    backgroundColor: '#FFFFFF', 
    width: '80%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Borde gris muy suave
    shadowColor: '#000',    // Un toque de sombra para que resalte el botón blanco
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonTextGoogle: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10, // Espacio entre el icono y el texto
  },
});