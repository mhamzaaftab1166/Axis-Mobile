import { StyleSheet } from "react-native";
import { SegmentedButtons, useTheme } from "react-native-paper";

export default function ButtonSegmented({
  options = [],
  selected,
  onChange,
  cardStyle,
  dark: propDark,
  colors: propColors,
}) {
  const theme = useTheme();
  const colors = propColors || theme.colors;
  const dark = typeof propDark === "boolean" ? propDark : theme.dark;

  const buttons = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
    style: {
      backgroundColor: selected === opt.value ? colors.primary : colors.surface,
      ...opt.style,
    },
    labelStyle: {
      color: selected === opt.value ? "#fff" : colors.text,
      fontFamily: theme.fonts?.medium?.fontFamily,
      ...opt.labelStyle,
    },
    showSelectedCheck: false,
    accessibilityLabel: opt.accessibilityLabel || opt.label,
  }));

  return (
    <SegmentedButtons
      value={selected}
      onValueChange={onChange}
      buttons={buttons}
      style={[styles.segmented, cardStyle]}
    />
  );
}

const styles = StyleSheet.create({
  segmented: {
    marginVertical: 12,
  },
});
