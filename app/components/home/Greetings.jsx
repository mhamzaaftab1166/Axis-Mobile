import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";

export default function SupervisorGreetingHeader({
  name = "User",
  profilePic = null,
  onPress = null,
  size = 72,
  style,
}) {
  const { dark } = useTheme();

  const initials = useMemo(() => {
    if (!name) return "U";
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const hour = new Date().getHours();

  const { greeting, emoji, gradient } = useMemo(() => {
    if (hour >= 5 && hour < 12) {
      return {
        greeting: "Good morning",
        emoji: "🌅",
        gradient: ["#FFF1C9", "#FFD58A"],
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: "Good afternoon",
        emoji: "☀️",
        gradient: ["#D8F3FF", "#7BDFF6"],
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        greeting: "Good evening",
        emoji: "🌇",
        gradient: ["#F7D9FF", "#D6B8FF"],
      };
    } else {
      return {
        greeting: "Good night",
        emoji: "🌙",
        gradient: ["#1F2A44", "#2B1F4A"],
      };
    }
  }, [hour]);

  const textColor = dark || hour >= 17 || hour < 6 ? "#FFFFFF" : "#0F172A";

  const avatarSource = useMemo(
    () =>
      profilePic && typeof profilePic === "string"
        ? { uri: profilePic }
        : profilePic,
    [profilePic]
  );

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        style,
        {
          transform: [{ scale: onPress && pressed ? 0.995 : 1 }],
        },
      ]}
      accessibilityRole={onPress ? "button" : "header"}
      accessibilityLabel={`${greeting}, ${name}`}
    >
      <LinearGradient
        colors={gradient}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        <View
          style={[
            styles.accent,
            { backgroundColor: gradient[gradient.length - 1] + "AA" },
          ]}
        />
        <View style={styles.content}>
          <View style={styles.textWrap}>
            <Text
              variant="titleMedium"
              style={[styles.greetingText, { color: textColor }]}
              numberOfLines={1}
            >
              {emoji} {greeting}
            </Text>
            <Text
              variant="titleLarge"
              style={[styles.nameText, { color: textColor }]}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>

          {avatarSource ? (
            <Avatar.Image size={size} source={avatarSource} />
          ) : (
            <Avatar.Text
              size={size}
              label={initials}
              style={{
                backgroundColor: dark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.16)",
              }}
              color={textColor}
            />
          )}
        </View>
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  gradient: {
    padding: 16,
    borderRadius: 12,
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textWrap: {
    flex: 1,
    paddingRight: 12,
  },
  greetingText: {
    fontWeight: "600",
    opacity: 0.95,
  },
  nameText: {
    fontWeight: "800",
    marginTop: 2,
    fontSize: 20,
  },
});
