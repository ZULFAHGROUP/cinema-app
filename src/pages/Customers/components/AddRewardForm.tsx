/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
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
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Reward Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name ? errors.name : ""}
              placeholder="Free Movie Ticket"
              required
            />

            <Input
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.description && errors.description
                  ? errors.description
                  : ""
              }
              placeholder="Redeem for any regular movie ticket"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Points Cost"
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

              <ReusableSelect
                label="Category"
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
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Creating Reward..." : "Create Reward"}
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

export default AddRewardForm;
