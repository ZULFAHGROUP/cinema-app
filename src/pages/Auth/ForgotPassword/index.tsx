import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { forgotPasswordValidationSchema } from "../../../validations";
import AuthLayout from "../../../components/shared/AuthLayout";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../routes/allRoutes";
const ForgotPassword = () => {
  const initialValues = { email: "" };
  const navigate = useNavigate();
  async function handleForgotPassword() {
    try {
      // localStorage.setItem('recoveryEmail', values.email)
      navigate(allRoutes.resetPassword);
    } catch (e) {
      console.log("error is", e);
    }
  }

  return (
    <AuthLayout>
      <div className="p-12 text-center space-y-2 w-full md:w-[30rem] shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-lg md:text-3xl">
          Let's help you recover your account!
        </p>
        <p>Input your account email to start password recovery</p>
        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleForgotPassword}
        >
          {({
            handleChange,
            values,
            errors,
            handleSubmit,
            isValid,
            isSubmitting,
          }) => (
            <Form
              className="flex-1 space-y-4 text-start my-6"
              onSubmit={handleSubmit}
            >
              <Input
                label="Email"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                className=""
                placeholder="example@example.com"
              />

              <div className="flex justify-center">
                <Button
                  title={isSubmitting ? "Sending Otp..." : "Start Recovery"}
                  variant="secondary"
                  type="submit"
                  className="rounded-md w-full"
                  disabled={!isValid}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
