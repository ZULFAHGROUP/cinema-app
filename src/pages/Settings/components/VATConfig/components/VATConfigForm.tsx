/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import Select from "../../../../../components/shared/Select";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { vatConfigSchema } from "../../../../../validations";
import {
  createVatConfig,
  getAllVatConfigs,
  updateVatConfig,
} from "../../../../../store/slices/vatConfig";

interface VATConfigFormProps {
  onCancel: () => void;
  editMode?: boolean;
  vatData?: any;
}

const VATConfigForm = ({
  onCancel,
  editMode = false,
  vatData,
}: VATConfigFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.vatConfig);
  
  const initialValues = {
    name: vatData?.name || "",
    rate: vatData?.rate || 0.075,
    is_global: vatData?.is_global ?? false,
    priority: vatData?.priority || 1,
    effective_from: vatData?.effective_from ? new Date(vatData.effective_from).toISOString().split('T')[0] : "",
    effective_to: vatData?.effective_to ? new Date(vatData.effective_to).toISOString().split('T')[0] : "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response: any;
      const payload = {
          ...values,
          rate: Number(values.rate),
          priority: Number(values.priority),
          is_global: values.is_global === "true" || values.is_global === true,
          effective_to: values.effective_to || null,
      }
      if (editMode && vatData?.vat_config_id) {
        delete payload.is_global;
        response = await dispatch(
          updateVatConfig({
            id: vatData.vat_config_id,
            data: payload,
          })
        ).unwrap();
      } else {
        response = await dispatch(createVatConfig(payload)).unwrap();
      }
      
      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllVatConfigs({ page, limit }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting VAT config form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={vatConfigSchema}
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
        setFieldValue
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="VAT Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && typeof errors.name === "string" ? errors.name : undefined}
              placeholder="Standard VAT"
              required
            />

            <Input
              label="Rate (0-1)"
              name="rate"
              type="number"
              step="0.001"
              value={values.rate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.rate && typeof errors.rate === "string" ? errors.rate : undefined}
              placeholder="0.075"
              required
            />

{!editMode && <Select
              label="Is Global"
              name="is_global"
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              value={String(values.is_global)}
              onChange={(value: any) => setFieldValue("is_global", value === "true")}
              error={touched.is_global && typeof errors.is_global === "string" ? errors.is_global : undefined}
              required
            />}
            

            <Input
              label="Priority"
              name="priority"
              type="number"
              value={values.priority}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.priority && typeof errors.priority === "string" ? errors.priority : undefined}
              placeholder="1"
              required
            />

            <Input
              label="Effective From"
              name="effective_from"
              type="date"
              value={values.effective_from}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.effective_from && typeof errors.effective_from === "string" ? errors.effective_from : undefined}
              required 
              restrictPastDate={true}
            />

            <Input
              label="Effective To"
              name="effective_to"
              type="date"
              value={values.effective_to || ""}
              onChange={handleChange}
              onBlur={handleBlur} 
              restrictPastDate={true}
              error={touched.effective_to && typeof errors.effective_to === "string" ? errors.effective_to : undefined}
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
                  ? "Update VAT"
                  : "Add VAT"
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

export default VATConfigForm;
