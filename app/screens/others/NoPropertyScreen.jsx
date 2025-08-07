import { Image, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyIllustration from "../../../assets/images/other/noitem.avif";

export default function NoPropertyScreen({ onAddPropertyPress }) {
  const { colors, fonts, dark } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? colors.primary : colors.background },
      ]}
    >
      <View style={styles.content}>
        <Image
          source={PropertyIllustration}
          style={styles.image}
          resizeMode="contain"
        />
        <Text
          variant="titleLarge"
          style={[
            styles.title,
            {
              color: dark ? colors.secondary : colors.primary,
              fontFamily: fonts.medium?.fontFamily,
            },
          ]}
        >
          No Property Found
        </Text>
        <Text
          variant="bodyMedium"
          style={[styles.subtitle, { color: colors.onBackground }]}
        >
          Please add a property before proceeding with your booking.
        </Text>
        <Button
          mode="contained"
          onPress={onAddPropertyPress}
          style={styles.button}
          contentStyle={{ paddingVertical: 8,backgroundColor:dark?colors.secondary:colors.primary }}
        >
          Add Property
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius:12
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    width: "60%",
    borderRadius: 12,
  },
});
