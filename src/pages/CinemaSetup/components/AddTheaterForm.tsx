/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { Building2, MapPin } from "lucide-react";
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
        onCancel();
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
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Theater Branch Details
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure the branch name and location. You can add auditorium
                screens and seat layouts once the theater is created.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Cinema / Branch Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="e.g., Silverbird Galleria"
              hint="Official branch name shown on tickets, POS, and reports"
              required
            />

            <Input
              label="Location / City"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.location && typeof errors.location === "string"
                  ? errors.location
                  : undefined
              }
              placeholder="e.g., Victoria Island, Lagos"
              hint="Neighborhood, mall, or city where this branch operates"
              prefix={<MapPin size={15} className="text-stone-400 mr-1" />}
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
              title={
                isSubmitting
                  ? editMode
                    ? "Updating Theater..."
                    : "Adding Theater..."
                  : editMode
                  ? "Save Changes"
                  : "Create Theater"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TheaterForm;
