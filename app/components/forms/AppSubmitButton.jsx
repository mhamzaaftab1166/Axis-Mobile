import { useFormikContext } from "formik";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";

export default function SubmitButton({ title }) {
  const { handleSubmit, isSubmitting } = useFormikContext();
  const { dark, colors } = useTheme();

  return (
    <Button
      mode="contained"
      onPress={handleSubmit}
      loading={isSubmitting}
      disabled={isSubmitting}
      style={[
        styles.button,
        { backgroundColor: dark ? colors.secondary : colors.primary },
      ]}
      labelStyle={{ color: dark ? colors.onPrimary : colors.onSecondary }}
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
