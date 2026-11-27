/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { UserCheck, Shield } from "lucide-react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../store/hook";
import {
  changeStaffRole,
  createStaff,
  getGeneralStaff,
  getManagers,
  getPosCashiers,
  updateStaff,
} from "../../../store/slices/staff";
import { BUILT_IN_ROLES } from "../../../constants";

interface StaffData {
  admin_id?: string;
  surname: string;
  other_names: string;
  email: string;
  phone: string;
  is_active?: boolean;
  roles?: { role_id: string; role_name: string }[];
}

interface AddStaffFormProps {
  roles: any[];
  staffData?: StaffData | null;
  onSuccess?: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const AddStaffForm = ({
  roles,
  staffData,
  onSuccess,
  onCancel,
  isEdit = false,
}: AddStaffFormProps) => {
  const dispatch = useAppDispatch();

  const roleOptions = roles
    ?.filter((role) => isEdit || BUILT_IN_ROLES.includes(role.role_name))
    .map((role) => ({
      label: role.role_name,
      value: role.role_name,
    }));
  const currentRoles = staffData?.roles || [];

  const validationSchema = Yup.object({
    surname: Yup.string().required("Surname is required"),
    other_names: Yup.string().required("Other names are required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role_name: Yup.string().required("Role is required"),
    password: isEdit
      ? Yup.string().notRequired()
      : Yup.string()
          .min(8, "Minimum 8 characters")
          .required("Password is required"),
  });

  const initialValues = {
    surname: staffData?.surname || "",
    other_names: staffData?.other_names || "",
    email: staffData?.email || "",
    phone: staffData?.phone || "",
    password: "",
    role_name: currentRoles[0]?.role_name || "",
    is_active: staffData?.is_active ?? true,
  };

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      let response;

      if (isEdit) {
        const { surname, other_names, phone, is_active, role_name } = values;
        response = await dispatch(
          updateStaff({
            id: staffData!.admin_id!,
            data: { surname, other_names, phone, is_active },
          })
        ).unwrap();

        const newRole = roles.find((role) => role.role_name === role_name);
        if (
          newRole &&
          !currentRoles.some((role) => role.role_id === newRole.role_id)
        ) {
          await dispatch(
            changeStaffRole({
              admin_id: staffData!.admin_id!,
              role_id: newRole.role_id,
              previous_role_ids: currentRoles.map((role) => role.role_id),
            })
          ).unwrap();
        }
      } else {
        const { surname, other_names, email, phone, password, role_name } =
          values;
        response = await dispatch(
          createStaff({
            surname,
            other_names,
            email,
            phone,
            password,
            role_name,
          })
        ).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(
          response.message ||
            (!isEdit ? "Staff added successfully" : "Staff updated successfully")
        );
        dispatch(getManagers({ page: 1, limit: 50 }));
        dispatch(getPosCashiers({ page: 1, limit: 50 }));
        dispatch(getGeneralStaff({ page: 1, limit: 50 }));
        resetForm();
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
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
      }) => (
        <Form className="space-y-5">
          {/* Personal Information Section */}
          <div className="space-y-3.5">
            <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 px-3.5 py-2 flex items-center gap-2">
              <UserCheck size={15} className="text-[#c77e3b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Personal & Contact Information
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Surname"
                name="surname"
                value={values.surname}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.surname && errors.surname ? errors.surname : ""}
                required
                placeholder="e.g., Doe"
              />

              <Input
                label="First & Other Names"
                name="other_names"
                value={values.other_names}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.other_names && errors.other_names
                    ? errors.other_names
                    : ""
                }
                required
                placeholder="e.g., John"
              />

              <Input
                label="Work Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email ? errors.email : ""}
                disabled={isEdit}
                required
                placeholder="johndoe@cinema.com"
                hint={
                  isEdit ? "Email address cannot be changed" : "Used for login"
                }
              />

              <Input
                label="Phone Number"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone ? errors.phone : ""}
                required
                placeholder="08110999001"
              />
            </div>
          </div>

          {/* Role & Credentials Section */}
          <div className="space-y-3.5">
            <div className="rounded-xl bg-stone-100/80 border border-stone-200/80 px-3.5 py-2 flex items-center gap-2">
              <Shield size={15} className="text-[#754f2c]" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Role & Account Access
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReusableSelect
                label="Assigned Role"
                name="role_name"
                value={values.role_name}
                onChange={(value) => setFieldValue("role_name", value)}
                options={roleOptions}
                defaultOption="Select staff role"
                error={
                  touched.role_name && errors.role_name ? errors.role_name : ""
                }
                required
              />

              {isEdit ? (
                <ReusableSelect
                  label="Account Status"
                  name="is_active"
                  value={values.is_active ? "active" : "inactive"}
                  onChange={(value) =>
                    setFieldValue("is_active", value === "active")
                  }
                  options={[
                    { label: "Active (Can sign in)", value: "active" },
                    { label: "Deactivated (Suspended)", value: "inactive" },
                  ]}
                  showSearch={false}
                />
              ) : (
                <Input
                  label="Temporary Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.password && errors.password ? errors.password : ""
                  }
                  required
                  placeholder="••••••••••••"
                  hint="Minimum 8 characters"
                />
              )}
            </div>
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
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Save Staff Changes"
                  : "Create Staff Account"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddStaffForm;
