// RootLayout.tsx
import { Stack } from "expo-router";
import React, { useContext } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider as PaperProvider } from "react-native-paper";

import { ThemeContext, ThemeProvider } from "./context/themeContext";
import { darkTheme, lightTheme } from "./theme/theme";

function MainApp() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useContext(ThemeContext);

  const theme =
    themeMode === "default"
      ? systemColorScheme === "dark"
        ? darkTheme
        : lightTheme
      : themeMode === "dark"
      ? darkTheme
      : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
