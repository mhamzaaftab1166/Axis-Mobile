import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Card, TouchableRipple, useTheme } from "react-native-paper";
import { ROUTES } from "../../helpers/routePaths";

const categories = [
  {
    id: "1",
    icon: "playlist-check",
    label: "Avalable Services",
    color: "#0A84FF",
    route: ROUTES.SERVICE_LISTING,
  },
  {
    id: "2",
    icon: "calendar-check",
    label: "Standard Bookings",
    color: "#34C759",
    route: ROUTES.MY_BOOKINGS,
  },
  {
    id: "3",
    icon: "clipboard-text-search",
    label: "Inspection Bookings",
    color: "#FF7A00",
    route: ROUTES.MY_INSPECTION_BOOKING,
  },
];

const NUM_COLS = 3;
const SPACING = 16;

export default function CategoryListing({ allowScroll = false }) {
  const { colors, dark } = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const router = useRouter();

  const CARD_WIDTH = (SCREEN_WIDTH - SPACING * (NUM_COLS + 1)) / NUM_COLS;

  const onPressItem = useCallback(
    (route) => {
      router.push(route);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={[styles.wrapper, { width: CARD_WIDTH }]}>
        <TouchableRipple
          onPress={() => onPressItem(item.route)}
          rippleColor={dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}
          borderless
          style={{ borderRadius: 16 }}
        >
          <Card
            mode="contained"
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                elevation: 2,
                shadowColor: dark ? "#000" : "#000",
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: `${item.color}20`,
                    shadowColor: item.color,
                  },
                ]}
              >
                <Icon name={item.icon} size={26} color={item.color} />
              </View>

              <Text
                style={[styles.label, { color: colors.text }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.label}
              </Text>
            </View>
          </Card>
        </TouchableRipple>
      </View>
    ),
    [CARD_WIDTH, colors.surface, colors.text, dark, onPressItem]
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(i) => i.id}
      numColumns={NUM_COLS}
      scrollEnabled={allowScroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: SPACING / 2, paddingBottom: SPACING }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    minHeight: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 17,
    paddingHorizontal: 6,
  },
});
