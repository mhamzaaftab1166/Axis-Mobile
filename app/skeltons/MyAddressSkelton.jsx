import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function MyAddressesSkeleton() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {[...Array(8)].map((_, index) => (
          <View key={index} style={styles.card}>
            {/* Icon Skeleton */}
            <AppSkeleton width={28} height={28} borderRadius={14} />

            {/* Text Skeleton */}
            <View style={styles.textContainer}>
              <AppSkeleton width="50%" height={16} borderRadius={4} />
              <AppSkeleton
                width="80%"
                height={14}
                borderRadius={4}
                style={{ marginTop: 6 }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
});
