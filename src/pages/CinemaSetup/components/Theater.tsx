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
// import { deleteCinema, getAllCinemas } from "../../../store/slices/cinema";
// import { useState } from "react";
// import { useAppDispatch } from "../../../store/hook";
// import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
// import { toast } from "react-toastify";
// import TheaterForm from "./AddTheaterForm";
// import DisplayModal from "../../../components/shared/Modal/DisplayModal";

// const Theater = ({ cinemas, loading }: any) => {
//   const [selectedCinema, setSelectedCinema] = useState<any>(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);

//   const dispatch = useAppDispatch();

//   const handleDelete = async () => {
//     if (!selectedCinema) return;

//     try {
//       const response = await dispatch(
//         deleteCinema(selectedCinema?.cinema_id)
//       ).unwrap();
//       if (response.code === 200) {
//         await dispatch(getAllCinemas());
//         setShowDeleteModal(false);
//       }
//     } catch (error: any) {
//       toast.error(error?.response?.message);
//       setShowDeleteModal(false);
//     }
//   };

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           cinemas?.length > 0 &&
//           cinemas?.map((theater: any) => (
//             <Card
//               key={theater?.id}
//               className="hover:shadow-md transition-shadow"
//             >
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="font-sans">{theater?.name}</CardTitle>
//                   <Tag
//                     color={theater?.status === "Active" ? "green" : "orange"}
//                   >
//                     {theater?.status}
//                   </Tag>
//                 </div>
//                 <CardDescription className="font-serif">
//                   <p>{theater?.location}</p>
//                   {theater?.screens?.length} screen • {theater?.totalSeats}{" "}
//                   seats
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex flex-wrap gap-1">
//                     {theater?.features?.map((feature: any) => (
//                       <Tag key={feature} className="text-xs">
//                         {feature}
//                       </Tag>
//                     ))}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       title="Edit"
//                       icon={<Edit className="w-3 h-3" />}
//                       className="flex-1 gap-2 rounded-md"
//                       onClick={() => {
//                         setSelectedCinema(theater);
//                         setShowEditModal(true);
//                       }}
//                     />
//                     <Button
//                       variant="primary"
//                       size="sm"
//                       className="gap-2 rounded-md"
//                       icon={<Trash2 className="w-3 h-3" />}
//                       onClick={() => {
//                         setSelectedCinema(theater);
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
//         item={selectedCinema?.name}
//       />

//       {/* Edit Modal */}
//       <DisplayModal
//         open={showEditModal}
//         title={`Edit ${selectedCinema?.name}`}
//         onClose={() => setShowEditModal(false)}
//       >
//         <TheaterForm
//           onCancel={() => setShowEditModal(false)}
//           editMode
//           cinemaData={selectedCinema}
//         />
//       </DisplayModal>
//     </>
//   );
// };

// export default Theater;

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Tag, Collapse } from "antd";
import { Edit, Trash2, Monitor, ChevronDown } from "lucide-react";
import { deleteCinema, getAllCinemas } from "../../../store/slices/cinema";
import { useState } from "react";
import { useAppDispatch } from "../../../store/hook";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { toast } from "react-toastify";
import TheaterForm from "./AddTheaterForm";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import { deleteScreen, getAllScreen } from "../../../store/slices/screen";
import AddScreensForm from "./AddScreensForm";
import Loader from "../../../components/shared/Loader";

const { Panel } = Collapse;

