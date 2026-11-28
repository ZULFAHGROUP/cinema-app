/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MoreVertical, Edit, Trash2, Plus, Layers } from "lucide-react";
import { Dropdown } from "antd";
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
      toast.error(error?.response?.message || "Error deleting category");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <span className="inline-flex items-center gap-2 font-bold text-stone-900">
          <span className="w-2 h-2 rounded-full bg-[#c77e3b]" />
          {name}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc: string) => (
        <span className="text-xs text-stone-600">{desc || "—"}</span>
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
                label: "Edit Category",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete Category",
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
      getAllProductCategories({
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
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              Concession Product Categories
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Organize food, drinks, and merchandise into POS categories
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Add Category"
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
          title={`Product Categories (${total || productCats?.length || 0})`}
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
        title={editMode ? "Edit Product Category" : "Add Product Category"}
        onClose={() => setShowFormModal(false)}
      >
        <ProductCategoryForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          productCategoryData={selectedItem}
        />
      </DisplayModal>

      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this product category: ${selectedItem?.name}?`}
      />
    </div>
  );
};

export default ProductCategory;
