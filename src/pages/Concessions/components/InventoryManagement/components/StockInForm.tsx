/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import { PackagePlus } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import TextArea from "../../../../../components/shared/TextArea";
import Button from "../../../../../components/shared/Button";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import {
  stockIn,
  getAllInventories,
} from "../../../../../store/slices/inventory";
import { toast } from "react-toastify";
import { useState } from "react";
import { newIdempotencyKey } from "../../../../../services/httpClient";
import { inventoryOperationSchema } from "../../../../../validations";

interface StockInFormProps {
  onCancel: () => void;
  inventoryId: string;
  productName: string;
  cinema_id?: any;
}

const REASON_PRESETS = [
  "Weekly supplier restock",
  "New shipment received",
  "Emergency replenishment",
];

const StockInForm = ({
  onCancel,
  inventoryId,
  productName,
  cinema_id,
}: StockInFormProps) => {
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
        stockIn({
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
        toast.success(response.message || "Stock added successfully");
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
      }) => (
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <PackagePlus size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Receiving Stock For
              </p>
              <p className="text-sm font-bold text-stone-900">{productName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Quantity Received (Units)"
              name="quantity"
              type="number"
              min={1}
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.quantity && typeof errors.quantity === "string"
                  ? errors.quantity
                  : undefined
              }
              placeholder="e.g., 100"
              required
            />

            <div>
              <TextArea
                label="Restock Note / Reason"
                name="reason"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., Weekly restock from supplier"
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
                {REASON_PRESETS.map((preset) => (
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
              className="min-w-[140px]"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={isSubmitting ? "Adding Stock..." : "Add Stock"}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StockInForm;
