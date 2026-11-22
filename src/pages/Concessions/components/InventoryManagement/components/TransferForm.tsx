/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import ReusableSelect from "../../../../../components/shared/Select";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { transferOut, getAllInventories } from "../../../../../store/slices/inventory";
import { toast } from "react-toastify";
import { transferOutSchema } from "../../../../../validations";
import { useEffect, useState } from "react";
import Inventory from "../../../../../services/network/inventory";
import { newIdempotencyKey } from "../../../../../services/httpClient";

interface TransferFormProps {
  onCancel: () => void;
  /** The inventory row stock is sent from (with its product). */
  inventory: any;
}

const TransferForm = ({ onCancel, inventory }: TransferFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.inventory);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  // One key per opened form, reused if the user retries after an error.
  const [idempotencyKey] = useState(newIdempotencyKey);

  // The same product's stock record in every other cinema.
  useEffect(() => {
    Inventory.transferDestinations(inventory.inventory_id)
      .then((response) => setDestinations(response.data.data || []))
      .catch((error: any) => toast.error(error?.message || "Could not load destinations"))
      .finally(() => setLoadingDestinations(false));
  }, [inventory.inventory_id]);

  const initialValues = {
    quantity: "",
    reason: "",
    destination_cinema_id: "",
    destination_inventory_id: "",
  };

  const destinationOptions = destinations.map((item: any) => ({
    label: `${item.cinema_name}${item.cinema_location ? ` (${item.cinema_location})` : ""}`,
    value: item.inventory_id,
  }));

  async function handleSubmit(values: any, { resetForm }: { resetForm: () => void }) {
    try {
      const response = await dispatch(
        transferOut({
          id: inventory.inventory_id,
          idempotencyKey,
          data: {
            quantity: Number(values.quantity),
            reason: values.reason,
            destination_cinema_id: values.destination_cinema_id,
            destination_inventory_id: values.destination_inventory_id,
          },
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
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="bg-red-50 border-red-200 border rounded-md p-3 mb-4">
              <p className="text-sm font-semibold text-red-800">
                Product: {inventory?.product?.name || inventory?.productName}
              </p>
              <p className="text-sm text-red-700">Current Stock: {inventory?.quantity}</p>
              <p className="text-xs text-red-700 mt-1">
                Stock leaves this cinema and arrives at the destination in one step.
              </p>
            </div>

            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.quantity && typeof errors.quantity === "string" ? errors.quantity : undefined}
              placeholder="10"
              required
            />

            <ReusableSelect
              label="Destination"
              name="destination_inventory_id"
              value={values.destination_inventory_id}
              onChange={(value) => {
                const destination = destinations.find((d: any) => d.inventory_id === value);
                setFieldValue("destination_inventory_id", value);
                setFieldValue("destination_cinema_id", destination?.cinema_id || "");
              }}
              options={destinationOptions}
              defaultOption={loadingDestinations ? "Loading..." : "Select destination cinema"}
              disabled={loadingDestinations}
              error={
                touched.destination_inventory_id && typeof errors.destination_inventory_id === "string"
                  ? errors.destination_inventory_id
                  : !loadingDestinations && destinations.length === 0
                  ? "No other cinema stocks this product yet. Create it there first."
                  : undefined
              }
              required
            />

            <div>
              <label className="block font-medium md:text-lg mb-2">Reason</label>
              <textarea
                name="reason"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., Stock replenishment, Excess inventory redistribution"
                rows={3}
                className={`w-full p-2 border rounded-md ${
                  touched.reason && errors.reason ? "border-red-500" : "border-gray-300"
                }`}
              />
              {touched.reason && errors.reason && (
                <p className="text-sm text-red-500 italic mt-1">
                  {typeof errors.reason === "string" ? errors.reason : undefined}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={isSubmitting ? "Processing..." : "Transfer Out"}
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

export default TransferForm;
