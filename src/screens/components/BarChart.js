import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function BarChartComponent({ data }) {
  return (
    <View>
      <BarChart
        data={{
          labels: data.map(item => item.label),
          datasets: [
            {
              data: data.map(item => item.value),
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: () => "#4CAF50",
          labelColor: () => "#000",
        }}
        style={{
          borderRadius: 8,
        }}
      />
    </View>
  );
}
