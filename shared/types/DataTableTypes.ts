import React from "react";

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
