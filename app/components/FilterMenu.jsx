// components/FilterMenu.js
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

export default function FilterMenu({ options, value, onChange, placeholder }) {
  const [showDropDown, setShowDropDown] = useState(false);
  const { colors, dark } = useTheme();

  // Map options to label/value pairs, treating "All" as empty string
  const items = options.map((opt) => ({
    label: opt,
    value: opt === "All" ? "" : opt,
  }));

  const backgroundColor = dark ? colors.secondary : colors.primary;
  const textColor = dark ? colors.onSecondary : colors.onPrimary;

  return (
    <View style={styles.wrapper}>
      <Dropdown
        label={placeholder}
        mode="outlined"
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={value}
        options={items}
        onSelect={onChange}
        style={[styles.dropdown, { backgroundColor }]}
        textColor={textColor}
        iconColor={textColor}
        dropDownItemStyle={{
          backgroundColor: dark ? colors.surface : colors.background,
        }}
        dropDownItemTextStyle={{ color: textColor }}
        activeColor={textColor}
        baseColor={textColor}
        labelTextStyle={{ color: textColor }}
        placeholderStyle={{ color: textColor }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginHorizontal: 4,
    zIndex: 20,
    elevation: 20,
  },
  dropdown: {
    borderRadius: 10,
    marginVertical: 4,
  },
});
