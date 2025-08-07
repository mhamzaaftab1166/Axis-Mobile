import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

const InfoCard = ({ onAddProperty }) => {
  const { colors, dark, fonts } = useTheme();
  const bgColor = dark ? colors.secondary : colors.primary;
  const fgColor = colors.onPrimary;
  const accentColor = dark ? colors.onPrimary : colors.secondary;

  return (
    <View style={[styles.shadowWrapper]}>
      <View style={[styles.clipContainer, { backgroundColor: bgColor }]}>
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
        <View style={styles.content}>
          <MaterialCommunityIcons
            name="broom"
            size={32}
            color={fgColor}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text
              variant="headlineSmall"
              style={{
                color: fgColor,
                fontFamily: fonts.bold?.fontFamily,
                fontSize: 20,
                marginBottom: 6,
              }}
            >
              Spiffy Cleaning Services
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: fgColor,
                fontFamily: fonts.regular?.fontFamily,
                lineHeight: 20,
                fontSize: 14,
              }}
            >
              Add your property in minutes and experience a pristine home!
            </Text>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={onAddProperty}
          icon="plus-box-outline"
          contentStyle={styles.buttonContent}
          style={[
            styles.button,
            { backgroundColor: dark ? colors.primary : colors.secondary },
          ]}
          labelStyle={{
            color: colors.onPrimary,
            fontFamily: fonts.medium?.fontFamily,
          }}
        >
          Add Property
        </Button>
      </View>
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 30,
  },
  clipContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  buttonContent: {
    height: 48,
    paddingHorizontal: 20,
  },
  button: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
  },
});
