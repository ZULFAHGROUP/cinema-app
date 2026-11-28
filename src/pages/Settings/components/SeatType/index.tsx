/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MoreVertical, Edit, Trash2, Plus, MonitorPlay } from "lucide-react";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  deleteScreenType,
  getAllScreenTypes,
} from "../../../../store/slices/screenType";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import ScreenTypeForm from "./components/ScreenTypeForm";
import Loader from "../../../../components/shared/Loader";

const ScreenType = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { screenTypes, loading, page, limit, total } = useAppSelector(
    (state) => state.screenType
  );

  useEffect(() => {
    dispatch(getAllScreenTypes({ page, limit }));
  }, [dispatch, page, limit]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteScreenType(
          selectedItem?.screen_type_id || selectedItem?.seat_type_id
        )
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllScreenTypes({ page, limit }));
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting screen type");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Screen Experience Format",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#5480c7]/10 border border-[#5480c7]/25 text-[#5480c7] font-bold text-xs">
          <MonitorPlay className="w-3.5 h-3.5" />
          {name}
        </span>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) =>
        date ? (
          <span className="text-xs text-stone-500">
            {new Date(date).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-xs text-stone-400">—</span>
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
                label: "Edit Format",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete Format",
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
      getAllScreenTypes({
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
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              Auditorium Screen Formats
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Experience formats (Standard 2D, 3D, IMAX, VIP) assigned to
              auditoriums and price rules
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Add Screen Format"
          onClick={() => {
            setEditMode(false);
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        />
      </div>

      {loading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={screenTypes || []}
          columns={columns}
          title={`Screen Formats (${total || screenTypes?.length || 0})`}
          searchField={["name"]}
          excludeColumns={["seat_type_id"]}
          showPagination={true}
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
        title={editMode ? "Edit Screen Type" : "Add Screen Type"}
        onClose={() => setShowFormModal(false)}
      >
        <ScreenTypeForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          seatTypeData={selectedItem}
        />
      </DisplayModal>

      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        item={selectedItem?.name}
      />
    </div>
  );
};

export default ScreenType;
