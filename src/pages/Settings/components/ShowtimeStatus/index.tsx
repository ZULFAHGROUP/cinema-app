/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/shared/Button";
import { MoreVertical, Edit, Trash2, Plus, Clock } from "lucide-react";
import { Dropdown } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  deleteShowtimeStatus,
  getAllShowtimeStatuses,
} from "../../../../store/slices/showtimeStatus";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import { toast } from "react-toastify";
import ShowtimeStatusForm from "./components/ShowtimeStatusForm";
import ReusableTable from "../../../../components/shared/Table";
import Loader from "../../../../components/shared/Loader";

const ShowtimeStatus = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { statuses, loading, page, limit, total } = useAppSelector(
    (state) => state.showtimeStatus
  );

  useEffect(() => {
    dispatch(getAllShowtimeStatuses({ page, limit }));
  }, [dispatch, page, limit]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteShowtimeStatus(selectedItem.showtime_status_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllShowtimeStatuses({ page, limit }));
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting status");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Status Label",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
                label: "Edit Status",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete Status",
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
      getAllShowtimeStatuses({
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
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              Showtime Lifecycle Statuses
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Status badges (Scheduled, Now Showing, Sold Out) used on screening
              timetables
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Add Status"
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
          data={statuses || []}
          columns={columns}
          title={`Showtime Statuses (${total || statuses?.length || 0})`}
          searchField={["name"]}
          excludeColumns={["showtime_status_id"]}
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
        title={editMode ? "Edit Showtime Status" : "Add Showtime Status"}
        onClose={() => setShowFormModal(false)}
      >
        <ShowtimeStatusForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          statusData={selectedItem}
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

export default ShowtimeStatus;
