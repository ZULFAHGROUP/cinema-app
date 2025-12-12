/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { correctInventory, getAllInventories } from "../../../../../store/slices/inventory";
import { toast } from "react-toastify";
import { inventoryOperationSchema } from "../../../../../validations";

interface CorrectionFormProps {
  onCancel: () => void;
  inventoryId: string;
  productName: string;
  currentStock: number;cinema_id:any
}

const CorrectionForm = ({ onCancel, inventoryId, productName, currentStock, cinema_id }: CorrectionFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.inventory);
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  const initialValues = {
    quantity: currentStock.toString(),
    reason: "",
  };

  async function handleSubmit(values: any, { resetForm }: { resetForm: () => void }) {
    try {
      const response = await dispatch(
        correctInventory({
          id: inventoryId,
          data: {
            quantity: Number(values.quantity),
            reason: values.reason,
            cinema_id:cinema_id
          },
        })
      ).unwrap();

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message || "Inventory corrected successfully");
           isAdmin ? 
                await dispatch(getAllInventories({ page, limit, cinema_id: cinema_id })).unwrap() :         await dispatch(getAllInventories({ page, limit })).unwrap();
        ;
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
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-4">
              <p className="text-sm font-semibold text-orange-800">Product: {productName}</p>
              <p className="text-sm text-orange-700">System Stock: {currentStock}</p>
              <p className="text-xs text-orange-600 mt-1">Enter the actual counted quantity below</p>
            </div>

            <Input
              label="Actual Quantity (Physical Count)"
              name="quantity"
              type="number"
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.quantity && typeof errors.quantity === "string" ? errors.quantity : undefined}
              placeholder={currentStock.toString()}
              required
            />

            <div>
              <label className="block font-medium md:text-lg mb-2">Reason for Correction</label>
              <textarea
                name="reason"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., Physical count discrepancy, System error, Stock audit"
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

            {values.quantity && Number(values.quantity) !== currentStock && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-sm font-semibold">Adjustment:</p>
                <p className={`text-sm ${Number(values.quantity) > currentStock ? "text-green-600" : "text-red-600"}`}>
                  {Number(values.quantity) > currentStock ? "+" : ""}
                  {Number(values.quantity) - currentStock} units
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={isSubmitting ? "Correcting..." : "Correct Inventory"}
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

export default CorrectionForm;
