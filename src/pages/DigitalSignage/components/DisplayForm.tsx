/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Tv } from "lucide-react";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { DisplayInput } from "../../../services/network/signage";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Display name is required").max(100),
  location: Yup.string().max(150),
  resolution: Yup.string().matches(
    /^\d{3,5}x\d{3,5}$/,
    "Use the form 1920x1080"
  ),
  orientation: Yup.string().oneOf(["landscape", "portrait"]),
});

interface DisplayFormProps {
  display?: any;
  onSubmit: (values: DisplayInput) => Promise<void>;
  onCancel: () => void;
}

const RESOLUTION_PRESETS = [
  { label: "1080p HD", value: "1920x1080" },
  { label: "4K UHD", value: "3840x2160" },
  { label: "Vertical HD", value: "1080x1920" },
];

const DisplayForm = ({ display, onSubmit, onCancel }: DisplayFormProps) => (
  <Formik
    initialValues={{
      name: display?.name || "",
      location: display?.location || "",
      resolution: display?.resolution || "1920x1080",
      orientation: display?.orientation || "landscape",
    }}
    validationSchema={validationSchema}
    onSubmit={async (values, { setSubmitting }) => {
      try {
        await onSubmit({
          ...values,
          location: values.location.trim() || null,
        });
      } catch {
        // Error toast handled upstream
      } finally {
        setSubmitting(false);
      }
    }}
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
      <Form className="space-y-5">
        <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
            <Tv size={18} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
              Digital Signage Display
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Register a lobby TV, menu board, or poster screen and configure
              its aspect ratio.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Display Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.name && typeof errors.name === "string" ? errors.name : ""
            }
            placeholder="e.g., Lobby Main Screen"
            required
          />
          <Input
            label="Physical Placement / Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Main lobby, above the box office"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Resolution (WxH)"
                name="resolution"
                value={values.resolution}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.resolution && typeof errors.resolution === "string"
                    ? errors.resolution
                    : ""
                }
                placeholder="1920x1080"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {RESOLUTION_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setFieldValue("resolution", preset.value)}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                      values.resolution === preset.value
                        ? "bg-[#fff8ea] border-[#c77e3b] text-[#754f2c] font-semibold"
                        : "bg-stone-50 border-stone-200 text-stone-500 hover:border-[#c77e3b]/40"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <ReusableSelect
              label="Screen Orientation"
              name="orientation"
              value={values.orientation}
              onChange={(value) => setFieldValue("orientation", value)}
              options={[
                { value: "landscape", label: "Landscape (Horizontal)" },
                { value: "portrait", label: "Portrait (Vertical)" },
              ]}
              showSearch={false}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-stone-200/80">
          <Button
            type="button"
            variant="outline"
            title="Cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            className="min-w-[140px]"
            loading={isSubmitting}
            disabled={isSubmitting}
            title={display ? "Save Display" : "Add Display"}
          />
        </div>
      </Form>
    )}
  </Formik>
);

export default DisplayForm;
