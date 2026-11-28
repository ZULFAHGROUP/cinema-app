/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MoreVertical, Edit, Trash2, Plus, ShieldAlert } from "lucide-react";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  deleteClassification,
  getAllClassifications,
} from "../../../../store/slices/classification";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import MovieClassificationForm from "./components/MovieClassificationForm";
import Loader from "../../../../components/shared/Loader";

const MovieClassification = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { classifications, loading, limit, page, total } = useAppSelector(
    (state) => state.classification
  );

  useEffect(() => {
    dispatch(getAllClassifications({ limit, page })).unwrap();
  }, [dispatch, limit, page]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteClassification(selectedItem?.movie_classification_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllClassifications({ limit, page })).unwrap();
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting classification");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Classification Rating",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-lg bg-[#fff8ea] border border-[#c77e3b]/30 text-[#754f2c] font-extrabold text-xs">
            {name}
          </span>
        </div>
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
                label: "Edit Rating",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete Rating",
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
      getAllClassifications({
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
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              Movie Age Classifications
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Age ratings (G, PG, PG-13, 18+) displayed on movie cards and
              tickets
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Add Classification"
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
          data={classifications || []}
          columns={columns}
          title={`Classifications (${total || classifications?.length || 0})`}
          searchField={["name"]}
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
        title={editMode ? "Edit Classification" : "Add Classification"}
        onClose={() => setShowFormModal(false)}
      >
        <MovieClassificationForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          classificationData={selectedItem}
        />
      </DisplayModal>

      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this classification: ${selectedItem?.name}?`}
      />
    </div>
  );
};

export default MovieClassification;
