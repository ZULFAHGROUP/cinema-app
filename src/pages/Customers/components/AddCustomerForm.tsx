/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { UserPlus, Check } from "lucide-react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Format: (555) 123-4567"),
  joinDate: Yup.date()
    .required("Join date is required")
    .max(new Date(), "Join date cannot be in the future"),
  preferences: Yup.array()
    .min(1, "At least one preference is required")
    .required("Preferences are required"),
});

interface AddCustomerFormProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddCustomerForm = ({ onSubmit, onCancel }: AddCustomerFormProps) => {
  const preferenceOptions = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Adventure",
  ];

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    preferences: [] as string[],
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
      }) => {
        const togglePreference = (pref: string) => {
          const current = values.preferences || [];
          if (current.includes(pref)) {
            setFieldValue(
              "preferences",
              current.filter((p) => p !== pref)
            );
          } else {
            setFieldValue("preferences", [...current, pref]);
          }
        };

        return (
          <Form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
                <UserPlus size={18} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                  Loyalty Member Registration
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enroll a customer to track loyalty points, rewards, and favorite
                  movie genres.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && errors.name ? errors.name : ""}
                placeholder="John Doe"
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email ? errors.email : ""}
                placeholder="john@example.com"
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && errors.phone ? errors.phone : ""}
                placeholder="(555) 123-4567"
                hint="Required format: (555) 123-4567"
                required
              />

              <Input
                label="Enrollment Date"
                name="joinDate"
                type="date"
                value={values.joinDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.joinDate && errors.joinDate ? errors.joinDate : ""
                }
                restrictFutureDate
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Favorite Movie Genres <span className="text-[#c77e3b]">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {preferenceOptions.map((pref) => {
                  const selected = values.preferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selected
                          ? "bg-[#fff8ea] border-[#c77e3b] text-[#754f2c] shadow-xs"
                          : "bg-white border-stone-200 text-stone-600 hover:border-[#c77e3b]/40"
                      }`}
                    >
                      {selected && <Check size={13} className="text-[#c77e3b]" />}
                      {pref}
                    </button>
                  );
                })}
              </div>
              {touched.preferences && errors.preferences && (
                <p className="text-xs text-red-500 font-medium mt-1.5">
                  {errors.preferences as string}
                </p>
              )}
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
                title={isSubmitting ? "Adding Customer..." : "Enroll Customer"}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddCustomerForm;
