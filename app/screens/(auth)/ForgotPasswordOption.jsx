import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, RadioButton, Text, useTheme } from "react-native-paper";
import { ROUTES } from "../../helpers/routePaths";

export default function ForgotPasswordOptionsScreen() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState("");

  const options = [
    {
      id: "email",
      label: "Change by Email",
      icon: "email-outline",
      route: ROUTES.FORGOT_BY_EMAIL,
    },
    {
      id: "phone",
      label: "Change by Phone Number",
      icon: "phone-outline",
      route: ROUTES.FORGOT_BY_PHONE,
    },
  ];

  const handleSelect = (item) => {
    setSelected(item.id);
    router.push(item.route);
  };

  return (
    <LinearGradient
      colors={[colors.secondary, colors.primary]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo + Heading */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text
              variant="headlineSmall"
              style={[styles.heading, { color: "white" }]}
            >
              Forgot Password
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subText, { color: "white" }]}
            >
              Select a method to reset your password.
            </Text>
          </View>

          {/* Card */}
          <View
            style={[styles.formCard, { backgroundColor: colors.background }]}
          >
            {options.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.left}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={24}
                      color={colors.primary}
                    />
                    <Text style={styles.label}>{item.label}</Text>
                  </View>
                  <RadioButton
                    value={item.id}
                    status={selected === item.id ? "checked" : "unchecked"}
                    onPress={() => handleSelect(item)}
                  />
                </TouchableOpacity>
                {index !== options.length - 1 && (
                  <Divider style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
  },
  heading: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subText: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.85,
  },
  formCard: {
    borderRadius: 16,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
  },
});
