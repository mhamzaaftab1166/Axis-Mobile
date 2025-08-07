import dayjs from "dayjs";
import { useState } from "react";
import { Card, Chip, DataTable, useTheme } from "react-native-paper";

const STATUS_COLOR_MAP = {
  Pending: { bg: "#FFF3CD", text: "#856404" },
  Success: { bg: "#D4EDDA", text: "#155724" },
  Failed: { bg: "#F8D7DA", text: "#721C24" },
};

const DEFAULT_ITEMS_PER_PAGE = 4;

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
        backgroundColor: dark ? colors.secondary : colors.background,
        padding: dark ? 8 : 0,
        borderRadius: 12,
      }}
    >
      <DataTable>
        <DataTable.Header
          style={{
            backgroundColor: dark ? colors.primary : colors.secondary,
            borderRadius: 10,
          }}
        >
          {columns.map((col) => (
            <DataTable.Title
              key={col.key}
              textStyle={{ color: colors.onPrimary }}
            >
              {col.title}
            </DataTable.Title>
          ))}
        </DataTable.Header>

        {paginatedData.map((item, index) => (
          <DataTable.Row key={item.id || index}>
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
                  <DataTable.Cell key={col.key}>
                    <Chip
                      compact
                      style={{ backgroundColor: statusColor.bg }}
                      textStyle={{
                        color: statusColor.text,
                        fontWeight: "600",
                        width: 70,
                        textAlign: "center",
                      }}
                    >
                      {cellValue}
                    </Chip>
                  </DataTable.Cell>
                );
              }

              return (
                <DataTable.Cell
                  key={col.key}
                  textStyle={{ color: colors.text }}
                >
                  {display}
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
