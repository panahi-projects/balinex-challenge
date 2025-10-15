"use client";
import React, { useState, useMemo } from "react";
import { Button } from "./form";

// Types
export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  align?: "left" | "center" | "right";
  responsive?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
  };
}

export interface ActionButton<T = any> {
  label: string;
  onClick: (record: T, index: number) => void;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  disabled?: (record: T) => boolean;
  icon?: React.ReactNode;
  responsive?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
  };
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  actions?: ActionButton<T>[];
  pagination?: {
    pageSize?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
  };
  loading?: boolean;
  emptyText?: string;
  className?: string;
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  actionColumnTitle?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  pagination = { pageSize: 10 },
  loading = false,
  emptyText = "No data available",
  className = "",
  rowKey = "id",
  onRowClick,
  selectable = false,
  onSelectionChange,
  actionColumnTitle = "Actions",
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

  // Helper function to get responsive classes for columns
  const getResponsiveClasses = (column: Column<T>) => {
    const { responsive } = column;
    if (!responsive) return ""; // Show by default on all screens

    const classes = [];

    // Build responsive classes based on the configuration
    // We need to handle all combinations properly

    // Start with base visibility
    if (responsive.mobile === false) {
      classes.push("hidden");
    } else {
      classes.push("block");
    }

    // Override for tablet (md: breakpoint)
    if (responsive.tablet !== undefined) {
      if (responsive.tablet === false) {
        classes.push("md:hidden");
      } else {
        classes.push("md:block");
      }
    }

    // Override for desktop (lg: breakpoint)
    if (responsive.desktop !== undefined) {
      if (responsive.desktop === false) {
        classes.push("lg:hidden");
      } else {
        classes.push("lg:block");
      }
    }

    return classes.join(" ");
  };

  // Helper function to get responsive classes for action buttons
  const getActionResponsiveClasses = (action: ActionButton<T>) => {
    const { responsive } = action;
    if (!responsive) return ""; // Show by default on all screens

    const classes = [];

    // Start with base visibility
    if (responsive.mobile === false) {
      classes.push("hidden");
    } else {
      classes.push("block");
    }

    // Override for tablet (md: breakpoint)
    if (responsive.tablet !== undefined) {
      if (responsive.tablet === false) {
        classes.push("md:hidden");
      } else {
        classes.push("md:block");
      }
    }

    // Override for desktop (lg: breakpoint)
    if (responsive.desktop !== undefined) {
      if (responsive.desktop === false) {
        classes.push("lg:hidden");
      } else {
        classes.push("lg:block");
      }
    }

    return classes.join(" ");
  };

  // Helper function to check if action column should be visible
  const shouldShowActionColumn = () => {
    if (actions.length === 0) return false;

    // If any action has responsive settings, check if at least one is visible on any screen
    const hasResponsiveActions = actions.some((action) => action.responsive);

    if (!hasResponsiveActions) return true; // Show by default if no responsive settings

    // Check if at least one action is visible on any screen size
    return actions.some((action) => {
      const { responsive } = action;
      if (!responsive) return true; // Show by default

      // Check if action is visible on at least one screen size
      return (
        responsive.mobile !== false ||
        responsive.tablet !== false ||
        responsive.desktop !== false
      );
    });
  };

  // Helper function to get responsive classes for action column
  const getActionColumnResponsiveClasses = () => {
    if (actions.length === 0) return "hidden";

    // If no responsive settings, show on all screens
    const hasResponsiveActions = actions.some((action) => action.responsive);
    if (!hasResponsiveActions) return "";

    // Check if any action is visible on mobile
    const hasVisibleOnMobile = actions.some((action) => {
      const { responsive } = action;
      if (!responsive) return true;
      return responsive.mobile !== false;
    });

    // Check if any action is visible on tablet
    const hasVisibleOnTablet = actions.some((action) => {
      const { responsive } = action;
      if (!responsive) return true;
      return responsive.tablet !== false;
    });

    // Check if any action is visible on desktop
    const hasVisibleOnDesktop = actions.some((action) => {
      const { responsive } = action;
      if (!responsive) return true;
      return responsive.desktop !== false;
    });

    const classes = [];

    // Mobile visibility
    if (!hasVisibleOnMobile) {
      classes.push("hidden");
    } else {
      classes.push("block");
    }

    // Tablet visibility
    if (hasVisibleOnTablet) {
      classes.push("md:block");
    } else {
      classes.push("md:hidden");
    }

    // Desktop visibility
    if (hasVisibleOnDesktop) {
      classes.push("lg:block");
    } else {
      classes.push("lg:hidden");
    }

    return classes.join(" ");
  };

  // Get visible columns based on responsive settings
  const getVisibleColumns = () => {
    return columns.filter((column) => {
      const { responsive } = column;
      if (!responsive) return true; // Show by default

      // For now, we'll show all columns and let CSS handle visibility
      // In a real implementation, you might want to use a hook to detect screen size
      return true;
    });
  };

  const visibleColumns = getVisibleColumns();

  return (
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
          {shouldShowActionColumn() && (
            <div
              className={`px-4 py-3 text-center font-medium text-text-700 flex-shrink-0 min-w-[120px] max-w-[200px] ${getActionColumnResponsiveClasses()}`}
            >
              {actionColumnTitle}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-200">
        {paginatedData.length === 0 ? (
          <div className="px-4 py-8 text-center text-secondary-text">
            {emptyText}
          </div>
        ) : (
          paginatedData.map((record, index) => (
            <div
              key={getRowKey(record, index)}
              className={`flex items-center hover:bg-background-25 transition-colors justify-between ${
                onRowClick ? "cursor-pointer" : ""
              } ${isRowSelected(record) ? "bg-primary-50" : ""}`}
              onClick={() => onRowClick?.(record, index)}
            >
              {selectable && (
                <div className="px-4 py-3 w-12 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isRowSelected(record)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectRow(record, e.target.checked);
                    }}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              )}
              {visibleColumns.map((column) => (
                <div
                  key={column.key}
                  className={`px-4 py-3 text-text flex-shrink-0 ${getResponsiveClasses(column)}`}
                  style={{
                    width: column.width || "auto",
                    minWidth: column.minWidth || column.width || "120px",
                    textAlign: column.align || "right",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                  }}
                >
                  {column.render
                    ? column.render(record[column.dataIndex], record, index)
                    : record[column.dataIndex]}
                </div>
              ))}
              {shouldShowActionColumn() && (
                <div
                  className={`px-4 py-3 flex-shrink-0 min-w-[120px] max-w-[200px] ${getActionColumnResponsiveClasses()}`}
                >
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant={action.variant || "secondary"}
                        size={action.size || "small"}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          action.onClick(record, index);
                        }}
                        disabled={action.disabled?.(record)}
                        className={`flex items-center gap-1 ${getActionResponsiveClasses(action)}`}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

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
  );
};

export default DataTable;
