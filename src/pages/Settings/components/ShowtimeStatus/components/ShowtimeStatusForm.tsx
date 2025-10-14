/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { useAppDispatch } from "../../../../../store/hook";
import {
  createShowtimeStatus,
  updateShowtimeStatus,
  getAllShowtimeStatuses,
} from "../../../../../store/slices/showtimeStatus";
import { toast } from "react-toastify";
import { showtimeStatusSchema } from "../../../../../validations";

interface ShowtimeStatusFormProps {
  onCancel: () => void;
  editMode?: boolean;
  statusData?: any;
}

const ShowtimeStatusForm = ({
  onCancel,
  editMode,
  statusData,
}: ShowtimeStatusFormProps) => {
  const dispatch = useAppDispatch();
  const initialValues = {
    name: statusData?.name || "",
    // description: statusData?.description || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      if (editMode) {
        const response = await dispatch(
          updateShowtimeStatus({
            id: statusData.showtime_status_id,
            data: values,
          })
        ).unwrap();
        if (response.code === 200) {
          toast.success(response.message);
        }
      } else {
        const response = await dispatch(createShowtimeStatus(values)).unwrap();
        if (response.code === 201) {
          toast.success(response.message);
        }
      }

      await dispatch(getAllShowtimeStatuses());
      resetForm();
      onCancel();
    } catch (error: any) {
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={showtimeStatusSchema}
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
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Showtime Status Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="Scheduled"
              required
            />
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Update Classification"
                  : "Add Classification"
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

export default ShowtimeStatusForm;
