/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import ReusableSelect from "../../../../../components/shared/Select";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { transferOut, transferIn, getAllInventories } from "../../../../../store/slices/inventory";
import { getAllCinemas } from "../../../../../store/slices/cinema";
import { toast } from "react-toastify";
import { transferOutSchema, transferInSchema } from "../../../../../validations";
import { useEffect, useState } from "react";

interface TransferFormProps {
  onCancel: () => void;
  inventoryId: string;
  productName: string;
  currentStock: number;
}

const TransferForm = ({ onCancel, inventoryId, productName, currentStock }: TransferFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.inventory);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { user } = useAppSelector((state) => state.accounts.data);
  const [transferType, setTransferType] = useState<"out" | "in">("out");
  
  const userCinemaId = user?.cinema_id;
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    dispatch(getAllCinemas({ page: 1, limit: 100 }));
  }, [dispatch]);

  const initialValues = {
    quantity: "",
    reason: "",
    destination_cinema_id: "",
    source_cinema_id: "",
  };

  const cinemaOptions = allCinemas
    ?.filter((cinema: any) => cinema.cinema_id !== userCinemaId) // Exclude current cinema
    ?.map((cinema: any) => ({
      label: cinema.name,
      value: cinema.cinema_id,
    })) || [];

  async function handleSubmit(values: any, { resetForm }: { resetForm: () => void }) {
    try {
      let response;
      
      if (transferType === "out") {
        response = await dispatch(
          transferOut({
            id: inventoryId,
            data: {
              quantity: Number(values.quantity),
              reason: values.reason,
              destination_cinema_id: values.destination_cinema_id,
            },
          })
        ).unwrap();
      } else {
        response = await dispatch(
          transferIn({
            id: inventoryId,
            data: {
              quantity: Number(values.quantity),
              reason: values.reason,
              source_cinema_id: values.source_cinema_id,
            },
          })
        ).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message || `Transfer ${transferType === "out" ? "out" : "in"} successful`);
        const cinemaIdToUse = isAdmin ? undefined : userCinemaId;
        await dispatch(getAllInventories({ page, limit, cinema_id: cinemaIdToUse }));
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <div>
      {/* Transfer Type Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          variant={transferType === "out" ? "primary" : "outline"}
          onClick={() => setTransferType("out")}
          title="Transfer Out"
          className="flex-1 rounded-md"
        />
        <Button
          type="button"
          variant={transferType === "in" ? "primary" : "outline"}
          onClick={() => setTransferType("in")}
          title="Transfer In"
          className="flex-1 rounded-md"
        />
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={transferType === "out" ? transferOutSchema : transferInSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className={`${transferType === "out" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"} border rounded-md p-3 mb-4`}>
                <p className={`text-sm font-semibold ${transferType === "out" ? "text-red-800" : "text-green-800"}`}>
                  Product: {productName}
                </p>
                <p className={`text-sm ${transferType === "out" ? "text-red-700" : "text-green-700"}`}>
                  Current Stock: {currentStock}
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

              {transferType === "out" ? (
                <ReusableSelect
                  label="Destination Cinema"
                  name="destination_cinema_id"
                  value={values.destination_cinema_id}
                  onChange={(value) => setFieldValue("destination_cinema_id", value)}
                  options={cinemaOptions}
                  defaultOption="Select destination"
                  error={
                    touched.destination_cinema_id && typeof errors.destination_cinema_id === "string"
                      ? errors.destination_cinema_id
                      : undefined
                  }
                  required
                />
              ) : (
                <ReusableSelect
                  label="Source Cinema"
                  name="source_cinema_id"
                  value={values.source_cinema_id}
                  onChange={(value) => setFieldValue("source_cinema_id", value)}
                  options={cinemaOptions}
                  defaultOption="Select source"
                  error={
                    touched.source_cinema_id && typeof errors.source_cinema_id === "string"
                      ? errors.source_cinema_id
                      : undefined
                  }
                  required
                />
              )}

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
                title={isSubmitting ? "Processing..." : `Transfer ${transferType === "out" ? "Out" : "In"}`}
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
    </div>
  );
};

export default TransferForm;
