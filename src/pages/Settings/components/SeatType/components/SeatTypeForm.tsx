/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../../../store/hook";
import {
  createSeatType,
  getAllSeatTypes,
  updateSeatType,
} from "../../../../../store/slices/seatType";
import { seatTypeValidationSchema } from "../../../../../validations";

interface SeatTypeFormProps {
  onCancel: () => void;
  editMode?: boolean;
  seatTypeData?: any;
}

const SeatTypeForm = ({
  onCancel,
  editMode,
  seatTypeData,
}: SeatTypeFormProps) => {
  const dispatch = useAppDispatch();

  const initialValues = {
    name: seatTypeData?.name || "",
    // description: seatTypeData?.description || "",
    // price: seatTypeData?.price || "",
  };

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      let response;
      if (editMode) {
        response = await dispatch(
          updateSeatType({
            id: seatTypeData?.seat_type_id,
            payload: values,
          })
        ).unwrap();
      } else {
        response = await dispatch(createSeatType(values)).unwrap();
      }

      if (response.code === 201 || response.code === 200) {
        toast.success(response.message || "Success!");
        await dispatch(getAllSeatTypes());
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error occurred");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={seatTypeValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Seat Type Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.name && typeof errors.name === "string"
                ? errors.name
                : undefined
            }
            placeholder="e.g. VIP"
            required
          />

          {/*<Input
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.description && typeof errors.description === "string"
                ? errors.description
                : undefined
            }
            placeholder="e.g. Comfortable recliner with snacks"
            required
          />

          <Input
            label="Price (#)"
            type="number"
            name="price"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.price && typeof errors.price === "string"
                ? errors.price
                : undefined
            }
            placeholder="5000"
            required
          />*/}

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating Seat Type..."
                    : "Adding Seat Type..."
                  : editMode
                  ? "Update Seat Type"
                  : "Add Seat Type"
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

export default SeatTypeForm;
