import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

const getBadgeStyle = (tag) => {
  switch (tag) {
    case "Top Rated":
      return { backgroundColor: "#4CAF50", icon: "star" };
    case "Popular":
      return { backgroundColor: "#FF5722", icon: "whatshot" };
    default:
      return { backgroundColor: "#9E9E9E", icon: "tag" };
  }
};

export default function ServiceRow({ service = {}, colors = {}, fonts = {} }) {
  const imgSource =
    typeof service.image === "number"
      ? service.image
      : service.image
      ? { uri: service.image }
      : null;

  const badgeStyle = service.badge ? getBadgeStyle(service.badge) : null;

  const subtotal = (Number(service.price) || 0) * (service.quantity || 1);
  const formattedSubtotal = (() => {
    try {
      return new Intl.NumberFormat("en-AE", {
        style: "currency",
        currency: "AED",
        maximumFractionDigits: 2,
      }).format(subtotal);
    } catch {
      return `AED ${subtotal.toFixed(2)}`;
    }
  })();

  return (
    <View style={styles.serviceRow}>
      <View style={styles.serviceLeft}>
        <View style={[styles.imageWrap, { backgroundColor: colors.surface }]}>
          {imgSource ? (
            <Image
              source={imgSource}
              style={styles.serviceImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[styles.placeholder, { backgroundColor: colors.disabled }]}
            />
          )}
        </View>
      </View>

      <View style={styles.serviceBody}>
        <View style={styles.serviceHeader}>
          <Text
            style={[
              styles.serviceName,
              { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
            ]}
          >
            {service.name}
          </Text>

          {badgeStyle && (
            <View
              style={[
                styles.badge,
                { backgroundColor: badgeStyle.backgroundColor },
              ]}
            >
              <MaterialIcons
                name={badgeStyle.icon}
                size={12}
                color="#fff"
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.badgeText,
                  { color: "#fff", fontFamily: fonts?.medium?.fontFamily },
                ]}
              >
                {service.badge}
              </Text>
            </View>
          )}
        </View>

        {service.description ? (
          <Text
            numberOfLines={2}
            style={[
              styles.serviceDesc,
              { color: colors.text, fontFamily: fonts?.regular?.fontFamily },
            ]}
          >
            {service.description}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text
            style={[
              styles.qtyText,
              { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
            ]}
          >
            x{service.quantity || 1}
          </Text>

          <Text
            style={[
              styles.lineTotal,
              { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
            ]}
          >
            {formattedSubtotal}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceRow: { flexDirection: "row", alignItems: "flex-start" },
  serviceLeft: { marginRight: 12 },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceImage: { width: "100%", height: "100%" },
  placeholder: { width: 40, height: 40, borderRadius: 6 },

  serviceBody: { flex: 1 },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: { fontSize: 15 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },

  serviceDesc: { fontSize: 13, marginTop: 6 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  qtyText: { fontSize: 13 },
  lineTotal: { fontSize: 15, fontWeight: "700" },
});
