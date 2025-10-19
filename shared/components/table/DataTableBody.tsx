import { useDataTableContext } from "@/shared";
import DataTableRow from "./DataTableRow";

const DataTableBody = () => {
  const { data, emptyText, getRowKey } = useDataTableContext();
  return (
    <div className="divide-y divide-gray-200">
      {data.length === 0 ? (
        <div className="px-4 py-8 text-center text-secondary-text">
          {emptyText}
        </div>
      ) : (
        data.map((record, index) => (
          <DataTableRow
            key={getRowKey(record, index)}
            record={record}
            index={index}
          />
        ))
      )}
    </div>
  );
};

export default DataTableBody;
