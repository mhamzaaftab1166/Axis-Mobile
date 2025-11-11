import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { ROUTES } from "../../helpers/routePaths";
import useBookingStore from "../../store/useBookingStore";
import ServiceCardGrid from "./services/ServiceCardGrid";

export default function HomeServiceSection({
  title,
  homePageServices = [],
  inspectionServices = [],
  onViewAll,
  addressCapacity = 0,
}) {

  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [servicesList, setServicesList] = useState([...homePageServices, ...inspectionServices]);

  const toggleService = useBookingStore((state) => state.toggleService);
  const isSelected = useBookingStore((state) => state.isSelected);
  const selectedServices = useBookingStore(
    (state) => state.booking?.selectedServices || []
  );

  const categories = [
    { key: "All", label: "All", icon: "apps" },
    { key: "Direct Booking", label: "Direct", icon: "add-shopping-cart" },
    { key: "Inspection", label: "Inspect", icon: "search" },
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if(category === "All"){
      setServicesList([...homePageServices, ...inspectionServices]);
    }else if(category === "Direct Booking"){
      setServicesList(homePageServices)
    }else if(category === "Inspection"){
      setServicesList(inspectionServices)
    }else{
      setServicesList([]);
    }
  };

  const handleBookInspection = (service) => {
    router.push({
      pathname: ROUTES.BOOK_SERVICE_INSPECTION,
      params: {
        service: JSON.stringify(service),
      },
    });
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {onViewAll && (
          <Pressable
            onPress={onViewAll}
            accessibilityRole="button"
            style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1 }]}
          >
            <Text style={[styles.viewAll, { color: colors.primary }]}>
              View All
            </Text>
          </Pressable>
        )}
      </View>

      <View
        style={[
          styles.segmentWrap,
          { borderColor: colors.outline ?? "rgba(0,0,0,0.12)" },
        ]}
      >
        {categories.map((c, idx) => {
          const active = selectedCategory === c.key;
          return (
            <Pressable
              key={c.key}
              onPress={() => handleCategoryChange(c.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={({ pressed }) => [
                styles.segmentButton,
                {
                  flex: 1,
                  backgroundColor: active ? colors.tertiary : colors.surface,
                },
                {
                  opacity: pressed ? 0.9 : 1,
                  transform: pressed ? [{ scale: 0.997 }] : [{ scale: 1 }],
                },
              ]}
            >
              <View style={styles.segmentInner}>
                <MaterialIcons
                  name={c.icon}
                  size={14}
                  color={active ? colors.onTertiary ?? "#fff" : colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.segmentText,
                    {
                      color: active ? colors.onTertiary ?? "#fff" : colors.text,
                    },
                  ]}
                >
                  {c.label}
                </Text>
              </View>
              {idx < categories.length - 1 && (
                <View
                  pointerEvents="none"
                  style={[
                    styles.separator,
                    {
                      backgroundColor: colors.outline ?? "rgba(0,0,0,0.08)",
                      opacity: active ? 0.0 : 0.6,
                    },
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <FlatList
        horizontal
        data={servicesList}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        extraData={selectedServices}
        contentContainerStyle={{ paddingLeft: 4, paddingTop: 8 }}
        renderItem={({ item }) => (
          <ServiceCardGrid
            service={item}
            capacity={addressCapacity}
            horizontalMode
            isSelected={isSelected(item)}
            onToggleSelect={toggleService}
            onBookInspection={handleBookInspection}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
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
  segmentWrap: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    height: 35,
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  segmentButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    position: "relative",
  },
  segmentInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
  },
  separator: {
    position: "absolute",
    right: 0,
    top: 6,
    bottom: 6,
    width: 1,
  },
});
