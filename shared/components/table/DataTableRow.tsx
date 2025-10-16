import { useDataTableContext } from "@/shared/hooks/useDataTable";
import { Button } from "@/shared";
import { DataTableRowProps } from "@/shared/types";

const DataTableRow = <T extends Record<string, any>>({
  record,
  index,
}: DataTableRowProps<T>) => {
  const {
    visibleColumns,
    selectable,
    actions,
    getRowKey,
    onRowClick,
    isRowSelected,
    handleSelectRow,
    getResponsiveClasses,
    getActionColumnResponsiveClasses,
    shouldShowActionColumn,
    getActionResponsiveClasses,
  } = useDataTableContext();
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
