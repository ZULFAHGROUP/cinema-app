/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { DisplayInput } from "../../../services/network/signage";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Display name is required").max(100),
  location: Yup.string().max(150),
  resolution: Yup.string().matches(/^\d{3,5}x\d{3,5}$/, "Use the form 1920x1080"),
  orientation: Yup.string().oneOf(["landscape", "portrait"]),
});

interface DisplayFormProps {
  display?: any;
  onSubmit: (values: DisplayInput) => Promise<void>;
  onCancel: () => void;
}

const DisplayForm = ({ display, onSubmit, onCancel }: DisplayFormProps) => (
  <Formik
    initialValues={{
      name: display?.name || "",
      location: display?.location || "",
      resolution: display?.resolution || "1920x1080",
      orientation: display?.orientation || "landscape",
    }}
    validationSchema={validationSchema}
    onSubmit={async (values, { setSubmitting }) => {
      try {
        await onSubmit({ ...values, location: values.location.trim() || null });
      } catch {
        // The error toast comes from the API call.
      } finally {
        setSubmitting(false);
      }
    }}
  >
    {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
      <Form className="space-y-4">
        <Input
          label="Display name"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && typeof errors.name === "string" ? errors.name : ""}
          placeholder="Lobby main screen"
          required
        />
        <Input
          label="Location"
          name="location"
          value={values.location}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Main lobby, above the box office"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Resolution"
            name="resolution"
            value={values.resolution}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.resolution && typeof errors.resolution === "string" ? errors.resolution : ""}
            placeholder="1920x1080"
          />
          <ReusableSelect
            label="Orientation"
            name="orientation"
            value={values.orientation}
            onChange={(value) => setFieldValue("orientation", value)}
            options={[
              { value: "landscape", label: "Landscape" },
              { value: "portrait", label: "Portrait" },
            ]}
            showSearch={false}
          />
        </div>
        <div className="flex gap-2 pt-4 border-t">
          <Button
            type="submit"
            className="flex-1 rounded-md"
            loading={isSubmitting}
            disabled={isSubmitting}
            title={display ? "Save display" : "Add display"}
          />
          <Button type="button" variant="outline" className="rounded-md" title="Cancel" onClick={onCancel} />
        </div>
      </Form>
    )}
  </Formik>
);

export default DisplayForm;
