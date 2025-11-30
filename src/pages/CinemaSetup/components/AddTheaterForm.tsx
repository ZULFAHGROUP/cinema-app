/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { theaterValidationSchema } from "../../../validations";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../store/hook";
import {
  createCinema,
  getAllCinemas,
  updateCinema,
} from "../../../store/slices/cinema";
import { useState } from "react";

interface TheaterFormProps {
  onCancel: () => void;
  editMode?: boolean;
  cinemaData?: any;
}

const TheaterForm = ({
  onCancel,
  editMode = false,
  cinemaData,
}: TheaterFormProps) => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const initialValues = {
    name: cinemaData?.name || "",
    location: cinemaData?.location || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    setCurrentPage(currentPage);
    setPageSize(pageSize);
    try {
      let response;
      if (editMode && cinemaData?.cinema_id) {
        response = await dispatch(
          updateCinema({ id: cinemaData.cinema_id, payload: values })
        ).unwrap();
      } else {
        response = await dispatch(createCinema(values)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllCinemas({ page: currentPage, limit: pageSize }));
        resetForm();
        onCancel(); // close modal after success
      }
    } catch (error: any) {
      console.error("Error submitting theater form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={theaterValidationSchema}
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
              label="Cinema Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="Silver bird"
              required
            />

            <Input
              label="Location"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.location && typeof errors.location === "string"
                  ? errors.location
                  : undefined
              }
              placeholder="Ikeja"
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
                    ? "Updating Theater..."
                    : "Adding Theater..."
                  : editMode
                  ? "Update Theater"
                  : "Add Theater"
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

export default TheaterForm;
