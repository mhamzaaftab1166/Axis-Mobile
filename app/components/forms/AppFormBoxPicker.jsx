/* eslint-disable react-hooks/exhaustive-deps */
import { useFormikContext } from "formik";
import { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import AppErrorMessage from "./AppErrorMessage";

const AppFormBoxPicker = ({
  name,
  items = [],
  multiple = false,
  parentStyles,
  onSelectionChange,
}) => {
  const { colors, fonts, dark } = useTheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const selected = Array.isArray(values[name]) ? values[name] : [];

  useEffect(() => {
    if (items.length && selected.length === 0) {
      const first = items[0];
      const defaultSelection = [{ label: first.label, value: first.value }];
      setFieldValue(name, defaultSelection);
      onSelectionChange?.(multiple ? defaultSelection : defaultSelection[0]);
    }
  }, [items]);

  const handleSelect = (item) => {
    setFieldTouched(name, true);

    const payload = { label: item.label, value: item.value };

    if (multiple) {
      const exists = selected.some((i) => i.value === payload.value);
      const next = exists
        ? selected.filter((i) => i.value !== payload.value)
        : [...selected, payload];
      setFieldValue(name, next);
      onSelectionChange?.(next);
    } else {
      setFieldValue(name, [payload]);
      onSelectionChange?.(payload);
    }
  };

  const onBg = colors.onPrimary;
  const selBg = dark ? colors.secondary : colors.primary;
  const onSelText = colors.onSecondary;
  const offText = colors.primary;

  return (
    <>
      <View style={[styles.container, parentStyles]}>
        {items.map((item) => {
          const isSel = selected.some((i) => i.value === item.value);

          return (
            <TouchableOpacity
              key={item.value}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
              style={[
                styles.item,
                {
                  flex: 1,
                  height: 100,
                  backgroundColor: isSel ? selBg : onBg,
                  borderColor: colors.primary,
                },
              ]}
            >
              {item.icon && <Image source={item.icon} style={styles.icon} />}
              <Text
                style={[
                  styles.label,
                  {
                    color: isSel ? onSelText : offText,
                    fontFamily: fonts.regular?.fontFamily,
                    fontWeight: isSel ? "700" : "400",
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormBoxPicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  item: {
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    resizeMode: "contain",
  },
  label: {
    fontSize: 14,
    textAlign: "center",
  },
});
