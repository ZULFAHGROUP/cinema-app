/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../store/hook";
import { createStaff, getGeneralStaff, getManagers, getPosCashiers, updateStaff } from "../../../store/slices/staff";

interface StaffData {
  id?: string;
  surname: string;
  other_names: string;
  email: string;
  phone: string;
  role_name: string;
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
  ?.filter(
    (role) => role.role_name?.toLowerCase() !== "customer"
  ).map((role) => ({
    label: role.role_name,
    value: role.role_name,
  }));


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
    role_name: staffData?.role_name || "",
  };

  const handleSubmit = async (values: any, { resetForm }: { resetForm: () => void }) => {
    try {
      const payload = { ...values };
let response
      // Remove password on edit if empty
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      if (isEdit) {
       response = await dispatch(
          updateStaff({ id: staffData!.id!, data: payload })
        ).unwrap();
      } else {
        response = await dispatch(createStaff(payload)).unwrap();
      }

if(response.code === 200 || response.code === 201){
          toast.success(response.message || (!isEdit ? "Staff added successfully" : "Staff updated successfully"));
  dispatch(getManagers({ page: 1, limit: 100 }));
    dispatch(getPosCashiers({ page: 1, limit: 100 }));
    dispatch(getGeneralStaff({ page: 1, limit: 100 }));
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
        <Form>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Surname"
              name="surname"
              value={values.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.surname && errors.surname ? errors.surname : ""}
              required
              placeholder="John"
            />

            <Input
              label="Other Names"
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
              placeholder="Doe"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email ? errors.email : ""}
              required
              placeholder="johndoe@example.com"
            />

            <Input
              label="Phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone ? errors.phone : ""}
              required
              placeholder="08110999001"
            />

            <ReusableSelect
              label="Role"
              name="role_name"
              value={values.role_name}
              onChange={(value) => setFieldValue("role_name", value)}
              options={roleOptions}
              defaultOption="Select role"
              error={
                touched.role_name && errors.role_name ? errors.role_name : ""
              }
              required
            />

            {!isEdit && (
              <Input
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.password && errors.password ? errors.password : ""
                }
                required
                placeholder="***********"
              />
            )}
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={
                isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Staff"
                  : "Add Staff"
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

export default AddStaffForm;
