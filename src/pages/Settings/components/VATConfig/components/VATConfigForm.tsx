/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { Percent } from "lucide-react";
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
    effective_from: vatData?.effective_from
      ? new Date(vatData.effective_from).toISOString().split("T")[0]
      : "",
    effective_to: vatData?.effective_to
      ? new Date(vatData.effective_to).toISOString().split("T")[0]
      : "",
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
      };
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
        setFieldValue,
      }) => {
        const ratePercent = ((Number(values.rate) || 0) * 100).toFixed(2);
        return (
          <Form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
                  <Percent size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                    Tax & VAT Rule Configuration
                  </p>
                  <p className="text-xs text-stone-500">
                    Configure tax rates and effective date ranges applied at
                    checkout.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-white border border-[#c77e3b]/30 text-xs font-bold text-[#754f2c] shrink-0">
                {ratePercent}% VAT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="VAT Rule Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.name && typeof errors.name === "string"
                    ? errors.name
                    : undefined
                }
                placeholder="e.g., Standard VAT"
                required
              />

              <Input
                label="Decimal Rate (0 - 1)"
                name="rate"
                type="number"
                step="0.001"
                value={values.rate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.rate && typeof errors.rate === "string"
                    ? errors.rate
                    : undefined
                }
                placeholder="0.075"
                hint={`Equivalent to ${ratePercent}% tax`}
                required
              />

              {!editMode && (
                <Select
                  label="Global Scope (All Cinemas)"
                  name="is_global"
                  options={[
                    { label: "Yes — Apply Across All Cinemas", value: "true" },
                    { label: "No — Branch Specific", value: "false" },
                  ]}
                  value={String(values.is_global)}
                  onChange={(value: any) =>
                    setFieldValue("is_global", value === "true")
                  }
                  error={
                    touched.is_global && typeof errors.is_global === "string"
                      ? errors.is_global
                      : undefined
                  }
                  showSearch={false}
                  required
                />
              )}

              <Input
                label="Rule Priority"
                name="priority"
                type="number"
                value={values.priority}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.priority && typeof errors.priority === "string"
                    ? errors.priority
                    : undefined
                }
                placeholder="1"
                hint="Higher priority rule takes precedence"
                required
              />

              <Input
                label="Effective From"
                name="effective_from"
                type="date"
                value={values.effective_from}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.effective_from &&
                  typeof errors.effective_from === "string"
                    ? errors.effective_from
                    : undefined
                }
                required
                restrictPastDate={true}
              />

              <Input
                label="Effective Until (Optional)"
                name="effective_to"
                type="date"
                value={values.effective_to || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                restrictPastDate={true}
                hint="Leave blank if open-ended"
                error={
                  touched.effective_to &&
                  typeof errors.effective_to === "string"
                    ? errors.effective_to
                    : undefined
                }
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
                    ? "Save VAT Rule"
                    : "Create VAT Rule"
                }
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default VATConfigForm;
