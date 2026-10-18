/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import AuthLayout from "../../../components/shared/AuthLayout";
import { resetPasswordValidationSchema } from "../../../validations";
import Accounts from "../../../services/network/accounts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { allRoutes } from "../../../routes/allRoutes";

const ResetPassword = () => {
  const [phase, setPhase] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<any>([]);
  const navigate = useNavigate();

  const handleOtpChange = (value: any, index: number) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleOtpBackspace = (value: any, index: number) => {
    if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // This runs when user submits OTP form
  const verifyOtp = () => {
    const joinedOtp = otp.join("");
    if (joinedOtp.length !== 6) return alert("Please enter full OTP");
    setPhase(2);
  };

  const email = localStorage.getItem("recoveryEmail");

  const handleResetSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!email) {
      toast.error("Start password recovery with your email first");
      navigate(allRoutes.forgetPassword);
      return;
    }

    try {
      const response = await Accounts.completeForgetPassword({
        email,
        otp: otp.join(""),
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      localStorage.removeItem("recoveryEmail");
      toast.success(response.data.message);
      resetForm();
      navigate(`${allRoutes.auth}/login`);
    } catch (error: any) {
      // A wrong or expired code: go back and enter it again.
      toast.error(error?.message || "Something went wrong");
      setOtp(["", "", "", "", "", ""]);
      setPhase(1);
    }
  };

  return (
    <AuthLayout>
      <div className="p-12 space-y-4 text- w-full shadow-lg rounded-lg border border-gray-200">
        {phase === 1 && (
          <>
            <p className="font-medium text-lg md:text-2xl">
              Enter the 6-digit code sent to your email
            </p>

            <div className="flex justify-center gap-3 my-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: any) => (inputsRef.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e: any) => {
                    if (e.key === "Backspace")
                      handleOtpBackspace(e.target.value, index);
                  }}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:border-black outline-none"
                />
              ))}
            </div>

            <Button title="Verify OTP" className="w-full" onClick={verifyOtp} />
          </>
        )}

        {phase === 2 && (
          <>
            <p className="font-medium text-lg md:text-2xl">
              Reset Your Password
            </p>

            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
              }}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleResetSubmit}
            >
              {({
                handleChange,
                values,
                errors,
                handleSubmit,
                isValid,
                isSubmitting,
              }) => (
                <Form className="space-y-4 my-6" onSubmit={handleSubmit}>
                  <Input
                    label="New Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />

                  <Button
                    title={isSubmitting ? "Resetting..." : "Reset Password"}
                    variant="secondary"
                    type="submit"
                    disabled={!isValid}
                    className="w-full rounded-md"
                  />
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
