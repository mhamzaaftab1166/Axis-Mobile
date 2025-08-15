import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import useBookingStore from "../../store/useBookingStore";
import ServiceCardGrid from "./services/ServiceCardGrid";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeServiceSection({
  title,
  homePageServices = [],
  onViewAll,
}) {
  const { colors } = useTheme();

  const toggleService = useBookingStore((state) => state.toggleService);
  const isSelected = useBookingStore((state) => state.isSelected);
  const selectedServices = useBookingStore((state) => state.selectedServices);

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
        extraData={selectedServices}
        renderItem={({ item }) => (
          <ServiceCardGrid
            service={item}
            horizontalMode
            isSelected={isSelected(item)}
            onToggleSelect={toggleService}
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
