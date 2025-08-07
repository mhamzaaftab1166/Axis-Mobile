import { useFormikContext } from "formik";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import AppErrorMessage from "./AppErrorMessage";

const AppFormChipPicker = ({
  name,
  items = [],
  label,
  parentStyles,
  onSelectionChange,
  suffix = "",
}) => {
  
  const { colors, fonts } = useTheme();
  const colorScheme = useColorScheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const selected = values[name];

  const handleSelect = (item) => {
    setFieldTouched(name, true);
    setFieldValue(name, item);
    onSelectionChange?.(item);
  };

  const renderLabel = (item) => {
    if (suffix) {
      return `${item} ${suffix}`;
    }
    return String(item);
  };

  return (
    <>
      {label && (
        <Text
          style={[
            styles.labelText,
            {
              color: colors.text,
              fontFamily: fonts.medium?.fontFamily,
              marginBottom: 20,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View style={[styles.container, parentStyles]}>
        {items.map((item) => {
          const isSel = selected === item;
          const selBgColor =
            colorScheme === "dark" ? colors.secondary : colors.primary;

          return (
            <TouchableOpacity
              key={String(item)}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                {
                  backgroundColor: isSel ? selBgColor : colors.onPrimary,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color: isSel ? colors.onSecondary : colors.primary,
                    fontFamily: fonts.regular?.fontFamily,
                    fontSize: 14,
                  },
                ]}
              >
                {renderLabel(item)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormChipPicker;

const styles = StyleSheet.create({
  labelText: {
    fontSize: 16,
    marginBottom: 8,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chipLabel: {
    textAlign: "center",
  },
});
