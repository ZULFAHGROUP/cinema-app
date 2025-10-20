import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/shared/Cards";
import Button from "../../components/shared/Button";
import { Tabs } from "antd";
import { Building2, Monitor, Armchair } from "lucide-react";
import { useEffect, useState } from "react";
import Theater from "./components/Theater";
import Screens from "./components/Screens";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import AddTheaterForm from "./components/AddTheaterForm";
import AddScreensForm from "./components/AddScreensForm";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllCinemas } from "../../store/slices/cinema";
import { getAllScreen } from "../../store/slices/screen";
import { getAllSeats } from "../../store/slices/seat";

function CinemaSetup() {
  const [activeTab, setActiveTab] = useState("theaters");
  const [isAddTheaterModalOpen, setIsAddTheaterModalOpen] = useState(false);
  const [isAddScreensModalOpen, setIsAddScreensModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllCinemas());
    dispatch(getAllScreen());
    dispatch(getAllSeats());
  }, [dispatch]);

  const { cinemaLoading, allCinemas } = useAppSelector((state) => state.cinema);
  const { loading, screens } = useAppSelector((state) => state.screen);
  const { seatLoading, seats } = useAppSelector((state) => state.seat);

  const seatLayout = Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 15 }, (_, seat) => ({
      id: `${String.fromCharCode(65 + row)}${seat + 1}`,
      row: String.fromCharCode(65 + row),
      number: seat + 1,
      type: seat < 2 || seat > 12 ? "premium" : "standard",
      status: Math.random() > 0.1 ? "available" : "maintenance",
    }))
  );

  const tabItems = [
    {
      key: "theaters",
      label: (
        <span className="flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Cinemas
        </span>
      ),
      children: <Theater loading={cinemaLoading} cinemas={allCinemas} />,
    },
    {
      key: "screens",
      label: (
        <span className="flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Screens
        </span>
      ),
      children: <Screens loading={loading} screens={screens} />,
    },
    {
      key: "seating",
      label: (
        <span className="flex items-center gap-2">
          <Armchair className="w-4 h-4" /> Seating
        </span>
      ),
      children: (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">
              Seating Layout - Theater 1
            </CardTitle>
            <CardDescription className="font-serif">
              Configure seat types and availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="bg-gray-200 px-8 py-2 rounded-lg">
                  <p className="text-sm font-serif text-center">SCREEN</p>
                </div>
              </div>

              <div className="space-y-2">
                {seatLayout.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center justify-center gap-1"
                  >
                    <span className="w-6 text-center text-sm font-serif text-muted-foreground">
                      {String.fromCharCode(65 + rowIndex)}
                    </span>
                    {row.map((seat) => (
                      <button
                        key={seat.id}
                        className={`
                        w-6 h-6 rounded text-xs font-serif transition-colors
                        ${
                          seat.type === "premium"
                            ? "bg-green-600 text-white hover:bg-green-500"
                            : "bg-gray-300 text-black hover:bg-gray-400"
                        }
                        ${
                          seat.status === "maintenance"
                            ? "bg-red-500 text-white"
                            : ""
                        }
                      `}
                        title={`${seat.id} - ${seat.type} - ${seat.status}`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="font-serif">Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <span className="font-serif">Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="font-serif">Maintenance</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header with Tabs and Button in same line */}
      <div className="flex items-center flex-col md:flex-row justify-between mb-6">
        <div className="flex-1">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems.map((item) => ({
              key: item.key,
              label: item.label,
            }))}
            className="cinema-tabs"
          />
        </div>
        <div className="flex gap-2 ml-4">
          {activeTab === "theaters" && (
            <Button
              title="Add Cinema"
              onClick={() => setIsAddTheaterModalOpen(true)}
              className="gap-2 rounded-md"
              icon={<Building2 className="w-4 h-4" />}
            />
          )}
          {activeTab === "screens" && (
            <Button
              title="Add Screen"
              onClick={() => setIsAddScreensModalOpen(true)}
              className="gap-2 rounded-md"
              icon={<Monitor className="w-4 h-4" />}
            />
          )}
          {activeTab === "seating" && (
            <Button
              className="gap-2 rounded-md"
              icon={<Armchair className="w-4 h-4" />}
              title="Edit Seating Layout"
            />
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content min-h-screen">
        {tabItems.find((item) => item.key === activeTab)?.children}
      </div>

      {/* Add Movie Modal */}
      <DisplayModal
        open={isAddTheaterModalOpen}
        onClose={() => setIsAddTheaterModalOpen(false)}
        title="Add New Movie"
      >
        <AddTheaterForm onCancel={() => setIsAddTheaterModalOpen(false)} />
      </DisplayModal>

      {/* Add Showtime Modal */}
      <DisplayModal
        open={isAddScreensModalOpen}
        onClose={() => setIsAddScreensModalOpen(false)}
        title="Add New Showtime"
      >
        <AddScreensForm
          cinemas={allCinemas}
          onCancel={() => setIsAddScreensModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default CinemaSetup;
