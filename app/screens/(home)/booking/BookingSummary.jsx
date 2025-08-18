import { Image, StyleSheet, Text, View } from "react-native";
import { Card, Chip, Divider, useTheme } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const TAX_RATE = 0.05;

const DAYS_MAP = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `AED ${Number(amount).toFixed(2)}`;
  }
};

const formatReadableDate = (isoDate) => {
  if (!isoDate) return "-";
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
};

const formatReadableTime = (timeStr) => {
  if (!timeStr) return "-";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  const d = new Date();
  d.setHours(parseInt(parts[0], 10));
  d.setMinutes(parseInt(parts[1], 10));
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

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

function ServiceRow({ service, colors, fonts }) {
  const imgSource =
    typeof service.image === "number"
      ? service.image
      : service.image
      ? { uri: service.image }
      : null;

  const badgeStyle = service.badge ? getBadgeStyle(service.badge) : null;

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
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
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
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.badgeText,
                  { color: "#fff", fontFamily: fonts.medium?.fontFamily },
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
              { color: colors.text, fontFamily: fonts.regular?.fontFamily },
            ]}
          >
            {service.description}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text
            style={[
              styles.qtyText,
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
            ]}
          >
            x{service.quantity || 1}
          </Text>
          <Text
            style={[
              styles.lineTotal,
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
            ]}
          >
            {formatCurrency(
              (Number(service.price) || 0) * (service.quantity || 1)
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function BookingSummary({ booking = {} }) {
  const { colors, fonts, dark } = useTheme();
  const services = Array.isArray(booking.selectedServices)
    ? booking.selectedServices
    : [];
  const subtotal = services.reduce(
    (s, it) => s + (Number(it.price) || 0) * (it.quantity || 1),
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const svcTime = booking.serviceTime || {};

  return (
    <View>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text, fontFamily: fonts.medium?.fontFamily },
        ]}
      >
        Services
      </Text>

      <Card
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: dark ? "#333" : "transparent",
          },
        ]}
      >
        <Card.Content>
          {services.length === 0 ? (
            <Text
              style={{
                color: colors.text,
                fontFamily: fonts.regular?.fontFamily,
              }}
            >
              No services selected
            </Text>
          ) : (
            services.map((s, idx) => (
              <View
                key={s.id || `${s.name}-${idx}`}
                style={{ marginBottom: idx === services.length - 1 ? 0 : 12 }}
              >
                <ServiceRow service={s} colors={colors} fonts={fonts} />
                {idx !== services.length - 1 && (
                  <Divider
                    style={{ marginTop: 12, backgroundColor: colors.disabled }}
                  />
                )}
              </View>
            ))
          )}

          <Divider
            style={{ marginVertical: 12, backgroundColor: colors.disabled }}
          />

          <View>
            <View style={styles.totRow}>
              <Text
                style={[
                  styles.totLabel,
                  { color: colors.text, fontFamily: fonts.regular?.fontFamily },
                ]}
              >
                Subtotal
              </Text>
              <Text
                style={[
                  styles.totValue,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                {formatCurrency(subtotal)}
              </Text>
            </View>

            <View style={styles.totRow}>
              <Text
                style={[
                  styles.totLabel,
                  { color: colors.text, fontFamily: fonts.regular?.fontFamily },
                ]}
              >
                Tax ({Math.round(TAX_RATE * 100)}%)
              </Text>
              <Text
                style={[
                  styles.totValue,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                {formatCurrency(tax)}
              </Text>
            </View>

            <View style={[styles.totRow, { marginTop: 6 }]}>
              <Text
                style={[
                  styles.totLabel,
                  {
                    color: colors.text,
                    fontSize: 16,
                    fontFamily: fonts.medium?.fontFamily,
                  },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.totValue,
                  {
                    color: colors.tertiary,
                    fontSize: 16,
                    fontFamily: fonts.medium?.fontFamily,
                  },
                ]}
              >
                {formatCurrency(total)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
            fontFamily: fonts.medium?.fontFamily,
            marginTop: 16,
          },
        ]}
      >
        Schedule
      </Text>

      <Card
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: dark ? "#333" : "transparent",
          },
        ]}
      >
        <Card.Content>
          <View style={styles.scheduleRow}>
            <Text
              style={[
                styles.scheduleLabel,
                { color: colors.text, fontFamily: fonts.regular?.fontFamily },
              ]}
            >
              Mode
            </Text>
            <Text
              style={[
                styles.scheduleValue,
                { color: colors.text, fontFamily: fonts.medium?.fontFamily },
              ]}
            >
              {svcTime.mode === "oneTime"
                ? "One Time"
                : svcTime.mode === "regular"
                ? "Regular"
                : "-"}
            </Text>
          </View>

          {svcTime.mode === "oneTime" && (
            <>
              <View style={styles.scheduleRow}>
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color: colors.text,
                      fontFamily: fonts.regular?.fontFamily,
                    },
                  ]}
                >
                  Date
                </Text>
                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                >
                  {formatReadableDate(svcTime.oneTimeDate)}
                </Text>
              </View>

              <View style={styles.scheduleRow}>
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color: colors.text,
                      fontFamily: fonts.regular?.fontFamily,
                    },
                  ]}
                >
                  Time
                </Text>
                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                >
                  {formatReadableTime(svcTime.oneTimeTime)}
                </Text>
              </View>
            </>
          )}

          {svcTime.mode === "regular" && svcTime.regular && (
            <>
              <View style={styles.scheduleRow}>
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color: colors.text,
                      fontFamily: fonts.regular?.fontFamily,
                    },
                  ]}
                >
                  Start date
                </Text>
                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                >
                  {formatReadableDate(svcTime.regular.startDate)}
                </Text>
              </View>

              <View style={styles.scheduleRow}>
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color: colors.text,
                      fontFamily: fonts.regular?.fontFamily,
                    },
                  ]}
                >
                  Start time
                </Text>
                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                >
                  {formatReadableTime(svcTime.regular.startTime)}
                </Text>
              </View>

              <View style={styles.scheduleRow}>
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color: colors.text,
                      fontFamily: fonts.regular?.fontFamily,
                    },
                  ]}
                >
                  Type
                </Text>
                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                >
                  {svcTime.regular.type === "all"
                    ? "All Days"
                    : "Selected Days"}
                </Text>
              </View>

              <View style={styles.scheduleRow}>
                <Text
                  style={[
                    styles.scheduleLabel,
                    {
                      color: colors.text,
                      fontFamily: fonts.regular?.fontFamily,
                    },
                  ]}
                >
                  Repeat
                </Text>
                <Text
                  style={[
                    styles.scheduleValue,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                >
                  {svcTime.regular.repeat
                    ? `Yes — ${
                        svcTime.regular.repeatDuration || "Not specified"
                      }`
                    : "No"}
                </Text>
              </View>

              {svcTime.regular.type === "selected" && (
                <>
                  <Text
                    style={[
                      styles.subLabel,
                      {
                        color: colors.text,
                        fontFamily: fonts.regular?.fontFamily,
                        marginTop: 8,
                      },
                    ]}
                  >
                    Selected days
                  </Text>
                  {Array.isArray(svcTime.regular.selectedDays) &&
                  svcTime.regular.selectedDays.length > 0 ? (
                    <View style={styles.daysRow}>
                      {svcTime.regular.selectedDays.map((d) => (
                        <Chip
                          key={d}
                          style={[
                            styles.dayChip,
                            {
                              backgroundColor: colors.surface,
                              borderColor:
                                colors.outline || (dark ? "#444" : "#eee"),
                              borderWidth: 1,
                            },
                          ]}
                          textStyle={{
                            color: colors.text,
                            fontFamily: fonts.medium?.fontFamily,
                          }}
                        >
                          {DAYS_MAP[d] || d}
                        </Chip>
                      ))}
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.scheduleValue,
                        {
                          color: colors.text,
                          fontFamily: fonts.regular?.fontFamily,
                          marginTop: 4,
                        },
                      ]}
                    >
                      No days selected
                    </Text>
                  )}
                </>
              )}
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 8,

    borderWidth: 1,
    elevation: 2,
  },
  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: "600" },

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

  totRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totLabel: { fontSize: 14 },
  totValue: { fontSize: 14 },

  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  scheduleLabel: { fontSize: 13 },
  scheduleValue: { fontSize: 13, fontWeight: "600" },

  subLabel: { fontSize: 12 },

  daysRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  dayChip: {
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
  },
});
