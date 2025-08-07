import { useFormikContext } from "formik";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, Switch, Text, useTheme } from "react-native-paper";
import AppErrorMessage from "./AppErrorMessage";

const AppFormCheckboxPicker = ({ name, items = [], label }) => {
  const { colors, fonts, dark } = useTheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const section = values[name] || {
    specialServices: [],
    specialServicesSwitch: false,
  };

  const selectedArray = Array.isArray(section.specialServices)
    ? section.specialServices
    : [];
  const showSpecial = section.specialServicesSwitch === true;

  const toggleItem = (item) => {
    const updated = selectedArray.includes(item)
      ? selectedArray.filter((v) => v !== item)
      : [...selectedArray, item];

    setFieldValue(`${name}.specialServices`, updated);
    setFieldTouched(`${name}.specialServices`, true);

    if (updated.length > 0) {
      setFieldTouched(`${name}.specialServices`, false);
    }
  };

  const toggleSwitch = (val) => {
    setFieldValue(`${name}.specialServicesSwitch`, val);
    setFieldTouched(`${name}.specialServicesSwitch`, true);
    if (!val) {
      setFieldValue(`${name}.specialServices`, []);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text
          style={[
            styles.label,
            {
              color: dark ? colors.onPrimary : colors.primary,
              fontFamily: fonts?.bodyMedium?.fontFamily,
            },
          ]}
        >
          Want Specialized Service
        </Text>
        <Switch
          value={showSpecial}
          onValueChange={toggleSwitch}
          color={dark ? colors.secondary : colors.primary}
        />
      </View>

      {showSpecial && (
        <>
          {label ? (
            <Text
              style={[
                styles.label,
                {
                  marginTop: 10,
                  color: colors.text,
                  fontFamily: fonts.medium?.fontFamily,
                },
              ]}
            >
              {label}
            </Text>
          ) : null}

          <View style={styles.checkboxWrapper}>
            {items.map((item) => {
              const isChecked = selectedArray.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => toggleItem(item)}
                  activeOpacity={0.7}
                  style={[
                    styles.itemWrapper,
                    { borderColor: dark ? colors.onPrimary : colors.primary },
                  ]}
                >
                  <Checkbox.Android
                    status={isChecked ? "checked" : "unchecked"}
                    onPress={() => toggleItem(item)}
                    color={dark ? colors.onPrimary : colors.primary}
                    uncheckedColor={dark ? colors.placeholder : colors.primary}
                    style={styles.checkbox}
                  />
                  <Text
                    style={[
                      styles.itemLabel,
                      {
                        color: colors.text,
                        fontFamily: fonts.regular?.fontFamily,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppErrorMessage
            error={errors?.[name]?.specialServices}
            visible={touched?.[name]?.specialServices}
          />
        </>
      )}
    </View>
  );
};

export default AppFormCheckboxPicker;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    marginRight: 12,
  },
  checkboxWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  checkbox: {
    margin: 0,
    padding: 0,
  },
  itemLabel: {
    fontSize: 14,
    marginLeft: 4,
  },
});
