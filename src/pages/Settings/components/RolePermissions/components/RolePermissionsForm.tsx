/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
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

const RolePermissionsForm = ({
  onCancel,
}: RolePermissionsFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.rolePermission);
  
  const { roles } = useAppSelector((state) => state.role);
  const [permissions, setPermissions] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getAllRoles({ page: 1, limit: 50 }));
  }, [dispatch]);

  // The API returns at most 50 per page and there are more permissions than that.
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
        setFieldValue
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Select
              label="Select Role"
              name="role_id"
              options={roles.map((role: any) => ({
                label: role.role_name,
                value: role.role_id,
              }))}
              value={values.role_id}
              onChange={(value: any) => setFieldValue("role_id", value)}
              error={touched.role_id && typeof errors.role_id === "string" ? errors.role_id : undefined}
              required
            />

            <Select
              label="Select Permission"
              name="permission_id"
              options={permissions.map((p: any) => ({
                label: formatUserLabel(p.permission_name),
                value: p.permission_id,
              }))}
              value={values.permission_id}
              onChange={(value: any) => setFieldValue("permission_id", value)}
              error={touched.permission_id && typeof errors.permission_id === "string" ? errors.permission_id : undefined}
              required
              // mode="multiple"
            />
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={isSubmitting ? "Assigning..." : "Assign Permission"}
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

export default RolePermissionsForm;
