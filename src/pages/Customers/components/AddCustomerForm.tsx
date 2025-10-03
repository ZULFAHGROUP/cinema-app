/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { Checkbox } from "antd";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Format: (555) 123-4567"),
  joinDate: Yup.date()
    .required("Join date is required")
    .max(new Date(), "Join date cannot be in the future"),
  preferences: Yup.array()
    .min(1, "At least one preference is required")
    .required("Preferences are required"),
});

interface AddCustomerFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddCustomerForm = ({ onSubmit, onCancel }: AddCustomerFormProps) => {
  const preferenceOptions = [
    { label: "Action", value: "Action" },
    { label: "Comedy", value: "Comedy" },
    { label: "Drama", value: "Drama" },
    { label: "Horror", value: "Horror" },
    { label: "Romance", value: "Romance" },
    { label: "Sci-Fi", value: "Sci-Fi" },
    { label: "Thriller", value: "Thriller" },
    { label: "Adventure", value: "Adventure" },
  ];

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    preferences: [],
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
              label="Full Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name ? errors.name : ""}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email ? errors.email : ""}
              placeholder="john@example.com"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone ? errors.phone : ""}
              placeholder="(555) 123-4567"
              required
            />

            <Input
              label="Join Date"
              name="joinDate"
              type="date"
              value={values.joinDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.joinDate && errors.joinDate ? errors.joinDate : ""}
              required
            />

            <div>
              <label className="block font-medium md:text-lg mb-2">
                Movie Preferences <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-md p-4">
                <Checkbox.Group
                  value={values.preferences}
                  onChange={(checkedValues) =>
                    setFieldValue("preferences", checkedValues)
                  }
                >
                  <div className="grid grid-cols-2 gap-2">
                    {preferenceOptions.map((preference) => (
                      <Checkbox
                        key={preference.value}
                        value={preference.value}
                        className="font-serif"
                      >
                        {preference.label}
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </div>
              {touched.preferences && errors.preferences && (
                <p className="text-sm text-red-500 italic mt-1">
                  {errors.preferences}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Adding Customer..." : "Add Customer"}
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

export default AddCustomerForm;
