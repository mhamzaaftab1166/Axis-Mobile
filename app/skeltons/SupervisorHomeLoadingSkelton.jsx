import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function SupervisorHomeSkeleton() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <AppSkeleton width="100%" height={100} borderRadius={10} />

        <View style={styles.spacer} />

        <View style={styles.statsRow}>
          <AppSkeleton width="48%" height={100} borderRadius={12} />
          <AppSkeleton width="48%" height={100} borderRadius={12} />
        </View>

        <View style={styles.spacer} />

        <AppSkeleton
          width="100%"
          height={42}
          borderRadius={10}
          style={styles.block}
        />

        <View style={styles.servicesList}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.serviceCardWrap}>
              <AppSkeleton width="100%" height={110} borderRadius={14} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  greetText: { flex: 1, marginLeft: 12 },
  spacer: { height: 20 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  block: { marginBottom: 12 },
  servicesList: { marginTop: 8 },
  serviceCardWrap: { marginBottom: 12 },
});
