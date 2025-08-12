import { useState } from "react";
import { TextInput as RNTextInput, StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

const SearchBarWithToggle = ({
  searchValue,
  onSearchChange,
  viewMode,
  onToggleView,
}) => {
  const { colors, dark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <RNTextInput
        placeholder="Search services..."
        value={searchValue}
        onChangeText={onSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.searchInput,
          {
            borderColor:
              isFocused || dark ? colors.primary : colors.placeholder,
            color: colors.text,
          },
        ]}
        placeholderTextColor={colors.placeholder}
      />

      <IconButton
        icon="view-grid"
        size={28}
        onPress={() => onToggleView("grid")}
        iconColor={viewMode === "grid" ? colors.primary : colors.disabled}
        style={[
          styles.iconButton,
          viewMode === "grid" && { backgroundColor: colors.primary + "22" },
        ]}
        rippleColor={colors.primary + "44"}
      />
      <IconButton
        icon="view-list"
        size={28}
        onPress={() => onToggleView("list")}
        iconColor={viewMode === "list" ? colors.primary : colors.disabled}
        style={[
          styles.iconButton,
          viewMode === "list" && { backgroundColor: colors.primary + "22" },
        ]}
        rippleColor={colors.primary + "44"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  iconButton: {
    marginHorizontal: 0,
    borderRadius: 12,
    padding: 4,
  },
});

export default SearchBarWithToggle;
