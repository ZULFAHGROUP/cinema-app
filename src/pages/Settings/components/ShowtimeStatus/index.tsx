/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/shared/Button";
import { Edit, Trash2, Plus } from "lucide-react";
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify">
          <Button
            variant="secondary"
            size="sm"
            icon={<Edit className="w-3 h-3" />}
            className="rounded-md"
            onClick={() => {
              setSelectedItem(record);
              setEditMode(true);
              setShowFormModal(true);
            }}
          />
          <Button
            variant="primary"
            size="sm"
            icon={<Trash2 className="w-3 h-3" />}
            className="rounded-md"
            onClick={() => {
              setSelectedItem(record);
              setShowDeleteModal(true);
            }}
          />
        </div>
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Showtime Statuses</h2>
        <Button
          className="rounded-md"
          icon={<Plus className="w-4 h-4" />}
          title="Add New"
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
          title="Showtime Status"
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

      {/* Add / Edit Modal */}
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

      {/* Delete Confirmation */}
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
