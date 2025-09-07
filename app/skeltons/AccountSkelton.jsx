import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function AccountSkeleton() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Card */}
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

        {/* Options */}
        <View style={styles.options}>
          {[...Array(7)].map((_, index) => (
            <View key={index} style={styles.optionRow}>
              {/* Icon */}
              <AppSkeleton width={24} height={24} borderRadius={12} />

              {/* Label */}
              <AppSkeleton
                width="40%"
                height={16}
                borderRadius={4}
                style={{ marginLeft: 16 }}
              />

              {/* Right Chevron */}
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <AppSkeleton width={20} height={20} borderRadius={10} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  options: {
    marginTop: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
});
