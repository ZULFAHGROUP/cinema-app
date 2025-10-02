/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { Checkbox } from "antd";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Role name is required")
    .min(2, "Role name must be at least 2 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  level: Yup.string().required("Access level is required"),
  permissions: Yup.array()
    .min(1, "At least one permission is required")
    .required("Permissions are required"),
});

interface AddRoleFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddRoleForm = ({ onSubmit, onCancel }: AddRoleFormProps) => {
  const levelOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Supervisor", label: "Supervisor" },
    { value: "Staff", label: "Staff" },
    { value: "Technical", label: "Technical" },
  ];

  const permissionOptions = [
    { label: "All Access", value: "all" },
    { label: "Staff Management", value: "staff" },
    { label: "Reports & Analytics", value: "reports" },
    { label: "Ticket Sales", value: "tickets" },
    { label: "Concessions", value: "concessions" },
    { label: "Movies Management", value: "movies" },
    { label: "Theater Operations", value: "theater" },
    { label: "Technical Systems", value: "technical" },
    { label: "Customer Management", value: "customers" },
  ];

  const initialValues = {
    name: "",
    description: "",
    level: "",
    permissions: [],
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
              label="Role Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name ? errors.name : ""}
              placeholder="Concession Manager"
              required
            />

            <Input
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && errors.description
                  ? errors.description
                  : ""
              }
              placeholder="Manages concession operations"
              required
            />

            <ReusableSelect
              label="Access Level"
              name="level"
              value={values.level}
              onChange={(value) => setFieldValue("level", value)}
              options={levelOptions}
              defaultOption="Select level"
              error={touched.level && errors.level ? errors.level : ""}
              required
            />

            <div>
              <label className="block font-medium md:text-lg mb-2">
                Permissions <span className="text-red-500">*</span>
              </label>
              <div className="border rounded-md p-4 space-y-2">
                <Checkbox.Group
                  value={values.permissions}
                  onChange={(checkedValues) =>
                    setFieldValue("permissions", checkedValues)
                  }
                >
                  <div className="grid grid-cols-2 gap-2">
                    {permissionOptions.map((permission) => (
                      <Checkbox
                        key={permission.value}
                        value={permission.value}
                        className="font-serif"
                      >
                        {permission.label}
                      </Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              </div>
              {touched.permissions && errors.permissions && (
                <p className="text-sm text-red-500 italic mt-1">
                  {errors.permissions}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Creating Role..." : "Create Role"}
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

export default AddRoleForm;
