/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, TableProps } from "antd";
import Input from "./Input";
import { FileExcelOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import Button from "./Button";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Search } from "lucide-react";

interface ReusableTableProps<T> {
  data: T[];
  columns: TableProps<T>["columns"];
  title?: string;
  showPagination?: boolean;
  searchField?: string | string[];
  showSearch?: boolean;
  pathText?: string;
  onRowClick?: (record: T) => void;
  excludeColumns?: string[];
  tableText?: string;
  pathLink?: string;
  showPdfDownload?: boolean;
  paginationProps?: any;
  onTableChange?: (pagination: any) => void;
  paginationMode?: "frontend" | "backend";
}

type TablePaginationPosition =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

const ReusableTable = <T extends Record<string, any>>({
  data,
  columns,
  title = "Order History",
  showPagination = false,
  searchField = "",
  showSearch = true,
  onRowClick,
  excludeColumns = [],
  tableText = "",
  pathLink,
  pathText = "Create New",
  showPdfDownload = false,
  paginationProps,
  onTableChange,
  paginationMode,
}: ReusableTableProps<T>) => {
  const safeData = Array.isArray(data) ? data : [];
  const [filteredData, setFilteredData] = useState<T[]>(safeData);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    setFilteredData(Array.isArray(data) ? data : []);
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = safeData.filter((item) =>
      Array.isArray(searchField)
        ? searchField.some((field) =>
            String(item[field] || "")
              .toLowerCase()
              .includes(value)
          )
        : String(item[searchField] || "")
            .toLowerCase()
            .includes(value)
    );

    setFilteredData(filtered);
  };

  // Pagination settings
  const paginationConfig = showPagination
    ? {
        pageSize: 10,
        showSizeChanger: false,
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        position: ["bottomCenter"] as TablePaginationPosition[],
        hideOnSinglePage: true,
      }
    : false;

  const handleRow = (record: T) => {
    return {
      onClick: () => {
        if (onRowClick) {
          onRowClick(record);
        }
      },
    };
  };

  const handleExport = () => {
    const exportData = filteredData.map((item) => {
      return Object.fromEntries(
        Object.entries(item).filter(([key]) => !excludeColumns.includes(key))
      );
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");
    XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_")}.xlsx`);
  };

  const snColumn = {
    title: "S/N",
    dataIndex: "sn",
    key: "sn",
    width: 64,
    render: (_: any, __: any, index: number) => (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#fff8ea] text-[#754f2c] text-xs font-semibold">
        {index + 1}
      </span>
    ),
  };

  const updatedColumns = [snColumn, ...(columns || [])];

  return (
    <div className="bg-white rounded-2xl border border-[#c77e3b]/15 shadow-[0_4px_20px_-4px_rgba(117,79,44,0.06)] overflow-hidden w-full">
      {/* Modern Table Header Bar */}
      <div className="px-6 py-4 border-b border-[#c77e3b]/10 bg-gradient-to-r from-[#fff8ea]/70 via-white to-[#fff8ea]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#c77e3b] to-[#5480c7]" />
          <div>
            <h3 className="text-base font-bold text-stone-900">{title}</h3>
            {tableText && <p className="text-xs text-stone-500 mt-0.5">{tableText}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showSearch && (
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search records..."
                name="searchText"
                id="searchText"
                value={searchText}
                onChange={handleSearch}
                prefix={<Search className="w-4 h-4 text-stone-400 mr-1" />}
              />
            </div>
          )}
          {showPdfDownload && (
            <Button
              icon={<FileExcelOutlined />}
              onClick={handleExport}
              type="button"
              variant="outline"
              size="xs"
              title="Export Excel"
            />
          )}
          {pathLink && (
            <Link to={pathLink}>
              <Button
                title={pathText}
                size="xs"
                icon={<FaPlus />}
              />
            </Link>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div id="table-content" className="p-2 sm:p-4">
        <Table
          columns={updatedColumns}
          dataSource={filteredData}
          bordered={false}
          pagination={
            showPagination
              ? paginationMode === "backend"
                ? {
                    ...paginationProps,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50", "100"],
                  }
                : paginationConfig
              : false
          }
          onChange={paginationMode === "backend" ? onTableChange : undefined}
          scroll={{ x: "max-content" }}
          className={`${onRowClick ? "cursor-pointer" : ""}`}
          onRow={handleRow}
        />
      </div>
    </div>
  );
};

export default ReusableTable;
