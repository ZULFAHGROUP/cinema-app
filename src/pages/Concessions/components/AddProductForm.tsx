/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { ShoppingBag, Image as ImageIcon } from "lucide-react";
import Input from "../../../components/shared/Input";
import TextArea from "../../../components/shared/TextArea";
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
import { useEffect, useState } from "react";
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
  const [selectedCinema, setSelectedCinema] = useState<any>(null);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { user } = useAppSelector((state) => state.accounts.data);

  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";
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
    product_image: productData?.product_image || "",
    description: productData?.description || "",
  };

  const cinemas = [...(allCinemas || [])]
    ?.sort((a: any, b: any) => a.name.localeCompare(b.name))
    ?.map((cinema: { cinema_id: string; name: string }) => ({
      label: cinema.name,
      value: cinema.cinema_id,
    }));

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      const payload = {
        ...values,
        price: Number(values.price),
      };

      const productId = productData?.product_id || productData?.id;
      if (editMode && productId) {
        response = await dispatch(
          updateProduct({
            id: productId,
            data: payload,
          })
        ).unwrap();
      } else {
        response = await dispatch(createProduct(payload)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(
          getAllProducts({
            page: productPage,
            limit: productLimit,
            cinema_id: selectedCinema,
          })
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
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Concession Item Details
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure product name, category, pricing, and image for the
                Concessions POS catalog.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="e.g., Large Caramel Popcorn"
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

            {isAdmin && (
              <ReusableSelect
                label="Cinema Branch"
                name="cinema_id"
                value={values.cinema_id}
                onChange={(value) => {
                  setFieldValue("cinema_id", value);
                  setSelectedCinema(value);
                }}
                options={cinemas}
                defaultOption="Select cinema branch"
                error={
                  touched.cinema_id && typeof errors.cinema_id === "string"
                    ? errors.cinema_id
                    : undefined
                }
                required
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Sale Price (₦)"
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
                placeholder="e.g., 2500"
                prefix={
                  <span className="text-stone-400 font-semibold text-xs mr-1">
                    ₦
                  </span>
                }
                required
              />

              <Input
                label="Product Image URL"
                name="product_image"
                value={values.product_image}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://images.unsplash.com/..."
                prefix={<ImageIcon size={14} className="text-stone-400 mr-1" />}
                error={
                  touched.product_image &&
                  typeof errors.product_image === "string"
                    ? errors.product_image
                    : undefined
                }
                required
              />
            </div>

            <TextArea
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe portion size, ingredients, or combo items..."
              rows={3}
              error={
                touched.description && typeof errors.description === "string"
                  ? errors.description
                  : undefined
              }
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
              className="min-w-[150px]"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Save Changes"
                  : "Create Product"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddProductForm;
