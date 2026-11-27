/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import { Monitor, Info } from "lucide-react";
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
  cinemas,
  preSelectedCinema,
}: AddScreensFormProps) => {
  const dispatch = useAppDispatch();
  const { screenTypes, page, limit, total } = useAppSelector(
    (state) => state.screenType
  );
  const { screensPage, screensLimit } = useAppSelector((state) => state.screen);

  useEffect(() => {
    dispatch(getAllScreenTypes({ page, limit: total || 50 }));
  }, [dispatch, page, limit, total]);

  const initialValues = {
    cinema_id: preSelectedCinema || screenData?.cinema_id || "",
    name: screenData?.name || "",
    seat_count: screenData?.seat_count || "",
    screen_type_id: screenData?.screenType?.screen_type_id || "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;
      if (editMode && screenData?.screen_id) {
        const payload: { name: string; seat_count?: number } = {
          name: values.name,
        };
        if (Number(values.seat_count) !== Number(screenData.seat_count)) {
          payload.seat_count = Number(values.seat_count);
        }
        response = await dispatch(
          updateScreen({ id: screenData.screen_id, data: payload })
        ).unwrap();
      } else {
        response = await dispatch(createScreen(values)).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(
          getAllScreen({
            screensPage,
            screensLimit,
            cinema_id: preSelectedCinema || screenData?.cinema_id,
          })
        );
        resetForm();
        onCancel();
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
        <Form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
              <Monitor size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                Auditorium Configuration
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Assign this screen to a cinema branch, set its display format,
                and specify default seating capacity.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <ReusableSelect
              label="Cinema Branch"
              name="cinema_id"
              value={values.cinema_id}
              onChange={(value) => setFieldValue("cinema_id", value)}
              options={allCinema}
              defaultOption="Select cinema branch"
              error={
                touched.cinema_id && typeof errors.cinema_id === "string"
                  ? errors.cinema_id
                  : undefined
              }
              required
              disabled={editMode || Boolean(preSelectedCinema)}
            />

            <Input
              label="Screen / Auditorium Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.name && typeof errors.name === "string"
                  ? errors.name
                  : undefined
              }
              placeholder="e.g., Screen 1 (Main Hall)"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Default Seat Capacity"
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
                placeholder="e.g., 120"
                hint="Auto-updates if you design a custom seat map"
              />

              <ReusableSelect
                label="Experience / Screen Type"
                name="screen_type_id"
                value={values.screen_type_id}
                onChange={(value) => setFieldValue("screen_type_id", value)}
                onBlur={handleBlur}
                options={allScreenType}
                defaultOption="Select format (2D, 3D, VIP...)"
                disabled={editMode}
                hint={editMode ? "Screen format is locked after creation" : "Used for pricing rules"}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 border border-stone-200/70 rounded-xl px-3 py-2.5">
              <Info size={14} className="text-[#c77e3b] shrink-0" />
              <span>
                Tip: After saving, click the <strong>Seats</strong> button on
                this screen row to build an interactive row-by-row seat map.
              </span>
            </div>
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
                    ? "Updating Screen..."
                    : "Adding Screen..."
                  : editMode
                  ? "Save Changes"
                  : "Create Screen"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddScreensForm;
