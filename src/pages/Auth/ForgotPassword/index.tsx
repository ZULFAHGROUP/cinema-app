import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { Carousel } from "antd";
import { forgotPasswordValidationSchema } from "../../../validations";
const ForgotPassword = () => {
  const initialValues = { email: "" };

  async function handleForgotPassword() {}

  return (
    <div className="flex min-h-screen p-6">
      <div className="bg-[url('/src/assets/background.jpg')] items-end font-bold text-6xl flex-1 hidden md:flex">
        <Carousel autoplay className="text-[#7da851] max-w-xl p-10 h-full">
          <div className="">
            <h3 className="text-4xl font-bold">Welcome to Our Platform</h3>
            <p className="italic text-lg mt-2">
              Explore a world of opportunities tailored just for you.
            </p>
          </div>
          <div className="">
            <h3 className="text-4xl font-bold">Join Our Community</h3>
            <p className="italic text-lg mt-2">
              Connect with like-minded individuals and grow together.
            </p>
          </div>
          <div className="">
            <h3 className="text-4xl font-bold">Achieve Your Goals</h3>
            <p className="italic text-lg mt-2">
              Your success is our priority—start your journey today.
            </p>
          </div>
        </Carousel>
      </div>
      <div className="flex-1 flex justify-center items-center">
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
            {({ handleChange, values, errors, handleSubmit, isValid }) => (
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
                    title="Start Recovery"
                    variant="secondary"
                    className="rounded-md w-full"
                    disabled={isValid}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
