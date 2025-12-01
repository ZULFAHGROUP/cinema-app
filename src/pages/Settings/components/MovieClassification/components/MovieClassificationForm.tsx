/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
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
      console.log("coming response", response);
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
        isSubmitting,
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Classification Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="PG-13"
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

export default MovieClassificationForm;
