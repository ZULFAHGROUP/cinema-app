/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { Layers } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import TextArea from "../../../../../components/shared/TextArea";
import Button from "../../../../../components/shared/Button";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { productCatSchema } from "../../../../../validations";
import {
  createProductCategories,
  getAllProductCategories,
  updateProductCategories,
} from "../../../../../store/slices/productCat";

interface ProductCategoryFormProps {
  onCancel: () => void;
  editMode?: boolean;
  productCategoryData?: any;
}

const ProductCategoryForm = ({
  onCancel,
  editMode = false,
  productCategoryData,
}: ProductCategoryFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.productCat);
  const initialValues = {
    name: productCategoryData?.name || "",
    description: productCategoryData?.description || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      if (editMode && productCategoryData?.product_category_id) {
        response = await dispatch(
          updateProductCategories({
            id: productCategoryData.product_category_id,
            data: values,
          })
        ).unwrap();
      } else {
        response = await dispatch(createProductCategories(values)).unwrap();
      }
      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllProductCategories({ page, limit }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={productCatSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Concession Category
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Group concession items (e.g., Popcorn, Drinks, Combos) for faster
                POS filtering.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Category Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="e.g., Popcorn & Snacks"
              required
            />

            <TextArea
              label="Category Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && typeof errors.description === "string"
                  ? errors.description
                  : undefined
              }
              placeholder="Describe what products belong in this category..."
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-stone-200/80">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              title="Cancel"
            />
            <Button
              type="submit"
              className="min-w-[160px]"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Save Category"
                  : "Create Category"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductCategoryForm;
