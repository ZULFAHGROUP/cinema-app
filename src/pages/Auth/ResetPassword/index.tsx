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
import { ShieldCheck } from "lucide-react";

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

  const verifyOtp = () => {
    const joinedOtp = otp.join("");
    if (joinedOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
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
      toast.error(error?.message || "Something went wrong");
      setOtp(["", "", "", "", "", ""]);
      setPhase(1);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_-12px_rgba(117,79,44,0.14)] border border-[#c77e3b]/20">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] mb-3 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-2xl text-stone-900">
            {phase === 1 ? "Verify Recovery Code" : "Set New Password"}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {phase === 1
              ? "Enter the 6-digit verification code sent to your email"
              : "Choose a strong password for your account"}
          </p>
        </div>

        {phase === 1 && (
          <div className="space-y-6">
            <div className="flex justify-center gap-2.5 my-4">
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
                  className="w-12 h-14 text-center text-xl font-bold border border-stone-200 bg-[#fff8ea]/40 rounded-xl focus:border-[#c77e3b] focus:ring-2 focus:ring-[#c77e3b]/20 outline-none transition-all"
                />
              ))}
            </div>

            <Button
              title="Verify Code"
              className="w-full py-3"
              onClick={verifyOtp}
            />
          </div>
        )}

        {phase === 2 && (
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
              <Form className="space-y-5" onSubmit={handleSubmit}>
                <Input
                  label="New Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />

                <Button
                  title={isSubmitting ? "Resetting..." : "Reset Password"}
                  variant="primary"
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  className="w-full py-3"
                />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
