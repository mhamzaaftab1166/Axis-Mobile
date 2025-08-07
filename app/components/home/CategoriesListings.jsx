import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");
const SPACING = 18;
const NUM_COLUMNS = 3;
const ITEM_WIDTH =
  (width - SPACING * 5 - SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

const DATA = [
  {
    id: "1",
    label: "My Properties",
    image: require("../../../assets/images/home/property.png"),
    route: "screens/(home)/property-section/PropertyListing",
  },
  {
    id: "2",
    label: "Book Service",
    image: require("../../../assets/images/home/booking.png"),
    route: "screens/(home)/book-service/BookServiceWizard",
  },
  {
    id: "3",
    label: "Promotions",
    image: require("../../../assets/images/home/gift.png"),
    route: "",
  },
];

const CategoryGrid = () => {
  const { colors, dark, fonts } = useTheme();
  const router = useRouter();

  const handlePress = (item) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <View style={styles.container}>
      {DATA.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handlePress(item)}
          style={[
            styles.item,
            {
              backgroundColor: dark ? colors.primary : colors.surface,
              width: ITEM_WIDTH,
            },
          ]}
        >
          <Surface
            style={[
              styles.circle,
              { backgroundColor: dark ? colors.onPrimary : colors.surface },
            ]}
          >
            <Image source={item.image} style={styles.image} />
          </Surface>
          <Text
            style={[
              styles.label,
              {
                color: colors.onSurface,
                fontFamily: fonts.regular?.fontFamily,
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CategoryGrid;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING,
    justifyContent: "space-between",
    marginBottom: 15,
  },
  item: {
    alignItems: "center",
    marginBottom: SPACING,
  },
  circle: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: ITEM_WIDTH / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: ITEM_WIDTH * 0.5,
    height: ITEM_WIDTH * 0.5,
    resizeMode: "contain",
  },
  label: {
    marginTop: 16,
    fontSize: 14,
    textAlign: "center",
  },
});
