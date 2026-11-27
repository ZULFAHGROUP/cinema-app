/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Collapse, Dropdown } from "antd";
import {
  Edit,
  Trash2,
  Monitor,
  ChevronDown,
  MoreVertical,
  Armchair,
  MapPin,
  Building2,
} from "lucide-react";
import { deleteCinema, getAllCinemas } from "../../../store/slices/cinema";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { toast } from "react-toastify";
import TheaterForm from "./AddTheaterForm";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import { deleteScreen, getAllScreen } from "../../../store/slices/screen";
import AddScreensForm from "./AddScreensForm";
import SeatLayoutEditor from "./SeatLayoutEditor";
import Loader from "../../../components/shared/Loader";
import { hasPermission } from "../../../utils/permissions";

const { Panel } = Collapse;

const Theater = ({ cinemas, loading }: any) => {
  const [selectedCinema, setSelectedCinema] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<any>(null);
  const [showDeleteCinemaModal, setShowDeleteCinemaModal] = useState(false);
  const [showDeleteScreenModal, setShowDeleteScreenModal] = useState(false);
  const [showEditCinemaModal, setShowEditCinemaModal] = useState(false);
  const [showEditScreenModal, setShowEditScreenModal] = useState(false);
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [showSeatLayoutModal, setShowSeatLayoutModal] = useState(false);

  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.cinema);
  const { screensByCinema, loadingCinemas } = useAppSelector(
    (state) => state.screen
  );
  const { user } = useAppSelector((state) => state.accounts.data);
  const canEditCinema = hasPermission(user, "edit_cinemas");
  const canDeleteCinema = hasPermission(user, "delete_cinemas");
  const canConfigureSeats = hasPermission(user, "configure_screen_layouts");

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
    if (!selectedScreen) return;

    try {
      const response = await dispatch(
        deleteScreen({
          id: selectedScreen?.screen_id,
          cinema_id: selectedScreen?.cinema_id,
        })
      ).unwrap();
      if (response.code === 200) {
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

  const handleCollapseChange = (cinemaId: string) => {
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
      ) : !cinemas?.length ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#c77e3b]/30 p-16 text-center">
          <Building2 className="w-10 h-10 text-[#c77e3b] mx-auto mb-3 opacity-80" />
          <p className="font-bold text-stone-800">No cinema locations found</p>
          <p className="text-sm text-stone-500 mt-1">
            Add your first theater location to configure screens and seat maps.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cinemas.map((theater: any) => {
            const cinemaScreens = getCinemaScreens(theater?.cinema_id);
            const isLoadingScreens = loadingCinemas[theater?.cinema_id];
            const screensForCount = cinemaScreens?.length
              ? cinemaScreens
              : theater?.screens || [];
            const screenCount = screensForCount.length;
            const seatCount = screensForCount.reduce(
              (sum: number, screen: any) =>
                sum + (Number(screen.seat_count) || 0),
              0
            );

            return (
              <Card
                key={theater?.cinema_id}
                className="relative overflow-hidden group"
              >
                <span className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#c77e3b] via-[#754f2c] to-[#5480c7]" />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0 mt-0.5">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg truncate">
                          {theater?.name}
                        </CardTitle>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#c77e3b] shrink-0" />
                          <span className="truncate">{theater?.location}</span>
                        </p>
                      </div>
                    </div>

                    {(canEditCinema || canDeleteCinema) && (
                      <Dropdown
                        menu={{
                          items: [
                            ...(canEditCinema
                              ? [
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
                                ]
                              : []),
                            ...(canDeleteCinema
                              ? [
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
                                ]
                              : []),
                          ],
                        }}
                        trigger={["click"]}
                      >
                        <Button
                          size="xs"
                          variant="outline"
                          className="p-1.5! border-stone-200! text-stone-600! hover:text-white!"
                          icon={<MoreVertical size={16} />}
                        />
                      </Dropdown>
                    )}
                  </div>

                  {/* Quick Stat Badges */}
                  <div className="flex items-center gap-2 pt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff8ea] text-[#754f2c] border border-[#c77e3b]/20 text-xs font-semibold">
                      <Monitor className="w-3.5 h-3.5 text-[#c77e3b]" />
                      {screenCount} screen{screenCount === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5480c7]/10 text-[#5480c7] border border-[#5480c7]/20 text-xs font-semibold">
                      <Armchair className="w-3.5 h-3.5" />
                      {seatCount.toLocaleString()} seat{seatCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <Collapse
                    bordered={false}
                    onChange={() => handleCollapseChange(theater?.cinema_id)}
                    expandIcon={({ isActive }) => (
                      <ChevronDown
                        className={`w-4 h-4 text-[#c77e3b] transition-transform ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    className="bg-[#fff8ea]/60 border border-[#c77e3b]/15 rounded-xl overflow-hidden"
                  >
                    <Panel
                      header={
                        <span className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                          Auditorium Screens ({screenCount})
                        </span>
                      }
                      key="1"
                    >
                      <div className="space-y-2 pt-1">
                        {isLoadingScreens ? (
                          <Loader rows={2} />
                        ) : cinemaScreens?.length > 0 ? (
                          cinemaScreens.map((screen: any) => (
                            <div
                              key={screen.screen_id}
                              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#c77e3b]/15 shadow-2xs hover:border-[#c77e3b]/40 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#fff8ea] text-[#c77e3b] flex items-center justify-center shrink-0">
                                  <Monitor className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-stone-800 truncate">
                                    {screen.name}
                                  </p>
                                  <p className="text-xs text-stone-500">
                                    <span className="font-semibold text-[#5480c7]">
                                      {screen.screenType?.name || "Standard"}
                                    </span>{" "}
                                    · {screen.seat_count} seats
                                  </p>
                                </div>
                              </div>

                              {(canEditCinema ||
                                canConfigureSeats ||
                                canDeleteCinema) && (
                                <Dropdown
                                  menu={{
                                    items: [
                                      ...(canEditCinema
                                        ? [
                                            {
                                              key: "1",
                                              label: "Edit Screen",
                                              icon: (
                                                <Edit className="w-4 h-4" />
                                              ),
                                              onClick: () => {
                                                setSelectedScreen(screen);
                                                setShowEditScreenModal(true);
                                              },
                                            },
                                          ]
                                        : []),
                                      ...(canConfigureSeats
                                        ? [
                                            {
                                              key: "seats",
                                              label: "Seat Layout",
                                              icon: (
                                                <Armchair className="w-4 h-4" />
                                              ),
                                              onClick: () => {
                                                setSelectedScreen(screen);
                                                setShowSeatLayoutModal(true);
                                              },
                                            },
                                          ]
                                        : []),
                                      ...(canDeleteCinema
                                        ? [
                                            {
                                              key: "2",
                                              label: "Delete Screen",
                                              danger: true,
                                              icon: (
                                                <Trash2 className="w-4 h-4" />
                                              ),
                                              onClick: () => {
                                                setSelectedScreen(screen);
                                                setShowDeleteScreenModal(true);
                                              },
                                            },
                                          ]
                                        : []),
                                    ],
                                  }}
                                  trigger={["click"]}
                                >
                                  <button
                                    type="button"
                                    className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
                                  >
                                    <MoreVertical size={16} />
                                  </button>
                                </Dropdown>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-stone-500 text-center py-3">
                            No screens configured yet
                          </p>
                        )}
                      </div>
                    </Panel>
                  </Collapse>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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
        open={showSeatLayoutModal}
        title={`Seat Layout: ${selectedScreen?.name}`}
        onClose={() => setShowSeatLayoutModal(false)}
      >
        {showSeatLayoutModal && selectedScreen && (
          <SeatLayoutEditor
            screen={selectedScreen}
            onCancel={() => setShowSeatLayoutModal(false)}
          />
        )}
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
