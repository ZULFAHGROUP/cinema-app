/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
});

interface CustomerInfoProps {
  onSubmit: (info: any) => void;
  onBack: () => void;
}

export default function CustomerInfo({ onSubmit, onBack }: CustomerInfoProps) {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          title="← Back"
          className="rounded-md"
        />
        <h2 className="text-xl font-sans font-semibold">
          Customer Information
        </h2>
      </div>

      <div className="border rounded-lg p-6">
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
            isSubmitting,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.firstName && errors.firstName
                      ? errors.firstName
                      : ""
                  }
                  placeholder="John"
                  required
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.lastName && errors.lastName ? errors.lastName : ""
                  }
                  placeholder="Doe"
                  required
                />

                <Input
                  label="Email"
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
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && errors.phone ? errors.phone : ""}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 rounded-md"
                title="Continue to Payment"
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
