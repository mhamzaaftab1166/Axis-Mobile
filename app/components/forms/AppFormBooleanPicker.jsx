import { useFormikContext } from "formik";
import { StyleSheet, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import AppErrorMessage from "./AppErrorMessage";

export default function AppFormBooleanPicker({
  name,
  label,
  yesLabel = "Yes",
  noLabel = "No",
  parentStyles,
  style,
}) {
  const { touched, setFieldTouched, errors, values, setFieldValue } =
    useFormikContext();
  const { colors } = useTheme();

  const value = values[name];

  return (
    <View style={[parentStyles]}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, { color: colors.onSurface }]}>{label}</Text>
      )}

      {/* Chips */}
      <View style={styles.container}>
        <Chip
          selected={value === true}
          style={[
            styles.chip,
            {
              backgroundColor: value === true ? colors.primary : colors.surface,
            },
            style,
          ]}
          textStyle={{ color: value === true ? "#fff" : colors.onSurface }}
          onPress={() => {
            setFieldValue(name, true);
            setFieldTouched(name, true);
          }}
        >
          {yesLabel}
        </Chip>

        <Chip
          selected={value === false}
          style={[
            styles.chip,
            {
              backgroundColor:
                value === false ? colors.primary : colors.surface,
            },
            style,
          ]}
          textStyle={{ color: value === false ? "#fff" : colors.onSurface }}
          onPress={() => {
            setFieldValue(name, false);
            setFieldTouched(name, true);
          }}
        >
          {noLabel}
        </Chip>
      </View>

      {/* Error */}
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
  },
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
});
