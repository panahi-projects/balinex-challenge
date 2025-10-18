"use client";
import {
  getActionColumnResponsiveClasses,
  getActionResponsiveClasses,
  getResponsiveClasses,
  getVisibleColumns,
  shouldShowActionColumn,
  useResponsive,
  type DataTableProps,
} from "@/shared";
import { useMemo, useState } from "react";
import DataTableBody from "./DataTableBody";
import { DataTableProvider } from "./DataTableContext";
import DataTableSearch from "./DataTableSearch";

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyText = "No data available",
  className = "",
  rowKey = "id",
  selectable = false,
  actionColumnTitle = "Actions",
  onRowClick,
  onSelectionChange,
}: DataTableProps<T>) => {
  const { isMobile, isTablet } = useResponsive();
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Get visible columns early
  const visibleColumns = getVisibleColumns<T>(columns);

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  // Search filtering function
  const filterData = (data: T[], searchTerm: string): T[] => {
    if (!searchTerm.trim()) return data;

    return data.filter((record) => {
      return visibleColumns.some((column) => {
        const value = record[column.dataIndex];
        if (value === null || value === undefined) return false;

        const stringValue = String(value).toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return stringValue.includes(searchLower);
      });
    });
  };

  // Sorting and filtering
  const sortedData = useMemo(() => {
    let filteredData = filterData(data, debouncedSearch);

    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig, debouncedSearch, visibleColumns]);

  // Handlers
  const handleSort = (key: string) => {
    const column = columns.find((col) => col.dataIndex === key);
    if (!column?.sortable) return;

    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc" ? { key, direction: "desc" } : null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(sortedData);
      onSelectionChange?.(sortedData);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (record: T, checked: boolean) => {
    let newSelectedRows;
    if (checked) {
      newSelectedRows = [...selectedRows, record];
    } else {
      newSelectedRows = selectedRows.filter(
        (row) => getRowKey(row, 0) !== getRowKey(record, 0)
      );
    }
    setSelectedRows(newSelectedRows);
    onSelectionChange?.(newSelectedRows);
  };

  const isRowSelected = (record: T) => {
    return selectedRows.some(
      (row) => getRowKey(row, 0) === getRowKey(record, 0)
    );
  };

  const isAllSelected =
    sortedData.length > 0 && selectedRows.length === sortedData.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const contextValue = {
    data: sortedData,
    emptyText,
    visibleColumns,
    actions,
    selectedRows,
    selectable,
    rowKey,
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    getRowKey,
    getResponsiveClasses,
    getActionResponsiveClasses,
    shouldShowActionColumn: () => shouldShowActionColumn(actions),
    getActionColumnResponsiveClasses: () =>
      getActionColumnResponsiveClasses(actions),
    handleSelectRow,
    isRowSelected,
    onRowClick,
    onSelectionChange,
  };

  return (
    <DataTableProvider value={contextValue}>
      <div className={`overflow-x-auto ${className}`}>
        <div className="min-w-full space-y-4">
          <div className="w-full">
            <DataTableSearch />
          </div>
          {/* Header */}
          <div className="bg-background-50 border-b border-gray-200 rounded-t-lg min-w-max">
            <div className="flex items-center justify-between" dir="rtl">
              {selectable && (
                <div className="px-4 py-3 w-12 flex-shrink-0 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              )}
              {visibleColumns.map((column) => {
                // Determine width based on screen size
                const getColumnWidth = () => {
                  if (isMobile && column.mobileWidth) {
                    return column.mobileWidth;
                  }
                  if (isTablet && column.tabletWidth) {
                    return column.tabletWidth;
                  }
                  return column.width || "150px";
                };

                const columnWidth = getColumnWidth();

                return (
                  <div
                    key={column.key}
                    className={`px-4 py-3 font-medium text-text-200 flex-shrink-0 ${getResponsiveClasses(column)}`}
                    style={{
                      textAlign: column.align || "right",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      flex: `0 0 ${columnWidth}`,
                      width: columnWidth,
                    }}
                  >
                    <div className="flex items-center gap-2" dir="rtl">
                      <span className="flex-1 truncate">{column.title}</span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.dataIndex)}
                          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                        >
                          {sortConfig?.key === column.dataIndex
                            ? sortConfig.direction === "asc"
                              ? "↑"
                              : "↓"
                            : "↕"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {shouldShowActionColumn(actions) && (
                <div
                  className={`px-4 py-3 text-center font-medium text-text-700 flex-shrink-0 ${getActionColumnResponsiveClasses(actions)}`}
                  style={{
                    flex: "0 0 120px",
                    minWidth: "120px",
                  }}
                >
                  <span className="truncate">{actionColumnTitle}</span>
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="min-w-max">
            <DataTableBody />
          </div>
        </div>
      </div>
    </DataTableProvider>
  );
};

export default DataTable;
