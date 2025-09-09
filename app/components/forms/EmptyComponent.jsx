import { View } from "react-native";
import { Text } from "react-native-paper";

export const EmptyComponent = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 }}>
    <Text style={{ fontSize: 16, fontWeight: "600", color: "black" }}>
      No services available!
    </Text>
  </View>
);