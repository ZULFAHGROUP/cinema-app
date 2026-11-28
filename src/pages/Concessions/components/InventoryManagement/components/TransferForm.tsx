/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import { ArrowRightLeft } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import TextArea from "../../../../../components/shared/TextArea";
import Button from "../../../../../components/shared/Button";
import ReusableSelect from "../../../../../components/shared/Select";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import {
  transferOut,
  getAllInventories,
} from "../../../../../store/slices/inventory";
import { toast } from "react-toastify";
import { transferOutSchema } from "../../../../../validations";
import { useEffect, useState } from "react";
import Inventory from "../../../../../services/network/inventory";
import { newIdempotencyKey } from "../../../../../services/httpClient";

interface TransferFormProps {
  onCancel: () => void;
  inventory: any;
}

const TRANSFER_PRESETS = [
  "Branch stock replenishment",
  "Excess inventory redistribution",
];

const TransferForm = ({ onCancel, inventory }: TransferFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.inventory);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [idempotencyKey] = useState(newIdempotencyKey);

  useEffect(() => {
    Inventory.transferDestinations(inventory.inventory_id)
      .then((response) => setDestinations(response.data.data || []))
      .catch((error: any) =>
        toast.error(error?.message || "Could not load destinations")
      )
      .finally(() => setLoadingDestinations(false));
  }, [inventory.inventory_id]);

  const initialValues = {
    quantity: "",
    reason: "",
    destination_cinema_id: "",
    destination_inventory_id: "",
  };

  const destinationOptions = destinations.map((item: any) => ({
    label: `${item.cinema_name}${
      item.cinema_location ? ` (${item.cinema_location})` : ""
    }`,
    value: item.inventory_id,
  }));

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      const response = await dispatch(
        transferOut({
          id: inventory.inventory_id,
          idempotencyKey,
          data: {
            quantity: Number(values.quantity),
            reason: values.reason,
            ...(inventory?.cinema_id
              ? { cinema_id: inventory.cinema_id }
              : {}),
            destination_cinema_id: values.destination_cinema_id,
            destination_inventory_id: values.destination_inventory_id,
          } as any,
        })
      ).unwrap();

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message || "Transfer successful");
        await dispatch(getAllInventories({ page, limit }));
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
      validationSchema={transferOutSchema}
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
          <div className="rounded-xl bg-blue-50/80 border border-blue-200 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ArrowRightLeft size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Inter-Branch Stock Transfer
                </p>
                <p className="text-sm font-bold text-stone-900">
                  {inventory?.product?.name || inventory?.productName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-blue-700 font-semibold block">
                Current Stock
              </span>
              <span className="text-sm font-bold text-stone-900">
                {inventory?.quantity} units
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Quantity to Transfer"
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
                placeholder="e.g., 20"
                required
              />

              <ReusableSelect
                label="Destination Cinema"
                name="destination_inventory_id"
                value={values.destination_inventory_id}
                onChange={(value) => {
                  const destination = destinations.find(
                    (d: any) => d.inventory_id === value
                  );
                  setFieldValue("destination_inventory_id", value);
                  setFieldValue(
                    "destination_cinema_id",
                    destination?.cinema_id || ""
                  );
                }}
                options={destinationOptions}
                defaultOption={
                  loadingDestinations
                    ? "Loading branches..."
                    : "Select destination cinema"
                }
                disabled={loadingDestinations}
                error={
                  touched.destination_inventory_id &&
                  typeof errors.destination_inventory_id === "string"
                    ? errors.destination_inventory_id
                    : !loadingDestinations && destinations.length === 0
                    ? "No other cinema stocks this product yet. Create it there first."
                    : undefined
                }
                required
              />
            </div>

            <div>
              <TextArea
                label="Transfer Note / Reason"
                name="reason"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., Stock replenishment, Excess inventory redistribution"
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
                {TRANSFER_PRESETS.map((preset) => (
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
              title={isSubmitting ? "Transferring..." : "Transfer Stock"}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TransferForm;
