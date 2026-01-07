/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { permissionSchema } from "../../../../../validations";
import {
  createPermission,
  getAllPermissions,
  updatePermission,
} from "../../../../../store/slices/permissions";

interface PermissionsFormProps {
  onCancel: () => void;
  editMode?: boolean;
  permissionData?: any;
}

const PermissionsForm = ({
  onCancel,
  editMode = false,
  permissionData,
}: PermissionsFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.permission);
  const initialValues = {
    permission_name: permissionData?.permission_name || "",
    description: permissionData?.description || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response: any;
      if (editMode && permissionData?.permission_id) {
        response = await dispatch(
          updatePermission({
            id: permissionData.permission_id,
            data: values,
          })
        ).unwrap();
      } else {
        response = await dispatch(createPermission(values)).unwrap();
      }
      
      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllPermissions({ page, limit }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting permission form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={permissionSchema}
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
              label="Permission Name"
              name="permission_name"
              value={values.permission_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.permission_name && typeof errors.permission_name === "string"
                  ? errors.permission_name
                  : undefined
              }
              placeholder="can_view_dashboard"
              required
            />

            <Input
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && typeof errors.description === "string"
                  ? errors.description
                  : undefined
              }
              placeholder="Allows user to view dashboard"
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
                  ? "Update Permission"
                  : "Add Permission"
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

export default PermissionsForm;
