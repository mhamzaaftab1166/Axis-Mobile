import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Chip, useTheme } from "react-native-paper";
import EmptyState from "../common/EmptyState";

const STATUS_COLOR_MAP = {
  Pending: { bg: "#FFF3CD", text: "#856404", icon: "clock-outline" },
  Success: { bg: "#D4EDDA", text: "#155724", icon: "check-circle-outline" },
  Failed: { bg: "#F8D7DA", text: "#721C24", icon: "close-circle-outline" },
  Upcoming: { bg: "#CCE5FF", text: "#004085", icon: "calendar-outline" },
  InProgress: { bg: "#CCE5FF", text: "#356941ff", icon: "progress-clock" },
  Completed: { bg: "#CCE5FF", text: "#5bb16fff", icon: "check-bold" },
  Missed: { bg: "#FFE5E5", text: "#721C24", icon: "alert-circle-outline" },
  Cancelled: { bg: "#F0F0F0", text: "#181616ff", icon: "close" },
};

const DEFAULT_ITEMS_PER_PAGE = 5;

const FILTERS = [
  { label: "All", value: "all", icon: "apps" },
  { label: "Pending", value: "pending", icon: "clock-outline" },
  { label: "Cancelled", value: "cancelled", icon: "close-circle-outline" },
  { label: "Completed", value: "completed", icon: "check-circle-outline" },
];

export default function CustomSubServiceTenantList({
  data = [],
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  showPagination = true,
}) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState("all");
  const { colors, dark } = useTheme();

  // 🔹 Filter data
  const filteredData = data.filter((item) => {
    if (filter === "completed") return item.status === "Completed";
    if (filter === "cancelled") return ["Cancelled", "Missed"].includes(item.status);
    if (filter === "pending") return ["Pending", "InProgress"].includes(item.status);
    return true; 
  });

  // 🔹 Pagination
  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = showPagination
    ? filteredData.slice(start, end)
    : filteredData;
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  if (filteredData.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Upcoming Services
          </Text>
        </View>

        {/* Filter bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTERS.map((f) => {
            const selected = f.value === filter;
            return (
              <TouchableOpacity
                key={f.value}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selected
                      ? colors.primary
                      : dark
                      ? "#374151"
                      : "#F0F0F0",
                  },
                ]}
                onPress={() => {
                  setFilter(f.value);
                  setPage(0);
                }}
              >
                <MaterialCommunityIcons
                  name={f.icon}
                  size={16}
                  color={selected ? "#fff" : colors.text}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    color: selected ? "#fff" : colors.text,
                    fontWeight: selected ? "600" : "500",
                    fontSize: 13,
                  }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <EmptyState
          title="No services found"
          description="There are no services matching the selected status."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Heading */}
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Upcoming Services
        </Text>
      </View>

      {/* Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTERS.map((f) => {
          const selected = f.value === filter;
          return (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selected
                    ? colors.primary
                    : dark
                    ? "#374151"
                    : "#F0F0F0",
                },
              ]}
              onPress={() => {
                setFilter(f.value);
                setPage(0);
              }}
            >
              <MaterialCommunityIcons
                name={f.icon}
                size={16}
                color={selected ? "#fff" : colors.text}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: selected ? "#fff" : colors.text,
                  fontWeight: selected ? "600" : "500",
                  fontSize: 13,
                }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Cards */}
      {paginatedData.map((item, idx) => {
        const statusColor = STATUS_COLOR_MAP[item.status] || {
          bg: "#E0E0E0",
          text: "#000",
          icon: "alert-circle-outline",
        };

        return (
          <View
            key={item.uniqueId || idx}
            style={[
              styles.card,
              {
                backgroundColor: dark ? "#1F2937" : "#fff",
                borderColor: dark ? "#374151" : "#E5E7EB",
              },
            ]}
          >
            {/* Top Row */}
            <View style={styles.topRow}>
              <Text style={[styles.uniqueId, { color: colors.text }]}>
                {item.uniqueId}
              </Text>

              <Chip
                compact
                style={{ backgroundColor: statusColor.bg }}
                textStyle={{
                  color: statusColor.text,
                  fontWeight: "600",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                {item.status}
              </Chip>
            </View>

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <Text
                style={[
                  styles.metaText,
                  { color: dark ? "#AAB0B6" : "#6B7280" },
                ]}
              >
                {item.scheduledDay}, {item.scheduledDate}
              </Text>
              <Text
                style={[
                  styles.metaText,
                  { color: dark ? "#AAB0B6" : "#6B7280" },
                ]}
              >
                {item.scheduledTime}
              </Text>
            </View>
          </View>
        );
      })}

      {/* Pagination */}
      {showPagination && pageCount > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            disabled={page === 0}
            onPress={() => setPage(page - 1)}
          >
            <Text style={{ color: page === 0 ? "#AAA" : colors.primary }}>
              Previous
            </Text>
          </TouchableOpacity>
          <Text style={{ color: colors.text }}>
            Page {page + 1} of {pageCount}
          </Text>
          <TouchableOpacity
            disabled={page + 1 >= pageCount}
            onPress={() => setPage(page + 1)}
          >
            <Text
              style={{
                color: page + 1 >= pageCount ? "#AAA" : colors.primary,
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {},
  headerContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    paddingLeft: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  card: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  uniqueId: {
    fontWeight: "700",
    fontSize: 15,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaText: {
    fontSize: 13,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 12,
  },
});
