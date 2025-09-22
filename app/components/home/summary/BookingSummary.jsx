// components/home/bookings/BookingSummary.js
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Divider, Surface, Text, useTheme } from "react-native-paper";
import { serviceOptions } from "../../../helpers/contantData";
import { calculateTax, formatAddressLabel } from "../../../helpers/general";
import useAddressStore from "../../../store/useAddressStore";
import BookingSchedule from "./BookingSchedule";
import ServiceRow from "./ServiceRow";

export default function BookingSummary({ booking = {}, onChangeAddress, noOfDays }) {
  const { colors, fonts, dark } = useTheme();
  const services = Array.isArray(booking.selectedServices)
    ? booking.selectedServices
    : [];
  
  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const addr = formatAddressLabel(selectedAddress);

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

  const svcTime = booking.serviceTime || {};
  const totalServicesCount = services.length;

  const total = services.reduce((sum, service) => {

    const unitCapacity = selectedAddress?.unitId?.unitCapacity || 1;
    const bhkKey = `${unitCapacity} BHK`;

    // Pick the price for this capacity
    const unitPrice = service.price?.[bhkKey] || 0;

    // Multiply by quantity (default 1)
    const subtotal = (Number(unitPrice) || 0) * (noOfDays || 1);

    return sum + subtotal;
  }, 0);

  const taxed = calculateTax(total,5);

  return (
    <View>
      <Surface
        style={[
          styles.addressSurface,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: colors.outline,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            typeof onChangeAddress === "function" && onChangeAddress()
          }
          style={styles.addressRowInner}
        >
          <View style={styles.addressLeft}>
            <MaterialIcons
              name="home"
              size={20}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.addressMain,
                  {
                    color: colors.onSurface,
                    fontFamily: fonts?.medium?.fontFamily,
                  },
                ]}
              >
                {selectedAddress ? addr.main : "No address selected"}
              </Text>
              <Text
                style={[
                  styles.addressMeta,
                  {
                    color: colors.placeholder,
                    fontFamily: fonts?.regular?.fontFamily,
                  },
                ]}
              >
                {selectedAddress ? addr.meta : "Please choose an address"}
              </Text>
            </View>
          </View>

          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </Surface>

      {/* Section heading */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
        ]}
      >
        Services
      </Text>

      {/* Services card (existing layout preserved) */}
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
                      <ServiceRow noOfDays={noOfDays} service={s} colors={colors} fonts={fonts} />
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
                AED {total}
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
                Tax 5%
              </Text>
              <Text
                style={[
                  styles.totValue,
                  { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
                ]}
              >
                AED {taxed}
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
                AED {total + taxed}
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
  addressSurface: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  addressRowInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  addressMain: { fontSize: 15, fontWeight: "600" },
  addressMeta: { fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 14, marginBottom: 8, fontWeight: "600" },

  card: { borderRadius: 12, marginBottom: 12, borderWidth: 1, elevation: 3 },

  totRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  totLabel: { fontSize: 14 },
  totValue: { fontSize: 14 },
});
