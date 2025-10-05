/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Content name is required")
    .min(3, "Name must be at least 3 characters"),
  type: Yup.string().required("Content type is required"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
});

interface AddContentFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddContentForm = ({ onSubmit, onCancel }: AddContentFormProps) => {
  const contentTypeOptions = [
    { value: "Movie Carousel", label: "Movie Carousel" },
    { value: "Menu Display", label: "Menu Display" },
    { value: "Advertisement", label: "Promotional" },
    { value: "Safety Display", label: "Information" },
  ];

  const initialValues = {
    name: "",
    type: "",
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
            <Input
              label="Content Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name ? errors.name : ""}
              placeholder="Enter content name"
              required
            />

            <ReusableSelect
              label="Content Type"
              name="type"
              value={values.type}
              onChange={(value) => setFieldValue("type", value)}
              options={contentTypeOptions}
              defaultOption="Select type"
              error={touched.type && errors.type ? errors.type : ""}
              required
            />

            <div>
              <label className="block font-medium md:text-lg mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Describe your content..."
                rows={4}
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
              title={isSubmitting ? "Creating Content..." : "Create Content"}
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

export default AddContentForm;
