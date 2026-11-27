/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../components/shared/Button";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import Theater from "./components/Theater";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import AddTheaterForm from "./components/AddTheaterForm";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllCinemas } from "../../store/slices/cinema";
import { hasPermission, isAdminRole } from "../../utils/permissions";

function CinemaSetup() {
  const [isAddTheaterModalOpen, setIsAddTheaterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { cinemaLoading, allCinemas, total } = useAppSelector(
    (state) => state.cinema
  );
  const { user } = useAppSelector((state) => state.accounts.data);
  const isAdmin = isAdminRole(user);
  const canAddCinema = hasPermission(user, "add_cinemas");
  const scopedCinemaId = !isAdmin ? user?.cinema_id : user?.scoped_cinema_id || "";
  const visibleCinemas = scopedCinemaId
    ? (allCinemas || []).filter((c: any) => c.cinema_id === scopedCinemaId)
    : allCinemas;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCinemas({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Modern Page Header */}
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              Cinema Locations
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              {scopedCinemaId
                ? "Manage your assigned cinema location, screens, and auditorium seat maps"
                : "Manage your cinema locations, screens, and auditorium seat maps"}
            </p>
          </div>
        </div>
        {canAddCinema && (
          <Button
            title="Add Location"
            onClick={() => setIsAddTheaterModalOpen(true)}
            icon={<Building2 className="w-4 h-4" />}
          />
        )}
      </div>

      {/* Theater Content */}
      <Theater loading={cinemaLoading} cinemas={visibleCinemas} />

      {/* Pagination */}
      {!cinemaLoading && !scopedCinemaId && allCinemas?.length > 0 && (
        <div className="flex justify-center pt-4">
          <Pagination
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            showSizeChanger
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} cinemas`
            }
            pageSizeOptions={["6", "9", "12", "18", "24"]}
          />
        </div>
      )}

      {/* Add Theater Modal */}
      <DisplayModal
        open={isAddTheaterModalOpen}
        onClose={() => setIsAddTheaterModalOpen(false)}
        title="Add New Cinema Location"
      >
        <AddTheaterForm onCancel={() => setIsAddTheaterModalOpen(false)} />
      </DisplayModal>
    </div>
  );
}

export default CinemaSetup;
