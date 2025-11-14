// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import Input from "../../../components/shared/Input";
// import Button from "../../../components/shared/Button";
// // import ReusableSelect from "../../../components/shared/Select";
// import { CreditCard, Wallet, DollarSign } from "lucide-react";

// const validationSchema = Yup.object({
//   paymentMethod: Yup.string().required("Payment method is required"),
//   cardNumber: Yup.string().when("paymentMethod", {
//     is: "card",
//     then: (schema) =>
//       schema
//         .required("Card number is required")
//         .matches(/^\d{16}$/, "Card number must be 16 digits"),
//   }),
//   cardName: Yup.string().when("paymentMethod", {
//     is: "card",
//     then: (schema) => schema.required("Cardholder name is required"),
//   }),
//   expiryDate: Yup.string().when("paymentMethod", {
//     is: "card",
//     then: (schema) =>
//       schema
//         .required("Expiry date is required")
//         .matches(/^\d{2}\/\d{2}$/, "Format: MM/YY"),
//   }),
//   cvv: Yup.string().when("paymentMethod", {
//     is: "card",
//     then: (schema) =>
//       schema
//         .required("CVV is required")
//         .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
//   }),
// });

// interface PaymentProps {
//   totalAmount: number;
//   onComplete: (payment: any) => void;
//   onBack: () => void;
// }

// export default function Payment({
//   totalAmount,
//   onComplete,
//   onBack,
// }: PaymentProps) {
//   const [paymentMethod, setPaymentMethod] = useState("card");

//   const paymentOptions = [
//     { value: "card", label: "Credit/Debit Card" },
//     { value: "cash", label: "Cash" },
//     { value: "mobile", label: "Mobile Payment" },
//   ];

//   const initialValues = {
//     paymentMethod: "card",
//     cardNumber: "",
//     cardName: "",
//     expiryDate: "",
//     cvv: "",
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button
//           onClick={onBack}
//           variant="outline"
//           title="← Back"
//           className="rounded-md"
//         />
//         <h2 className="text-xl font-sans font-semibold">Payment</h2>
//       </div>

//       <div className="border rounded-lg p-6">
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={(values, { setSubmitting }) => {
//             setTimeout(() => {
//               onComplete(values);
//               setSubmitting(false);
//             }, 1000);
//           }}
//         >
//           {({
//             values,
//             errors,
//             touched,
//             handleChange,
//             handleBlur,
//             setFieldValue,
//             isSubmitting,
//             handleSubmit,
//           }) => (
//             <Form onSubmit={handleSubmit}>
//               <div className="space-y-6">
//                 {/* Payment Method Selection */}
//                 <div className="grid grid-cols-3 gap-4">
//                   {[
//                     { value: "card", icon: CreditCard, label: "Card" },
//                     { value: "cash", icon: DollarSign, label: "Cash" },
//                     { value: "mobile", icon: Wallet, label: "Mobile" },
//                   ].map((method) => (
//                     <button
//                       key={method.value}
//                       type="button"
//                       onClick={() => {
//                         setFieldValue("paymentMethod", method.value);
//                         setPaymentMethod(method.value);
//                       }}
//                       className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
//                         values.paymentMethod === method.value
//                           ? "border-primary bg-primary/5"
//                           : "border-gray-300"
//                       }`}
//                     >
//                       <method.icon className="w-6 h-6" />
//                       <span className="text-sm font-serif">{method.label}</span>
//                     </button>
//                   ))}
//                 </div>

//                 {/* Card Payment Form */}
//                 {values.paymentMethod === "card" && (
//                   <div className="space-y-4">
//                     <Input
//                       label="Card Number"
//                       name="cardNumber"
//                       value={values.cardNumber}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={
//                         touched.cardNumber && errors.cardNumber
//                           ? errors.cardNumber
//                           : ""
//                       }
//                       placeholder="1234 5678 9012 3456"
//                       maxLength={16}
//                       required
//                     />

//                     <Input
//                       label="Cardholder Name"
//                       name="cardName"
//                       value={values.cardName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       error={
//                         touched.cardName && errors.cardName
//                           ? errors.cardName
//                           : ""
//                       }
//                       placeholder="John Doe"
//                       required
//                     />

//                     <div className="grid grid-cols-2 gap-4">
//                       <Input
//                         label="Expiry Date"
//                         name="expiryDate"
//                         value={values.expiryDate}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={
//                           touched.expiryDate && errors.expiryDate
//                             ? errors.expiryDate
//                             : ""
//                         }
//                         placeholder="MM/YY"
//                         maxLength={5}
//                         required
//                       />

//                       <Input
//                         label="CVV"
//                         name="cvv"
//                         type="password"
//                         value={values.cvv}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={touched.cvv && errors.cvv ? errors.cvv : ""}
//                         placeholder="123"
//                         maxLength={4}
//                         required
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Cash Payment */}
//                 {values.paymentMethod === "cash" && (
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <p className="font-serif text-sm text-muted-foreground mb-2">
//                       Cash Payment
//                     </p>
//                     <p className="font-sans text-2xl font-bold">
//                       ${totalAmount.toFixed(2)}
//                     </p>
//                     <p className="font-serif text-sm text-muted-foreground mt-2">
//                       Collect cash from customer at the counter
//                     </p>
//                   </div>
//                 )}

//                 {/* Mobile Payment */}
//                 {values.paymentMethod === "mobile" && (
//                   <div className="p-4 bg-gray-50 rounded-lg">
//                     <p className="font-serif text-sm text-muted-foreground mb-2">
//                       Mobile Payment
//                     </p>
//                     <p className="font-sans text-2xl font-bold">
//                       ${totalAmount.toFixed(2)}
//                     </p>
//                     <p className="font-serif text-sm text-muted-foreground mt-2">
//                       Show QR code or NFC reader to customer
//                     </p>
//                   </div>
//                 )}

//                 {/* Total Amount */}
//                 <div className="border-t pt-4">
//                   <div className="flex items-center justify-between mb-6">
//                     <span className="font-sans font-semibold text-lg">
//                       Total Amount
//                     </span>
//                     <span className="font-sans font-bold text-2xl">
//                       ${totalAmount.toFixed(2)}
//                     </span>
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full rounded-md"
//                     title={isSubmitting ? "Processing..." : "Complete Payment"}
//                   />
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }

const Payment = () => {
  return <div>Payment</div>;
};

export default Payment;
