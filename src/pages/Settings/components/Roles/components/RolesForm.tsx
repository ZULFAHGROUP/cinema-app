/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { roleSchema } from "../../../../../validations";
import {
  createRole,
  getAllRoles,
  updateRole,
} from "../../../../../store/slices/roles";

interface RolesFormProps {
  onCancel: () => void;
  editMode?: boolean;
  roleData?: any;
}

const RolesForm = ({
  onCancel,
  editMode = false,
  roleData,
}: RolesFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.role);
  const initialValues = {
    role_name: roleData?.role_name || "",
    description: roleData?.description || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      if (editMode && roleData?.role_id) {
        response = await dispatch(
          updateRole({
            id: roleData.role_id,
            data: values,
          })
        ).unwrap();
      } else {
        response = await dispatch(createRole(values)).unwrap();
      }
      console.log("coming response", response);
      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllRoles({ page, limit }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting role form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={roleSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Role Name"
              name="role_name"
              value={values.role_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.role_name && typeof errors.role_name === "string"
                  ? errors.role_name
                  : undefined
              }
              placeholder="Technical"
              required
            />

            <Input
              label="Role Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && typeof errors.description === "string"
                  ? errors.description
                  : undefined
              }
              placeholder="Full access control"
              required
            />
          </div>

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
                  ? "Update Role"
                  : "Add Role"
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

export default RolesForm;
