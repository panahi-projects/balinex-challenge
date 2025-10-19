import {
  Button,
  DataTableRowProps,
  useDataTableContext,
  useResponsive,
} from "@/shared";

const DataTableRow = <T extends Record<string, any>>({
  record,
  index,
}: DataTableRowProps<T>) => {
  const { isMobile, isTablet } = useResponsive();
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
      className={`flex items-center hover:bg-background-25 transition-colors min-w-max justify-between ${
        onRowClick ? "cursor-pointer" : ""
      } ${isRowSelected(record) ? "bg-primary-50" : ""}`}
      onClick={() => onRowClick?.(record, index)}
      dir="rtl"
    >
      {selectable && (
        <div className="px-4 py-3 w-12 flex-shrink-0 flex items-center justify-center">
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
            className={`px-4 py-3 text-text flex-shrink-0 ${getResponsiveClasses(column)}`}
            style={{
              textAlign: column.align || "right",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              flex: `0 0 ${columnWidth}`,
              width: columnWidth,
            }}
          >
            <div className="truncate" dir="rtl">
              {column.render
                ? column.render(record[column.dataIndex], record, index)
                : record[column.dataIndex]}
            </div>
          </div>
        );
      })}
      {shouldShowActionColumn() && (
        <div
          className={`px-4 py-3 flex-shrink-0 ${getActionColumnResponsiveClasses()}`}
          style={{
            flex: "0 0 120px",
            minWidth: "120px",
          }}
        >
          <div className="flex items-center justify-center">
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
                className={`flex items-center gap-1 truncate ${getActionResponsiveClasses(action)}`}
              >
                {action.icon}
                <span className="truncate">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableRow;
