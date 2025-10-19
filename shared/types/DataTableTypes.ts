import React, { ReactNode } from "react";
import { CryptoCurrency } from "./ScraperTypes";

export interface DataTableContextValue<T extends Record<string, any>> {
  // Data
  data: T[];
  emptyText: string;
  visibleColumns: Column<T>[];
  actions: ActionButton<T>[];
  selectedRows: T[];

  // Search
  search: string;
  setSearch: (search: string) => void;
  debouncedSearch: string;
  setDebouncedSearch: (search: string) => void;

  // Configuration
  selectable: boolean;
  rowKey: string | ((record: T) => string);

  // Functions
  getRowKey: (record: T, index: number) => string;
  getResponsiveClasses: (column: Column<T>) => string;
  getActionResponsiveClasses: (action: ActionButton<T>) => string;
  shouldShowActionColumn: () => boolean;
  getActionColumnResponsiveClasses: () => string;
  handleSelectRow: (record: T, checked: boolean) => void;
  isRowSelected: (record: T) => boolean;
  onRowClick?: (record: T, index: number) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
}

export interface DataTableRowProps<T extends Record<string, any>> {
  record: T;
  index: number;
}

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  mobileWidth?: string | number;
  tabletWidth?: string | number;
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
  width?: string | number;
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
  loading?: boolean;
  emptyText?: string;
  className?: string;
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  actionColumnTitle?: string;
}

export interface DataTableProviderProps<T extends Record<string, any>> {
  children: ReactNode;
  value: DataTableContextValue<T>;
}

export interface CryptoMarketParams {
  vs_currency: string;
  order?: string;
  per_page?: number;
  page?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface APIEndpoint {
  name: string;
  priority: number;
  handler: (params: CryptoMarketParams) => Promise<CryptoCurrency[]>;
  timeout?: number;
}

export interface StoredCrypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: string;
  marketCap: string;
  totalVolume: string;
  priceChangePercentage24h: string;
  marketCapRank: number;
  lastUpdated: string;
  isCustom: boolean;
  description?: string;
  website?: string;
  twitter?: string;
  github?: string;
  createdAt: string;
}
