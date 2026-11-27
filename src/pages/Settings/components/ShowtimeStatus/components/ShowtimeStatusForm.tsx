/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import { Clock } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
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

const STATUS_PRESETS = ["Scheduled", "Now Showing", "Sold Out", "Cancelled"];

const ShowtimeStatusForm = ({
  onCancel,
  editMode,
  statusData,
}: ShowtimeStatusFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.showtimeStatus);
  const initialValues = {
    name: statusData?.name || "",
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

      await dispatch(getAllShowtimeStatuses({ page, limit }));
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
        setFieldValue,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Showtime Lifecycle Status
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Define status labels assigned to movie screenings on the schedule
                and digital signage boards.
              </p>
            </div>
          </div>

          <div>
            <Input
              label="Showtime Status Label"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="e.g., Scheduled"
              required
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-stone-400">Quick presets:</span>
              {STATUS_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFieldValue("name", preset)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-colors cursor-pointer ${
                    values.name === preset
                      ? "bg-[#fff8ea] border-[#c77e3b] text-[#754f2c] font-bold"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:border-[#c77e3b]/40"
                  }`}
                >
                  {preset}
                </button>
              ))}
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
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Save Status"
                  : "Add Status"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ShowtimeStatusForm;
