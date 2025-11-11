import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, Divider, Text, useTheme } from "react-native-paper";
import { filterInspectionServicesPrevious } from "../../../../helpers/general";
import { useSupServicesStore } from "../../../../store/useSupServicesStore";

const STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "pending",
    color: "#f39c12",
    icon: "clock-outline",
  },
  {
    label: "Confirmed",
    value: "confirmed",
    color: "#3498db",
    icon: "check-circle-outline",
  },
  {
    label: "Ongoing",
    value: "ongoing",
    color: "#3498db",
    icon: "progress-clock",
  },
  {
    label: "Completed",
    value: "completed",
    color: "#27ae60",
    icon: "checkbox-marked-circle-outline",
  },
  {
    label: "Terminated",
    value: "terminated",
    color: "#95a5a6",
    icon: "close-circle-outline",
  },
  { label: "Cancelled", value: "cancelled", color: "#e74c3c", icon: "cancel" },
];

export default function CompletedJobsInspect() {
  const { colors, dark } = useTheme();

  const inspectionServices = useSupServicesStore((s) => s.inspectionServices);
  const services = filterInspectionServicesPrevious(inspectionServices);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {services?.map((item) => {
        const statusCfg = STATUS_OPTIONS.find((s) => s.value === item.serviceStatus) || STATUS_OPTIONS[0];
        const totalAmount = item.inspectionAmount + item.quotationAmount;

        return (
          <View key={item.id} style={{ marginBottom: 12 }}>
            <Card
              style={[
                styles.card,
                { backgroundColor: dark ? colors.surface : "#fff" },
              ]}
            >
              <Card.Content style={styles.cardInner}>
                <View style={styles.rowTop}>
                  <View style={styles.left}>
                    <Avatar.Text
                      size={44}
                      label={item.id.slice(-2)}
                      style={[
                        styles.avatar,
                        { backgroundColor: dark ? "#0F1720" : "#EEF2FF" },
                      ]}
                      labelStyle={{ color: dark ? "#E6EDF3" : "#3730A3" }}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text
                        style={[styles.serviceName, { color: colors.text }]}
                      >
                        {item.serviceName}
                      </Text>
                      <Text style={[styles.subtle, { color: colors.disabled }]}>
                        {item.serviceCategory}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.badgeWrap}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusCfg.color },
                      ]}
                    >
                      <Icon
                        name={statusCfg.icon}
                        size={14}
                        color="#fff"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.statusText}>{statusCfg.label}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Icon
                      name="calendar"
                      size={16}
                      color={colors.placeholder}
                    />
                    <Text
                      style={[styles.metaText, { color: colors.placeholder }]}
                    >{` ${item.bookingDate}`}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Icon
                      name="clock-outline"
                      size={16}
                      color={colors.placeholder}
                    />
                    <Text
                      style={[styles.metaText, { color: colors.placeholder }]}
                    >{` ${item.bookingTime}`}</Text>
                  </View>
                </View>

                <View style={styles.addressRow}>
                  <Icon
                    name="map-marker"
                    size={16}
                    color={colors.placeholder}
                  />
                  <Text
                    style={[styles.addressText, { color: colors.placeholder }]}
                    numberOfLines={2}
                  >
                    {` ${item.address}`}
                  </Text>
                </View>

                <View style={styles.amountRow}>
                  <Text style={[styles.amountText, { color: colors.text }]}>
                    Inspection: AED {item.inspectionAmount} + Quotation: AED{" "}
                    {item.quotationAmount} = Total: AED {totalAmount}
                  </Text>
                </View>
              </Card.Content>
              <Divider />
            </Card>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  card: { borderRadius: 12 },
  cardInner: { paddingVertical: 12 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { elevation: 0 },
  serviceName: { fontSize: 16, fontWeight: "700" },
  subtle: { fontSize: 13, marginTop: 2 },
  badgeWrap: {},
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  metaRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  metaText: { fontSize: 13 },
  addressRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addressText: { fontSize: 13, flexShrink: 1 },
  amountRow: { marginTop: 12 },
  amountText: { fontSize: 14, fontWeight: "700" },
});
