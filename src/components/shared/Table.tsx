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
    width: 60,
    render: (_: any, __: any, index: number) => (
      <span className="text-xs font-semibold text-stone-400 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
    ),
  };

  const updatedColumns = [snColumn, ...(columns || [])];

  return (
    <div className="bg-white rounded-2xl border border-[#e6dfd3] shadow-[0_1px_2px_rgba(18,22,28,0.05)] overflow-hidden w-full">
      {/* Clean Flat Table Header Bar */}
      <div className="px-6 py-4 border-b border-[#e6dfd3] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#12161c] tracking-tight">
            {title}
          </h3>
          {tableText && (
            <p className="text-xs text-stone-500 mt-0.5">{tableText}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showSearch && (
            <div className="w-full md:w-64">
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
              <Button title={pathText} size="xs" icon={<FaPlus />} />
            </Link>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div id="table-content" className="p-2 md:p-3">
        <Table
          rowKey={(record: any, index) =>
            record.id ||
            record.order_id ||
            record.audit_id ||
            record.inventory_id ||
            record.price_rule_id ||
            record.movie_classification_id ||
            record.screen_type_id ||
            record.showtime_status_id ||
            record.role_id ||
            record.permission_id ||
            record.product_category_id ||
            record.vat_config_id ||
            record.admin_id ||
            record.user_id ||
            String(index)
          }
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
