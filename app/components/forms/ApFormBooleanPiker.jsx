import { useFormikContext } from "formik";
import { StyleSheet, View } from "react-native";
import { Switch, Text, useTheme } from "react-native-paper";
import AppErrorMessage from "./AppErrorMessage";

const AppFormBooleanPicker = ({
  name,
  label,
  parentStyles,
  disabled = false,
}) => {
  const { touched, setFieldTouched, errors, values, setFieldValue } =
    useFormikContext();
  const theme = useTheme();
  const isDark = theme.dark;

  const value = values[name] === true;

  return (
    <>
      <View style={[styles.container, parentStyles]}>
        <Text
          style={[
            styles.label,
            {
              color: isDark ? theme.colors.onPrimary : theme.colors.primary,
              fontFamily: theme.fonts?.bodyMedium?.fontFamily,
            },
          ]}
        >
          {label}
        </Text>
        <Switch
          value={value}
          onValueChange={(val) => {
            setFieldValue(name, val);
            setFieldTouched(name, true);
          }}
          disabled={disabled}
          color={isDark ? theme.colors.secondary : theme.colors.primary}
        />
      </View>
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormBooleanPicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 12,
  },
});
