import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import { serviceOptions } from "../../../helpers/contantData";
import BookingSchedule from "./BookingSchedule";
import ServiceRow from "./ServiceRow";

const TAX_RATE = 0.05;

const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `AED ${Number(amount || 0).toFixed(2)}`;
  }
};

export default function BookingSummary({ booking = {} }) {
  const { colors, fonts, dark } = useTheme();
  const services = Array.isArray(booking.selectedServices)
    ? booking.selectedServices
    : [];

  const grouped = useMemo(() => {
    const map = {};
    (serviceOptions || []).forEach((c) => {
      map[c.value] = [];
    });
    map["__other"] = [];

    (services || []).forEach((s) => {
      const cat = s?.category;
      if (cat && Object.prototype.hasOwnProperty.call(map, cat)) {
        map[cat].push(s);
      } else {
        map["__other"].push(s);
      }
    });

    // create ordered array
    const ordered = (serviceOptions || []).map((c) => ({
      key: c.value,
      label: c.label,
      items: map[c.value] || [],
    }));

    if (map["__other"].length > 0) {
      ordered.push({ key: "__other", label: "Other", items: map["__other"] });
    }
    return ordered;
  }, [services]);

  const { subtotal, tax, total } = useMemo(() => {
    const subtotalCalc = services.reduce(
      (s, it) => s + (Number(it.price) || 0) * (it.quantity || 1),
      0
    );
    const taxCalc = subtotalCalc * TAX_RATE;
    return {
      subtotal: subtotalCalc,
      tax: taxCalc,
      total: subtotalCalc + taxCalc,
    };
  }, [services]);

  const svcTime = booking.serviceTime || {};
  const totalServicesCount = services.length;

  return (
    <View>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
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
          {totalServicesCount === 0 ? (
            <Text
              style={{
                color: colors.text,
                fontFamily: fonts?.regular?.fontFamily,
              }}
            >
              No services selected
            </Text>
          ) : (
            grouped.map((group) =>
              group.items && group.items.length > 0 ? (
                <View key={group.key} style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={[
                        { fontSize: 14, fontWeight: "600", color: colors.text },
                        { fontFamily: fonts?.medium?.fontFamily },
                      ]}
                    >
                      {group.label}
                    </Text>
                  </View>

                  {group.items.map((s, idx) => (
                    <View
                      key={s.id || `${s.name}-${idx}`}
                      style={{
                        marginBottom: idx === group.items.length - 1 ? 0 : 12,
                      }}
                    >
                      <ServiceRow service={s} colors={colors} fonts={fonts} />
                      {idx !== group.items.length - 1 && (
                        <Divider
                          style={{
                            marginTop: 12,
                            backgroundColor: colors.disabled,
                          }}
                        />
                      )}
                    </View>
                  ))}
                </View>
              ) : null
            )
          )}

          <Divider
            style={{ marginVertical: 12, backgroundColor: colors.disabled }}
          />

          <View>
            <View style={styles.totRow}>
              <Text
                style={[
                  styles.totLabel,
                  {
                    color: colors.text,
                    fontFamily: fonts?.regular?.fontFamily,
                  },
                ]}
              >
                Subtotal
              </Text>
              <Text
                style={[
                  styles.totValue,
                  { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
                ]}
              >
                {formatCurrency(subtotal)}
              </Text>
            </View>

            <View style={styles.totRow}>
              <Text
                style={[
                  styles.totLabel,
                  {
                    color: colors.text,
                    fontFamily: fonts?.regular?.fontFamily,
                  },
                ]}
              >
                Tax ({Math.round(TAX_RATE * 100)}%)
              </Text>
              <Text
                style={[
                  styles.totValue,
                  { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
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
                    fontFamily: fonts?.medium?.fontFamily,
                  },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.totValue,
                  {
                    color: colors.primary ?? colors.text,
                    fontSize: 16,
                    fontFamily: fonts?.medium?.fontFamily,
                  },
                ]}
              >
                {formatCurrency(total)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      <BookingSchedule svcTime={svcTime} fonts={fonts} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, marginBottom: 12, borderWidth: 1, elevation: 3 },
  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: "600" },

  totRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  totLabel: { fontSize: 14 },
  totValue: { fontSize: 14 },

  serviceRow: { flexDirection: "row", alignItems: "flex-start" },
  serviceLeft: { marginRight: 12 },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
