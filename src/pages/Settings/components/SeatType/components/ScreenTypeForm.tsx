/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { MonitorPlay } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import {
  createScreenType,
  getAllScreenTypes,
  updateScreenType,
} from "../../../../../store/slices/screenType";
import { seatTypeValidationSchema } from "../../../../../validations";

interface ScreenTypeFormProps {
  onCancel: () => void;
  editMode?: boolean;
  seatTypeData?: any;
}

const SCREEN_TYPE_PRESETS = ["2D Standard", "3D", "IMAX", "VIP Lounge", "4DX"];

const ScreenTypeForm = ({
  onCancel,
  editMode,
  seatTypeData,
}: ScreenTypeFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.screenType);

  const initialValues = {
    name: seatTypeData?.name || "",
  };

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      let response;
      if (editMode) {
        response = await dispatch(
          updateScreenType({
            id: seatTypeData?.screen_type_id || seatTypeData?.seat_type_id,
            payload: values,
          })
        ).unwrap();
      } else {
        response = await dispatch(createScreenType(values)).unwrap();
      }

      if (response.code === 201 || response.code === 200) {
        toast.success(response.message || "Success!");
        await dispatch(getAllScreenTypes({ page, limit }));
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
        setFieldValue,
        isSubmitting,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <MonitorPlay size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Screen Experience Format
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Define auditorium experience formats used when configuring
                screens and ticket price rules.
              </p>
            </div>
          </div>

          <div>
            <Input
              label="Screen Type Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="e.g., VIP / IMAX / 3D"
              required
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-stone-400">Quick presets:</span>
              {SCREEN_TYPE_PRESETS.map((preset) => (
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
                  ? "Save Screen Type"
                  : "Add Screen Type"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ScreenTypeForm;
