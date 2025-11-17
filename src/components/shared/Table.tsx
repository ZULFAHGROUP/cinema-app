/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Table, TableProps } from "antd";
import Input from "./Input";
import { FileExcelOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import Button from "./Button";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

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
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = data.filter((item) =>
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
    render: (_: any, __: any, index: number) => index + 1,
  };

  const updatedColumns = [snColumn, ...(columns || [])];

  return (
    <div className="shadow-md bg-white flex flex-col gap-3 rounded-md p-4 w-full text-center">
      <div className="flex justify-between flex-wrap gap-4 items-center w-full mb-">
        {showSearch ? (
          <Input
            placeholder="Search here..."
            name="searchText"
            id="searchText"
            value={searchText}
            onChange={handleSearch}
            className=""
            conClassName="md:w-[30rem] flex-1"
          />
        ) : (
          <p>{tableText}</p>
        )}
        {pathLink && (
          <Link to={pathLink}>
            <Button
              title={pathText}
              className="rounded-md py-1"
              icon={<FaPlus />}
            />
          </Link>
        )}
      </div>

      {showPdfDownload && (
        <div className="flex gap-2 items-center mt-2">
          <Button
            icon={<FileExcelOutlined />}
            onClick={handleExport}
            type="button"
            className="py-1 px-2 rounded-md"
          />
          <p>Export to CSV</p>
        </div>
      )}
      {/* Table */}
      <div id="table-content">
        <Table
          columns={updatedColumns}
          dataSource={filteredData}
          bordered
          // pagination={paginationConfig}
          // pagination={
          //   showPagination
          //     ? {
          //         ...paginationProps,
          //         showSizeChanger: true,
          //         pageSizeOptions: ["10", "20", "50", "100"],
          //       }
          //     : false
          // }
          pagination={
            showPagination
              ? paginationMode === "backend"
                ? {
                    ...paginationProps,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50", "100"],
                  }
                : { paginationConfig }
              : false
          }
          // onChange={onTableChange}
          onChange={paginationMode === "backend" ? onTableChange : undefined}
          title={() => (
            <div
              className="bg-extra"
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                textAlign: "center",
                color: "#ffffff",
                padding: "8px",
                borderRadius: "5px 5px 0 0",
              }}
            >
              {title}
            </div>
          )}
          scroll={{ x: "max-content" }}
          style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
          className={`${onRowClick ? "cursor-pointer" : ""}`}
          onRow={handleRow}
        />
      </div>
    </div>
  );
};

export default ReusableTable;
