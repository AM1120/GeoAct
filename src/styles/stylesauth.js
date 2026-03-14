import { StyleSheet } from "react-native";

export const stylesauth = StyleSheet.create ({

    container: {
    flex: 1,
    backgroundColor: '#C2D5E8', // Azul claro de fondo
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
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

});