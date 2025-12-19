// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import Input from "../../../components/shared/Input";
// import Button from "../../../components/shared/Button";
// import ReusableSelect from "../../../components/shared/Select";

// const validationSchema = Yup.object({
//   name: Yup.string()
//     .required("Full name is required")
//     .min(2, "Name must be at least 2 characters"),
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   phone: Yup.string()
//     .required("Phone number is required")
//     .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Format: (555) 123-4567"),
//   role: Yup.string().required("Role is required"),
//   department: Yup.string().required("Department is required"),
//   hireDate: Yup.date()
//     .required("Hire date is required")
//     .max(new Date(), "Hire date cannot be in the future"),
//   schedule: Yup.string().required("Schedule is required"),
// });

// interface AddStaffFormProps {
//   roles: any[];
//   onSubmit: (values: any) => void;
//   onCancel: () => void;
// }

// const AddStaffForm = ({ roles, onSubmit, onCancel }: AddStaffFormProps) => {
//   const roleOptions = roles.map((role) => ({
//     value: role.name,
//     label: role.name,
//   }));

//   const departmentOptions = [
//     { value: "Operations", label: "Operations" },
//     { value: "Box Office", label: "Box Office" },
//     { value: "Concessions", label: "Concessions" },
//     { value: "Theater Operations", label: "Theater Operations" },
//     { value: "Technical", label: "Technical" },
//     { value: "Maintenance", label: "Maintenance" },
//   ];

//   const scheduleOptions = [
//     { value: "Full-time", label: "Full-time" },
//     { value: "Part-time", label: "Part-time" },
//     { value: "Contract", label: "Contract" },
//   ];

//   const initialValues = {
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     department: "",
//     hireDate: "",
//     schedule: "",
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={(values, { setSubmitting }) => {
//         onSubmit(values);
//         setSubmitting(false);
//       }}
//     >
//       {({
//         values,
//         errors,
//         touched,
//         handleChange,
//         handleBlur,
//         setFieldValue,
//         isSubmitting,
//         handleSubmit,
//       }) => (
//         <Form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="Full Name"
//               name="name"
//               value={values.name}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.name && errors.name ? errors.name : ""}
//               placeholder="John Doe"
//               required
//             />

//             <Input
//               label="Email"
//               name="email"
//               type="email"
//               value={values.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.email && errors.email ? errors.email : ""}
//               placeholder="john@cinema.com"
//               required
//             />

//             <Input
//               label="Phone"
//               name="phone"
//               value={values.phone}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.phone && errors.phone ? errors.phone : ""}
//               placeholder="(555) 123-4567"
//               required
//             />

//             <ReusableSelect
//               label="Role"
//               name="role"
//               value={values.role}
//               onChange={(value) => setFieldValue("role", value)}
//               options={roleOptions}
//               defaultOption="Select role"
//               error={touched.role && errors.role ? errors.role : ""}
//               required
//             />

//             <ReusableSelect
//               label="Department"
//               name="department"
//               value={values.department}
//               onChange={(value) => setFieldValue("department", value)}
//               options={departmentOptions}
//               defaultOption="Select department"
//               error={
//                 touched.department && errors.department ? errors.department : ""
//               }
//               required
//             />

//             <ReusableSelect
//               label="Schedule"
//               name="schedule"
//               value={values.schedule}
//               onChange={(value) => setFieldValue("schedule", value)}
//               options={scheduleOptions}
//               defaultOption="Select schedule"
//               error={touched.schedule && errors.schedule ? errors.schedule : ""}
//               required
//             />

//             <div className="col-span-2">
//               <Input
//                 label="Hire Date"
//                 name="hireDate"
//                 type="date"
//                 value={values.hireDate}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={
//                   touched.hireDate && errors.hireDate ? errors.hireDate : ""
//                 }
//                 required
//               />
//             </div>
//           </div>

//           <div className="flex gap-2 pt-6 border-t mt-6">
//             <Button
//               type="submit"
//               className="flex-1 rounded-md"
//               disabled={isSubmitting}
//               title={isSubmitting ? "Adding Staff..." : "Add Staff Member"}
//             />
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               disabled={isSubmitting}
//               title="Cancel"
//               className="rounded-md"
//             />
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddStaffForm;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { useMemo } from "react";
import { toast } from "react-toastify";
// import { createStaff, updateStaff } from "../../../services/staff"; // example

interface StaffData {
  id?: string;
  surname: string;
  other_names: string;
  email: string;
  phone: string;
  role_name: string;
}

interface AddStaffFormProps {
  roles: any[];
  staffData?: StaffData | null; // 👈 presence = edit mode
  onSuccess?: () => void;
  onCancel: () => void;
}

const AddStaffForm = ({
  roles,
  staffData,
  onSuccess,
  onCancel,
}: AddStaffFormProps) => {
  const isEditMode = Boolean(staffData?.id);

  const roleOptions = useMemo(
    () =>
      roles?.map((role) => ({
        value: role.id ?? role.name,
        label: role.name,
      })),
    [roles]
  );

  const validationSchema = Yup.object({
    surname: Yup.string().required("Surname is required"),
    other_names: Yup.string().required("Other names are required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role_name: Yup.string().required("Role is required"),
    password: isEditMode
      ? Yup.string().notRequired()
      : Yup.string()
          .min(8, "Minimum 8 characters")
          .required("Password is required"),
  });

  const initialValues = {
    surname: staffData?.surname || "",
    other_names: staffData?.other_names || "",
    email: staffData?.email || "",
    phone: staffData?.phone || "",
    password: "",
    role_name: staffData?.role_name || "",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const payload = { ...values };

      // Remove password on edit if empty
      if (isEditMode && !payload.password) {
        delete payload.password;
      }

      if (isEditMode) {
        // await updateStaff(staffData!.id, payload);
        toast.success("Staff updated successfully");
      } else {
        // await createStaff(payload);
        toast.success("Staff added successfully");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Surname"
              name="surname"
              value={values.surname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.surname && errors.surname ? errors.surname : ""}
              required
              placeholder="John"
            />

            <Input
              label="Other Names"
              name="other_names"
              value={values.other_names}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.other_names && errors.other_names
                  ? errors.other_names
                  : ""
              }
              required
              placeholder="Doe"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email ? errors.email : ""}
              required
              placeholder="johndoe@example.com"
            />

            <Input
              label="Phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone ? errors.phone : ""}
              required
              placeholder="08110999001"
            />

            {/* <ReusableSelect
              label="Role"
              name="role_name"
              value={values.role_name}
              onChange={(value) => setFieldValue("role_name", value)}
              options={roleOptions}
              defaultOption="Select role"
              error={
                touched.role_name && errors.role_name ? errors.role_name : ""
              }
              required
            /> */}

            {!isEditMode && (
              <Input
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.password && errors.password ? errors.password : ""
                }
                required
                placeholder="***********"
              />
            )}
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={
                isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Staff"
                  : "Add Staff"
              }
            />

            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              title="Cancel"
              className="rounded-md"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddStaffForm;
