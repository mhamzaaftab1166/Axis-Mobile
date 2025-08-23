import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import StarView from "react-native-star-view";

export default function CompactServiceCard({ item, isSelected, onToggle }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.thumbWrapper}>
        <Image source={item.image} style={styles.thumb} />
        {item.badge && (
          <View
            style={[
              styles.badge,
              item.badge === "Top Rated"
                ? styles.topBadge
                : styles.popularBadge,
            ]}
          >
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.meta}>
        <View style={styles.row}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.text }]}
          >
            {item.name}
          </Text>
          <Text style={[styles.price, { color: "#28a745" }]}>
            AED {item.price}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={[styles.desc, { color: colors.placeholder }]}
        >
          {item.description}
        </Text>

        <View style={styles.bottom}>
          <View style={styles.rating}>
            <StarView
              score={item.rating}
              totalScore={5}
              style={{ width: 60, height: 12 }}
            />
            <Text style={[styles.ratingText, { color: colors.placeholder }]}>
              ({item.rating})
            </Text>
          </View>

          <Pressable
            onPress={() => onToggle(item)}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: isSelected ? "#d9534f" : "#28a745",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <MaterialIcons
              name={isSelected ? "remove-shopping-cart" : "add-shopping-cart"}
              size={16}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.actionText}>
              {isSelected ? "Remove" : "Add"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    padding: 6,
    alignItems: "flex-start",
  },
  thumbWrapper: { position: "relative", marginRight: 8 },
  thumb: { width: 80, height: 80, borderRadius: 6 },
  meta: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 13, fontWeight: "700", flex: 1, marginRight: 6 },
  price: { fontSize: 11, fontWeight: "700" },
  desc: { fontSize: 11, lineHeight: 14, marginVertical: 2 },
  moreLess: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 10, marginLeft: 4 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  actionText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  badge: {
    position: "absolute",
    top: 4,
    left: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
  },
  topBadge: { backgroundColor: "#4CAF50" },
  popularBadge: { backgroundColor: "#FF5722" },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