const Theater = ({ cinemas, loading, screens, screensLoading }: any) => {
  const [selectedCinema, setSelectedCinema] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<any>(null);
  const [showDeleteCinemaModal, setShowDeleteCinemaModal] = useState(false);
  const [showDeleteScreenModal, setShowDeleteScreenModal] = useState(false);
  const [showEditCinemaModal, setShowEditCinemaModal] = useState(false);
  const [showEditScreenModal, setShowEditScreenModal] = useState(false);
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);

  const dispatch = useAppDispatch();

  const handleDeleteCinema = async () => {
    if (!selectedCinema) return;

    try {
      const response = await dispatch(
        deleteCinema(selectedCinema?.cinema_id)
      ).unwrap();
      if (response.code === 200) {
        await dispatch(getAllCinemas());
        setShowDeleteCinemaModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message);
      setShowDeleteCinemaModal(false);
    }
  };

  const handleDeleteScreen = async () => {
    if (!selectedScreen) return;

    try {
      const response = await dispatch(
        deleteScreen(selectedScreen?.screen_id)
      ).unwrap();
      if (response.code === 200) {
        await dispatch(getAllScreen());
        setShowDeleteScreenModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message);
      setShowDeleteScreenModal(false);
    }
  };

  const getCinemaScreens = (cinemaId: string) => {
    return (
      screens?.filter(
        (screen: any) => screen?.cinema?.cinema_id === cinemaId
      ) || []
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Loader rows={6} />
        ) : (
          cinemas?.length > 0 &&
          cinemas?.map((theater: any) => {
            const cinemaScreens = getCinemaScreens(theater?.cinema_id);

            return (
              <Card
                key={theater?.id}
                className="hover:shadow-md transition-shadow relative"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-sans">{theater?.name}</CardTitle>
                    <Tag
                      color={theater?.status === "Active" ? "green" : "orange"}
                    >
                      {theater?.status}
                    </Tag>
                  </div>
                  <CardDescription className="font-serif">
                    <p>{theater?.location}</p>
                    {cinemaScreens?.length} screen
                    {cinemaScreens?.length !== 1 ? "s" : ""} •{" "}
                    {theater?.totalSeats} seats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* <div className="flex flex-wrap gap-1">
                      {theater?.features?.map((feature: any) => (
                        <Tag key={feature} className="text-xs">
                          {feature}
                        </Tag>
                      ))}
                    </div> */}

                    {/* Screens Dropdown */}
                    <div className="mb-6">
                      {cinemaScreens?.length > 0 && (
                        <Collapse
                          bordered={false}
                          expandIcon={({ isActive }) => (
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isActive ? "rotate-180" : ""
                              }`}
                            />
                          )}
                          className="bg-gray-50 rounded-md"
                        >
                          <Panel
                            header={
                              <span className="font-serif text-sm">
                                Screens ({cinemaScreens?.length})
                              </span>
                            }
                            key="1"
                          >
                            <div className="space-y-2">
                              {screensLoading ? (
                                <Loader rows={2} />
                              ) : (
                                cinemaScreens?.map((screen: any) => (
                                  <div
                                    key={screen.screen_id}
                                    className="flex items-center justify-between p-1 bg-white rounded border border-gray-200"
                                  >
                                    <div className="flex-1">
                                      <p className="font-sans text-sm font-medium">
                                        {screen.name}
                                      </p>
                                      <p className="font-serif text-xs text-muted-foreground">
                                        {screen.size} • {screen.resolution} •{" "}
                                        {screen.soundSystem}
                                      </p>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        className="gap-1 rounded-md p-1 h-7"
                                        icon={<Edit className="w-3 h-3" />}
                                        onClick={() => {
                                          setSelectedScreen(screen);
                                          setShowEditScreenModal(true);
                                        }}
                                      />
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        className="gap-1 rounded-md p-1 h-7"
                                        icon={<Trash2 className="w-3 h-3" />}
                                        onClick={() => {
                                          setSelectedScreen(screen);
                                          setShowDeleteScreenModal(true);
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </Panel>
                        </Collapse>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 absolute bottom-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        // title="Add Screen"
                        icon={<Monitor className="w-3 h-3" />}
                        className="flex-1 gap-2 rounded-md"
                        onClick={() => {
                          setSelectedCinema(theater);
                          setShowAddScreenModal(true);
                        }}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        // title="Edit"
                        icon={<Edit className="w-3 h-3" />}
                        className="gap-2 rounded-md"
                        onClick={() => {
                          setSelectedCinema(theater);
                          setShowEditCinemaModal(true);
                        }}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-2 rounded-md"
                        icon={<Trash2 className="w-3 h-3" />}
                        onClick={() => {
                          setSelectedCinema(theater);
                          setShowDeleteCinemaModal(true);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Cinema Confirmation */}
      <ConfirmationModal
        open={showDeleteCinemaModal}
        onCancel={() => setShowDeleteCinemaModal(false)}
        onConfirm={handleDeleteCinema}
        item={selectedCinema?.name}
      />

      {/* Delete Screen Confirmation */}
      <ConfirmationModal
        open={showDeleteScreenModal}
        onCancel={() => setShowDeleteScreenModal(false)}
        onConfirm={handleDeleteScreen}
        item={selectedScreen?.name}
      />

      {/* Edit Cinema Modal */}
      <DisplayModal
        open={showEditCinemaModal}
        title={`Edit ${selectedCinema?.name}`}
        onClose={() => setShowEditCinemaModal(false)}
      >
        <TheaterForm
          onCancel={() => setShowEditCinemaModal(false)}
          editMode
          cinemaData={selectedCinema}
        />
      </DisplayModal>

      {/* Edit Screen Modal */}
      <DisplayModal
        open={showEditScreenModal}
        title={`Edit ${selectedScreen?.name}`}
        onClose={() => setShowEditScreenModal(false)}
      >
        <AddScreensForm
          onCancel={() => setShowEditScreenModal(false)}
          editMode
          screenData={selectedScreen}
        />
      </DisplayModal>

      {/* Add Screen Modal */}
      <DisplayModal
        open={showAddScreenModal}
        title={`Add Screen to ${selectedCinema?.name}`}
        onClose={() => setShowAddScreenModal(false)}
      >
        <AddScreensForm
          cinemas={[selectedCinema]}
          onCancel={() => setShowAddScreenModal(false)}
          preSelectedCinema={selectedCinema?.cinema_id}
        />
      </DisplayModal>
    </>
  );
};

export default Theater;
