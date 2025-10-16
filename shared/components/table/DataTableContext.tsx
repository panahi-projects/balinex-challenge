"use client";
import type { DataTableContextValue, DataTableProviderProps } from "@/shared";
import { createContext } from "react";

export const DataTableContext =
  createContext<DataTableContextValue<any> | null>(null);

export const DataTableProvider = <T extends Record<string, any>>({
  children,
  value,
}: DataTableProviderProps<T>) => {
  return (
    <DataTableContext.Provider value={value}>
      {children}
    </DataTableContext.Provider>
  );
};
