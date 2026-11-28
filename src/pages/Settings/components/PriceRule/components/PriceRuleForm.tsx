/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from "formik";
import { Tag, Sliders, Clock, AlertCircle } from "lucide-react";
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

const normalizeTimeWithSeconds = (t?: string | null) => {
  if (!t) return undefined;
  const trimmed = t.trim();
  if (!trimmed) return undefined;
  if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  return trimmed;
};

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
  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    if (isAdmin) {
      dispatch(getAllCinemas({ page: 1, limit: 100 }));
    }
    dispatch(getAllProducts({ page: 1, limit: 100 }));
  }, [dispatch, isAdmin]);

  const initialDays = Array.isArray(priceRuleData?.day_of_week)
    ? priceRuleData.day_of_week
    : typeof priceRuleData?.day_of_week === "number"
    ? [priceRuleData.day_of_week]
    : [];

  const initialProducts = Array.isArray(priceRuleData?.product_ids)
    ? priceRuleData.product_ids
    : Array.isArray(priceRuleData?.products)
    ? priceRuleData.products.map((p: any) => p.product_id).filter(Boolean)
    : [];

  const initialValues = {
    name: priceRuleData?.name || "",
    price: priceRuleData?.price || "",
    screen_type_id: priceRuleData?.screen_type_id || "",
    movie_id: priceRuleData?.movie_id || "",
    priority: priceRuleData?.priority || 1,
    day_of_week: initialDays,
    start_time: priceRuleData?.start_time || "",
    end_time: priceRuleData?.end_time || "",
    cinema_id: priceRuleData?.cinema_id || (isAdmin ? "" : userCinemaId || ""),
    product_ids: initialProducts,
  };

  const cinemaOptions = [
    { label: "General (All Cinemas)", value: "GLOBAL_ALL" },
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
      const isGlobal = !values.cinema_id || values.cinema_id === "GLOBAL_ALL";
      const payload = {
        ...values,
        price: Number(values.price),
        priority: Number(values.priority),
        cinema_id: isGlobal ? undefined : values.cinema_id,
        is_global: isGlobal,
        movie_id: values.movie_id || undefined,
        screen_type_id: values.screen_type_id || undefined,
        day_of_week:
          Array.isArray(values.day_of_week) && values.day_of_week.length > 0
            ? values.day_of_week
            : undefined,
        start_time: normalizeTimeWithSeconds(values.start_time),
        end_time: normalizeTimeWithSeconds(values.end_time),
        product_ids:
          Array.isArray(values.product_ids) && values.product_ids.length > 0
            ? values.product_ids
            : undefined,
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
        if (response.code === 201 || response.code === 200) {
          toast.success(response.message);
        }
      }

      await dispatch(getAllPriceRules({ page, limit }));
      resetForm();
      onCancel();
    } catch (error: any) {
      toast.error(
        error?.response?.message || error?.message || "Something went wrong"
      );
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
        <Form onSubmit={handleSubmit} className="space-y-5">
          {errors && (errors as any).atLeastOneSelection && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-xs font-medium border border-red-200 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{(errors as any).atLeastOneSelection}</span>
            </div>
          )}

          {/* Section 1: Rule Identity & Pricing */}
          <div className="rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-[#c77e3b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                1. Rule Identity & Price
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
                placeholder="e.g., Weekend Premium"
                conClassName="md:col-span-1"
                required
              />

              <Input
                label="Ticket Price (₦)"
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
                placeholder="e.g., 4500"
                required
              />

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
                hint="Higher overrides lower"
                required
              />
            </div>

            {isAdmin && (
              <ReusableSelect
                label="Cinema Branch Scope"
                name="cinema_id"
                value={values.cinema_id || "GLOBAL_ALL"}
                onChange={(value) =>
                  setFieldValue(
                    "cinema_id",
                    value === "GLOBAL_ALL" ? "" : value
                  )
                }
                options={cinemaOptions}
                defaultOption="General (All Cinemas)"
                error={
                  touched.cinema_id && typeof errors.cinema_id === "string"
                    ? errors.cinema_id
                    : undefined
                }
              />
            )}
          </div>

          {/* Section 2: Target Scope */}
          <div className="rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders size={15} className="text-[#c77e3b]" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  2. Target Conditions
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                Choose at least one condition or day below
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <ReusableSelect
                label="Specific Movie (Optional)"
                name="movie_id"
                value={values.movie_id}
                onChange={(value) => setFieldValue("movie_id", value || "")}
                options={
                  movies?.map((movie: any) => ({
                    label: movie.title,
                    value: movie.movie_id,
                  })) || []
                }
                defaultOption="Any Movie"
                allowClear
                error={
                  touched.movie_id && typeof errors.movie_id === "string"
                    ? errors.movie_id
                    : undefined
                }
              />

              <ReusableSelect
                label="Screen Experience (Optional)"
                name="screen_type_id"
                value={values.screen_type_id}
                onChange={(value) =>
                  setFieldValue("screen_type_id", value || "")
                }
                options={
                  screenTypes?.map((type: any) => ({
                    label: type.name,
                    value: type.screen_type_id,
                  })) || []
                }
                defaultOption="Any Screen Type"
                allowClear
                error={
                  touched.screen_type_id &&
                  typeof errors.screen_type_id === "string"
                    ? errors.screen_type_id
                    : undefined
                }
              />
            </div>

            <ReusableSelect
              label="Bundled Concession Products (Optional)"
              name="product_ids"
              mode="multiple"
              value={values.product_ids}
              onChange={(value) => setFieldValue("product_ids", value)}
              options={
                products?.map((product: any) => ({
                  label: product.name,
                  value: product.product_id,
                })) || []
              }
              defaultOption="Select bundled products (if any)"
              error={
                touched.product_ids && typeof errors.product_ids === "string"
                  ? errors.product_ids
                  : undefined
              }
            />
          </div>

          {/* Section 3: Schedule Window */}
          <div className="rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4 space-y-3.5">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[#c77e3b]" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                3. Days & Time Window (Optional)
              </span>
            </div>

            <ReusableSelect
              label="Applicable Days of Week"
              name="day_of_week"
              mode="multiple"
              value={values.day_of_week}
              onChange={(value) => setFieldValue("day_of_week", value)}
              options={DAYS_OF_WEEK.map((day) => ({
                label: day.label,
                value: day.value,
              }))}
              defaultOption="All days (or pick specific days)"
              error={
                touched.day_of_week && typeof errors.day_of_week === "string"
                  ? errors.day_of_week
                  : undefined
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                required={
                  Array.isArray(values.day_of_week) &&
                  values.day_of_week.length > 0
                }
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
                required={
                  Array.isArray(values.day_of_week) &&
                  values.day_of_week.length > 0
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-stone-200/80">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              title="Cancel"
            />
            <Button
              type="submit"
              className="min-w-[160px]"
              disabled={isSubmitting}
              loading={isSubmitting}
              title={
                isSubmitting
                  ? editMode
                    ? "Updating..."
                    : "Adding..."
                  : editMode
                  ? "Save Price Rule"
                  : "Create Price Rule"
              }
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PriceRuleForm;
