import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Card, useTheme } from "react-native-paper";
import StarView from "react-native-star-view";

export default function ServiceCardGrid({
  service,
  onBookPress,
  horizontalMode,
}) {
  const { colors, dark } = useTheme();
  const [showFullDescription, setShowFullDescription] = useState(false);

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

  const TRUNCATE_LIMIT = 37;
  const truncatedDescription =
    service.description.length > TRUNCATE_LIMIT
      ? service.description.slice(0, TRUNCATE_LIMIT) + "... "
      : service.description;

  const showMoreButton = service.description.length > TRUNCATE_LIMIT;

  return (
    <Card
      style={[
        styles.card,
        horizontalMode ? { width: 200 } : {},
        {
          backgroundColor: colors.background,
          shadowColor: "#000",
          borderWidth: dark ? 1.5 : 0,
          borderColor: dark ? "#333" : "transparent",
        },
      ]}
      mode="elevated"
    >
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
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
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.badge, { color: "#fff" }]}>
                {service.badge}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {service.name}
          </Text>

          <Text style={[styles.description, { color: colors.placeholder }]}>
            {showFullDescription
              ? `${service.description} `
              : truncatedDescription}
            {showMoreButton && (
              <Text
                style={[
                  styles.moreLessInline,
                  { color: "#ff6b6b", textDecorationLine: "underline" },
                ]}
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Less" : "More"}
              </Text>
            )}
          </Text>

          <View style={styles.detailsRow}>
            <View style={styles.ratingRow}>
              <StarView
                score={service.rating}
                totalScore={5}
                style={{ width: 70, height: 14 }}
              />
              <Text style={[styles.ratingText, { color: colors.placeholder }]}>
                ({service.rating})
              </Text>
            </View>
            <Text style={[styles.price, { color: "#28a745" }]}>
              AED {service.price}
            </Text>
          </View>

          <Pressable
            onPress={() => onBookPress && onBookPress(service)}
            style={({ pressed }) => [
              styles.bookButton,
              { backgroundColor: "#ff6b6b", opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 12,
    elevation: 4,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardContent: {
    borderRadius: 12,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 130,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  badge: {
    fontSize: 10,
    fontWeight: "bold",
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    marginBottom: 6,
  },
  moreLessInline: {
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  price: {
    fontSize: 12,
    fontWeight: "600",
  },
  bookButton: {
    borderRadius: 8,
    width: "100%",
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});
