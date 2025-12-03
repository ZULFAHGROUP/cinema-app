/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import Loader from "../../../../components/shared/Loader";
import ProductCategoryForm from "./components/ProductCategoryForm";
import {
  deleteProductCategories,
  getAllProductCategories,
} from "../../../../store/slices/productCat";

const ProductCategory = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { productCats, productCatLoading, page, limit, total } = useAppSelector(
    (state) => state.productCat
  );

  useEffect(() => {
    dispatch(getAllProductCategories({ page, limit })).unwrap();
  }, [dispatch, page, limit]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteProductCategories(selectedItem?.product_category_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllProductCategories({ page, limit })).unwrap();
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting classification");
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
        <div className="flex gap-2 justify-">
          <Button
            variant="secondary"
            size="sm"
            // title="Edit"
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
            // title="Delete"
            icon={<Trash2 className="w-3 h-3" />}
            className="rounded-md bg-red-700"
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
      getAllProductCategories({
        page: pagination.current,
        limit: pagination.pageSize,
      })
    ).unwrap();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Roles Settings</h2>
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

      {productCatLoading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={productCats || []}
          columns={columns}
          title="Roles"
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

      {/* Add / Edit Modal */}
      <DisplayModal
        open={showFormModal}
        title={editMode ? "Edit Role" : "Add Role"}
        onClose={() => setShowFormModal(false)}
      >
        <ProductCategoryForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          productCategoryData={selectedItem}
        />
      </DisplayModal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this product category, ${selectedItem?.name}`}
      />
    </div>
  );
};

export default ProductCategory;
