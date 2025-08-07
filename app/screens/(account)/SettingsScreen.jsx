import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import {
  Appbar,
  Divider,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

export default function SettingsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { colors, dark, fonts } = useTheme();

  const screenBg = dark ? colors.primary : colors.background;
  const textColor = dark ? colors.onPrimary : colors.primary;

  const options = [
    {
      label: "Change Password",
      icon: "lock-outline",
      onPress: () => router.push("screens/(account)/NewPassword"),
    },
    {
      label: "Change Email",
      icon: "email-outline",
      onPress: () => router.push("screens/(account)/NewEmail"),
    },
    {
      label: "Change Mobile Number",
      icon: "phone-outline",
      onPress: () => router.push("screens/(account)/NewMobile"),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={colors.secondary}
      />
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.onPrimary}
        />
        <Appbar.Content
          title="Settings"
          titleStyle={{ color: colors.onPrimary }}
        />
      </Appbar.Header>

      <View style={styles.content}>
        {options.map((item, idx) => (
          <React.Fragment key={item.label}>
            <TouchableRipple onPress={item.onPress}>
              <View style={styles.optionRow}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={dark ? colors.onPrimary : colors.primary}
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
            <Divider />
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
