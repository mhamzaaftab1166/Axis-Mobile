import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import EmptyState from "../../components/common/EmptyState";
import {
  formatPaymentHistoryCurrency,
  openPaymentHistoryReceipt,
  paymentHistoryStatusConfig,
} from "../../helpers/general";
import { useGetMyPaymentHistory } from "../../hooks/usePaymentHistoryQuery";
import PaymentHistorySkeleton from "../../skeltons/PaymentHistorySkelton";

export default function PaymentsHistoryScreen() {
  const { colors, fonts, dark } = useTheme();
  const navigation = useNavigation();

  const { data: payments, isLoading: fetchingHistory } =
    useGetMyPaymentHistory();

  if (fetchingHistory) return <PaymentHistorySkeleton />;
  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Payments History"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text
            variant="titleMedium"
            style={{ color: colors.text, fontFamily: fonts.medium }}
          >
            Payment History
          </Text>
          <Text style={{ color: colors.placeholder }}>
            {payments?.length} records
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={[
            { padding: 16, paddingBottom: 96 },
            payments?.length === 0 && {
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {payments?.length === 0 ? (
            <EmptyState
              title="No payments found. "
              description="Your transactions will appear here."
            />
          ) : (
            payments?.map((item) => {
              const cfg = paymentHistoryStatusConfig(item.paymentStatus);
              return (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.outline,
                    },
                  ]}
                >
                  <View style={styles.cardInner}>
                    <View style={styles.row}>
                      <Avatar.Icon
                        size={44}
                        icon={cfg.icon}
                        color="#fff"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={[
                            styles.amountText,
                            { color: colors.text, fontFamily: fonts.medium },
                          ]}
                        >
                          {formatPaymentHistoryCurrency(
                            item.amount,
                            item.currency
                          )}
                        </Text>
                        <Text
                          style={[
                            styles.subText,
                            { color: colors.placeholder },
                          ]}
                        >
                          {item.paidAt}
                        </Text>
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <View
                          style={[
                            styles.statusPill,
                            { backgroundColor: cfg.color + "22" },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={cfg.icon}
                            size={14}
                            color={cfg.color}
                          />
                          <Text
                            style={[styles.statusText, { color: cfg.color }]}
                          >
                            {cfg.label}
                          </Text>
                        </View>

                        {item.receiptUrl ? (
                          <TouchableRipple
                            onPress={() =>
                              openPaymentHistoryReceipt(item.receiptUrl)
                            }
                            style={{ marginTop: 8, borderRadius: 6 }}
                            rippleColor={dark ? "#ffffff10" : "#00000010"}
                          >
                            <View style={styles.receiptRow}>
                              <MaterialCommunityIcons
                                name="file-document-outline"
                                size={18}
                                color={colors.primary}
                              />
                              <Text
                                style={[
                                  styles.receiptText,
                                  { color: colors.primary },
                                ]}
                              >
                                View receipt
                              </Text>
                            </View>
                          </TouchableRipple>
                        ) : null}
                      </View>
                    </View>

                    <Divider
                      style={{
                        marginVertical: 12,
                        backgroundColor: colors.outline,
                      }}
                    />

                    <View>
                      <Text
                        style={[styles.label, { color: colors.placeholder }]}
                      >
                        Services
                      </Text>
                      <View style={styles.servicesWrap}>
                        {Array.isArray(item.services) &&
                        item.services.length ? (
                          item.services.map((s, i) => (
                            <View
                              key={i}
                              style={[
                                styles.chip,
                                {
                                  backgroundColor: dark ? "#111827" : "#F3F4F6",
                                  borderColor: colors.outline,
                                },
                              ]}
                            >
                              <Text
                                style={{ color: colors.text, fontSize: 13 }}
                              >
                                {s}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text
                            style={[
                              styles.subText,
                              { color: colors.placeholder },
                            ]}
                          >
                            —
                          </Text>
                        )}
                      </View>

                      <View style={{ height: 8 }} />

                      <Text
                        style={[styles.label, { color: colors.placeholder }]}
                      >
                        Notes
                      </Text>
                      <Text style={[styles.noteText, { color: colors.text }]}>
                        {item.paymentStatus?.toLowerCase().includes("fail")
                          ? item.notes || "Failure reason not provided."
                          : item.notes || "—"}
                      </Text>

                      {item.paymentStatus?.toLowerCase().includes("fail") &&
                        item.receiptUrl && (
                          <View style={{ marginTop: 8 }}>
                            <Button
                              mode="outlined"
                              onPress={() =>
                                openPaymentHistoryReceipt(item.receiptUrl)
                              }
                            >
                              View Receipt
                            </Button>
                          </View>
                        )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardInner: { padding: 14 },
  row: { flexDirection: "row", alignItems: "center" },
  amountText: { fontSize: 16, fontWeight: "700" },
  subText: { fontSize: 13 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  statusText: { marginLeft: 6, fontWeight: "700", fontSize: 12 },
  receiptRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  receiptText: { marginLeft: 6 },
  label: { fontSize: 12, marginBottom: 6 },
  servicesWrap: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  noteText: { fontSize: 13 },
  empty: { alignItems: "center", marginTop: 48 },
  emptyText: { fontSize: 14 },
});
