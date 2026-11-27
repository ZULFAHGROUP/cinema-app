/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Radio, Upload } from "antd";
import { ImagePlus, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../../components/shared/Input";
import TextArea from "../../../components/shared/TextArea";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import Signage, {
  ContentInput,
  SignageContentType,
} from "../../../services/network/signage";
import { CONTENT_TYPES, CONTENT_TYPE_OPTIONS } from "../constants";

type MediaSource = "none" | "upload" | "link";

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Content name is required").max(100),
  type: Yup.string().required("Content type is required"),
  description: Yup.string().max(2000),
  duration_seconds: Yup.number()
    .typeError("Enter a number of seconds")
    .min(3, "At least 3 seconds")
    .max(3600, "At most an hour")
    .required("Duration is required"),
  media_url: Yup.string().url("Enter a full link starting with https://"),
});

interface AddContentFormProps {
  content?: any;
  onSubmit: (values: ContentInput) => Promise<void>;
  onCancel: () => void;
}

const DURATION_PRESETS = [10, 15, 30, 60];

const AddContentForm = ({
  content,
  onSubmit,
  onCancel,
}: AddContentFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [upload, setUpload] = useState<{ id: string; url: string } | null>(
    null
  );
  const [mediaSource, setMediaSource] = useState<MediaSource>(
    content?.media_url ? "link" : "upload"
  );

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Upload an image. For a video, paste its link instead.");
      return;
    }
    setUploading(true);
    try {
      const response = await Signage.uploadImage(file);
      setUpload({
        id: response.data.data.temp_upload_id,
        url: response.data.data.url,
      });
    } catch (error: any) {
      toast.error(error?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: content?.name || "",
        type: (content?.type || "") as SignageContentType | "",
        description: content?.description || "",
        duration_seconds: content?.duration_seconds ?? 15,
        media_url: content?.media_url || "",
        media_kind: content?.media_kind || "image",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const live = values.type && CONTENT_TYPES[values.type].live;
        const hasMedia =
          (mediaSource === "upload" && (upload || content?.media_url)) ||
          (mediaSource === "link" && values.media_url.trim());
        if (values.type === "promotional" && !hasMedia) {
          toast.error("Promotional content needs an image or a video link");
          setSubmitting(false);
          return;
        }
        const payload: ContentInput = {
          name: values.name.trim(),
          type: values.type as SignageContentType,
          description: values.description.trim() || null,
          duration_seconds: Number(values.duration_seconds),
        };
        if (!live) {
          if (mediaSource === "upload" && upload)
            payload.media_temp_upload_id = upload.id;
          if (mediaSource === "link" && values.media_url) {
            payload.media_url = values.media_url.trim();
            payload.media_kind = values.media_kind as "image" | "video";
          }
          if (mediaSource === "none" && content?.media_url)
            payload.media_url = null;
        }
        try {
          await onSubmit(payload);
        } catch {
          // Handled upstream
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
      }) => {
        const type = values.type ? CONTENT_TYPES[values.type] : null;
        const previewUrl =
          mediaSource === "upload"
            ? upload?.url || (!upload && content?.media_url)
            : null;
        return (
          <Form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Content Title"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.name && typeof errors.name === "string"
                    ? errors.name
                    : ""
                }
                placeholder="e.g., Weekend Combo Offer"
                required
              />
              <ReusableSelect
                label="Content Type"
                name="type"
                value={values.type}
                onChange={(value) => setFieldValue("type", value)}
                options={CONTENT_TYPE_OPTIONS}
                defaultOption="Select content type"
                showSearch={false}
                error={
                  touched.type && typeof errors.type === "string"
                    ? errors.type
                    : ""
                }
                required
              />
            </div>

            {type && (
              <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 px-3.5 py-2.5 flex items-center gap-2 text-xs text-[#754f2c]">
                <Sparkles size={14} className="text-[#c77e3b] shrink-0" />
                <span>{type.hint}</span>
              </div>
            )}

            <div>
              <Input
                label="Slide Duration (Seconds)"
                name="duration_seconds"
                type="number"
                min={3}
                max={3600}
                value={values.duration_seconds}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.duration_seconds &&
                  typeof errors.duration_seconds === "string"
                    ? errors.duration_seconds
                    : ""
                }
              />
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[11px] text-stone-400">Quick presets:</span>
                {DURATION_PRESETS.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setFieldValue("duration_seconds", sec)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                      Number(values.duration_seconds) === sec
                        ? "bg-[#fff8ea] border-[#c77e3b] text-[#754f2c] font-semibold"
                        : "bg-stone-50 border-stone-200 text-stone-500 hover:border-[#c77e3b]/40"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <TextArea
              label={
                values.type === "information"
                  ? "On-Screen Announcement Message"
                  : "Description / Notes (Optional)"
              }
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
              maxLength={2000}
              placeholder="Enter text or notes for this content item..."
            />

            {type && !type.live && (
              <div className="space-y-3 border border-stone-200/90 rounded-2xl p-4 bg-stone-50/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Media Attachment
                  </span>
                  <Radio.Group
                    value={mediaSource}
                    onChange={(e) => setMediaSource(e.target.value)}
                    options={[
                      { value: "upload", label: "Upload Image" },
                      { value: "link", label: "Image / Video URL" },
                      ...(values.type === "information"
                        ? [{ value: "none", label: "Text Only" }]
                        : []),
                    ]}
                  />
                </div>

                {mediaSource === "upload" && (
                  <Upload.Dragger
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleUpload(file);
                      return false;
                    }}
                    disabled={uploading}
                    className="bg-white! rounded-xl!"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="py-4">
                        <ImagePlus className="w-8 h-8 mx-auto mb-2 text-[#c77e3b]" />
                        <p className="text-xs font-semibold text-stone-700">
                          {uploading
                            ? "Uploading image..."
                            : "Click or drag an image file here"}
                        </p>
                      </div>
                    )}
                  </Upload.Dragger>
                )}
                {mediaSource === "link" && (
                  <div className="space-y-2.5">
                    <Input
                      name="media_url"
                      value={values.media_url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="https://example.com/trailer.mp4"
                      error={
                        touched.media_url &&
                        typeof errors.media_url === "string"
                          ? errors.media_url
                          : ""
                      }
                    />
                    <Radio.Group
                      value={values.media_kind}
                      onChange={(e) =>
                        setFieldValue("media_kind", e.target.value)
                      }
                      options={[
                        { value: "image", label: "Image" },
                        { value: "video", label: "Video" },
                      ]}
                    />
                  </div>
                )}
              </div>
            )}

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
                className="min-w-[150px]"
                loading={isSubmitting}
                disabled={isSubmitting || uploading}
                title={content ? "Save Content" : "Create Content"}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddContentForm;
