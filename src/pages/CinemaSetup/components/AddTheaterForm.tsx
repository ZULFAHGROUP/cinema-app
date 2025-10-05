/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { theaterValidationSchema } from "../../../validations";

interface AddTheaterFormProps {
  // onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddTheaterForm = ({ onCancel }: AddTheaterFormProps) => {
  const initialValues = {
    name: "",
    location: "",
  };

  function handleaddTheater(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      if (values) {
        console.log(values);
        resetForm();
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={theaterValidationSchema}
      onSubmit={handleaddTheater}
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
              label="Theater Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name ? errors.name : ""}
              placeholder="Silver bird"
              required
            />

            <Input
              label="Location"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.location && errors.location ? errors.location : ""}
              placeholder="Ikeja"
              required
            />
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Adding Theater..." : "Add Theater"}
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

export default AddTheaterForm;
