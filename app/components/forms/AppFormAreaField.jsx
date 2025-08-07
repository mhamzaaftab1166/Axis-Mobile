import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Checkbox, Menu, Text, TextInput, useTheme } from "react-native-paper";
import AppErrorMessage from "./AppErrorMessage";

const AppFormAreaField = ({
  name,
  units = ["Sq Ft", "Sq Mt"],
  placeholder = "Enter area",
}) => {
  const { colors, fonts, dark } = useTheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const areaObject = values[name] ?? {
    exact: true,
    unit: units[0],
    value: "",
    from: "",
    to: "",
  };

  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (!units.includes(areaObject.unit)) {
      setFieldValue(name, {
        ...areaObject,
        unit: units[0],
      });
    }
  }, [areaObject.unit, units]);

  const toggleMode = () => {
    if (areaObject.exact) {
      // single -> switch to range mode
      const singleVal = areaObject.value ?? "";
      setFieldValue(name, {
        exact: false,
        unit: areaObject.unit,
        from: singleVal,
        to: "",
        value: "",
      });
    } else {
      // range -> switch to single mode
      const fromVal = areaObject.from ?? "";
      setFieldValue(name, {
        exact: true,
        unit: areaObject.unit,
        value: fromVal,
        from: "",
        to: "",
      });
    }
  };

  const handleChangeValue = (val) => {
    setFieldValue(name, {
      ...areaObject,
      value: val,
    });
  };
  const handleChangeFrom = (val) => {
    setFieldValue(name, {
      ...areaObject,
      from: val,
    });
  };
  const handleChangeTo = (val) => {
    setFieldValue(name, {
      ...areaObject,
      to: val,
    });
  };
  const handleChangeUnit = (val) => {
    setFieldValue(name, {
      ...areaObject,
      unit: val,
    });
    setMenuVisible(false);
  };

  return (
    <View>
      <View style={[styles.row, { gap: 2, marginTop: 5 }]}>
        <Checkbox.Android
          status={areaObject.exact ? "checked" : "unchecked"}
          onPress={toggleMode}
          color={dark ? colors.onPrimary : colors.primary}
          uncheckedColor={dark ? colors.placeholder : colors.primary}
        />
        <Text
          style={{
            color: colors.text,
            fontFamily: fonts.bodyMedium?.fontFamily,
          }}
        >
          Specify exact area?
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.inputWrapper}>
          {areaObject.exact ? (
            <>
              <TextInput
                mode="flat"
                label={placeholder}
                value={areaObject.value}
                onChangeText={handleChangeValue}
                onBlur={() => setFieldTouched(`${name}.value`)}
                keyboardType="numeric"
                style={[
                  styles.input,
                  {
                    backgroundColor: dark ? colors.primary : colors.background,
                    fontFamily: fonts.bodyMedium?.fontFamily,
                  },
                ]}
                underlineColor={colors.outline}
                activeUnderlineColor={colors.primary}
                theme={{
                  colors: {
                    placeholder: colors.outline,
                    text: colors.text,
                    primary: colors.primary,
                  },
                }}
              />
              <AppErrorMessage
                error={errors?.[name]?.value}
                visible={touched?.[name]?.value}
              />
            </>
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="flat"
                  label="From"
                  value={areaObject.from}
                  onChangeText={handleChangeFrom}
                  onBlur={() => setFieldTouched(`${name}.from`)}
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    {
                      backgroundColor: dark
                        ? colors.primary
                        : colors.background,
                      color: colors.text,
                      fontFamily: fonts.bodyMedium?.fontFamily,
                    },
                  ]}
                  underlineColor={colors.outline}
                  activeUnderlineColor={colors.primary}
                  theme={{
                    colors: {
                      placeholder: colors.outline,
                      text: colors.text,
                      primary: colors.primary,
                    },
                  }}
                />
                <AppErrorMessage
                  error={errors?.[name]?.from}
                  visible={touched?.[name]?.from}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="flat"
                  label="To"
                  value={areaObject.to}
                  onChangeText={handleChangeTo}
                  onBlur={() => setFieldTouched(`${name}.to`)}
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    {
                      backgroundColor: dark
                        ? colors.primary
                        : colors.background,
                      color: colors.text,
                      fontFamily: fonts.bodyMedium?.fontFamily,
                    },
                  ]}
                  underlineColor={colors.outline}
                  activeUnderlineColor={colors.primary}
                  theme={{
                    colors: {
                      placeholder: colors.outline,
                      text: colors.text,
                      primary: colors.primary,
                    },
                  }}
                />
                <AppErrorMessage
                  error={errors?.[name]?.to}
                  visible={touched?.[name]?.to}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.unitWrapper}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <TextInput
                  mode="flat"
                  value={areaObject.unit}
                  editable={false}
                  pointerEvents="none"
                  style={[
                    styles.input,
                    {
                      backgroundColor: dark
                        ? colors.primary
                        : colors.background,
                      color: colors.text,
                      fontFamily: fonts.bodyMedium?.fontFamily,
                    },
                  ]}
                  underlineColor={colors.outline}
                  activeUnderlineColor={colors.primary}
                  theme={{
                    colors: {
                      placeholder: colors.outline,
                      text: colors.text,
                      primary: colors.primary,
                    },
                  }}
                />
              </TouchableOpacity>
            }
          >
            {units.map((u) => (
              <Menu.Item
                key={u}
                onPress={() => handleChangeUnit(u)}
                title={u}
              />
            ))}
          </Menu>
          <AppErrorMessage
            error={errors?.[name]?.unit}
            visible={touched?.[name]?.unit}
          />
        </View>
      </View>
    </View>
  );
};

export default AppFormAreaField;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
  },
  unitWrapper: {
    width: 100,
  },
  input: {
    height: 56,
    fontSize: 16,
  },
});
