/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  deleteSeatType,
  getAllSeatTypes,
} from "../../../../store/slices/seatType";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import SeatTypeForm from "./components/SeatTypeForm";

const SeatType = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { seatTypes, loading } = useAppSelector((state) => state.seatType);

  useEffect(() => {
    dispatch(getAllSeatTypes());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteSeatType(selectedItem?.seat_type_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllSeatTypes());
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting seat type");
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
        <div className="flex gap-2 justify-center">
          <Button
            variant="secondary"
            size="sm"
            title="Edit"
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
            title="Delete"
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Seat Types</h2>
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
        <p>Loading...</p>
      ) : (
        <ReusableTable
          data={seatTypes || []}
          columns={columns}
          title="Seat Types"
          searchField={["name", "description"]}
          excludeColumns={["seat_type_id"]}
        />
      )}

      {/* Add / Edit Modal */}
      <DisplayModal
        open={showFormModal}
        title={editMode ? "Edit Seat Type" : "Add Seat Type"}
        onClose={() => setShowFormModal(false)}
      >
        <SeatTypeForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          seatTypeData={selectedItem}
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

export default SeatType;
