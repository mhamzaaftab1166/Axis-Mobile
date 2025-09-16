import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function PaymentHistorySkeleton() {
  const { colors, dark } = useTheme();

  const skeletonCards = Array.from({ length: 3 });

  const chipsPerCard = 3;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 96 }]}
        showsVerticalScrollIndicator={false}
      >
        {skeletonCards.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.outline },
            ]}
          >
            <View style={styles.cardInner}>
              {/* Row: Icon + Amount + Status */}
              <View style={styles.row}>
                <AppSkeleton width={44} height={44} borderRadius={22} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <AppSkeleton width="50%" height={16} borderRadius={4} />
                  <AppSkeleton
                    width="40%"
                    height={12}
                    borderRadius={4}
                    style={{ marginTop: 6 }}
                  />
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <AppSkeleton width={60} height={20} borderRadius={10} />
                  <AppSkeleton
                    width={60}
                    height={20}
                    borderRadius={10}
                    style={{ marginTop: 8 }}
                  />
                </View>
              </View>

              {/* Divider */}
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.outline, marginVertical: 12 },
                ]}
              />

              {/* Services */}
              <AppSkeleton
                width="30%"
                height={12}
                borderRadius={4}
                style={{ marginBottom: 6 }}
              />
              <View style={styles.servicesWrap}>
                {Array.from({ length: chipsPerCard }).map((_, i) => (
                  <AppSkeleton
                    key={i}
                    width={80}
                    height={24}
                    borderRadius={12}
                    style={{ marginRight: 8, marginBottom: 8 }}
                  />
                ))}
              </View>

              {/* Notes */}
              <AppSkeleton
                width="25%"
                height={12}
                borderRadius={4}
                style={{ marginBottom: 6 }}
              />
              <AppSkeleton width="100%" height={40} borderRadius={6} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16 },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardInner: { padding: 14 },
  row: { flexDirection: "row", alignItems: "center" },
  divider: { height: 0.5 },
  servicesWrap: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
});
