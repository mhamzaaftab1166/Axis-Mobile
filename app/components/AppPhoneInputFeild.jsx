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

  return (
    <View style={styles.wrapper}>
      <PhoneInput
        ref={phoneInputRef}
        defaultValue={value}
        defaultCode="AE"
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
