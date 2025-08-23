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

export default function ServiceCardList({
  service,
  isSelected,
  onToggleSelect,
  onlyView,
}) {
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
                <Text style={[styles.moreLessLink, { color: colors.tertiary }]}>
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

              {!onlyView && (
                <Pressable
                  onPress={() => onToggleSelect && onToggleSelect(service)}
                  accessibilityLabel={
                    isSelected
                      ? "Remove this service from your booking"
                      : "Add this service to your booking"
                  }
                  style={({ pressed }) => [
                    styles.bookButton,
                    {
                      opacity: pressed ? 0.8 : 1,
                      backgroundColor: colors.tertiary,
                    },
                  ]}
                >
                  <Text style={styles.bookButtonText}>
                    {isSelected ? "Remove Item" : "Add Item"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  innerWrapper: {
    overflow: "hidden",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  left: {
    width: 95,
    height: 105,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  right: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 6,
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  moreLessLink: {
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
    marginBottom: 6,
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
    fontSize: 11,
    marginLeft: 4,
    fontWeight: "500",
  },
  bookButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
});
