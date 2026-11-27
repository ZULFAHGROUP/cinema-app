/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import { ClipboardCheck } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import TextArea from "../../../../../components/shared/TextArea";
import Button from "../../../../../components/shared/Button";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import {
  correctInventory,
  getAllInventories,
} from "../../../../../store/slices/inventory";
import { toast } from "react-toastify";
import { useState } from "react";
import { newIdempotencyKey } from "../../../../../services/httpClient";
import { inventoryOperationSchema } from "../../../../../validations";

interface CorrectionFormProps {
  onCancel: () => void;
  inventoryId: string;
  productName: string;
  currentStock: number;
  cinema_id: any;
}

const CORRECTION_PRESETS = [
  "Physical audit count discrepancy",
  "Data entry correction",
  "End-of-week stock reconciliation",
];

const CorrectionForm = ({
  onCancel,
  inventoryId,
  productName,
  currentStock,
  cinema_id,
}: CorrectionFormProps) => {
  const dispatch = useAppDispatch();
  const [idempotencyKey] = useState(newIdempotencyKey);
  const { page, limit } = useAppSelector((state) => state.inventory);
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";

  const initialValues = {
    quantity: currentStock.toString(),
    reason: "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      const response = await dispatch(
        correctInventory({
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
        toast.success(response.message || "Inventory corrected successfully");
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
        const diff = Number(values.quantity) - currentStock;
        return (
          <Form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl bg-[#fff8ea] border border-[#c77e3b]/30 p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                    Stock Count Reconciliation
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    {productName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-[#754f2c] font-semibold block">
                  System Stock
                </span>
                <span className="text-sm font-bold text-stone-900">
                  {currentStock} units
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <Input
                  label="Actual Physical Count (Units)"
                  name="quantity"
                  type="number"
                  min={0}
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.quantity && typeof errors.quantity === "string"
                      ? errors.quantity
                      : undefined
                  }
                  placeholder={currentStock.toString()}
                  conClassName="flex-1"
                  required
                />

                {values.quantity !== "" && diff !== 0 && (
                  <div
                    className={`px-3.5 py-2 rounded-xl border text-xs font-bold h-[38px] flex items-center shrink-0 ${
                      diff > 0
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}
                  >
                    {diff > 0 ? `+${diff}` : diff} units adjustment
                  </div>
                )}
              </div>

              <div>
                <TextArea
                  label="Reason for Correction"
                  name="reason"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Physical count discrepancy, Stock audit..."
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
                  {CORRECTION_PRESETS.map((preset) => (
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
                className="min-w-[160px]"
                disabled={isSubmitting}
                loading={isSubmitting}
                title={isSubmitting ? "Correcting..." : "Apply Correction"}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CorrectionForm;
