import { Text, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";

export default function CenteredAppbarHeader({ title, onBack }) {
  const { colors } = useTheme();

  return (
    <Appbar.Header style={{ backgroundColor: colors.primary }}>
      <View
        style={{ width: 48, alignItems: "center", justifyContent: "center" }}
      >
        <Appbar.BackAction onPress={onBack} color={colors.onPrimary} />
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            color: colors.onPrimary,
            fontSize: 20,
            fontWeight: "500",
          }}
        >
          {title}
        </Text>
      </View>

      <View style={{ width: 48 }} />
    </Appbar.Header>
  );
}
