import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import AvatarPlaceholder from "../../../assets/images/account/avatar.avif";
import { getGreeting } from "../../helpers/general";

const GreetingHeader = ({ name = "User" }) => {
  const { colors, dark } = useTheme();
  const textColor = colors.onPrimary;
  const cardBg = colors.primary;
  const accentColor = dark ? colors.onPrimary : colors.secondary;
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={({ hovered }) => [
        styles.headerContainer,
        {
          backgroundColor: cardBg,
          shadowOpacity: pressed ? 0.25 : 0.1,
          elevation: pressed ? 2 : 1,
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.greetingContainer}>
        <Text
          variant="titleMedium"
          style={[styles.greetingText, { color: textColor }]}
        >
          👋 {getGreeting()}
        </Text>
        <Text
          variant="titleLarge"
          style={[styles.nameText, { color: textColor }]}
        >
          {name}
        </Text>
      </View>
      <Avatar.Image size={72} source={AvatarPlaceholder} />
    </Pressable>
  );
};

export default GreetingHeader;

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  greetingContainer: {
    flexDirection: "column",
    marginLeft: 12,
    flex: 1,
  },
  greetingText: {
    marginBottom: 4,
    fontWeight: "500",
  },
  nameText: {
    fontWeight: "700",
  },
});
