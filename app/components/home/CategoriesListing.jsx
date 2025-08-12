import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  Platform,
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
    label: "Book Service",
    color: "#34C759",
    route: "/book-service",
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

export default function CategoryListing({ allowScroll = false }) {
  const { colors } = useTheme();
  const router = useRouter();

  const onPressItem = useCallback(
    (route) => {
      router.push(route);
    },
    [router]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemWrapper}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => onPressItem(item.route)}
          style={{ flex: 1 }}
        >
          <Card
            style={[
              styles.card,
              { backgroundColor: colors.surface },
              Platform.OS === "android" && { elevation: 0 },
            ]}
            mode="contained"
            theme={{
              roundness: 14,
            }}
          >
            <View style={styles.cardContent}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: `${item.color}22` },
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
    [colors, onPressItem]
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(i) => i.id}
      numColumns={NUM_COLS}
      scrollEnabled={allowScroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {},
  columnWrapper: {
    justifyContent: "space-between",
  },
  itemWrapper: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 8,
    minWidth: 0,
  },
  card: {
    borderRadius: 14,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
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
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
