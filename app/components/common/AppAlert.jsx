import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";

const AppAlert = ({
  showAlert = false,
  showProgress = false,
  title = "",
  message = "",
  closeOnTouchOutside = true,
  closeOnHardwareBackPress = true,
  showCancelButton = false,
  showConfirmButton = true,
  cancelText = "Cancel",
  confirmText = "OK",
  confirmButtonColor, // optional override
  onCancelPressed = () => {},
  onConfirmPressed = () => {},
}) => {
  const { colors, dark } = useTheme();

  const singleButton =
    (showCancelButton && !showConfirmButton) ||
    (!showCancelButton && showConfirmButton);

  const containerBg = colors.surface || (dark ? "#121212" : "#fff");
  const titleColor = colors.primary || "#000";
  const messageColor = colors.onSurface || colors.text || "#333";
  const confirmBg = confirmButtonColor || colors.primary;
  const confirmTextColor = colors.surface || "#fff";
  const cancelBg = colors.disabled || (dark ? "#333" : "#f2f2f2");
  const cancelTextColor = colors.onSurface || "#333";

  return (
    <Modal
      visible={!!showAlert}
      transparent
      animationType="fade"
      hardwareAccelerated
      statusBarTranslucent={Platform.OS === "android"}
      onRequestClose={() => {
        if (closeOnHardwareBackPress) {
          onCancelPressed && onCancelPressed();
        }
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (closeOnTouchOutside) {
            onCancelPressed && onCancelPressed();
          }
        }}
      >
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.centered}>
        <View
          style={[
            styles.alertContainer,
            {
              backgroundColor: containerBg,
              borderColor: colors.outline || "rgba(0,0,0,0.06)",
            },
          ]}
        >
          {title ? (
            <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          ) : null}

          {showProgress ? (
            <View style={styles.progressRow}>
              <ActivityIndicator size="small" color={confirmBg} />
              <Text
                style={[
                  styles.message,
                  { marginLeft: 10, color: messageColor },
                ]}
              >
                {message || "Please wait..."}
              </Text>
            </View>
          ) : message ? (
            <Text style={[styles.message, { color: messageColor }]}>
              {message}
            </Text>
          ) : null}

          <View
            style={[
              styles.buttonsRow,
              singleButton && { justifyContent: "center" },
            ]}
          >
            {showCancelButton ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: cancelBg,
                    flex: singleButton ? 1 : 0.48,
                  },
                ]}
                onPress={() => onCancelPressed && onCancelPressed()}
              >
                <Text
                  style={[styles.cancelButtonText, { color: cancelTextColor }]}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
            ) : null}

            {showConfirmButton ? (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: confirmBg,
                    flex: singleButton ? 1 : 0.48,
                  },
                ]}
                onPress={() => onConfirmPressed && onConfirmPressed()}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    { color: confirmTextColor },
                  ]}
                >
                  {confirmText}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#00000066",
  },
  centered: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 12,
    padding: 20,
    zIndex: 1000,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 6,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonsRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  confirmButton: {
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    height: 42,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AppAlert;
