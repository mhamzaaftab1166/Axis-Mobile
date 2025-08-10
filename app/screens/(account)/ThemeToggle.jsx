import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useContext } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import {
  Divider,
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import { ThemeContext } from "../../context/themeContext";

const options = [
  { key: "default", label: "Default (System)", icon: "theme-light-dark" },
  { key: "light", label: "Light", icon: "white-balance-sunny" },
  { key: "dark", label: "Dark", icon: "weather-night" },
];

export default function ThemeToggleScreen() {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();
  const screenBg = colors.background;
  const { themeMode, setThemeMode } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Change Theme Mode"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <RadioButton.Group onValueChange={setThemeMode} value={themeMode}>
          {options.map(({ key, label, icon }, idx) => (
            <View key={key}>
              <TouchableRipple
                onPress={() => setThemeMode(key)}
                rippleColor={colors.primary + "33"}
                style={styles.optionRow}
              >
                <>
                  <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color={colors.primary}
                    style={styles.optionIcon}
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: colors.text, fontFamily: fonts.regular },
                    ]}
                  >
                    {label}
                  </Text>
                  <RadioButton value={key} color={colors.primary} />
                </>
              </TouchableRipple>
              {idx < options.length - 1 && (
                <Divider
                  style={{
                    height: 0.5,
                    backgroundColor: colors.outlineVariant,
                  }}
                />
              )}
            </View>
          ))}
        </RadioButton.Group>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 18,
  },
});
