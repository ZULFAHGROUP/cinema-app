/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Check, ShieldCheck } from "lucide-react";
import Input from "../../../components/shared/Input";
import TextArea from "../../../components/shared/TextArea";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";

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
    permissions: [] as string[],
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
      }) => {
        const togglePermission = (perm: string) => {
          const current = values.permissions || [];
          if (current.includes(perm)) {
            setFieldValue(
              "permissions",
              current.filter((p) => p !== perm)
            );
          } else {
            setFieldValue("permissions", [...current, perm]);
          }
        };

        return (
          <Form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                  Role & Access Template
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Define a role tier and select the functional modules this role
                  can access.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Role Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name ? errors.name : ""}
                placeholder="e.g., Concession Supervisor"
                required
              />

              <ReusableSelect
                label="Access Tier Level"
                name="level"
                value={values.level}
                onChange={(value) => setFieldValue("level", value)}
                options={levelOptions}
                defaultOption="Select access tier"
                error={touched.level && errors.level ? errors.level : ""}
                required
              />
            </div>

            <TextArea
              label="Role Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && errors.description
                  ? errors.description
                  : ""
              }
              placeholder="Briefly describe what responsibilities this role covers..."
              rows={2}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Module Permissions <span className="text-[#c77e3b]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {permissionOptions.map((permission) => {
                  const selected = values.permissions.includes(
                    permission.value
                  );
                  return (
                    <button
                      key={permission.value}
                      type="button"
                      onClick={() => togglePermission(permission.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                        selected
                          ? "bg-[#fff8ea] border-[#c77e3b] text-[#754f2c] shadow-xs"
                          : "bg-white border-stone-200 text-stone-600 hover:border-[#c77e3b]/40"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          selected
                            ? "bg-[#c77e3b] text-white"
                            : "border border-stone-300"
                        }`}
                      >
                        {selected && <Check size={11} />}
                      </span>
                      <span className="truncate">{permission.label}</span>
                    </button>
                  );
                })}
              </div>
              {touched.permissions && errors.permissions && (
                <p className="text-xs text-red-500 font-medium mt-1.5">
                  {errors.permissions as string}
                </p>
              )}
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
                title={isSubmitting ? "Creating Role..." : "Create Role"}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddRoleForm;
