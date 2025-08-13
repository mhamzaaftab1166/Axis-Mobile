import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import ServiceCardGrid from "./services/ServiceCardGrid";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeServiceSection({
  title,
  homePageServices = [],
  onViewAll,
  onBookPress,
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {onViewAll && (
          <Pressable
            onPress={onViewAll}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <Text style={[styles.viewAll, { color: colors.primary }]}>
              View All
            </Text>
          </Pressable>
        )}
      </View>

      <FlatList
        horizontal
        data={homePageServices}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <ServiceCardGrid
            service={item}
            onBookPress={onBookPress}
            horizontalMode
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
