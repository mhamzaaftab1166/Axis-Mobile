import { useFormikContext } from "formik";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function SubmitButton({
  title,
  isLoading,
  disabled,
  btnStyles,
}) {
  const { handleSubmit } = useFormikContext();
  const { colors } = useTheme();

  return (
    <Button
      mode="contained"
      onPress={handleSubmit}
      loading={isLoading}
      disabled={isLoading || disabled}
      style={[styles.button, { backgroundColor: colors.primary }, btnStyles]}
      labelStyle={{ color: colors.onPrimary }}
      contentStyle={styles.content}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    borderRadius: 8,
    width: "100%",
  },
  content: {
    height: 48,
  },
});
