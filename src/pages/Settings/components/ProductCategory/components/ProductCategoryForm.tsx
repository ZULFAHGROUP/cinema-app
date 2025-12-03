/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../../../components/shared/Input";
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
      console.log("coming response", response);
      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllProductCategories({ page, limit }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting role form", error);
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
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Product Category Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="Snacks"
              required
            />

            <Input
              label="Role Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && typeof errors.description === "string"
                  ? errors.description
                  : undefined
              }
              placeholder="Yummy snacks"
              required
            />
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Update Product Cat."
                  : "Add Product Cat."
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              title="Cancel"
              className="rounded-md"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductCategoryForm;
