/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { ShieldAlert } from "lucide-react";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import {
  createClassification,
  updateClassification,
  getAllClassifications,
} from "../../../../../store/slices/classification";
import { movieClassificationSchema } from "../../../../../validations";

interface MovieClassificationFormProps {
  onCancel: () => void;
  editMode?: boolean;
  classificationData?: any;
}

const RATING_PRESETS = ["G", "PG", "PG-13", "15", "18", "R"];

const MovieClassificationForm = ({
  onCancel,
  editMode = false,
  classificationData,
}: MovieClassificationFormProps) => {
  const dispatch = useAppDispatch();
  const { limit, page } = useAppSelector((state) => state.classification);
  const initialValues = {
    name: classificationData?.name || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      if (editMode && classificationData?.movie_classification_id) {
        response = await dispatch(
          updateClassification({
            id: classificationData.movie_classification_id,
            payload: values,
          })
        ).unwrap();
      } else {
        response = await dispatch(createClassification(values)).unwrap();
      }
      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllClassifications({ limit, page })).unwrap();
        resetForm();
        onCancel();
      }
    } catch (error: any) {
      console.error("Error submitting classification form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={movieClassificationSchema}
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
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Age Rating Classification
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Define age suitability badges displayed on movie posters and
                ticket receipts.
              </p>
            </div>
          </div>

          <div>
            <Input
              label="Classification Code / Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="e.g., PG-13"
              required
            />
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-stone-400">Common ratings:</span>
              {RATING_PRESETS.map((preset) => (
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
                  ? "Save Classification"
                  : "Add Classification"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MovieClassificationForm;
