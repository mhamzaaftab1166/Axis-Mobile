import {
  MD3DarkTheme as PaperDarkTheme,
  MD3LightTheme as PaperLightTheme,
} from "react-native-paper";

const PRIMARY = "#B66878";
const SECONDARY = "#5E3D42";
const TERTIARY = "#ff6b6b"; // added tertiary color

export const lightTheme = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    primary: PRIMARY,
    onPrimary: "#ffffff",
    secondary: SECONDARY,
    onSecondary: "#ffffff",
    tertiary: TERTIARY,
    background: "#ffffff",
    surface: "#f7f7f7",
    onSurface: "#1C1C1E",
    text: "#1C1C1E",
    placeholder: "#A1A1A1",
    outline: "#E0E0E0",
    error: "#D32F2F",
    success: "#388E3C",
    warning: "#FFA000",
  },
};

export const darkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: PRIMARY,
    onPrimary: "#ffffff",
    secondary: SECONDARY,
    onSecondary: "#ffffff",
    tertiary: TERTIARY,
    background: "#121212",
    surface: "#1E1E1E",
    onSurface: "#EDEDED",
    text: "#ffffff",
    placeholder: "#888888",
    outline: "#2C2C2C",
    error: "#EF5350",
    success: "#66BB6A",
    warning: "#FFB74D",
  },
};
