import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, useTheme } from "react-native-paper";
import StarView from "react-native-star-view";

export default function ServiceCardList({ service, onBookPress }) {
  const { colors, dark } = useTheme();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const TRUNCATE_LIMIT = 80;
  const truncatedDescription =
    service.description && service.description.length > TRUNCATE_LIMIT
      ? service.description.slice(0, TRUNCATE_LIMIT) + "..."
      : service.description || "";

  const showMoreButton =
    service.description && service.description.length > TRUNCATE_LIMIT;

  const getBadgeDetails = (badge) => {
    switch (badge) {
      case "Top Rated":
        return { color: "#4CAF50", icon: "star" };
      case "Popular":
        return { color: "#FF5722", icon: "whatshot" };
      default:
        return { color: "tomato", icon: "label" };
    }
  };

  const badgeDetails = getBadgeDetails(service.badge);

  return (
    <Card
      mode="elevated"
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderWidth: dark ? 1 : 0,
          borderColor: dark ? "#333" : "transparent",
        },
      ]}
    >
      <View style={styles.innerWrapper}>
        <TouchableOpacity activeOpacity={0.85} style={styles.row}>
          <View style={styles.left}>
            <Image
              source={service.image}
              style={styles.image}
              resizeMode="cover"
            />
            {service.badge && (
              <View
                style={[
                  styles.badgeContainer,
                  { backgroundColor: badgeDetails.color },
                ]}
              >
                <MaterialIcons
                  name={badgeDetails.icon}
                  size={12}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.badgeText}>{service.badge}</Text>
              </View>
            )}
          </View>

          <View style={styles.right}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.name, { color: colors.text }]}
                numberOfLines={1}
              >
                {service.name}
              </Text>
              <Text style={[styles.price, { color: "#28a745" }]}>
                AED {service.price}
              </Text>
            </View>

            <Text
              style={[styles.description, { color: colors.placeholder }]}
              numberOfLines={showFullDescription ? undefined : 2}
            >
              {showFullDescription ? service.description : truncatedDescription}
            </Text>

            {showMoreButton && (
              <Pressable
                onPress={() => setShowFullDescription((s) => !s)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={styles.moreLessLink}>
                  {showFullDescription ? "Less" : "More"}
                </Text>
              </Pressable>
            )}

            <View style={styles.bottomRow}>
              <View style={styles.ratingRow}>
                <StarView
                  score={service.rating}
                  totalScore={5}
                  style={{ width: 84, height: 16 }}
                />
                <Text
                  style={[styles.ratingText, { color: colors.placeholder }]}
                >
                  ({service.rating})
                </Text>
              </View>

              <Pressable
                onPress={() => onBookPress && onBookPress(service)}
                style={({ pressed }) => [
                  styles.bookButton,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
  },
  innerWrapper: {
    overflow: "hidden",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  left: {
    width: 110,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  right: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  moreLessLink: {
    color: "#ff6b6b",
    fontWeight: "600",
    textDecorationLine: "underline",
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
  bookButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#ff6b6b",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
