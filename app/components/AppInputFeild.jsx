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
    ? "transparent"
    : theme.colors.surfaceDisabled;

  const textColor = editable ? theme.colors.onSurface : theme.colors.text;
  const iconColor = theme.colors.text;

  return (
    <View style={[styles.container, parentStyles]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
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
        underlineColor={theme.colors.outlineVariant}
        activeUnderlineColor={theme.colors.primary}
        theme={{
          colors: {
            text: textColor,
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
