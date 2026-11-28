/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Gift } from "lucide-react";
import Input from "../../../components/shared/Input";
import TextArea from "../../../components/shared/TextArea";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Reward name is required")
    .min(3, "Name must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  pointsCost: Yup.number()
    .required("Points cost is required")
    .min(1, "Points cost must be greater than 0")
    .max(10000, "Points cost cannot exceed 10,000"),
  category: Yup.string().required("Category is required"),
});

interface AddRewardFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const POINTS_PRESETS = [500, 1000, 2500, 5000];

const AddRewardForm = ({ onSubmit, onCancel }: AddRewardFormProps) => {
  const categoryOptions = [
    { value: "Tickets", label: "Tickets" },
    { value: "Concessions", label: "Concessions" },
    { value: "Experiences", label: "Experiences" },
    { value: "Credits", label: "Credits" },
    { value: "Merchandise", label: "Merchandise" },
  ];

  const initialValues = {
    name: "",
    description: "",
    pointsCost: "",
    category: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
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
              <Gift size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Loyalty Reward Perks
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Define a redeemable reward item and the loyalty points required
                to claim it.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Reward Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name ? errors.name : ""}
                placeholder="e.g., Free Regular Movie Ticket"
                required
              />

              <ReusableSelect
                label="Reward Category"
                name="category"
                value={values.category}
                onChange={(value) => setFieldValue("category", value)}
                options={categoryOptions}
                defaultOption="Select category"
                error={
                  touched.category && errors.category ? errors.category : ""
                }
                required
              />
            </div>

            <div>
              <Input
                label="Points Required"
                name="pointsCost"
                type="number"
                value={values.pointsCost}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.pointsCost && errors.pointsCost
                    ? errors.pointsCost
                    : ""
                }
                placeholder="1000"
                required
              />
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[11px] text-stone-400">Quick presets:</span>
                {POINTS_PRESETS.map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setFieldValue("pointsCost", pts)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-[#fff8ea] text-stone-600 hover:text-[#754f2c] border border-stone-200/80 transition-colors cursor-pointer"
                  >
                    {pts.toLocaleString()} pts
                  </button>
                ))}
              </div>
            </div>

            <TextArea
              label="Reward Description & Terms"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && errors.description
                  ? errors.description
                  : ""
              }
              placeholder="Redeemable for any standard 2D movie screening..."
              rows={3}
              required
            />
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
              title={isSubmitting ? "Creating Reward..." : "Create Reward"}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddRewardForm;
