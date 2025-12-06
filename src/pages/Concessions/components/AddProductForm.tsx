// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import Input from "../../../components/shared/Input";
// import Button from "../../../components/shared/Button";
// import ReusableSelect from "../../../components/shared/Select";
// import { useAppDispatch, useAppSelector } from "../../../store/hook";
// import { getAllProductCategories } from "../../../store/slices/productCat";
// import { useEffect } from "react";
// import {
//   createProduct,
//   getAllProducts,
//   updateProduct,
// } from "../../../store/slices/product";

// const validationSchema = Yup.object({
//   name: Yup.string()
//     .required("Product name is required")
//     .min(2, "Product name must be at least 2 characters"),
//   product_category_id: Yup.string().required("Category is required"),
//   price: Yup.number()
//     .required("Sale price is required")
//     .min(0.01, "Price must be greater than 0")
//     .max(1000, "Price cannot exceed $1000"),
//   product_image: Yup.string().required("Product image is required"),
//   // cost: Yup.number()
//   //   .required("Cost price is required")
//   //   .min(0.01, "Cost must be greater than 0")
//   //   .max(1000, "Cost cannot exceed $1000"),
//   // stock: Yup.number()
//   //   .required("Initial stock is required")
//   //   .min(0, "Stock cannot be negative")
//   //   .integer("Stock must be a whole number"),
//   // minStock: Yup.number()
//   //   .required("Minimum stock is required")
//   //   .min(0, "Minimum stock cannot be negative")
//   //   .integer("Minimum stock must be a whole number"),
//   // supplier: Yup.string().required("Supplier is required"),
//   description: Yup.string(),
// });

// interface AddProductFormProps {
//   // suppliers: any[];
//   onCancel: () => void;
// }

// const AddProductForm = ({
//   // suppliers,
//   onCancel,
// }: AddProductFormProps) => {
//   // const categoryOptions = [
//   //   { value: "Snacks", label: "Snacks" },
//   //   { value: "Beverages", label: "Beverages" },
//   //   { value: "Candy", label: "Candy" },
//   //   { value: "Merchandise", label: "Merchandise" },
//   // ];
//   const dispatch = useAppDispatch();
//   const { productCats, page, limit } = useAppSelector(
//     (state) => state.productCat
//   );

//   useEffect(() => {
//     dispatch(getAllProductCategories({ page, limit: 100 })).unwrap();
//   }, [dispatch, page, limit]);
//   // const supplierOptions = suppliers.map((supplier) => ({
//   //   value: supplier.name,
//   //   label: supplier.name,
//   // }));

//   const initialValues = {
//     name: "",
//     product_category_id: "",
//     price: "",
//     product_image: "",
//     // cost: "",
//     // stock: "",
//     // minStock: "",
//     // supplier: "",
//     description: "",
//   };

//   async function handleSubmit(
//     values: any,
//     { resetForm }: { resetForm: () => void }
//   ) {
//     try {
//       let response;
//       if (editMode && productCategoryData?.product_category_id) {
//         response = await dispatch(
//           updateProduct({
//             id: productCategoryData.product_category_id,
//             data: values,
//           })
//         ).unwrap();
//       } else {
//         response = await dispatch(createProduct(values)).unwrap();
//       }
//       console.log("coming response", response);
//       if (response.code === 200 || response.code === 201) {
//         toast.success(response.message);
//         await dispatch(getAllProducts({ page, limit }));
//         resetForm();
//         onCancel();
//       }
//     } catch (error: any) {
//       console.error("Error submitting role form", error);
//       toast.error(error?.response?.message || "Something went wrong");
//     }
//   }

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values, { setSubmitting }) => {
//         onSubmit(values);
//         setSubmitting(false);
//       }}
//     >
//       {({
//         values,
//         errors,
//         touched,
//         handleChange,
//         handleBlur,
//         setFieldValue,
//         isSubmitting,
//         handleSubmit,
//       }) => (
//         <Form onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 label="Product Name"
//                 name="name"
//                 value={values.name}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.name && errors.name ? errors.name : ""}
//                 placeholder="Large Popcorn"
//                 required
//               />

//               <ReusableSelect
//                 label="Product Category"
//                 name="product_category_id"
//                 value={values.product_category_id}
//                 onChange={(value) => setFieldValue("category", value)}
//                 options={productCats}
//                 defaultOption="Select category"
//                 error={
//                   touched.product_category_id && errors.product_category_id
//                     ? errors.product_category_id
//                     : ""
//                 }
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Input
//                 label="Sale Price ($)"
//                 name="price"
//                 type="number"
//                 step="0.01"
//                 value={values.price}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.price && errors.price ? errors.price : ""}
//                 placeholder="8.99"
//                 required
//               />

//               <Input
//                 label="Product Image"
//                 name="product_image"
//                 type="file"
//                 value={values.product_image}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={
//                   touched.product_image && errors.product_image
//                     ? errors.product_image
//                     : ""
//                 }
//                 placeholder="2.50"
//                 required
//               />
//             </div>

//             {/* <div className="grid grid-cols-2 gap-4">
//               <Input
//                 label="Initial Stock"
//                 name="stock"
//                 type="number"
//                 value={values.stock}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.stock && errors.stock ? errors.stock : ""}
//                 placeholder="50"
//                 required
//               />

//               <Input
//                 label="Minimum Stock"
//                 name="minStock"
//                 type="number"
//                 value={values.minStock}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={
//                   touched.minStock && errors.minStock ? errors.minStock : ""
//                 }
//                 placeholder="20"
//                 required
//               />
//             </div>

//             <ReusableSelect
//               label="Supplier"
//               name="supplier"
//               value={values.supplier}
//               onChange={(value) => setFieldValue("supplier", value)}
//               options={supplierOptions}
//               defaultOption="Select supplier"
//               error={touched.supplier && errors.supplier ? errors.supplier : ""}
//               required
//             /> */}

//             <div>
//               <label className="block font-medium md:text-lg mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={values.description}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="Product description..."
//                 rows={3}
//                 className={`w-full p-2 border rounded-md ${
//                   touched.description && errors.description
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//               />
//               {touched.description && errors.description && (
//                 <p className="text-sm text-red-500 italic mt-1">
//                   {errors.description}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex gap-2 pt-6 border-t mt-6">
//             <Button
//               type="submit"
//               className="flex-1 rounded-md"
//               disabled={isSubmitting}
//               title={isSubmitting ? "Adding Product..." : "Add Product"}
//             />
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={isSubmitting}
//               title="Cancel"
//               className="rounded-md"
//             />
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddProductForm;

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

  useEffect(() => {
    dispatch(getAllProductCategories({ page, limit: 100 }));
  }, [dispatch, page, limit]);

  const initialValues = {
    name: productData?.name || "",
    product_category_id: productData?.product_category_id || "",
    price: productData?.price || "",
    product_image: "",
    description: productData?.description || "",
  };

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
