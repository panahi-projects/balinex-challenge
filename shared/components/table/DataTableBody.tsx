import React from "react";
import { ActionButton, Column } from "@/shared";
import DataTableRow from "./DataTableRow";

interface DataTableBodyProps<T extends Record<string, any>> {
  paginatedData: T[];
  emptyText: string;
  visibleColumns: Column<T>[];
  actions: ActionButton<T>[];
  selectable: boolean;
  onRowClick?: (record: T, index: number) => void;
  selectedRows: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  rowKey: string | ((record: T) => string);
  getRowKey: (record: T, index: number) => string;
  getResponsiveClasses: (column: Column<T>) => string;
  getActionResponsiveClasses: (action: ActionButton<T>) => string;
  shouldShowActionColumn: () => boolean;
  getActionColumnResponsiveClasses: () => string;
  handleSelectRow: (record: T, checked: boolean) => void;
  isRowSelected: (record: T) => boolean;
}

const DataTableBody = <T extends Record<string, any>>({
  paginatedData,
  emptyText,
  visibleColumns,
  actions,
  selectable,
  onRowClick,
  getRowKey,
  getResponsiveClasses,
  getActionResponsiveClasses,
  shouldShowActionColumn,
  getActionColumnResponsiveClasses,
  handleSelectRow,
  isRowSelected,
}: DataTableBodyProps<T>) => {
  return (
    <div className="divide-y divide-gray-200">
      {paginatedData.length === 0 ? (
        <div className="px-4 py-8 text-center text-secondary-text">
          {emptyText}
        </div>
      ) : (
        paginatedData.map((record, index) => (
          <DataTableRow
            key={getRowKey(record, index)}
            record={record}
            index={index}
            getRowKey={getRowKey}
            onRowClick={onRowClick}
            selectable={selectable}
            isRowSelected={isRowSelected}
            handleSelectRow={handleSelectRow}
            visibleColumns={visibleColumns}
            getResponsiveClasses={getResponsiveClasses}
            getActionColumnResponsiveClasses={getActionColumnResponsiveClasses}
            shouldShowActionColumn={shouldShowActionColumn}
            getActionResponsiveClasses={getActionResponsiveClasses}
            actions={actions}
          />
        ))
      )}
    </div>
  );
};

export default DataTableBody;
