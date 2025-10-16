import React from "react";
import { Button } from "../form";
import { ActionButton, Column } from "@/shared";

interface DataTableRowProps<T extends Record<string, any>> {
  record: T;
  index: number;
  getRowKey: (record: T, index: number) => string;
  onRowClick?: (record: T, index: number) => void;
  selectable: boolean;
  isRowSelected: (record: T) => boolean;
  handleSelectRow: (record: T, checked: boolean) => void;
  visibleColumns: Column<T>[];
  getResponsiveClasses: (column: Column<T>) => string;
  getActionColumnResponsiveClasses: () => string;
  shouldShowActionColumn: () => boolean;
  getActionResponsiveClasses: (action: ActionButton<T>) => string;
  actions: ActionButton<T>[];
}

const DataTableRow = <T extends Record<string, any>>({
  record,
  index,
  getRowKey,
  onRowClick,
  selectable,
  isRowSelected,
  handleSelectRow,
  visibleColumns,
  getResponsiveClasses,
  getActionColumnResponsiveClasses,
  shouldShowActionColumn,
  getActionResponsiveClasses,
  actions,
}: DataTableRowProps<T>) => {
  return (
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
  );
};

export default DataTableRow;
