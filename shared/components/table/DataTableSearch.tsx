"use client";
import { useDataTableContext, Input, useDebounce } from "@/shared";
import { SearchIcon } from "lucide-react";
import { useEffect } from "react";

const DataTableSearch = () => {
  const { search, setSearch, setDebouncedSearch } = useDataTableContext();
  const debouncedSearch = useDebounce(search, 500);

  // Update the debounced search in context when it changes
  useEffect(() => {
    setDebouncedSearch(debouncedSearch);
  }, [debouncedSearch, setDebouncedSearch]);

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجوی نام یا نماد"
        icon={<SearchIcon className="w-6 h-6 text-text-200" />}
      />
    </div>
  );
};

export default DataTableSearch;
