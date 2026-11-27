/* eslint-disable @typescript-eslint/no-explicit-any */
import { BUILT_IN_ROLES } from "../../../../../constants";
import { Formik, Form } from "formik";
import { UserCog } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import TextArea from "../../../../../components/shared/TextArea";
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

  const isBuiltIn = editMode && BUILT_IN_ROLES.includes(roleData?.role_name);

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
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <UserCog size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Staff Role Definition
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Create or update a staff role. Permissions can be attached in the
                Role Permissions tab.
              </p>
            </div>
          </div>

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
              placeholder="e.g., Technical Supervisor"
              disabled={isBuiltIn}
              hint={
                isBuiltIn
                  ? "Built-in system roles cannot be renamed"
                  : undefined
              }
              required
            />

            <TextArea
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
              placeholder="Describe the responsibilities and scope of this role..."
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
              className="min-w-[150px]"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Save Role"
                  : "Create Role"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RolesForm;
