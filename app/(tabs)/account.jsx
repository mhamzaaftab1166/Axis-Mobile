import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Divider,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarPlaceholder from "../../assets/images/account/avatar.avif";
import { ROUTES } from "../helpers/routePaths";

export default function AccountScreen() {
  const { colors, fonts } = useTheme();
  const router = useRouter();

  const screenBg = colors.background;
  const textColor = colors.text;
  const iconColor = colors.text;

  const options = [
    {
      key: "profile",
      label: "My Profile",
      icon: "account-outline",
      onPress: () => router.push(ROUTES.MY_PROFILE),
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: "bell-outline",
      count: 3,
      onPress: () => router.push(ROUTES.NOTIFICATIONS),
    },
    {
      key: "settings",
      label: "Settings",
      icon: "cog-outline",
      onPress: () => router.push(ROUTES.SETTINGS),
    },
    {
      key: "payment",
      label: "Add Payment Method",
      icon: "credit-card-plus-outline",
      onPress: () => router.push(ROUTES.PAYMENT_METHODS),
    },
    {
      key: "logout",
      label: "Logout",
      icon: "logout",
      onPress: () => console.log("Logout"),
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Avatar.Image size={64} source={AvatarPlaceholder} />
          <View style={styles.profileInfo}>
            <Text
              variant="titleMedium"
              style={{ color: textColor, fontFamily: fonts.medium }}
            >
              Hello, Jane Doe
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: colors.placeholder, marginTop: 4 }}
            >
              jane.doe@example.com
            </Text>
          </View>
        </View>

        <Divider
          style={{ height: 0.5, backgroundColor: colors.outlineVariant }}
        />

        <View style={styles.options}>
          {options.map((opt, idx) => (
            <React.Fragment key={opt.key}>
              <TouchableRipple onPress={opt.onPress}>
                <View style={styles.optionRow}>
                  <MaterialCommunityIcons
                    name={opt.icon}
                    size={24}
                    color={iconColor}
                    style={styles.optionIcon}
                  />

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.optionLabel,
                        { color: textColor, fontFamily: fonts.regular },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {opt.count > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{opt.count}</Text>
                      </View>
                    )}
                  </View>

                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colors.placeholder}
                  />
                </View>
              </TouchableRipple>
              {idx < options.length - 1 && (
                <Divider
                  style={{
                    height: 0.5,
                    backgroundColor: colors.outlineVariant,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={{ color: colors.placeholder }}>
          Axis v1.1
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  options: {
    flex: 1,
    marginTop: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  optionIcon: {
    width: 24,
    textAlign: "center",
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 16,
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 6,
    paddingHorizontal: 6,
    marginLeft: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 12,
  },
});
