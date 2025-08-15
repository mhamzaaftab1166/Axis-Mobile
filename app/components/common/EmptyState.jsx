import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function EmptyState({
  iconName = "remove-shopping-cart",
  iconSize = 80,
  iconColor,
  title = "Nothing Here",
  description = "",
  buttonLabel = "",
  onButtonPress = null,
  style = {},
}) {
  const { colors } = useTheme();
  const finalIconColor = iconColor || colors.primary;

  return (
    <View style={[styles.container, style]}>
      {iconName && (
        <MaterialIcons name={iconName} size={iconSize} color={finalIconColor} />
      )}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: colors.placeholder }]}>
          {description}
        </Text>
      ) : null}
      {buttonLabel && onButtonPress ? (
        <Button mode="contained" onPress={onButtonPress} style={styles.button}>
          {buttonLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 12,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
});
