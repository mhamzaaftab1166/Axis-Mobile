import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";

const AppPhoneInput = ({
  value,
  onChangeText,
  phoneInputRef,
  touched,
  error,
}) => {
  const { colors, dark } = useTheme();

  let displayValue = value ?? "";
  let defaultCode = "AE";

  if (typeof value === "string" && value.startsWith("+")) {
    if (value.startsWith("+971")) {
      defaultCode = "AE";
      displayValue = value.replace(/^\+971/, "").replace(/\D/g, "");
    } else {
      const m = value.match(/^\+(\d{1,3})(\d+)$/);
      if (m) {
        displayValue = m[2] || "";
      }
    }
  } else {
    displayValue = value ?? "";
  }

  return (
    <View style={styles.wrapper}>
      <PhoneInput
        ref={phoneInputRef}
        value={displayValue}
        defaultCode={defaultCode}
        layout="first"
        onChangeFormattedText={onChangeText}
        disableArrowIcon
        disableCountryChange
        countryPickerButtonStyle={{ display: "none" }}
        withDarkTheme={dark}
        containerStyle={[
          styles.phoneInput,
          {
            borderColor: touched && error ? colors.error : "#ccc",
            backgroundColor: "transparent",
          },
        ]}
        textContainerStyle={{
          backgroundColor: "transparent",
          borderBottomRightRadius: 8,
          paddingVertical: 0,
        }}
        textInputStyle={{
          color: colors.onSurface,
          fontSize: 16,
          height: 24,
          paddingVertical: 0,
          includeFontPadding: false,
          textAlignVertical: "center",
        }}
        textInputProps={{
          placeholderTextColor: colors.placeholder,
          selectionColor: colors.text,
        }}
        codeTextStyle={{ color: colors.onSurface, fontSize: 16 }}
      />
    </View>
  );
};

export default AppPhoneInput;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  phoneInput: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
});
