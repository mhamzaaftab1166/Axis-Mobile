import { StyleSheet } from "react-native";
import { SegmentedButtons, useTheme } from "react-native-paper";

export default function ModeSelector({
  mode,
  onChange,
  cardStyle,
  dark: propDark,
  colors: propColors,
}) {
  const theme = useTheme();
  const colors = propColors || theme.colors;
  const dark = typeof propDark === "boolean" ? propDark : theme.dark;

  const buttons = [
    {
      value: "oneTime",
      label: "One Time",
      style: {
        backgroundColor: mode === "oneTime" ? colors.tertiary : colors.surface,
      },
      labelStyle: {
        color: mode === "oneTime" ? "#fff" : colors.text,
        fontFamily: theme.fonts?.medium?.fontFamily,
      },
      showSelectedCheck: false,
      accessibilityLabel: "Choose one time schedule",
    },
    {
      value: "regular",
      label: "Regular",
      style: {
        backgroundColor: mode === "regular" ? colors.tertiary : colors.surface,
      },
      labelStyle: {
        color: mode === "regular" ? "#fff" : colors.text,
        fontFamily: theme.fonts?.medium?.fontFamily,
      },
      showSelectedCheck: false,
      accessibilityLabel: "Choose regular schedule",
    },
  ];

  return (
    <SegmentedButtons
      value={mode}
      onValueChange={onChange}
      buttons={buttons}
      style={styles.segmented}
    />
  );
}

const styles = StyleSheet.create({
  segmented: {
    marginVertical: 12,
  },
});
