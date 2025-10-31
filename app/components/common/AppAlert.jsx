// AppAlert.jsx — backdrop ignores taps when action buttons are present
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";

const DEFAULT_ANIM_DURATION = 240;

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
  confirmButtonColor,
  onCancelPressed = () => {},
  onConfirmPressed = () => {},
}) => {
  const { colors, dark } = useTheme();
  const backdrop = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showAlert) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: DEFAULT_ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: DEFAULT_ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 9,
          tension: 110,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: DEFAULT_ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: DEFAULT_ANIM_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.92,
          duration: DEFAULT_ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAlert, backdrop, scale, cardOpacity]);

  useEffect(() => {
    if (!closeOnHardwareBackPress) return;
    const onBack = () => {
      if (showAlert) {
        onCancelPressed && onCancelPressed();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [showAlert, closeOnHardwareBackPress, onCancelPressed]);

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

  // New: decide whether backdrop taps should dismiss
  const shouldBackdropDismiss =
    !(showCancelButton || showConfirmButton) && !!closeOnTouchOutside;

  return (
    <Modal
      visible={!!showAlert}
      transparent
      animationType="none"
      hardwareAccelerated
      statusBarTranslucent={Platform.OS === "android"}
      onRequestClose={() => {
        if (closeOnHardwareBackPress) onCancelPressed && onCancelPressed();
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          // Only dismiss via outside tap when there are NO action buttons AND closeOnTouchOutside === true
          if (shouldBackdropDismiss) onCancelPressed && onCancelPressed();
        }}
      >
        <Animated.View
          pointerEvents={showAlert ? "auto" : "none"}
          style={[
            styles.backdrop,
            { backgroundColor: "rgba(0,0,0,0.45)", opacity: backdrop },
          ]}
        />
      </TouchableWithoutFeedback>

      <View style={styles.centered}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              backgroundColor: containerBg,
              borderColor: colors.outline || "rgba(0,0,0,0.06)",
              transform: [{ scale }],
              opacity: cardOpacity,
            },
          ]}
          pointerEvents={showAlert ? "auto" : "none"}
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
                  { backgroundColor: cancelBg, flex: singleButton ? 1 : 0.48 },
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
                  { backgroundColor: confirmBg, flex: singleButton ? 1 : 0.48 },
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
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
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
    maxWidth: 520,
    borderRadius: 12,
    padding: 18,
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
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
    lineHeight: 22,
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
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "rgba(0,0,0,0.06)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    height: 44,
    borderRadius: 10,
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
