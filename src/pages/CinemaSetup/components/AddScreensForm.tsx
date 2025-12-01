/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  createScreen,
  getAllScreen,
  updateScreen,
} from "../../../store/slices/screen";
import { screenValidationSchema } from "../../../validations";
import ReusableSelect from "../../../components/shared/Select";
import { useEffect } from "react";
import { getAllScreenTypes } from "../../../store/slices/screenType";

interface AddScreensFormProps {
  onCancel: () => void;
  editMode?: boolean;
  screenData?: any;
  cinemas?: any;
  preSelectedCinema?: any;
}

const AddScreensForm = ({
  onCancel,
  editMode = false,
  screenData,
  // cinemas,
  preSelectedCinema,
}: AddScreensFormProps) => {
  const dispatch = useAppDispatch();
  const { screenTypes, page, limit, total } = useAppSelector(
    (state) => state.screenType
  );

  useEffect(() => {
    dispatch(getAllScreenTypes({ page, limit: total }));
  }, [dispatch, page, limit, total]);
  console.log("cinema id", preSelectedCinema);
  const initialValues = {
    // cinema_id: preSelectedCinema || screenData?.cinema?.name || "",
    name: screenData?.name || "",
    seat_count: screenData?.seat_count || "",
    screen_type_id: screenData?.screen_type?.name || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      if (editMode && screenData?.screen_id) {
        const payload = { ...values };
        delete payload.cinema_id;
        response = await dispatch(
          updateScreen({ id: screenData.screen_id, data: payload })
        ).unwrap();
      } else {
        response = await dispatch(createScreen(values)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllScreen());
        resetForm();
        onCancel(); // close modal after success
      }
    } catch (error: any) {
      console.error("Error submitting screen form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  // const allCinema = [...(cinemas || [])]
  //   .sort((a: any, b: any) => a.name.localeCompare(b.name))
  //   .map((cinema: { cinema_id: string; name: string }) => ({
  //     label: cinema.name,
  //     value: cinema.cinema_id,
  //   }));

  const allScreenType = [...(screenTypes || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((screens: { name: string; screen_type_id: string }) => ({
      label: screens.name,
      value: screens.screen_type_id,
    }));

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={screenValidationSchema}
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
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* <ReusableSelect
              label="Cinema"
              name="cinema_id"
              value={values.cinema_id}
              onChange={(value) => setFieldValue("cinema_id", value)}
              options={allCinema}
              defaultOption="Select Cinema"
              error={
                touched.cinema_id && typeof errors.cinema_id === "string"
                  ? errors.cinema_id
                  : undefined
              }
              required
              disabled={editMode || Boolean(preSelectedCinema)}
            />{" "} */}
            <Input
              label="Screen Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="Screen 1"
              required
            />
            <div className="flex gap-3 w-full">
              <Input
                label="Seat Count"
                name="seat_count"
                type="number"
                value={values.seat_count}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.seat_count && typeof errors.seat_count === "string"
                    ? errors.seat_count
                    : undefined
                }
                placeholder="10"
                conClassName="flex-1"
              />

              <ReusableSelect
                label="Screen Type"
                name="screen_type_id"
                value={values.screen_type_id}
                onChange={(value) => setFieldValue(`screen_type_id`, value)}
                onBlur={handleBlur}
                options={allScreenType}
                conClassName="flex-1"
              />
            </div>
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
                    ? "Updating Screen..."
                    : "Adding Screen..."
                  : editMode
                  ? "Update Screen"
                  : "Add Screen"
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

export default AddScreensForm;
