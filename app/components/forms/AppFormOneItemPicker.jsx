import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { Text as RNText, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "react-native-paper";
import AppErrorMessage from "./AppErrorMessage";

const AppFormDropdown = ({
  name,
  data = [],
  placeholder = "Select item",
  parentStyles,
  icon,
  onSelectionChange,
  labelField = "label",
  valueField = "value",
}) => {
  const { colors, fonts, dark } = useTheme();
  const { values, setFieldValue, setFieldTouched, errors, touched } =
    useFormikContext();

  const [selectedValue, setSelectedValue] = useState(
    values[name] && typeof values[name] === "object" ? values[name] : null
  );

  useEffect(() => {
    const val = values[name];
    if (val && typeof val === "object") {
      if (!selectedValue || val[valueField] !== selectedValue[valueField]) {
        setSelectedValue(val);
      }
    }
  }, [values[name]]);

  const handleChange = (item) => {
    setFieldTouched(name, true);
    setSelectedValue(item);
    setFieldValue(name, item);
    onSelectionChange?.(item);
  };

  const renderItem = (item) => (
    <View style={styles.itemContainer}>
      {item.icon && (
        <MaterialCommunityIcons
          name={item.icon}
          size={20}
          color={colors.text}
          style={styles.itemIcon}
        />
      )}
      <RNText
        style={[
          styles.itemLabel,
          {
            color: colors.primary,
            fontFamily: fonts.bodyMedium?.fontFamily,
          },
        ]}
      >
        {item[labelField]}
      </RNText>
    </View>
  );

  return (
    <>
      <View style={[styles.container, parentStyles]}>
        <Dropdown
          style={[
            styles.dropdown,
            {
              borderBottomWidth: 0.5,
              borderColor: colors.outline,
              height: 56,
              marginLeft: 5,
            },
          ]}
          placeholderStyle={[
            styles.placeholderStyle,
            {
              color: dark ? colors.onPrimary : colors.primary,
              fontFamily: fonts.bodyMedium?.fontFamily,
            },
          ]}
          searchPlaceholder="Search..."
          selectedTextStyle={[
            styles.selectedTextStyle,
            {
              color: colors.text,
              fontFamily: fonts.bodyMedium?.fontFamily,
            },
          ]}
          inputSearchStyle={[
            styles.inputSearchStyle,
            {
              color: colors.primary,
              fontFamily: fonts.bodyMedium?.fontFamily,
            },
          ]}
          iconStyle={{ tintColor: colors.primary }}
          data={data}
          maxHeight={200}
          search
          labelField={labelField}
          valueField={valueField}
          placeholder={placeholder}
          value={selectedValue ? selectedValue[valueField] : null}
          onChange={handleChange}
          renderLeftIcon={() =>
            icon ? (
              <MaterialCommunityIcons
                name={icon}
                size={20}
                color={dark ? colors.onPrimary : colors.primary}
                style={styles.leftIcon}
              />
            ) : null
          }
          renderItem={renderItem}
          renderRightIcon={() => (
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={dark ? colors.onPrimary : colors.primary}
            />
          )}
          dropdownStyle={{}}
        />
      </View>
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormDropdown;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  dropdown: {
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  leftIcon: {
    marginRight: 8,
  },
  itemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 8,
  },
  itemLabel: {
    fontSize: 16,
  },
});
