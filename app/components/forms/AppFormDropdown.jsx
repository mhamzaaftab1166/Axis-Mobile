import { useFormikContext } from "formik";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import AppErrorMessage from "./AppErrorMessage";

const AppFormDropdown = ({
  name,
  placeholder = "",
  items = [],
  labelKey,
  valueKey,
}) => {
  const { colors, fonts, dark } = useTheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();
  const [visible, setVisible] = useState(false);

  const safeItems = Array.isArray(items) ? items : [];
  const options = safeItems.map((item) => ({
    label: String(item[labelKey] ?? ""),
    value: item[valueKey],
  }));

  const selectedObj = values[name] || null;
  const selectedValue =
    selectedObj && selectedObj[valueKey] != null ? selectedObj[valueKey] : null;

  const onSelect = (val) => {
    const found = safeItems.find((it) => it[valueKey] === val) || null;
    setFieldValue(name, found);
    setFieldTouched(name, false);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Dropdown
        label={placeholder}
        mode="outlined"
        visible={visible}
        showDropDown={() => setVisible(true)}
        onDismiss={() => setVisible(false)}
        value={selectedValue}
        options={options}
        onSelect={onSelect}
        style={{ backgroundColor: dark ? colors.primary : colors.background }}
        textColor={dark ? colors.text : colors.primary}
        iconColor={dark ? colors.onPrimary : colors.primary}
        dropDownItemStyle={{
          backgroundColor: dark ? colors.primary : colors.surface,
        }}
        dropDownItemTextStyle={{ color: dark ? colors.onPrimary : colors.text }}
        activeColor={dark ? colors.onPrimary : colors.primary}
        baseColor={dark ? colors.text : colors.primary}
        labelTextStyle={{ fontFamily: fonts.bodyMedium?.fontFamily }}
        placeholderStyle={{ color: dark ? colors.onPrimary : colors.primary }}
        {...(errors[name] && touched[name] ? { error: true } : {})}
      />
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};

export default AppFormDropdown;

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
});
