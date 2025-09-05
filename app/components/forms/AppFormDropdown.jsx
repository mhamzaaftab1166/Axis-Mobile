import { useFormikContext } from "formik";
import { Lock } from "lucide-react-native"; // if you use lucide-react
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TextInput as RNPTextInput, Text, useTheme } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import AppErrorMessage from "./AppErrorMessage";

export default function AppFormDropdown({
  name,
  placeholder = "",
  items = [],
  labelKey,
  valueKey,
}) {
  const { colors, fonts } = useTheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();
  const [visible, setVisible] = useState(false);

  const safeItems = Array.isArray(items) ? items : [];
  const options = useMemo(
    () =>
      safeItems.map((item) => ({
        label: String(item[labelKey] ?? ""),
        value: item[valueKey],
        key: item[valueKey],
        disabled: name === "unit" && item.status !== "empty"
      })),
    [safeItems, labelKey, valueKey, name]
  );

  const selectedObj = values[name] || null;
  const selectedValue =
    selectedObj && selectedObj[valueKey] != null ? selectedObj[valueKey] : null;

  const onSelect = useCallback(
    (val) => {
      const found = safeItems.find((it) => it[valueKey] === val) || null;
      setFieldValue(name, found);
      setFieldTouched(name, false);
      setVisible(false);
    },
    [safeItems, valueKey, name, setFieldValue, setFieldTouched]
  );

  const CustomDropdownItem = useCallback(
    ({ width, option, value, onSelect: onItemSelect, toggleMenu, isLast }) => {
      const isSelected = value === option.value;
      const isDisabled = option.disabled;

      return (
        <Pressable
          android_ripple={
            !isDisabled
              ? {
                  color: isSelected
                    ? `${colors.onPrimary}22`
                    : `${colors.onSurface}12`,
                }
              : null
          }
          disabled={isDisabled}
          onPress={() => {
            onItemSelect?.(option.value);
            toggleMenu?.();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 50,
            width: width || "100%",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            backgroundColor: isSelected
              ? colors.primary
              : isDisabled
              ? `${colors.surface}66`
              : colors.surface,
            borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
            borderBottomColor: colors.outline || colors.backdrop,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              color: isSelected
                ? colors.onPrimary
                : isDisabled
                ? `${colors.onSurface}55`
                : colors.onSurface,
              fontFamily:
                fonts && fonts.bodyMedium
                  ? fonts.bodyMedium.fontFamily
                  : undefined,
              textDecorationLine: isDisabled ? "line-through" : "none", 
            }}
          >
            {option.label}
          </Text>

          {isDisabled && (
            <Lock size={16} color={`${colors.onSurface}88`} /> 
          )}
        </Pressable>
      );
    },
    [colors, fonts]
  );
  
  const CustomDropdownInput = useCallback(
    ({ placeholder: ph, selectedLabel, rightIcon }) => {
      const value =
        typeof selectedLabel === "string" && selectedLabel.length > 0
          ? selectedLabel
          : "";
      return (
        <View>
          <RNPTextInput
            mode="outlined"
            placeholder={ph}
            value={value}
            onTouchStart={() => setVisible(true)}
            style={{
              backgroundColor: colors.surface,
              borderColor:
                errors[name] && touched[name]
                  ? colors.error
                  : colors.outline || colors.backdrop,
            }}
            theme={{
              colors: { text: colors.onSurface, primary: colors.primary },
            }}
            right={rightIcon}
            placeholderTextColor={colors.onSurfaceVariant}
            editable={false}
            onChange={(val)=>{
              console.log(val)
            }}
            onChangeText={(val)=>{
              console.log(val)
            }}
          />
        </View>
      );
    },
    [colors, errors, touched, name]
  );

  return (
    <View style={styles.container}>
      <Dropdown
        label={placeholder}
        placeholder={placeholder}
        mode="outlined"
        visible={visible}
        showDropDown={() => setVisible(true)}
        onDismiss={() => setVisible(false)}
        value={selectedValue}
        options={options}
        onSelect={onSelect}
        CustomDropdownItem={CustomDropdownItem}
        CustomDropdownInput={CustomDropdownInput}
        style={{ backgroundColor: colors.surface }}
        textColor={colors.onSurface}
        iconColor={colors.primary}
        dropDownItemStyle={{ backgroundColor: colors.surface }}
        dropDownItemTextStyle={{ color: colors.onSurface }}
        activeColor={colors.primary}
        baseColor={colors.primary}
        labelTextStyle={
          fonts && fonts.bodyMedium
            ? { fontFamily: fonts.bodyMedium.fontFamily }
            : undefined
        }
        placeholderStyle={{ color: colors.onSurfaceVariant }}
        {...(errors[name] && touched[name] ? { error: true } : {})}
      />
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
});
