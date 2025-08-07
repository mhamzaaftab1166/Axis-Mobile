import { router } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton, Surface } from "react-native-paper";

const RenderBox = ({ title, count, dark, colors, fonts }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const BOX_GAP = 16;
  const BOX_WIDTH = (SCREEN_WIDTH - 32 - BOX_GAP) / 2;

  const goToOrders = () =>
    router.push("screens/(home)/book-service/listing/BookedServices");

  return (
    <TouchableOpacity
      onPress={goToOrders}
      activeOpacity={0.8}
      style={{ flex: 1 }}
    >
      <Surface
        style={[
          styles.bookingBox,
          {
            backgroundColor: dark ? colors.secondary : colors.primary,
            width: BOX_WIDTH,
          },
        ]}
        elevation={2}
      >
        <View>
          <Text
            style={[
              styles.boxTitle,
              { color: colors.onPrimary, fontFamily: fonts.medium },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.boxCount,
              { color: colors.onPrimary, fontFamily: fonts.bold },
            ]}
          >
            {count}
          </Text>
        </View>

        {/* Arrow Button */}
        <IconButton
          icon="arrow-right"
          size={24}
          iconColor={colors.onPrimary}
          style={styles.arrowIcon}
        />
      </Surface>
    </TouchableOpacity>
  );
};

export default RenderBox;

const styles = StyleSheet.create({
  bookingBox: {
    borderRadius: 14,
    padding: 20,
    paddingRight: 48, // make space for arrow
    justifyContent: "center",
  },
  boxTitle: {
    fontSize: 15,
    opacity: 0.9,
  },
  boxCount: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  arrowIcon: {
    position: "absolute",
    bottom: 8,
    right: 12,
  },
});
