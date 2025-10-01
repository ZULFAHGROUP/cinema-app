/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Product name must be at least 2 characters"),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .required("Sale price is required")
    .min(0.01, "Price must be greater than 0")
    .max(1000, "Price cannot exceed $1000"),
  cost: Yup.number()
    .required("Cost price is required")
    .min(0.01, "Cost must be greater than 0")
    .max(1000, "Cost cannot exceed $1000"),
  stock: Yup.number()
    .required("Initial stock is required")
    .min(0, "Stock cannot be negative")
    .integer("Stock must be a whole number"),
  minStock: Yup.number()
    .required("Minimum stock is required")
    .min(0, "Minimum stock cannot be negative")
    .integer("Minimum stock must be a whole number"),
  supplier: Yup.string().required("Supplier is required"),
  description: Yup.string(),
});

interface AddProductFormProps {
  suppliers: any[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddProductForm = ({
  suppliers,
  onSubmit,
  onCancel,
}: AddProductFormProps) => {
  const categoryOptions = [
    { value: "Snacks", label: "Snacks" },
    { value: "Beverages", label: "Beverages" },
    { value: "Candy", label: "Candy" },
    { value: "Merchandise", label: "Merchandise" },
  ];

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.name,
    label: supplier.name,
  }));

  const initialValues = {
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    supplier: "",
    description: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
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
                error={touched.name && errors.name ? errors.name : ""}
                placeholder="Large Popcorn"
                required
              />

              <ReusableSelect
                label="Category"
                name="category"
                value={values.category}
                onChange={(value) => setFieldValue("category", value)}
                options={categoryOptions}
                defaultOption="Select category"
                error={
                  touched.category && errors.category ? errors.category : ""
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sale Price ($)"
                name="price"
                type="number"
                step="0.01"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.price && errors.price ? errors.price : ""}
                placeholder="8.99"
                required
              />

              <Input
                label="Cost Price ($)"
                name="cost"
                type="number"
                step="0.01"
                value={values.cost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cost && errors.cost ? errors.cost : ""}
                placeholder="2.50"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Initial Stock"
                name="stock"
                type="number"
                value={values.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.stock && errors.stock ? errors.stock : ""}
                placeholder="50"
                required
              />

              <Input
                label="Minimum Stock"
                name="minStock"
                type="number"
                value={values.minStock}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.minStock && errors.minStock ? errors.minStock : ""
                }
                placeholder="20"
                required
              />
            </div>

            <ReusableSelect
              label="Supplier"
              name="supplier"
              value={values.supplier}
              onChange={(value) => setFieldValue("supplier", value)}
              options={supplierOptions}
              defaultOption="Select supplier"
              error={touched.supplier && errors.supplier ? errors.supplier : ""}
              required
            />

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
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Adding Product..." : "Add Product"}
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
