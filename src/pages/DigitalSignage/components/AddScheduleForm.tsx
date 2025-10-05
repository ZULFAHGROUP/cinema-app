/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";

const validationSchema = Yup.object({
  time: Yup.string().required("Time is required"),
  content: Yup.string().required("Content is required"),
  duration: Yup.string().required("Duration is required"),
});

interface AddScheduleFormProps {
  contentTemplates: any[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddScheduleForm = ({
  contentTemplates,
  onSubmit,
  onCancel,
}: AddScheduleFormProps) => {
  const contentOptions = contentTemplates?.map((template) => ({
    value: template.name,
    label: template.name,
  }));

  const initialValues = {
    time: "",
    content: "",
    duration: "",
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
              label="Start Time"
              name="time"
              type="time"
              value={values.time}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.time && errors.time ? errors.time : ""}
              required
            />

            <ReusableSelect
              label="Content"
              name="content"
              value={values.content}
              onChange={(value) => setFieldValue("content", value)}
              options={contentOptions}
              defaultOption="Select content"
              error={touched.content && errors.content ? errors.content : ""}
              required
            />

            <Input
              label="Duration"
              name="duration"
              value={values.duration}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.duration && errors.duration ? errors.duration : ""}
              placeholder="e.g., 30 min, 2 hours, Until Close"
              required
            />
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Adding Schedule..." : "Add Schedule Item"}
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

export default AddScheduleForm;
