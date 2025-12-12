// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../../components/shared/Cards";
// import Button from "../../../components/shared/Button";
// import { Tag } from "antd";
// import { Edit, Trash2 } from "lucide-react";
// import { useState } from "react";
// import { useAppDispatch } from "../../../store/hook";
// import { deleteScreen, getAllScreen } from "../../../store/slices/screen";
// import { toast } from "react-toastify";
// import DisplayModal from "../../../components/shared/Modal/DisplayModal";
// import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
// import AddScreensForm from "./AddScreensForm";

// const Screens = ({ screens, loading }: any) => {
//   const [selectedScreen, setSelectedScreen] = useState<any>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const dispatch = useAppDispatch();

//   const handleDelete = async () => {
//     if (!selectedScreen) return;

//     try {
//       const response = await dispatch(
//         deleteScreen(selectedScreen?.screen_id)
//       ).unwrap();
//       if (response.code === 200) {
//         await dispatch(getAllScreen());
//         setShowDeleteModal(false);
//       }
//     } catch (error: any) {
//       toast.error(error?.response?.message);
//       setShowDeleteModal(false);
//     }
//   };
//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           screens?.map((screen: any) => (
//             <Card key={screen.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="font-sans">{screen.name}</CardTitle>
//                   <Tag color="blue">{screen.status}</Tag>
//                 </div>
//                 <CardDescription className="font-serif">
//                   {screen.cinema.name}
//                   <p>{screen.cinema.location}</p>
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="font-serif text-muted-foreground">Size</p>
//                       <p className="font-sans font-medium">{screen.size}</p>
//                     </div>
//                     <div>
//                       <p className="font-serif text-muted-foreground">
//                         Resolution
//                       </p>
//                       <p className="font-sans font-medium">
//                         {screen.resolution}
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="font-serif text-muted-foreground text-sm">
//                       Sound System
//                     </p>
//                     <p className="font-sans font-medium">
//                       {screen.soundSystem}
//                     </p>
//                   </div>
//                   <div className="flex gap-2 pt-2">
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       className="flex-1 gap-2 bg- rounded-md"
//                       icon={<Edit className="w-3 h-3" />}
//                       title="Edit"
//                       onClick={() => {
//                         setSelectedScreen(screen);
//                         setShowEditModal(true);
//                       }}
//                     />
//                     <Button
//                       variant="primary"
//                       size="sm"
//                       className="gap-2 bg- rounded-md"
//                       icon={<Trash2 className="w-3 h-3" />}
//                       onClick={() => {
//                         setSelectedScreen(screen);
//                         setShowDeleteModal(true);
//                       }}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//       {/* Delete Confirmation */}
//       <ConfirmationModal
//         open={showDeleteModal}
//         onCancel={() => setShowDeleteModal(false)}
//         onConfirm={handleDelete}
//         item={selectedScreen?.name}
//       />

//       {/* Edit Modal */}
//       <DisplayModal
//         open={showEditModal}
//         title={`Edit ${selectedScreen?.name}`}
//         onClose={() => setShowEditModal(false)}
//       >
//         <AddScreensForm
//           onCancel={() => setShowEditModal(false)}
//           editMode
//           screenData={selectedScreen}
//         />
//       </DisplayModal>
//     </div>
//   );
// };

// export default Screens;
