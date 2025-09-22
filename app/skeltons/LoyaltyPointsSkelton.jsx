// components/common/LoyaltyPointsSkeleton.js
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function LoyaltyPointsSkeleton() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Balance Card Skeleton */}
        <View style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
          <AppSkeleton width="60%" height={24} borderRadius={6} />
          <AppSkeleton
            width="40%"
            height={36}
            borderRadius={8}
            style={{ marginTop: 12 }}
          />
          <AppSkeleton
            width="80%"
            height={16}
            borderRadius={6}
            style={{ marginTop: 16 }}
          />
          <AppSkeleton
            width="40%"
            height={18}
            borderRadius={6}
            style={{ marginTop: 18 }}
          />
        </View>

        {/* How it works button skeleton */}
        <AppSkeleton
          width={140}
          height={20}
          borderRadius={6}
          style={{ alignSelf: "center", marginBottom: 24 }}
        />

        {/* Transaction History Card Skeleton */}
        <View style={[styles.historyCard, { backgroundColor: colors.surface }]}>
          <AppSkeleton width="50%" height={22} borderRadius={6} />

          {/* Transaction Rows */}
          {[...Array(4)].map((_, idx) => (
            <View key={idx} style={styles.historyRow}>
              <View style={{ flex: 1 }}>
                <AppSkeleton width="70%" height={16} borderRadius={4} />
                <AppSkeleton
                  width="50%"
                  height={14}
                  borderRadius={4}
                  style={{ marginTop: 6 }}
                />
              </View>
              <AppSkeleton width={40} height={16} borderRadius={4} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 16 },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
});
