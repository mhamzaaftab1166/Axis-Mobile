import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function SelectedServiceCard({
  service,
  onRemove,
  capacity = 1,
}) {
  const { colors } = useTheme();

  let price = 0;

  if (service.price !== undefined) {
    if (typeof service.price === "number") {
      price = service.price;
    } else if (typeof service.price === "object") {
      const bhkKey = `${capacity} BHK`;
      price =
        service.price[bhkKey] ?? service.price[Object.keys(service.price)[0]];
    }
  }

  return (
    <View
      style={[styles.serviceCardContainer, { backgroundColor: colors.surface }]}
    >
      <View>
        <Text style={[styles.serviceName, { color: colors.text }]}>
          {service.name}
        </Text>
        <Text style={styles.servicePrice}>AED {price}</Text>
      </View>
      <TouchableOpacity onPress={() => onRemove(service)}>
        <MaterialIcons name="remove-circle" size={20} color="#d9534f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceCardContainer: {
    marginLeft: 15,
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  serviceName: { fontSize: 14, fontWeight: "600" },
  servicePrice: { fontSize: 12, marginTop: 2, color: "#28a745" },
});
