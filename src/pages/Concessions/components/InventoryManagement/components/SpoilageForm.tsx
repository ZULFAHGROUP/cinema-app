/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import { AlertTriangle } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import TextArea from "../../../../../components/shared/TextArea";
import Button from "../../../../../components/shared/Button";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import {
  recordSpoilage,
  getAllInventories,
} from "../../../../../store/slices/inventory";
import { toast } from "react-toastify";
import { useState } from "react";
import { newIdempotencyKey } from "../../../../../services/httpClient";
import { inventoryOperationSchema } from "../../../../../validations";

interface SpoilageFormProps {
  onCancel: () => void;
  inventoryId: string;
  productName: string;
  currentStock: number;
  cinema_id?: any;
}

const SPOILAGE_PRESETS = [
  "Expired batch",
  "Damaged packaging",
  "Spilled during preparation",
];

const SpoilageForm = ({
  onCancel,
  inventoryId,
  productName,
  currentStock,
  cinema_id,
}: SpoilageFormProps) => {
  const dispatch = useAppDispatch();
  const [idempotencyKey] = useState(newIdempotencyKey);
  const { page, limit } = useAppSelector((state) => state.inventory);
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";

  const initialValues = {
    quantity: "",
    reason: "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      const response = await dispatch(
        recordSpoilage({
          id: inventoryId,
          idempotencyKey,
          data: {
            quantity: Number(values.quantity),
            reason: values.reason,
            cinema_id: cinema_id,
          },
        })
      ).unwrap();

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message || "Spoilage recorded successfully");
        await dispatch(
          getAllInventories({
            page,
            limit,
            cinema_id: isAdmin ? cinema_id : undefined,
          })
        );
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={inventoryOperationSchema}
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
        handleSubmit,
      }) => {
        const qty = Number(values.quantity) || 0;
        const remaining = Math.max(0, currentStock - qty);

        return (
          <Form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl bg-amber-50/90 border border-amber-200 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Record Spoilage / Wastage
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    {productName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold block">
                  Available Stock
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {currentStock} units
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Quantity Spoiled / Damaged"
                name="quantity"
                type="number"
                min={1}
                max={currentStock}
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.quantity && typeof errors.quantity === "string"
                    ? errors.quantity
                    : undefined
                }
                placeholder="e.g., 5"
                hint={
                  qty > 0
                    ? `Remaining stock after deduction: ${remaining} units`
                    : undefined
                }
                required
              />

              <div>
                <TextArea
                  label="Reason for Spoilage"
                  name="reason"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Expired batch, Damaged packaging..."
                  rows={3}
                  error={
                    touched.reason && typeof errors.reason === "string"
                      ? errors.reason
                      : undefined
                  }
                  required
                />
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] text-stone-400">Quick fill:</span>
                  {SPOILAGE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFieldValue("reason", preset)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-[#fff8ea] text-stone-600 hover:text-[#754f2c] border border-stone-200/80 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
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
                title={isSubmitting ? "Recording..." : "Record Spoilage"}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SpoilageForm;
