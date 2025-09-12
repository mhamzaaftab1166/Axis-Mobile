import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function AccountSkeleton() {
  const { colors } = useTheme();

  const groups = [
    { key: "account", count: 3 },
    { key: "payments", count: 3 },
    { key: "support", count: 1 },
    { key: "preferences", count: 1 },
    { key: "danger", count: 1 },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <AppSkeleton width={64} height={64} borderRadius={32} />
          <View style={styles.profileInfo}>
            <AppSkeleton width="50%" height={16} borderRadius={4} />
            <AppSkeleton
              width="70%"
              height={14}
              borderRadius={4}
              style={{ marginTop: 6 }}
            />
          </View>
        </View>

        <View style={styles.options}>
          {groups.map((g, gi) => (
            <View key={g.key} style={[gi > 0 && styles.groupGap]}>
              <View style={styles.sectionHeader}>
                <AppSkeleton width="30%" height={12} borderRadius={4} />
              </View>

              {[...Array(g.count)].map((_, idx) => (
                <View key={idx}>
                  <View style={styles.optionRow}>
                    <AppSkeleton width={24} height={24} borderRadius={12} />
                    <AppSkeleton
                      width="40%"
                      height={16}
                      borderRadius={4}
                      style={{ marginLeft: 16 }}
                    />
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                      <AppSkeleton width={20} height={20} borderRadius={10} />
                    </View>
                  </View>

                  {idx < g.count - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: colors.outlineVariant },
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  profileInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  options: {
    marginTop: 8,
  },
  sectionHeader: {
    marginBottom: 8,
    marginLeft: 8,
  },
  groupGap: {
    marginTop: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  divider: {
    height: 0.5,
    marginHorizontal: 16,
  },
});
