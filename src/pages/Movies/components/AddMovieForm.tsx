// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Formik, Form } from "formik";
// import Input from "../../../components/shared/Input";
// import Button from "../../../components/shared/Button";
// import { ImageIcon } from "lucide-react";
// import ReusableSelect from "../../../components/shared/Select";
// import { addMovieValidationSchema } from "../../../validations";

// interface AddMovieProps {
//   onSubmit: () => void;
//   onCancel: () => void;
// }

// const AddMovieForm = ({ onSubmit, onCancel }: AddMovieProps) => {
//   const ratingOptions = [
//     { value: "G", label: "G - General Audiences" },
//     { value: "PG", label: "PG - Parental Guidance" },
//     { value: "PG-13", label: "PG-13 - Parents Strongly Cautioned" },
//     { value: "R", label: "R - Restricted" },
//     { value: "NC-17", label: "NC-17 - Adults Only" },
//   ];

//   const statusOptions = [
//     { value: "Now Playing", label: "Now Playing" },
//     { value: "Coming Soon", label: "Coming Soon" },
//     { value: "Off Screen", label: "Off Screen" },
//   ];

//   const initialValues = {
//     title: "",
//     genre: "",
//     duration: "",
//     rating: "",
//     releaseDate: "",
//     description: "",
//     status: "Now Playing",
//     imdbRating: "",
//     poster: "",
//   };

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={addMovieValidationSchema}
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
//           <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <Input
//                 label="Movie Title"
//                 name="title"
//                 value={values.title}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.title && errors.title ? errors.title : ""}
//                 placeholder="Enter movie title"
//                 required
//               />

//               <Input
//                 label="Genre"
//                 name="genre"
//                 value={values.genre}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={touched.genre && errors.genre ? errors.genre : ""}
//                 placeholder="e.g., Action/Adventure"
//                 required
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <Input
//                   label="Duration (minutes)"
//                   name="duration"
//                   type="number"
//                   value={values.duration}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={
//                     touched.duration && errors.duration ? errors.duration : ""
//                   }
//                   placeholder="120"
//                   required
//                 />

//                 <ReusableSelect
//                   label="Rating"
//                   name="rating"
//                   value={values.rating}
//                   onChange={(value) => setFieldValue("rating", value)}
//                   options={ratingOptions}
//                   defaultOption="Select rating"
//                   error={touched.rating && errors.rating ? errors.rating : ""}
//                   required
//                 />
//               </div>

//               <Input
//                 label="Release Date"
//                 name="releaseDate"
//                 type="date"
//                 value={values.releaseDate}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 error={
//                   touched.releaseDate && errors.releaseDate
//                     ? errors.releaseDate
//                     : ""
//                 }
//                 required
//               />

//               <div className="grid grid-cols-2 gap-4">
//                 <Input
//                   label="IMDB Rating"
//                   name="imdbRating"
//                   type="number"
//                   step="0.1"
//                   min="0"
//                   max="10"
//                   value={values.imdbRating}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={
//                     touched.imdbRating && errors.imdbRating
//                       ? errors.imdbRating
//                       : ""
//                   }
//                   placeholder="8.5"
//                 />

//                 <ReusableSelect
//                   label="Status"
//                   name="status"
//                   value={values.status}
//                   onChange={(value) => setFieldValue("status", value)}
//                   options={statusOptions}
//                   defaultOption="Select status"
//                   error={touched.status && errors.status ? errors.status : ""}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block font-medium md:text-lg mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={values.description}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   placeholder="Enter movie description"
//                   rows={3}
//                   className={`w-full p-2 border rounded-md ${
//                     touched.description && errors.description
//                       ? "border-red-500"
//                       : "border-gray-300"
//                   }`}
//                   required
//                 />
//                 {touched.description && errors.description && (
//                   <p className="text-sm text-red-500 italic mt-1">
//                     {errors.description}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block font-medium md:text-lg mb-2">
//                   Movie Poster
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                   <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//                   <p className="text-sm text-gray-600 mb-2">
//                     Drop poster image here or click to browse
//                   </p>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     type="button"
//                     title="Browse Files"
//                   />
//                 </div>
//               </div>

//               <Input
//                 label="Poster URL (Optional)"
//                 name="poster"
//                 value={values.poster}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 placeholder="https://example.com/poster.jpg"
//               />
//             </div>
//           </div>

//           <div className="flex gap-2 pt-6 border-t mt-6">
//             <Button
//               type="submit"
//               className="flex-1 rounded-md"
//               disabled={isSubmitting}
//               title={isSubmitting ? "Adding Movie..." : "Add Movie"}
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

// export default AddMovieForm;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form } from "formik";
import Input from "../../../components/shared/Input";
import Button from "../../../components/shared/Button";
import { ImageIcon } from "lucide-react";
import ReusableSelect from "../../../components/shared/Select";
import { addMovieValidationSchema } from "../../../validations";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { toast } from "react-toastify";
import {
  createMovie,
  getAllMovies,
  updateMovie,
} from "../../../store/slices/movie";

interface AddMovieProps {
  onCancel: () => void;
  editMode?: boolean;
  movieData?: any;
}

