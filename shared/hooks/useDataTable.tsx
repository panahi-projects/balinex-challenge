import { useContext } from "react";
import { type DataTableContextValue } from "../types";
import { DataTableContext } from "../components/table/DataTableContext";

export const useDataTableContext = <
  T extends Record<string, any>,
>(): DataTableContextValue<T> => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error(
      "useDataTableContext must be used within a DataTableProvider"
    );
  }
  return context as DataTableContextValue<T>;
};
