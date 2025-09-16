import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function BookingSkeleton() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Category Buttons Skeleton */}
        <View style={styles.categories}>
          {[...Array(2)].map((_, idx) => (
            <AppSkeleton
              key={idx}
              height={36}
              borderRadius={18}
              style={[
                styles.categoryButton,
                idx === 0 ? { marginRight: 8 } : { marginLeft: 8 },
              ]}
            />
          ))}
        </View>

        {/* Booking Cards Skeleton */}
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.card, { backgroundColor: colors.surface }]}
          >
            {/* Address */}
            <AppSkeleton height={16} width="70%" style={{ marginBottom: 10 }} />

            {/* Service number */}
            <AppSkeleton height={14} width="50%" style={{ marginBottom: 12 }} />

            {/* Divider */}
            <View style={styles.divider} />

            {/* Service list (2 items) */}
            {[1, 2].map((j) => (
              <View key={j} style={styles.serviceItem}>
                <AppSkeleton height={42} width={42} style={styles.serviceImg} />
                <View style={{ flex: 1 }}>
                  <AppSkeleton
                    height={14}
                    width="60%"
                    style={{ marginBottom: 6 }}
                  />
                  <AppSkeleton height={12} width="40%" />
                </View>
              </View>
            ))}

            {/* Divider */}
            <View style={styles.divider} />

            {/* Schedule + Status */}
            <View style={styles.footerRow}>
              <AppSkeleton height={16} width="50%" />
              <AppSkeleton height={20} width={80} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categories: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  categoryButton: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginVertical: 12,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceImg: {
    borderRadius: 10,
    marginRight: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
