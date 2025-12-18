/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Collapse, Dropdown } from "antd";
import { Edit, Trash2, Monitor, ChevronDown, MoreVertical } from "lucide-react";
import { deleteCinema, getAllCinemas } from "../../../store/slices/cinema";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { toast } from "react-toastify";
import TheaterForm from "./AddTheaterForm";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import { deleteScreen, getAllScreen } from "../../../store/slices/screen";
import AddScreensForm from "./AddScreensForm";
import Loader from "../../../components/shared/Loader";

const { Panel } = Collapse;

const Theater = ({ cinemas, loading }: any) => {
  const [selectedCinema, setSelectedCinema] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<any>(null);
  const [showDeleteCinemaModal, setShowDeleteCinemaModal] = useState(false);
  const [showDeleteScreenModal, setShowDeleteScreenModal] = useState(false);
  const [showEditCinemaModal, setShowEditCinemaModal] = useState(false);
  const [showEditScreenModal, setShowEditScreenModal] = useState(false);
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);

  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.cinema);
  const { screensByCinema, loadingCinemas } = useAppSelector(
    (state) => state.screen
  );

  const handleDeleteCinema = async () => {
    if (!selectedCinema) return;

    try {
      const response = await dispatch(
        deleteCinema(selectedCinema?.cinema_id)
      ).unwrap();
      if (response.code === 200) {
        await dispatch(getAllCinemas({ page, limit }));
        setShowDeleteCinemaModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message);
      setShowDeleteCinemaModal(false);
    }
  };

  const handleDeleteScreen = async () => {
    console.log("screen", selectedScreen);
    if (!selectedScreen) return;

    try {
      const response = await dispatch(
        deleteScreen({
          id: selectedScreen?.screen_id,
          cinema_id: selectedScreen?.cinema_id,
        })
      ).unwrap();
      if (response.code === 200) {
        // Re-fetch screens for this specific cinema
        const cinemaId = selectedScreen?.cinema_id;
        if (cinemaId) {
          await dispatch(
            getAllScreen({
              screensPage: 1,
              screensLimit: 10,
              cinema_id: cinemaId,
            })
          ).unwrap();
        }
        setShowDeleteScreenModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message);
      setShowDeleteScreenModal(false);
    }
  };

  const getCinemaScreens = (cinemaId: string) => {
    return screensByCinema[cinemaId] || [];
  };

  // Fetch screens when collapse is opened
  const handleCollapseChange = (cinemaId: string) => {
    // Only fetch if we haven't fetched for this cinema yet
    if (!screensByCinema[cinemaId]) {
      dispatch(
        getAllScreen({
          screensPage: 1,
          screensLimit: 10,
          cinema_id: cinemaId,
        })
      );
    }
  };

  return (
    <>
      {loading ? (
        <Loader rows={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cinemas?.length > 0 &&
            cinemas?.map((theater: any) => {
              const cinemaScreens = getCinemaScreens(theater?.cinema_id);
              const isLoadingScreens = loadingCinemas[theater?.cinema_id];

              return (
                <Card
                  key={theater?.id}
                  className="hover:shadow-md transition-shadow relative"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between!">
                      <CardTitle className="font-sans">
                        {theater?.name}
                      </CardTitle>
                       <Dropdown
                        menu={{
                          items: [
                            {
                              key: "1",
                              label: "Add Screen",
                              icon: <Monitor className="w-4 h-4" />,
                              onClick: () => {
                                setSelectedCinema(theater);
                                setShowAddScreenModal(true);
                              },
                            },
                            {
                              key: "2",
                              label: "Edit Cinema",
                              icon: <Edit className="w-4 h-4" />,
                              onClick: () => {
                                setSelectedCinema(theater);
                                setShowEditCinemaModal(true);
                              },
                            },
                            {
                              key: "3",
                              label: "Delete Cinema",
                              danger: true,
                              icon: <Trash2 className="w-4 h-4" />,
                              onClick: () => {
                                setSelectedCinema(theater);
                                setShowDeleteCinemaModal(true);
                              },
                            },
                          ],
                        }}
                        trigger={["click"]}
                      >
                        <Button
                          size="sm"
                          className="p-0 bg-transparent w-fit shadow-none text-black!"
                          icon={<MoreVertical className="" size={20} />}
                        />
                      </Dropdown>
                    </div>
                    <CardDescription className="font-serif">
                      <p>{theater?.location}</p>
                      {cinemaScreens?.length || theater?.screens?.length} screen
                      {cinemaScreens?.length || theater?.screens?.length !== 1
                        ? "s"
                        : ""}{" "}
                      • {theater?.totalSeats} seats
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Screens Dropdown */}
                      <div className="mb-6">
                        <Collapse
                          bordered={false}
                          onChange={() =>
                            handleCollapseChange(theater?.cinema_id)
                          }
                          expandIcon={({ isActive }) => (
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isActive ? "rotate-180" : ""
                              }`}
                            />
                          )}
                          className="bg-white shadow-md rounded-md"
                        >
                          <Panel
                            header={
                              <span className="font-serif text-sm">
                                Screens (
                                {cinemaScreens?.length ||
                                  theater?.screens?.length}
                                )
                              </span>
                            }
                            key="1"
                          >
                            <div className="space-y-2">
                              {isLoadingScreens ? (
                                <Loader rows={2} />
                              ) : cinemaScreens?.length > 0 ? (
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
                                      <Dropdown
                                        menu={{
                                          items: [
                                            {
                                              key: "1",
                                              label: "Edit Screen",
                                              icon: <Edit className="w-4 h-4" />,
                                              onClick: () => {
                                                setSelectedScreen(screen);
                                                setShowEditScreenModal(true);
                                              },
                                            },
                                            {
                                              key: "2",
                                              label: "Delete Screen",
                                              danger: true,
                                              icon: <Trash2 className="w-4 h-4" />,
                                              onClick: () => {
                                                setSelectedScreen(screen);
                                                setShowDeleteScreenModal(true);
                                              },
                                            },
                                          ],
                                        }}
                                        trigger={["click"]}
                                      >
                                        <Button
                                          size="sm"
                          className="p-0 bg-transparent w-fit shadow-none text-black!"
                                          icon={
                                            <MoreVertical className="" size={18} />
                                          }
                                        />
                                      </Dropdown>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 text-center py-2">
                                  No screens available
                                </p>
                              )}
                            </div>
                          </Panel>
                        </Collapse>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* All your modals remain the same */}
      <ConfirmationModal
        open={showDeleteCinemaModal}
        onCancel={() => setShowDeleteCinemaModal(false)}
        onConfirm={handleDeleteCinema}
        item={selectedCinema?.name}
      />

      <ConfirmationModal
        open={showDeleteScreenModal}
        onCancel={() => setShowDeleteScreenModal(false)}
        onConfirm={handleDeleteScreen}
        item={selectedScreen?.name}
      />

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

      <DisplayModal
        open={showEditScreenModal}
        title={`Edit ${selectedScreen?.name}`}
        onClose={() => setShowEditScreenModal(false)}
      >
        <AddScreensForm
          onCancel={() => setShowEditScreenModal(false)}
          editMode
          screenData={selectedScreen}
          cinemas={cinemas}
        />
      </DisplayModal>

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
