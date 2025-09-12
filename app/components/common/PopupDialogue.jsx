import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

export default function PopupDialog({
  visible,
  onDismiss,
  title,
  subtitle,
  children,
  actions = [],
  closeable = true,
  dismissOnBackdropPress = true,
  maxWidth = 720,
  widthPercent = 0.92,
  contentPadding = 16,
  accessibilityLabel,
}) {
  const { colors, fonts } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(visible);

  // Sync internal visibility with external prop
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }
  }, [visible]);

  if (!isVisible) return null;

  const backdropOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <Portal>
      <TouchableWithoutFeedback
        onPress={() => dismissOnBackdropPress && onDismiss?.()}
        accessible={false}
      >
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: "#000", opacity: backdropOpacity },
          ]}
        />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.center}
      >
        <Animated.View
          accessibilityLabel={accessibilityLabel ?? title}
          style={[
            styles.container,
            {
              transform: [{ scale }, { translateY }],
              maxWidth,
              width: `${Math.round(widthPercent * 100)}%`,
            },
          ]}
        >
          <Surface style={[styles.surface, { borderRadius: 14 }]}>
            {/* Header */}
            {(title || closeable) && (
              <View
                style={[
                  styles.headerRow,
                  {
                    backgroundColor: colors.primary,
                    borderTopLeftRadius: 14,
                    borderTopRightRadius: 14,
                  },
                ]}
              >
                <View style={styles.headerTextWrap}>
                  {title && (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.title,
                        { color: "#fff", fontFamily: fonts.medium },
                      ]}
                    >
                      {title}
                    </Text>
                  )}
                  {subtitle && (
                    <Text
                      numberOfLines={2}
                      style={[styles.subtitle, { color: "#e0e0e0" }]}
                    >
                      {subtitle}
                    </Text>
                  )}
                </View>
                {closeable && (
                  <IconButton
                    icon="close"
                    size={22}
                    onPress={onDismiss}
                    accessibilityLabel="Close dialog"
                    color="#fff"
                    style={styles.closeBtn}
                  />
                )}
              </View>
            )}

            {/* Content */}
            <ScrollView
              style={{ maxHeight: 520 }}
              contentContainerStyle={{ padding: contentPadding }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            {/* Divider */}
            {actions.length > 0 && <Divider />}

            {/* Actions */}
            {actions.length > 0 && (
              <View style={styles.actionsRow}>
                {actions.map((a) => (
                  <View key={a.key ?? a.label} style={styles.actionItem}>
                    <Button
                      mode={a.mode ?? "text"}
                      onPress={a.onPress}
                      compact
                      uppercase={false}
                      buttonColor={a.color ?? colors.primary}
                      style={{ borderRadius: 10, paddingHorizontal: 10 }}
                    >
                      {a.label}
                    </Button>
                  </View>
                ))}
              </View>
            )}
          </Surface>
        </Animated.View>
      </KeyboardAvoidingView>
    </Portal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, zIndex: 998 },
  center: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  container: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
  surface: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerTextWrap: { flex: 1, paddingRight: 8 },
  title: { fontSize: 18, fontWeight: "700" },
  subtitle: { fontSize: 13, marginTop: 2 },
  closeBtn: { margin: 0 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  actionItem: { marginLeft: 8 },
});
