import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AppSkeleton from "../components/common/LoadingSkelton";

const HomeSkeleton = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Row 1: Search Input */}
        <AppSkeleton width="100%" height={50} borderRadius={10} />

        {/* Row 2 */}
        <AppSkeleton width="100%" height={50} borderRadius={10} />

        {/* Container 3 */}
        <AppSkeleton width="100%" height={120} borderRadius={10} />

        {/* Container 4 */}
        <AppSkeleton width="100%" height={180} borderRadius={10} />

        {/* Row 5: Three in a row */}
        <View style={styles.row}>
          <AppSkeleton style={styles.item} height={100} borderRadius={10} />
          <AppSkeleton style={styles.item} height={100} borderRadius={10} />
          <AppSkeleton style={styles.item} height={100} borderRadius={10} />
        </View>

        {/* Row 6: Horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRow}
        >
          <AppSkeleton
            style={styles.scrollItem}
            height={180}
            width={160}
            borderRadius={10}
          />
          <AppSkeleton
            style={styles.scrollItem}
            height={180}
            width={160}
            borderRadius={10}
          />
          <AppSkeleton
            style={styles.scrollItem}
            height={180}
            width={160}
            borderRadius={10}
          />
          <AppSkeleton
            style={styles.scrollItem}
            height={180}
            width={160}
            borderRadius={10}
          />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",

    gap: 8,
  },
  item: {
    flex: 1,
  },
  scrollRow: {
    gap: 12,
  },
  scrollItem: {
    // marginRight removed, replaced by gap
  },
});

export default HomeSkeleton;
