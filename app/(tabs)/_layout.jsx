import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const { colors, fonts } = useTheme();

  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName, label;
        if (route.name === "index") {
          iconName = "home-outline";
          label = "Home";
        } else if (route.name === "account") {
          iconName = "account-circle-outline";
          label = "Account";
        }

        return {
          headerShown: false,
          tabBarLabel: label,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          ),
          tabBarStyle: {
            backgroundColor: colors.primary,
            borderTopWidth: 0,
            elevation: 4,
          },
          tabBarActiveTintColor: colors.onPrimary,
          tabBarInactiveTintColor: colors.secondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: fonts.regular,
            marginBottom: 4,
          },
        };
      }}
    />
  );
}
