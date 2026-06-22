import { StyleSheet } from "react-native";

export const stylesfilter = StyleSheet.create({
  container: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 5000, //para asegurar que no se oculte por otros componentes
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: 130,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
});