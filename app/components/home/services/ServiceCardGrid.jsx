import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Card, useTheme } from "react-native-paper";
import StarView from "react-native-star-view";

export default function ServiceCardGrid({
  service,
  horizontalMode,
  isSelected = false,
  onToggleSelect,
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

  const TRUNCATE_LIMIT = 32;
  const truncatedDescription =
    service.description && service.description.length > TRUNCATE_LIMIT
      ? service.description.slice(0, TRUNCATE_LIMIT) + "... "
      : service.description || "";

  const showMoreButton = (service.description || "").length > TRUNCATE_LIMIT;

  const handleToggle = () => {
    if (!onToggleSelect) return;
    onToggleSelect(service);
  };

  return (
    <Card
      style={[
        styles.card,
        horizontalMode ? { width: 180 } : {},
        {
          backgroundColor: colors.background,
          shadowColor: "#000",
          borderWidth: dark ? 1 : 0,
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
                size={11}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.badge}>{service.badge}</Text>
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
                style={{ width: 66, height: 13 }}
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
            onPress={handleToggle}
            style={({ pressed }) => [
              styles.bookButton,
              isSelected ? styles.removeButton : styles.addButton,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            accessibilityLabel={
              isSelected
                ? "Remove this service from your booking"
                : "Add this service to your booking"
            }
          >
            <View style={styles.buttonInner}>
              <MaterialIcons
                name={isSelected ? "remove-shopping-cart" : "add-shopping-cart"}
                size={14}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.bookButtonText}>
                {isSelected ? "Remove" : "Add"}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  cardContent: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 110,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    fontSize: 9,
    fontWeight: "600",
    color: "#fff",
  },
  info: {
    padding: 8,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },
  description: {
    fontSize: 11,
    marginBottom: 5,
  },
  moreLessInline: {
    fontSize: 11,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 11,
    marginLeft: 3,
    fontWeight: "500",
  },
  price: {
    fontSize: 11,
    fontWeight: "600",
  },
  bookButton: {
    borderRadius: 6,
    width: "100%",
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#ff6b6b",
  },
  removeButton: {
    backgroundColor: "#d9534f",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bookButtonText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },
});
