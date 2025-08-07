import { useFormikContext } from "formik";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { MultiSelectDropdown } from "react-native-paper-dropdown";
import AppErrorMessage from "./AppErrorMessage";

const AppFormMultiDropdown = ({
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

  const selectedObjs = Array.isArray(values[name]) ? values[name] : [];
  const selectedValues = selectedObjs.map((obj) => obj[valueKey]);

  const onSelect = (selectedVals) => {
    const selected = safeItems.filter((item) =>
      selectedVals.includes(item[valueKey])
    );
    setFieldValue(name, selected);
    setFieldTouched(name, false);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ minHeight: 80, justifyContent: "center" }}>
        <MultiSelectDropdown
          label={placeholder}
          mode="outlined"
          visible={visible}
          showDropDown={() => setVisible(true)}
          onDismiss={() => setVisible(false)}
          options={options}
          value={selectedValues}
          onSelect={onSelect}
          style={{
            backgroundColor: dark ? colors.primary : colors.background,
            minHeight: 60,
            paddingVertical: 12,
          }}
          textColor={dark ? colors.text : colors.primary}
          iconColor={dark ? colors.onPrimary : colors.primary}
          dropDownItemStyle={{
            backgroundColor: dark ? colors.primary : colors.surface,
          }}
          dropDownItemTextStyle={{
            color: dark ? colors.onPrimary : colors.text,
          }}
          activeColor={dark ? colors.onPrimary : colors.primary}
          baseColor={dark ? colors.text : colors.primary}
          labelTextStyle={{
            fontFamily: fonts.bodyMedium?.fontFamily,
            paddingBottom: 4,
          }}
          placeholderStyle={{
            color: dark ? colors.onPrimary : colors.primary,
          }}
          {...(errors[name] && touched[name] ? { error: true } : {})}
        />
      </View>
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </View>
  );
};

export default AppFormMultiDropdown;

const styles = StyleSheet.create({
  container: { margont: 8 },
});
