/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { KeyRound } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import TextArea from "../../../../../components/shared/TextArea";
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
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <KeyRound size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                System Permission Key
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Define a fine-grained capability identifier that can be granted
                to staff roles.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Permission Key / Name"
              name="permission_name"
              value={values.permission_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.permission_name &&
                typeof errors.permission_name === "string"
                  ? errors.permission_name
                  : undefined
              }
              placeholder="e.g., can_view_dashboard"
              hint="Use snake_case format for system permission identifiers"
              required
            />

            <TextArea
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
              placeholder="Explain what action this permission authorizes..."
              rows={3}
              required
            />
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
              className="min-w-[160px]"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Save Permission"
                  : "Add Permission"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PermissionsForm;
