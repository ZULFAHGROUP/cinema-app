/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Radio, Upload } from "antd";
import { ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../../components/shared/Input";
import TextArea from "../../../components/shared/TextArea";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import Signage, { ContentInput, SignageContentType } from "../../../services/network/signage";
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

/** Create or edit signage content. Live types need no media; the others take an image or video. */
const AddContentForm = ({ content, onSubmit, onCancel }: AddContentFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [upload, setUpload] = useState<{ id: string; url: string } | null>(null);
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
      setUpload({ id: response.data.data.temp_upload_id, url: response.data.data.url });
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
          if (mediaSource === "upload" && upload) payload.media_temp_upload_id = upload.id;
          if (mediaSource === "link" && values.media_url) {
            payload.media_url = values.media_url.trim();
            payload.media_kind = values.media_kind as "image" | "video";
          }
          // Editing to "no media" clears what was there.
          if (mediaSource === "none" && content?.media_url) payload.media_url = null;
        }
        try {
          await onSubmit(payload);
        } catch {
          // The error toast comes from the API call.
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
        const type = values.type ? CONTENT_TYPES[values.type] : null;
        const previewUrl = mediaSource === "upload" ? upload?.url || (!upload && content?.media_url) : null;
        return (
          <Form className="space-y-4">
            <Input
              label="Content name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && typeof errors.name === "string" ? errors.name : ""}
              placeholder="Weekend combo offer"
              required
            />
            <ReusableSelect
              label="Content type"
              name="type"
              value={values.type}
              onChange={(value) => setFieldValue("type", value)}
              options={CONTENT_TYPE_OPTIONS}
              defaultOption="Select type"
              showSearch={false}
              error={touched.type && typeof errors.type === "string" ? errors.type : ""}
              required
            />
            {type && <p className="text-xs text-muted-foreground -mt-2">{type.hint}</p>}

            <TextArea
              label={values.type === "information" ? "Message" : "Description (optional)"}
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={3}
              maxLength={2000}
            />

            <Input
              label="Seconds on screen"
              name="duration_seconds"
              type="number"
              min={3}
              max={3600}
              value={values.duration_seconds}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.duration_seconds && typeof errors.duration_seconds === "string"
                  ? errors.duration_seconds
                  : ""
              }
            />

            {type && !type.live && (
              <div className="space-y-3 border rounded-lg p-3">
                <p className="text-sm font-medium">Media</p>
                <Radio.Group
                  value={mediaSource}
                  onChange={(e) => setMediaSource(e.target.value)}
                  options={[
                    { value: "upload", label: "Upload image" },
                    { value: "link", label: "Image or video link" },
                    ...(values.type === "information" ? [{ value: "none", label: "Text only" }] : []),
                  ]}
                />
                {mediaSource === "upload" && (
                  <Upload.Dragger
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleUpload(file);
                      return false;
                    }}
                    disabled={uploading}
                  >
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto rounded" />
                    ) : (
                      <div className="py-4">
                        <ImagePlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm">{uploading ? "Uploading..." : "Click or drop an image"}</p>
                      </div>
                    )}
                  </Upload.Dragger>
                )}
                {mediaSource === "link" && (
                  <div className="space-y-2">
                    <Input
                      name="media_url"
                      value={values.media_url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="https://example.com/trailer.mp4"
                      error={touched.media_url && typeof errors.media_url === "string" ? errors.media_url : ""}
                    />
                    <Radio.Group
                      value={values.media_kind}
                      onChange={(e) => setFieldValue("media_kind", e.target.value)}
                      options={[
                        { value: "image", label: "Image" },
                        { value: "video", label: "Video" },
                      ]}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button
                type="submit"
                className="flex-1 rounded-md"
                loading={isSubmitting}
                disabled={isSubmitting || uploading}
                title={content ? "Save content" : "Create content"}
              />
              <Button type="button" variant="outline" className="rounded-md" title="Cancel" onClick={onCancel} />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddContentForm;
