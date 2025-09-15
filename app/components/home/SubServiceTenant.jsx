import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

const STATUS_COLOR_MAP = {
  Pending: { bg: "#FFF3CD", text: "#856404" },
  Success: { bg: "#D4EDDA", text: "#155724" },
  Failed: { bg: "#F8D7DA", text: "#721C24" },
  Upcoming: { bg: "#CCE5FF", text: "#004085" },
  InProgress: { bg: "#CCE5FF", text: "#356941ff" },
  Completed: { bg: "#CCE5FF", text: "#5bb16fff" },
  Missed: { bg: "#CCE5FF", text: "#721C24" },
  Cancelled: { bg: "#CCE5FF", text: "#181616ff" },
};

const DEFAULT_ITEMS_PER_PAGE = 5;

export default function CustomSubServiceTenantList({
  data = [],
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  showPagination = true,
}) {
  const [page, setPage] = useState(0);
  const { colors, dark } = useTheme();

  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = showPagination ? data.slice(start, end) : data;
  const pageCount = Math.ceil(data?.length / itemsPerPage);

  return (
    <ScrollView contentContainerStyle={{}}>
      {paginatedData.map((item, idx) => {
        const statusColor = STATUS_COLOR_MAP[item.status] || {
          bg: "#E0E0E0",
          text: "#000",
        };

        return (
          <View
            key={item.uniqueId || idx}
            style={{
              backgroundColor: dark ? "#1F2937" : "#fff",
              padding: 14,
              marginBottom: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: dark ? "#374151" : "#E5E7EB",
            }}
          >
            {/* Top Row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                {item.uniqueId}
              </Text>

              <Chip
                compact
                style={{
                  backgroundColor: statusColor.bg,
                  alignSelf: "flex-start",
                }}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  color: dark ? "#AAB0B6" : "#6B7280",
                  fontSize: 13,
                }}
              >
                {item.scheduledDay}, {item.scheduledDate}
              </Text>
              <Text
                style={{
                  color: dark ? "#AAB0B6" : "#6B7280",
                  fontSize: 13,
                }}
              >
                {item.scheduledTime}
              </Text>
            </View>
          </View>
        );
      })}

      {showPagination && pageCount > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
            gap: 12,
          }}
        >
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
              style={{ color: page + 1 >= pageCount ? "#AAA" : colors.primary }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
