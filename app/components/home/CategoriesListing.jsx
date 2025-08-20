import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, useTheme } from "react-native-paper";
import { ROUTES } from "../../helpers/routePaths";

const categories = [
  {
    id: "1",
    icon: "playlist-check",
    label: "Services",
    color: "#0A84FF",
    route: ROUTES.SERVICE_LISTING,
  },
  {
    id: "2",
    icon: "calendar-plus",
    label: "Bookings",
    color: "#34C759",
    route: ROUTES.MY_BOOKINGS,
  },
  {
    id: "3",
    icon: "chart-areaspline",
    label: "Statistics",
    color: "#FF7A00",
    route: "/statistics",
  },
];

const NUM_COLS = 3;
const SCREEN_WIDTH = Dimensions.get("window").width;
const SPACING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - SPACING * (NUM_COLS + 1)) / NUM_COLS;

export default function CategoryListing({ allowScroll = false }) {
  const { colors, dark } = useTheme();
  const router = useRouter();

  const onPressItem = useCallback(
    (route) => {
      router.push(route);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ width: CARD_WIDTH, marginBottom: 10 }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPressItem(item.route)}
        >
          <Card
            style={[styles.card, { backgroundColor: colors.background }]}
            mode="contained"
          >
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${item.color}33` },
                ]}
              >
                <Icon name={item.icon} size={28} color={item.color} />
              </View>
              <Text style={[styles.label, { color: colors.text }]}>
                {item.label}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    ),
    [colors.text, dark, onPressItem]
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(i) => i.id}
      numColumns={NUM_COLS}
      scrollEnabled={allowScroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: SPACING / 2 }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    aspectRatio: 1,
  },
  cardContent: { alignItems: "center", justifyContent: "center" },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  label: { fontSize: 15, fontWeight: "600", textAlign: "center" },
});
