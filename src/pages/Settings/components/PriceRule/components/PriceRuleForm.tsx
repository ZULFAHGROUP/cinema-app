/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import Input from "../../../../../components/shared/Input";
import Button from "../../../../../components/shared/Button";
import ReusableSelect from "../../../../../components/shared/Select";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import {
  createPriceRule,
  updatePriceRule,
  getAllPriceRules,
} from "../../../../../store/slices/priceRule";
import { toast } from "react-toastify";
import { priceRuleSchema } from "../../../../../validations";
import { useEffect } from "react";
import { getAllCinemas } from "../../../../../store/slices/cinema";
import { getAllProducts } from "../../../../../store/slices/product";

interface PriceRuleFormProps {
  onCancel: () => void;
  editMode?: boolean;
  priceRuleData?: any;
  movies?: any[];
  screenTypes?: any[];
}

const DAYS_OF_WEEK = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const PriceRuleForm = ({
  onCancel,
  editMode,
  priceRuleData,
  movies = [],
  screenTypes = [],
}: PriceRuleFormProps) => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.priceRule);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { products } = useAppSelector((state) => state.product);
  const { user } = useAppSelector((state) => state.accounts.data);
  
  const userCinemaId = user?.cinema_id;
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    if (isAdmin) {
      dispatch(getAllCinemas({ page: 1, limit: 100 }));
    }
    dispatch(getAllProducts({ page: 1, limit: 100 }));
  }, [dispatch, isAdmin]);

  const initialValues = {
    name: priceRuleData?.name || "",
    price: priceRuleData?.price || "",
    screen_type_id: priceRuleData?.screen_type_id || "",
    movie_id: priceRuleData?.movie_id || "",
    priority: priceRuleData?.priority || 1,
    day_of_week: priceRuleData?.day_of_week || [],
    start_time: priceRuleData?.start_time || "",
    end_time: priceRuleData?.end_time || "",
    cinema_id: priceRuleData?.cinema_id || (isAdmin ? "" : userCinemaId || ""),
    product_ids: priceRuleData?.product_ids || [],
  };

  const cinemaOptions = [
    { label: "General (All Cinemas)", value: "" },
    ...(allCinemas?.map((cinema: any) => ({
      label: cinema.name,
      value: cinema.cinema_id,
    })) || []),
  ];

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      // Prepare payload - remove cinema_id if empty (for general rules)
      const payload = {
        ...values,
        cinema_id: values.cinema_id || undefined,
        is_global: values.cinema_id === "",
      };

      if (editMode) {
        const response = await dispatch(
          updatePriceRule({
            id: priceRuleData.price_rule_id,
            data: payload,
          })
        ).unwrap();
        if (response.code === 200) {
          toast.success(response.message);
        }
      } else {
        const response = await dispatch(createPriceRule(payload)).unwrap();
        if (response.code === 201) {
          toast.success(response.message);
        }
      }

      await dispatch(getAllPriceRules({ page, limit }));
      resetForm();
      onCancel();
    } catch (error: any) {
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
   <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={priceRuleSchema}
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
        handleSubmit,
      }) => (
        <Form onSubmit={handleSubmit}>
          {errors && (errors as any).atLeastOneSelection && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4 border border-red-100">
               {(errors as any).atLeastOneSelection}
            </div>
          )}
          <div className="space-y-4">
            {/* Name and Price */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Rule Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.name && typeof errors.name === "string"
                    ? errors.name
                    : undefined
                }
                placeholder="Weekend Premium"
                required
              />

              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.price && typeof errors.price === "string"
                    ? errors.price
                    : undefined
                }
                placeholder="15.50"
                required
              />
            </div>

            {/* Movie and Screen Type */}
            <div className="grid grid-cols-2 gap-4">
              <ReusableSelect
                label="Movie"
                name="movie_id"
                value={values.movie_id}
                onChange={(value) => setFieldValue("movie_id", value)}
                options={movies.map((movie: any) => ({
                  label: movie.title,
                  value: movie.movie_id,
                }))}
                defaultOption="Select movie"
                error={
                  touched.movie_id && typeof errors.movie_id === "string"
                    ? errors.movie_id
                    : undefined
                }
              />

              <ReusableSelect
                label="Screen Type"
                name="screen_type_id"
                value={values.screen_type_id}
                onChange={(value) => setFieldValue("screen_type_id", value)}
                options={screenTypes.map((type: any) => ({
                  label: type.name,
                  value: type.screen_type_id,
                }))}
                defaultOption="Select screen type"
                error={
                  touched.screen_type_id && typeof errors.screen_type_id === "string"
                    ? errors.screen_type_id
                    : undefined
                }
              />
            </div>

            {/* Cinema (Admin only) */}
            {isAdmin && (
              <ReusableSelect
                label="Cinema"
                name="cinema_id"
                value={values.cinema_id}
                onChange={(value) => setFieldValue("cinema_id", value)}
                options={cinemaOptions}
                defaultOption="Select cinema"
                error={
                  touched.cinema_id && typeof errors.cinema_id === "string"
                    ? errors.cinema_id
                    : undefined
                }
              />
            )}

            {/* Priority and Days of Week */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Priority"
                name="priority"
                type="number"
                value={values.priority}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.priority && typeof errors.priority === "string"
                    ? errors.priority
                    : undefined
                }
                placeholder="1"
                required
              />

              <ReusableSelect
                label="Days of Week"
                name="day_of_week"
                mode="multiple"
                value={values.day_of_week}
                onChange={(value) => setFieldValue("day_of_week", value)}
                options={DAYS_OF_WEEK?.map((screen: any) => ({
                    label: screen.label,
                    value: screen.value,
                  })) || []}
                defaultOption="Select days"
                error={
                  touched.day_of_week && typeof errors.day_of_week === "string"
                    ? errors.day_of_week
                    : undefined
                }
              />
            </div>
            
            {/* Products Selection */}
            <ReusableSelect
                label="Products"
                name="product_ids"
                mode="multiple"
                value={values.product_ids}
                onChange={(value) => setFieldValue("product_ids", value)}
                options={products?.map((product: any) => ({
                    label: product.name,
                    value: product.product_id,
                })) || []}
                defaultOption="Select products"
                error={
                    touched.product_ids && typeof errors.product_ids === "string"
                    ? errors.product_ids
                    : undefined
                }
            />

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                name="start_time"
                type="time"
                step="1"
                value={values.start_time}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.start_time && typeof errors.start_time === "string"
                    ? errors.start_time
                    : undefined
                }
                required={values.day_of_week && values.day_of_week.length > 0}
              />

              <Input
                label="End Time"
                name="end_time"
                type="time"
                step="1"
                value={values.end_time}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.end_time && typeof errors.end_time === "string"
                    ? errors.end_time
                    : undefined
                }
                required={values.day_of_week && values.day_of_week.length > 0}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Update Price Rule"
                  : "Add Price Rule"
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

export default PriceRuleForm;
