/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../store/slices/accounts";
import { AppDispatch } from "../../../store/store";
import { loginValidationSchema } from "../../../validations";
import { allRoutes } from "../../../routes/allRoutes";
import AuthLayout from "../../../components/shared/AuthLayout";
import { toast } from "react-toastify";
import { LockKeyhole } from "lucide-react";

const initialValues = { email: "", password: "" };

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  async function handleLogin(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      const response = await dispatch(login(values)).unwrap();
      if (response.status === true) {
        navigate("/dashboard");
      }
      resetForm();
    } catch (error: any) {
      if (error.code === "ERR_BAD_REQUEST") {
        toast.error(
          `${error.message}. Confirm your email and password then try again`
        );
      } else {
        toast.error(error.message || "Something went wrong");
      }
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(117,79,44,0.14)] border border-[#c77e3b]/20">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] mb-3 shadow-2xs">
            <LockKeyhole className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-2xl md:text-3xl text-stone-900">
            Welcome Back
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Sign in to manage your cinema operations
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            values,
            errors,
            handleSubmit,
            isValid,
            dirty,
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

              <Input
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex gap-2 items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 rounded accent-[#c77e3b] cursor-pointer"
                    onChange={handleChange}
                  />
                  <span className="text-xs font-semibold text-stone-600">
                    Remember me
                  </span>
                </label>
                <span className="text-xs text-stone-500">
                  Forgot Password?{" "}
                  <Link
                    to={allRoutes.forgetPassword}
                    className="text-[#c77e3b] hover:text-[#754f2c] font-bold underline-offset-4 hover:underline transition"
                  >
                    Reset
                  </Link>
                </span>
              </div>

              <div className="pt-2">
                <Button
                  title="Sign In to Dashboard"
                  variant="primary"
                  className="w-full py-3"
                  loading={isSubmitting}
                  disabled={!isValid || !dirty || isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AuthLayout>
  );
};

export default Login;
