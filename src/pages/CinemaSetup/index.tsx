// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/shared/Cards";
import Button from "../../components/shared/Button";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import Theater from "./components/Theater";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import AddTheaterForm from "./components/AddTheaterForm";
// import AddScreensForm from "./components/AddScreensForm";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllCinemas } from "../../store/slices/cinema";
import { getAllScreen } from "../../store/slices/screen";
import { getAllSeats } from "../../store/slices/seat";

function CinemaSetup() {
  const [isAddTheaterModalOpen, setIsAddTheaterModalOpen] = useState(false);
  // const [isAddScreensModalOpen, setIsAddScreensModalOpen] = useState(false);
  const { cinemaLoading, allCinemas, page, limit, total } = useAppSelector(
    (state) => state.cinema
  );
  const { loading, screens } = useAppSelector((state) => state.screen);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllCinemas({ page, limit })).unwrap();
    dispatch(getAllScreen());
    dispatch(getAllSeats());
  }, [dispatch, page, limit]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-sans font-bold">Cinema Locations</h1>
          <p className="text-sm font-serif text-muted-foreground mt-1">
            Manage your cinema locations and screens
          </p>
        </div>
        <Button
          title="Add Location"
          onClick={() => setIsAddTheaterModalOpen(true)}
          className="gap-2 rounded-md"
          icon={<Building2 className="w-4 h-4" />}
        />
      </div>

      {/* Theater Content */}
      <Theater
        loading={cinemaLoading}
        cinemas={allCinemas}
        screens={screens}
        screensLoading={loading}
        // onAddScreen={() => setIsAddScreensModalOpen(true)}
      />

      {/* Add Theater Modal */}
      <DisplayModal
        open={isAddTheaterModalOpen}
        onClose={() => setIsAddTheaterModalOpen(false)}
        title="Add New Cinema Location"
      >
        <AddTheaterForm onCancel={() => setIsAddTheaterModalOpen(false)} />
      </DisplayModal>

      {/* Add Screen Modal */}
      {/* <DisplayModal
        open={isAddScreensModalOpen}
        onClose={() => setIsAddScreensModalOpen(false)}
        title="Add New Screen"
      >
        <AddScreensForm
          cinemas={allCinemas}
          onCancel={() => setIsAddScreensModalOpen(false)}
        />
      </DisplayModal> */}
    </div>
  );
}

export default CinemaSetup;
