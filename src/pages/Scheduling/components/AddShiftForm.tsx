/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";

const validationSchema = Yup.object({
  staffId: Yup.string().required("Staff member is required"),
  date: Yup.date()
    .required("Date is required")
    .min(new Date().toISOString().split("T")[0], "Date cannot be in the past"),
  department: Yup.string().required("Department is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test(
      "is-after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return value > startTime;
      }
    ),
});

interface AddShiftFormProps {
  staff: any[];
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddShiftForm = ({ staff, onSubmit, onCancel }: AddShiftFormProps) => {
  const staffOptions = staff.map((member) => ({
    value: member.id.toString(),
    label: `${member.name} - ${member.role}`,
  }));

  const departmentOptions = [
    { value: "Operations", label: "Operations" },
    { value: "Box Office", label: "Box Office" },
    { value: "Concessions", label: "Concessions" },
    { value: "Theater", label: "Theater" },
    { value: "Technical", label: "Technical" },
  ];

  const initialValues = {
    staffId: "",
    date: "",
    department: "",
    startTime: "",
    endTime: "",
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
            <ReusableSelect
              label="Staff Member"
              name="staffId"
              value={values.staffId}
              onChange={(value) => setFieldValue("staffId", value)}
              options={staffOptions}
              defaultOption="Select staff member"
              error={touched.staffId && errors.staffId ? errors.staffId : ""}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.date && errors.date ? errors.date : ""}
                restrictPastDate={true}
                required
              />

              <ReusableSelect
                label="Department"
                name="department"
                value={values.department}
                onChange={(value) => setFieldValue("department", value)}
                options={departmentOptions}
                defaultOption="Select department"
                error={
                  touched.department && errors.department
                    ? errors.department
                    : ""
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                name="startTime"
                type="time"
                value={values.startTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.startTime && errors.startTime ? errors.startTime : ""
                }
                required
              />

              <Input
                label="End Time"
                name="endTime"
                type="time"
                value={values.endTime}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.endTime && errors.endTime ? errors.endTime : ""}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Scheduling Shift..." : "Schedule Shift"}
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

export default AddShiftForm;
