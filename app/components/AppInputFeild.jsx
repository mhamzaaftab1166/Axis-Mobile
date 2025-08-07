import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, useTheme } from "react-native-paper";

const AppInput = ({
  placeholder,
  value,
  onChangeText,
  style,
  isPassword,
  parentStyles,
  icon,
  editable = true,
  multiline = false,
  numberOfLines = 4,
  ...otherProps
}) => {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isDark = theme.dark;

  const backgroundColor = editable
    ? isDark
      ? "transparent"
      : theme.colors.background
    : theme.colors.surfaceDisabled;

  const textColor = editable ? theme.colors.onSurface : theme.colors.outline;
  const labelColor = isDark ? theme.colors.onPrimary : theme.colors.primary;
  const iconColor = isDark ? theme.colors.onPrimary : theme.colors.primary;

  return (
    <View style={[styles.container, parentStyles]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.outline}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        mode="flat"
        secureTextEntry={isPassword && !isPasswordVisible}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
        selectionColor={isDark ? theme.colors.onPrimary : theme.colors.primary}
        style={[
          styles.input,
          {
            height: multiline ? 100 : 56,
            backgroundColor: backgroundColor,
            color: textColor,
            fontFamily: theme.fonts?.bodyMedium?.fontFamily,
          },
          style,
        ]}
        underlineColor={theme.colors.outline}
        activeUnderlineColor={
          isDark ? theme.colors.onPrimary : theme.colors.primary
        }
        theme={{
          colors: {
            text: textColor,
            placeholder: labelColor,
            primary: isDark ? theme.colors.onPrimary : theme.colors.primary,
          },
        }}
        left={
          icon ? (
            <TextInput.Icon
              icon={icon}
              color={iconColor}
              forceTextInputFocus={false}
            />
          ) : undefined
        }
        right={
          isPassword ? (
            <TextInput.Icon
              icon={isPasswordVisible ? "eye-off" : "eye"}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              forceTextInputFocus={false}
              color={iconColor}
            />
          ) : undefined
        }
        {...otherProps}
      />
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  input: {
    fontSize: 16,
  },
});
