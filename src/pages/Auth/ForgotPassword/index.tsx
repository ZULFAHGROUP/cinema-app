/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { forgotPasswordValidationSchema } from "../../../validations";
import AuthLayout from "../../../components/shared/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { allRoutes } from "../../../routes/allRoutes";
import Accounts from "../../../services/network/accounts";
import { toast } from "react-toastify";
import { KeyRound } from "lucide-react";

const ForgotPassword = () => {
  const initialValues = { email: "" };
  const navigate = useNavigate();

  async function handleForgotPassword(values: { email: string }) {
    try {
      const response = await Accounts.startForgetPassword(values);
      localStorage.setItem("recoveryEmail", values.email);
      toast.success(response.data.message);
      navigate(allRoutes.resetPassword);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(117,79,44,0.14)] border border-[#c77e3b]/20">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] mb-3 shadow-2xs">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-2xl text-stone-900">
            Account Recovery
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Enter your staff email to receive a 6-digit recovery code
          </p>
        </div>

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
            <Form className="space-y-5 text-start" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="name@company.com"
                required
              />

              <div className="pt-2 space-y-3">
                <Button
                  title={isSubmitting ? "Sending Code..." : "Send Recovery Code"}
                  variant="primary"
                  type="submit"
                  className="w-full py-3"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                />
                <div className="text-center">
                  <Link
                    to={`${allRoutes.auth}/login`}
                    className="text-xs font-bold text-[#c77e3b] hover:text-[#754f2c]"
                  >
                    ← Back to Sign In
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