const AddMovieForm = ({ editMode, movieData, onCancel }: AddMovieProps) => {
  const { classifications } = useAppSelector((state) => state.classification);
  const dispatch = useAppDispatch();

  const allClassification = [...(classifications || [])]
    .sort((a: any, b: any) => a.name.localeCompare(b.name))
    .map((seats: { movie_classification_id: string; name: string }) => ({
      label: seats.name,
      value: seats.movie_classification_id,
    }));

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Chinese", label: "Chinese" },
  ];

  const initialValues = {
    title: "",
    description: "",
    duration: "",
    genre: "",
    rating: "",
    release_date: "",
    director: "",
    cast: [""],
    poster_url: "",
    trailer_url: "",
    language: "",
    movie_classification_id: "",
  };

  async function handleSubmit(
    values: any,
    { resetForm }: { resetForm: () => void }
  ) {
    try {
      let response;

      if (editMode && movieData?.screen_id) {
        const formattedValues = {
          ...values,
          duration: parseInt(values.duration),
          rating: parseInt(values.rating),
          cast: values.cast.filter((actor: any) => actor.trim() !== ""),
        };
        delete formattedValues.movie_classification_id;
        response = await dispatch(
          updateMovie({
            id: movieData.movie_id,
            data: (() => {
              const copy = { ...formattedValues };
              delete copy.movie_classification_id;
              return copy;
            })(),
          })
        ).unwrap();
      } else {
        const formattedValues = {
          ...values,
          duration: parseInt(values.duration),
          rating: parseInt(values.rating),
          cast: values.cast.filter((actor: any) => actor.trim() !== ""),
        };
        response = await dispatch(
          createMovie({
            id: formattedValues.movie_classification_id,
            data: formattedValues,
          })
        ).unwrap();
      }

      if (response.code === 200 || response.code === 201) {
        toast.success(response.message);
        await dispatch(getAllMovies());
        resetForm();
        onCancel(); // close modal after success
      }
    } catch (error: any) {
      console.error("Error submitting screen form", error);
      toast.error(error?.response?.message || "Something went wrong");
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addMovieValidationSchema}
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
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Movie Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && errors.title ? errors.title : ""}
                placeholder="Enter movie title"
                required
              />

              <Input
                label="Director"
                name="director"
                value={values.director}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.director && errors.director ? errors.director : ""
                }
                placeholder="e.g., Christopher Nolan"
                required
              />

              <Input
                label="Genre"
                name="genre"
                value={values.genre}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.genre && errors.genre ? errors.genre : ""}
                placeholder="e.g., Sci-Fi"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={values.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.duration && errors.duration ? errors.duration : ""
                  }
                  placeholder="148"
                  required
                />

                <Input
                  label="Rating"
                  name="rating"
                  value={values.rating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.rating && errors.rating ? errors.rating : ""}
                  placeholder="8.8/10"
                  required
                />
              </div>

              <Input
                label="Release Date"
                name="release_date"
                type="date"
                value={values.release_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.release_date && errors.release_date
                    ? errors.release_date
                    : ""
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <ReusableSelect
                  label="Language"
                  name="language"
                  value={values.language}
                  onChange={(value) => setFieldValue("language", value)}
                  options={languageOptions}
                  defaultOption="Select language"
                  error={
                    touched.language && errors.language ? errors.language : ""
                  }
                  required
                />

                <ReusableSelect
                  label="Classification"
                  name="movie_classification_id"
                  value={values.movie_classification_id}
                  onChange={(value) =>
                    setFieldValue("movie_classification_id", value)
                  }
                  options={allClassification}
                  defaultOption="Select classification"
                  error={
                    touched.movie_classification_id &&
                    errors.movie_classification_id
                      ? errors.movie_classification_id
                      : ""
                  }
                  required
                />
              </div>

              <div>
                <label className="block font-medium md:text-lg mb-2">
                  Cast <span className="text-red-500">*</span>
                </label>
                {values.cast.map((actor, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      name={`cast.${index}`}
                      value={actor}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Actor ${index + 1}`}
                    />
                    {values.cast.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newCast = values.cast.filter(
                            (_, i) => i !== index
                          );
                          setFieldValue("cast", newCast);
                        }}
                        title="Remove"
                        className="px-3"
                      />
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFieldValue("cast", [...values.cast, ""])}
                  title="+ Add Actor"
                  className="mt-2"
                />
                {touched.cast && errors.cast && (
                  <p className="text-sm text-red-500 italic mt-1">
                    {errors.cast}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium md:text-lg mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter movie description"
                  rows={3}
                  className={`w-full p-2 border rounded-md ${
                    touched.description && errors.description
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-500 italic mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-medium md:text-lg mb-2">
                  Movie Poster
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop poster image here or click to browse
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    title="Browse Files"
                  />
                </div>
              </div>

              <Input
                label="Poster URL"
                name="poster_url"
                value={values.poster_url}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.poster_url && errors.poster_url
                    ? errors.poster_url
                    : ""
                }
                placeholder="https://example.com/poster.jpg"
                required
              />

              <Input
                label="Trailer URL"
                name="trailer_url"
                value={values.trailer_url}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.trailer_url && errors.trailer_url
                    ? errors.trailer_url
                    : ""
                }
                placeholder="https://youtube.com/watch?v=example"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-6 border-t mt-6">
            <Button
              type="submit"
              className="flex-1 rounded-md"
              disabled={isSubmitting}
              title={isSubmitting ? "Creating Movie..." : "Create Movie"}
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

export default AddMovieForm;
