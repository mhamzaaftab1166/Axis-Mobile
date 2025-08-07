import { StyleSheet, Text } from "react-native";
function AppErrorMessage({ error, visible }) {
  return error && visible ? (
    <Text style={styles.error}>{error}</Text>
  ) : undefined;
}

const styles = StyleSheet.create({
  error: {
    marginTop: 10,
    color: "red",
  },
});

export default AppErrorMessage;
