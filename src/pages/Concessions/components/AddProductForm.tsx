/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  createProduct,
  getAllProducts,
  updateProduct,
} from "../../../store/slices/product";
import { getAllProductCategories } from "../../../store/slices/productCat";
import { getAllCinemas } from "../../../store/slices/cinema";
import { useEffect } from "react";
import { productSchema } from "../../../validations";

interface AddProductFormProps {
  onCancel: () => void;
  editMode?: boolean;
  productData?: any;
}

const AddProductForm = ({
  onCancel,
  editMode = false,
  productData,
}: AddProductFormProps) => {
  const dispatch = useAppDispatch();
  const { productCats, page, limit } = useAppSelector(
    (state) => state.productCat
  );
  const { productPage, productLimit } = useAppSelector(
    (state) => state.product
  );
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { user } = useAppSelector((state) => state.accounts.data);

  // Determine if user is admin (adjust role check as needed)
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const userCinemaId = user?.cinema_id;

  useEffect(() => {
    dispatch(getAllProductCategories({ page, limit: 100 }));
    if (isAdmin) {
      dispatch(getAllCinemas({ page: 1, limit: 100 }));
    }
  }, [dispatch, page, limit, isAdmin]);

  const initialValues = {
    name: productData?.name || "",
    product_category_id: productData?.product_category_id || "",
    cinema_id: productData?.cinema_id || (isAdmin ? "" : userCinemaId || ""),
    price: productData?.price || "",
    product_image: "",
    description: productData?.description || "",
  };

  console.log("cinemas", allCinemas);
  const cinemas = [...(allCinemas || [])]
    ?.sort((a: any, b: any) => a.name.localeCompare(b.name))
    ?.map((cinema: { cinema_id: string; name: string }) => ({
      label: cinema.name,
      value: cinema.cinema_id,
    }));
  console.log("all cinemas", cinemas);

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;

      // Convert file
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      if (editMode && productData?.id) {
        response = await dispatch(
          updateProduct({
            id: productData.id,
            data: formData,
          })
        ).unwrap();
      } else {
        response = await dispatch(createProduct(formData)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(
          getAllProducts({ page: productPage, limit: productLimit })
        );
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting product", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={productSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Product Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.name && typeof errors.name === "string"
                    ? errors.name
                    : undefined
                }
                placeholder="Large Popcorn"
                required
              />

              <ReusableSelect
                label="Product Category"
                name="product_category_id"
                value={values.product_category_id}
                onChange={(value) =>
                  setFieldValue("product_category_id", value)
                }
                options={productCats?.map((cat: any) => ({
                  label: cat.name,
                  value: cat.product_category_id,
                }))}
                defaultOption="Select category"
                error={
                  touched.product_category_id &&
                  typeof errors.product_category_id === "string"
                    ? errors.product_category_id
                    : undefined
                }
                required
              />
            </div>

            {/* Cinema Selection - Only for Admin */}
            {isAdmin && (
              <div className="grid grid-cols-1 gap-4">
                <ReusableSelect
                  label="Cinema Location"
                  name="cinema_id"
                  value={values.cinema_id}
                  onChange={(value) => setFieldValue("cinema_id", value)}
                  options={cinemas}
                  defaultOption="Select cinema"
                  error={
                    touched.cinema_id && typeof errors.cinema_id === "string"
                      ? errors.cinema_id
                      : undefined
                  }
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sale Price"
                name="price"
                type="number"
                step="0.01"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.price && typeof errors.price === "string"
                    ? errors.price
                    : undefined
                }
                placeholder="8.99"
                required
              />

              <Input
                label="Product Image"
                name="product_image"
                // type="file"
                // onChange={(e) =>
                //   setFieldValue("product_image", e.currentTarget.files?.[0])
                // }
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.product_image &&
                  typeof errors.product_image === "string"
                    ? errors.product_image
                    : undefined
                }
                required
              />
            </div>

            <div>
              <label className="block font-medium md:text-lg mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Product description..."
                rows={3}
                className={`w-full p-2 border rounded-md ${
                  touched.description && errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.description && errors.description && (
                <p className="text-sm text-red-500 italic mt-1">
                  {errors.description === "string"
                    ? errors.description
                    : undefined}
                </p>
              )}
            </div>
          </div>

          {/* FOOTER ACTIONS */}
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
                  ? "Update Product"
                  : "Add Product"
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

export default AddProductForm;
