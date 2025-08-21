import dayjs from "dayjs";
import { useState } from "react";
import { Text, View } from "react-native";
import { Card, Chip, DataTable, useTheme } from "react-native-paper";

const STATUS_COLOR_MAP = {
  Pending: { bg: "#FFF3CD", text: "#856404" },
  Success: { bg: "#D4EDDA", text: "#155724" },
  Failed: { bg: "#F8D7DA", text: "#721C24" },
  Upcoming: { bg: "#CCE5FF", text: "#004085" },
};

const DEFAULT_ITEMS_PER_PAGE = 5;

export default function CustomDataTable({
  data = [],
  columns = [],
  showPagination = true,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}) {
  const [page, setPage] = useState(0);
  const { colors, dark } = useTheme();

  const start = page * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = showPagination ? data.slice(start, end) : data;
  const pageCount = Math.ceil(data.length / itemsPerPage);

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: colors.background,
        padding: dark ? 8 : 0,
        borderRadius: 12,
      }}
    >
      <DataTable>
        <DataTable.Header
          style={{
            backgroundColor: colors.tertiary,
            borderRadius: 10,
          }}
        >
          {columns.map((col) => (
            <DataTable.Title
              key={col.key}
              textStyle={{ color: colors.onPrimary }}
              style={{ flex: 1 }}
            >
              {col.title}
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {paginatedData.map((item, index) => (
          <DataTable.Row
            key={item.id || index}
            style={{ alignItems: "center" }}
          >
            {columns.map((col) => {
              const cellValue = item[col.key];
              let display = cellValue;

              if (col.key === "date") {
                display = dayjs(cellValue).format("D MMM");
              } else if (col.key === "time") {
                display = dayjs(`${item.date}T${item.time}`).format("h A");
              } else if (col.key === "status") {
                const statusColor = STATUS_COLOR_MAP[cellValue] || {
                  bg: "#E0E0E0",
                  text: "#000",
                };
                return (
                  <DataTable.Cell key={col.key} style={{ flex: 1 }}>
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <Chip
                        compact
                        style={{
                          backgroundColor: statusColor.bg,
                          alignSelf: "center",
                        }}
                        textStyle={{
                          color: statusColor.text,
                          fontWeight: "600",
                          width: 80,
                          textAlign: "center",
                        }}
                      >
                        {cellValue}
                      </Chip>
                    </View>
                  </DataTable.Cell>
                );
              }

              return (
                <DataTable.Cell key={col.key} style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: colors.text }}>{display}</Text>
                  </View>
                </DataTable.Cell>
              );
            })}
          </DataTable.Row>
        ))}

        {showPagination && (
          <DataTable.Pagination
            page={page}
            numberOfPages={pageCount}
            onPageChange={setPage}
            label={`${start + 1}-${Math.min(end, data.length)} of ${
              data.length
            }`}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows per page"}
          />
        )}
      </DataTable>
    </Card>
  );
}
