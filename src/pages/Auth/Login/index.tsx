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
    } catch (error :any) {
      if(error.code === 'ERR_BAD_REQUEST'){
        toast.error(`${error.message}. Confirm your email and password then try again`);
      }else{
        toast.error(error.message ||"Something went wrong");
      }
    }
  }

  return (
    <AuthLayout>
      <div className="p-12 text-center space-y-2 w-full md:w-[30rem] shadow-lg rounded-lg border border-gray-200">
        <p className="font-medium text-lg md:text-3xl">Welcome Back!</p>
        <p>Login to continue to see what is happening with your cinemas.</p>
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

              <Input
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="********"
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <Input
                    type="checkbox"
                    id="rememberMe"
                    className="accent-[#c77e3b]"
                    // checked={}
                    onChange={handleChange}
                  />
                  <p className="text-xs font-semibold">Remember me</p>
                </div>
                <span className="text-[#c77e3b] text-xs font-normal">
                  Forgot Password?{" "}
                  <Link
                    to={allRoutes.forgetPassword}
                    className="text-[#c77e3b] font-semibold transition ease-in-out duration-300"
                  >
                    Reset
                  </Link>
                </span>
              </div>

              <div className="flex justify-center">
                <Button
                  title="Login"
                  variant="secondary"
                  className="rounded-md w-full"
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
