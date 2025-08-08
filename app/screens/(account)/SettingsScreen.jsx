import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { Divider, Text, TouchableRipple, useTheme } from "react-native-paper";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import { ROUTES } from "../../helpers/routePaths";

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { colors, dark, fonts } = useTheme();

  const screenBg = colors.background;
  const textColor = colors.text;
  const iconColor = colors.text;

  const options = [
    {
      label: "Change Password",
      icon: "lock-outline",
      onPress: () => router.push(ROUTES.NEW_PASSWORD),
    },
    {
      label: "Change Email",
      icon: "email-outline",
      onPress: () => router.push(ROUTES.NEW_EMAIL),
    },
    {
      label: "Change Mobile Number",
      icon: "phone-outline",
      onPress: () => router.push(ROUTES.NEW_PHONE),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Settings"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {options.map((item, idx) => (
          <React.Fragment key={item.label}>
            <TouchableRipple onPress={item.onPress}>
              <View style={styles.optionRow}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={iconColor}
                />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.label,
                    { color: textColor, fontFamily: fonts.regular },
                  ]}
                >
                  {item.label}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={colors.placeholder}
                />
              </View>
            </TouchableRipple>
            <Divider
              style={{ height: 0.5, backgroundColor: colors.outlineVariant }}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  label: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
});
