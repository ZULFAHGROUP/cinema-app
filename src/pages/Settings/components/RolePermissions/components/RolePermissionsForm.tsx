/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { ShieldCheck } from "lucide-react";
import Button from "../../../../../components/shared/Button";
import Select from "../../../../../components/shared/Select";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { rolePermissionSchema } from "../../../../../validations";
import {
  createRolePermission,
  getAllRolePermissions,
} from "../../../../../store/slices/rolePermissions";
import { getAllRoles } from "../../../../../store/slices/roles";
import Permissions from "../../../../../services/network/permissions";
import { formatUserLabel } from "../../../../../utils";

interface RolePermissionsFormProps {
  onCancel: () => void;
}

const RolePermissionsForm = ({ onCancel }: RolePermissionsFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.rolePermission);

  const { roles } = useAppSelector((state) => state.role);
  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getAllRoles({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    const loadAllPermissions = async () => {
      const all: any[] = [];
      for (let page = 1; ; page++) {
        const response = await Permissions.allPermissions(page, 50);
        const { permissions: batch, pagination } = response.data.data;
        all.push(...batch);
        if (!pagination.hasNextPage) break;
      }
      setPermissions(all);
    };
    loadAllPermissions().catch((error: any) =>
      toast.error(error?.message || "Could not load permissions")
    );
  }, []);

  const initialValues = {
    role_id: "",
    permission_id: "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      const response = await dispatch(createRolePermission(values)).unwrap();

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllRolePermissions({ page, limit }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={rolePermissionSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Grant Role Capability
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Link a permission capability to a staff role to expand what members
                of that role can perform.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Select
              label="Target Role"
              name="role_id"
              defaultOption="Choose a staff role"
              options={roles.map((role: any) => ({
                label: role.role_name,
                value: role.role_id,
              }))}
              value={values.role_id}
              onChange={(value: any) => setFieldValue("role_id", value)}
              error={
                touched.role_id && typeof errors.role_id === "string"
                  ? errors.role_id
                  : undefined
              }
              required
            />

            <Select
              label="Permission to Grant"
              name="permission_id"
              defaultOption="Search and choose a permission"
              options={permissions.map((p: any) => ({
                label: formatUserLabel(p.permission_name),
                value: p.permission_id,
              }))}
              value={values.permission_id}
              onChange={(value: any) => setFieldValue("permission_id", value)}
              error={
                touched.permission_id &&
                typeof errors.permission_id === "string"
                  ? errors.permission_id
                  : undefined
              }
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
              title={isSubmitting ? "Assigning..." : "Assign Permission"}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default RolePermissionsForm;
