// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../../../components/shared/Cards";
// import Button from "../../../../components/shared/Button";
// import { Edit, Trash2, Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../../../store/hook";
// import {
//   deleteClassification,
//   getAllClassifications,
// } from "../../../../store/slices/classification";
// import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
// import { toast } from "react-toastify";
// import MovieClassificationForm from "./components/MovieClassificationForm";
// import DisplayModal from "../../../../components/shared/Modal/DisplayModal";

// const MovieClassification = () => {
//   const [selectedItem, setSelectedItem] = useState<any>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);

//   const dispatch = useAppDispatch();
//   const { classifications, loading } = useAppSelector(
//     (state) => state.classification
//   );
//   console.log("classifications is", classifications);

//   useEffect(() => {
//     dispatch(getAllClassifications());
//   }, [dispatch]);

//   const handleDelete = async () => {
//     if (!selectedItem) return;
//     try {
//       const response = await dispatch(
//         deleteClassification(selectedItem?.movie_classification_id)
//       ).unwrap();
//       if (response.code === 200) {
//         toast.success(response.message);
//         await dispatch(getAllClassifications());
//         setShowDeleteModal(false);
//       }
//     } catch (error: any) {
//       toast.error(error?.response?.message || "Error deleting classification");
//       setShowDeleteModal(false);
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-lg font-semibold">Movie Classifications</h2>
//         <Button
//           className="rounded-md"
//           icon={<Plus className="w-4 h-4" />}
//           title="Add New"
//           onClick={() => {
//             setEditMode(false);
//             setSelectedItem(null);
//             setShowFormModal(true);
//           }}
//         />
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {classifications?.map((item: any) => (
//             <Card key={item.id} className="hover:shadow-md transition-shadow">
//               <CardHeader>
//                 <CardTitle>{item.name}</CardTitle>
//                 <CardDescription>{item.description}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="secondary"
//                     size="sm"
//                     title="Edit"
//                     icon={<Edit className="w-3 h-3" />}
//                     className="flex-1 rounded-md"
//                     onClick={() => {
//                       setSelectedItem(item);
//                       setEditMode(true);
//                       setShowFormModal(true);
//                     }}
//                   />
//                   <Button
//                     variant="primary"
//                     size="sm"
//                     className="rounded-md"
//                     icon={<Trash2 className="w-3 h-3" />}
//                     onClick={() => {
//                       setSelectedItem(item);
//                       setShowDeleteModal(true);
//                     }}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Add / Edit Modal */}
//       <DisplayModal
//         open={showFormModal}
//         title={editMode ? "Edit Classification" : "Add Classification"}
//         onClose={() => setShowFormModal(false)}
//       >
//         <MovieClassificationForm
//           onCancel={() => setShowFormModal(false)}
//           editMode={editMode}
//           classificationData={selectedItem}
//         />
//       </DisplayModal>

//       {/* Delete Confirmation */}
//       <ConfirmationModal
//         open={showDeleteModal}
//         onCancel={() => setShowDeleteModal(false)}
//         onConfirm={handleDelete}
//         item={selectedItem?.name}
//       />
//     </div>
//   );
// };

// export default MovieClassification;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  deleteClassification,
  getAllClassifications,
} from "../../../../store/slices/classification";

import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import MovieClassificationForm from "./components/MovieClassificationForm";

const MovieClassification = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { classifications, loading } = useAppSelector(
    (state) => state.classification
  );

  useEffect(() => {
    dispatch(getAllClassifications());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteClassification(selectedItem?.movie_classification_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllClassifications());
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting classification");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify-">
          <Button
            variant="secondary"
            size="sm"
            // title="Edit"
            icon={<Edit className="w-3 h-3" />}
            className="rounded-md"
            onClick={() => {
              setSelectedItem(record);
              setEditMode(true);
              setShowFormModal(true);
            }}
          />
          <Button
            variant="primary"
            size="sm"
            // title="Delete"
            icon={<Trash2 className="w-3 h-3" />}
            className="rounded-md bg-red-700"
            onClick={() => {
              setSelectedItem(record);
              setShowDeleteModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Movie Classifications</h2>
        <Button
          className="rounded-md"
          icon={<Plus className="w-4 h-4" />}
          title="Add New"
          onClick={() => {
            setEditMode(false);
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ReusableTable
          data={classifications || []}
          columns={columns}
          title="Movie Classifications"
          searchField={["name"]}
        />
      )}

      {/* Add / Edit Modal */}
      <DisplayModal
        open={showFormModal}
        title={editMode ? "Edit Classification" : "Add Classification"}
        onClose={() => setShowFormModal(false)}
      >
        <MovieClassificationForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          classificationData={selectedItem}
        />
      </DisplayModal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this classification, ${selectedItem?.name}`}
      />
    </div>
  );
};

export default MovieClassification;
