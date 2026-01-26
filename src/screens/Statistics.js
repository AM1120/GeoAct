import { View, Text } from "react-native";
import BarChartComponent from "./components/BarChart";
import { styleshome } from "../src/styles/styleshome";

export default function Statistics() {
  const data = [
    { label: "Ene", value: 10 },
    { label: "Feb", value: 7 },
    { label: "Mar", value: 15 },
  ];

  return (
    <View style={{ padding: 16 }}>
      <Text style={styleshome.title}>
        Actas registradas por mes
      </Text>

      <BarChartComponent data={data} />
    </View>
  );
}
