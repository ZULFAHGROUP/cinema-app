/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MoreVertical, Edit, Trash2, Plus, Percent } from "lucide-react";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import VATConfigForm from "./components/VATConfigForm";
import {
  deleteVatConfig,
  getAllVatConfigs,
} from "../../../../store/slices/vatConfig";
import Loader from "../../../../components/shared/Loader";
import { formatUserLabel } from "../../../../utils";

const VATConfig = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { vatConfigs, vatLoading, page, limit, total } = useAppSelector(
    (state) => state.vatConfig
  );

  useEffect(() => {
    dispatch(getAllVatConfigs({ page, limit })).unwrap();
  }, [dispatch, page, limit]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteVatConfig(selectedItem?.vat_config_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllVatConfigs({ page, limit })).unwrap();
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting VAT config");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Tax Rule Name",
      dataIndex: "name",
      key: "name",
      render: (val: string) => (
        <span className="font-bold text-stone-900">{formatUserLabel(val)}</span>
      ),
    },
    {
      title: "Tax Rate",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#fff8ea] border border-[#c77e3b]/30 text-[#754f2c] font-extrabold text-xs">
          {((Number(rate) || 0) * 100).toFixed(2)}% ({rate})
        </span>
      ),
    },
    {
      title: "Scope",
      dataIndex: "is_global",
      key: "is_global",
      render: (val: boolean) =>
        val ? (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            Global
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
            Branch
          </span>
        ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: boolean) =>
        val ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-xs font-semibold">
            Inactive
          </span>
        ),
    },
    {
      title: "Effective From",
      dataIndex: "effective_from",
      key: "effective_from",
      render: (date: string) => (
        <span className="text-xs font-medium text-stone-600">
          {date ? new Date(date).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit VAT Rule",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete VAT Rule",
                danger: true,
                icon: <Trash2 className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setShowDeleteModal(true);
                },
              },
            ],
          }}
          trigger={["click"]}
        >
          <button
            type="button"
            className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    dispatch(
      getAllVatConfigs({
        page: pagination.current,
        limit: pagination.pageSize,
      })
    ).unwrap();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              VAT & Tax Configuration
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage Value Added Tax rates and effective dates applied to ticket
              and concession orders
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Add VAT Rule"
          onClick={() => {
            setEditMode(false);
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        />
      </div>

      {vatLoading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={vatConfigs || []}
          columns={columns}
          title={`VAT Configurations (${total || vatConfigs?.length || 0})`}
          showPagination={true}
          searchField={["name"]}
          paginationMode="backend"
          paginationProps={{
            total,
            current: page,
            pageSize: limit,
          }}
          onTableChange={handleTableChange}
        />
      )}

      <DisplayModal
        open={showFormModal}
        title={editMode ? "Edit VAT Config" : "Add VAT Config"}
        onClose={() => setShowFormModal(false)}
      >
        <VATConfigForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          vatData={selectedItem}
        />
      </DisplayModal>

      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this VAT config: ${selectedItem?.name}?`}
      />
    </div>
  );
};

export default VATConfig;
