// components/common/FAQSkeleton.js
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

export default function FAQSkeleton() {
  const { colors, dark } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
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

        {/* FAQ Items Skeleton */}
        {[...Array(5)].map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.accordionCard,
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            {/* Question Skeleton */}
            <AppSkeleton width="80%" height={20} borderRadius={6} />

            {/* Answer Skeleton */}
            <View style={{ marginTop: 12 }}>
              <AppSkeleton width="95%" height={14} borderRadius={4} />
              <AppSkeleton
                width="90%"
                height={14}
                borderRadius={4}
                style={{ marginTop: 6 }}
              />
              <AppSkeleton
                width="85%"
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categories: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  categoryButton: {
    flex: 1,
  },
  accordionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    elevation: 1,
  },
});
