// components/StatCard.js
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Surface, useTheme } from "react-native-paper";

const PRESETS = {
  primary: { bg: "#EEF2FF", iconBg: "#6366F1", text: "#1F2937" }, // soft indigo bg, indigo icon
  success: { bg: "#ECFDF5", iconBg: "#10B981", text: "#065F46" }, // green
  warning: { bg: "#FFFBEB", iconBg: "#F59E0B", text: "#92400E" }, // amber
  info: { bg: "#F0F9FF", iconBg: "#06B6D4", text: "#044E54" }, // teal
  neutral: { bg: "#F3F4F6", iconBg: "#6B7280", text: "#111827" }, // gray
};

function StatCard({
  label,
  count,
  icon,
  variant = "primary",
  bgColor,
  iconBgColor,
  textColor,
  onPress,
  style,
  accessibilityLabel,
}) {
  const { fonts } = useTheme();

  const preset = PRESETS[variant] || PRESETS.primary;
  const cardBg = bgColor ?? preset.bg;
  const circleBg = iconBgColor ?? preset.iconBg;
  const labelColor = textColor ?? preset.text;

  const formattedCount =
    typeof count === "number" ? new Intl.NumberFormat().format(count) : count;

  const Container = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress,
        accessibilityRole: "button",
        accessibilityLabel:
          accessibilityLabel ?? `${label} stat. ${formattedCount}`,
        android_ripple: { color: "rgba(0,0,0,0.06)" },
      }
    : { accessibilityLabel: accessibilityLabel ?? `${label} stat` };

  return (
    <Container {...containerProps} style={[styles.wrapper, style]}>
      <Surface style={[styles.surface, { backgroundColor: cardBg }]}>
        <View style={styles.contentRow}>
          <View style={[styles.iconWrap, { backgroundColor: circleBg }]}>
            {icon ? (
              React.isValidElement(icon) ? (
                icon
              ) : (
                <Text style={[styles.iconText, { color: "#fff" }]}>{icon}</Text>
              )
            ) : (
              <Text style={[styles.iconText, { color: "#fff" }]}>
                {label?.[0]?.toUpperCase() ?? "S"}
              </Text>
            )}
          </View>

          <View style={styles.textWrap}>
            <Text
              numberOfLines={1}
              style={[
                styles.count,
                { color: labelColor, fontFamily: fonts.medium?.fontFamily },
              ]}
            >
              {formattedCount}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                styles.label,
                { color: labelColor, fontFamily: fonts.regular?.fontFamily },
              ]}
            >
              {label}
            </Text>
          </View>
        </View>
      </Surface>
    </Container>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
  },
  surface: {
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: "hidden",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconText: { fontSize: 18, fontWeight: "700" },
  textWrap: { flex: 1 },
  count: { fontSize: 20, lineHeight: 24 },
  label: { fontSize: 11, marginTop: 4, opacity: 0.9 },
});

export default React.memo(StatCard);
