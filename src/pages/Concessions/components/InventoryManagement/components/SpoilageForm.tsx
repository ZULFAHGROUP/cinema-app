/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { recordSpoilage, getAllInventories } from "../../../../../store/slices/inventory";
import { toast } from "react-toastify";
import { inventoryOperationSchema } from "../../../../../validations";

interface SpoilageFormProps {
  onCancel: () => void;
  inventoryId: string;
  productName: string;
  currentStock: number;
}

const SpoilageForm = ({ onCancel, inventoryId, productName, currentStock }: SpoilageFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.inventory);
  const { user } = useAppSelector((state) => state.accounts.data);
  const userCinemaId = user?.cinema_id;
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  const initialValues = {
    quantity: "",
    reason: "",
  };

  async function handleSubmit(values: any, { resetForm }: { resetForm: () => void }) {
    try {
      const response = await dispatch(
        recordSpoilage({
          id: inventoryId,
          data: {
            quantity: Number(values.quantity),
            reason: values.reason,
          },
        })
      ).unwrap();

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message || "Spoilage recorded successfully");
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
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={inventoryOperationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-sm font-semibold text-yellow-800">Product: {productName}</p>
              <p className="text-sm text-yellow-700">Current Stock: {currentStock}</p>
            </div>

            <Input
              label="Quantity Spoiled/Damaged"
              name="quantity"
              type="number"
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.quantity && typeof errors.quantity === "string" ? errors.quantity : undefined}
              placeholder="10"
              required
            />

            <div>
              <label className="block font-medium md:text-lg mb-2">Reason</label>
              <textarea
                name="reason"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., Expired, Damaged packaging, Quality issues"
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
              title={isSubmitting ? "Recording..." : "Record Spoilage"}
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

export default SpoilageForm;
