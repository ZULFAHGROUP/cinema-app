/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, FieldArray, FormikTouched } from "formik";
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

interface AddScreensFormProps {
  onCancel: () => void;
  editMode?: boolean;
  screenData?: any;
  cinemas?: any;
}

const AddScreensForm = ({
  onCancel,
  editMode = false,
  screenData,
  cinemas,
}: AddScreensFormProps) => {
  const dispatch = useAppDispatch();
  const { seatTypes } = useAppSelector((state) => state.seatType);

  const initialValues = {
    cinema_id: screenData?.cinema.name || "",
    name: screenData?.name || "",
    seat_layout: {
      rows: screenData?.seat_layout?.rows || [
        {
          row: "",
          count: 0,
          default_type: "",
        },
      ],
    },
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
        const { cinema_id, ...restData } = values;
        response = await dispatch(
          createScreen({ id: cinema_id, data: restData })
        ).unwrap();
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

  const allCinema = [...(cinemas || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((cinema: { cinema_id: string; name: string }) => ({
      label: cinema.name,
      value: cinema.cinema_id,
    }));

  const allSeat = [...(seatTypes || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((seats: { name: string }) => ({
      label: seats.name,
      value: seats.name,
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
            <ReusableSelect
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
              disabled={editMode}
            />{" "}
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
            <div className="pt-2">
              <h3 className="text-sm font-semibold mb-2">Seat Layout (Rows)</h3>
              <FieldArray name="seat_layout.rows">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.seat_layout.rows.map((row: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 border rounded-md space-y-2 relative"
                      >
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            label="Row"
                            name={`seat_layout.rows.${index}.row`}
                            value={row.row}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              (
                                touched.seat_layout?.rows as
                                  | FormikTouched<any>[]
                                  | undefined
                              )?.[index]?.row &&
                              typeof (errors.seat_layout?.rows as any)?.[index]
                                ?.row === "string"
                                ? (errors.seat_layout?.rows as any)[index].row
                                : undefined
                            }
                            placeholder="A"
                          />

                          <Input
                            label="Seat Count"
                            name={`seat_layout.rows.${index}.count`}
                            type="number"
                            value={row.count}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              (
                                touched.seat_layout?.rows as
                                  | FormikTouched<any>[]
                                  | undefined
                              )?.[index]?.count &&
                              typeof (errors.seat_layout?.rows as any)?.[index]
                                ?.count === "string"
                                ? (errors.seat_layout?.rows as any)[index].count
                                : undefined
                            }
                            placeholder="10"
                          />

                          <ReusableSelect
                            label="Default Type"
                            name={`seat_layout.rows.${index}.default_type`}
                            value={row.default_type}
                            onChange={(value) =>
                              setFieldValue(
                                `seat_layout.rows.${index}.default_type`,
                                value
                              )
                            }
                            onBlur={handleBlur}
                            options={allSeat}
                          />
                        </div>

                        {values.seat_layout.rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 text-sm absolute right-2 top-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      title="Add Row"
                      onClick={() =>
                        push({
                          row: "",
                          count: 0,
                          default_type: "",
                        })
                      }
                      className="rounded-md"
                    />
                  </div>
                )}
              </FieldArray>
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
