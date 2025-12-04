// AppPhoneInputFeild.js
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";

const AppPhoneInput = ({
  value,
  onChangeText,
  phoneInputRef,
  touched,
  error,
  editable = true,
}) => {
  const { colors, dark } = useTheme();

  let displayValue = value ?? "";
  if (typeof value === "string" && value.startsWith("+")) {
    if (value.startsWith("+971")) {
      displayValue = value.replace(/^\+971/, "").replace(/\D/g, "");
    } else {
      const m = value.match(/^\+(\d{1,3})(\d+)$/);
      displayValue = m ? m[2] || "" : "";
    }
  } else {
    displayValue = value ?? "";
  }

  return (
    <View style={styles.wrapper}>
      <PhoneInput
        ref={phoneInputRef}
        defaultCode="AE"
        layout="first"
        value={displayValue}
        onChangeFormattedText={onChangeText}
        countryPickerProps={{
          countryCodes: ["AE"],
          withFilter: false,
          withFlagButton: true,
        }}
        textInputProps={{
          placeholder: "5XXXXXXXX",
          placeholderTextColor: colors.placeholder,
          selectionColor: colors.text,
          editable,
        }}
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
