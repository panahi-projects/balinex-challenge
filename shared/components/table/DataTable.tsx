"use client";
import {
  Button,
  getActionColumnResponsiveClasses,
  getActionResponsiveClasses,
  getResponsiveClasses,
  getVisibleColumns,
  shouldShowActionColumn,
  type DataTableProps,
} from "@/shared";
import { useMemo, useState } from "react";
import DataTableBody from "./DataTableBody";
import { DataTableProvider } from "./DataTableContext";

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  pagination = { pageSize: 10 },
  loading = false,
  emptyText = "No data available",
  className = "",
  rowKey = "id",
  selectable = false,
  actionColumnTitle = "Actions",
  onRowClick,
  onSelectionChange,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
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
  }, [data, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData);
      onSelectionChange?.(paginatedData);
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
    paginatedData.length > 0 && selectedRows.length === paginatedData.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const visibleColumns = getVisibleColumns<T>(columns);

  const contextValue = {
    paginatedData,
    emptyText,
    visibleColumns,
    actions,
    selectedRows,
    selectable,
    rowKey,
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
      <div className={`overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-background-50 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            {selectable && (
              <div className="px-4 py-3 w-12 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
            )}
            {visibleColumns.map((column) => (
              <div
                key={column.key}
                className={`px-4 py-3 font-medium text-text-200 flex-shrink-0 ${getResponsiveClasses(column)}`}
                style={{
                  width: column.width || "auto",
                  minWidth: column.minWidth || column.width || "120px",
                  textAlign: column.align || "right",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="flex-1">{column.title}</span>
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
            ))}
            {shouldShowActionColumn(actions) && (
              <div
                className={`px-4 py-3 text-center font-medium text-text-700 flex-shrink-0 min-w-[120px] max-w-[200px] ${getActionColumnResponsiveClasses(actions)}`}
              >
                {actionColumnTitle}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <DataTableBody />

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-background-25">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {pagination.showTotal && (
                  <span className="text-sm text-secondary-text">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                    {sortedData.length} entries
                  </span>
                )}
                {pagination.showSizeChanger && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-secondary-text">Show:</span>
                    <select
                      value={pageSize}
                      onChange={(e) =>
                        handlePageSizeChange(Number(e.target.value))
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {pagination.showQuickJumper ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = Number(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          handlePageChange(page);
                        }
                      }}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center"
                    />
                    <span className="text-sm text-secondary-text">
                      of {totalPages}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "primary" : "secondary"
                          }
                          size="small"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                )}

                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DataTableProvider>
  );
};

export default DataTable;
