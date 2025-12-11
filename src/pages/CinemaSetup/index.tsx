// /* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../components/shared/Button";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Pagination } from "antd";
import Theater from "./components/Theater";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import AddTheaterForm from "./components/AddTheaterForm";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllCinemas } from "../../store/slices/cinema";
// import { getAllScreen } from "../../store/slices/screen";

// function CinemaSetup() {
//   const [isAddTheaterModalOpen, setIsAddTheaterModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const { cinemaLoading, allCinemas, total } = useAppSelector(
//     (state) => state.cinema
//   );
//   const { loading, screens, screensLimit, screensPage } = useAppSelector(
//     (state) => state.screen
//   );

//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(getAllCinemas({ page: currentPage, limit: pageSize }));
//     dispatch(getAllScreen({ screensPage, screensLimit }));
//   }, [dispatch, currentPage, pageSize, screensPage, screensLimit]);

//   const handlePageChange = (page: number, pageSize: number) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-sans font-bold">Cinema Locations</h1>
//           <p className="text-sm font-serif text-muted-foreground mt-1">
//             Manage your cinema locations and screens
//           </p>
//         </div>
//         <Button
//           title="Add Location"
//           onClick={() => setIsAddTheaterModalOpen(true)}
//           className="gap-2 rounded-md"
//           icon={<Building2 className="w-4 h-4" />}
//         />
//       </div>

//       {/* Theater Content */}
//       <Theater
//         loading={cinemaLoading}
//         cinemas={allCinemas}
//         screens={screens}
//         screensLoading={loading}
//       />

//       {/* Pagination */}
//       {!cinemaLoading && allCinemas?.length > 0 && (
//         <div className="flex justify-center mt-6">
//           <Pagination
//             current={currentPage}
//             total={total}
//             pageSize={pageSize}
//             onChange={handlePageChange}
//             onShowSizeChange={handlePageChange}
//             showSizeChanger
//             showTotal={(total, range) =>
//               `${range[0]}-${range[1]} of ${total} cinemas`
//             }
//             pageSizeOptions={["6", "9", "12", "18", "24"]}
//             className="font-serif"
//           />
//         </div>
//       )}

//       {/* Add Theater Modal */}
//       <DisplayModal
//         open={isAddTheaterModalOpen}
//         onClose={() => setIsAddTheaterModalOpen(false)}
//         title="Add New Cinema Location"
//       >
//         <AddTheaterForm onCancel={() => setIsAddTheaterModalOpen(false)} />
//       </DisplayModal>
//     </div>
//   );
// }

// export default CinemaSetup;

function CinemaSetup() {
  const [isAddTheaterModalOpen, setIsAddTheaterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { cinemaLoading, allCinemas, total } = useAppSelector(
    (state) => state.cinema
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllCinemas({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

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
      <Theater loading={cinemaLoading} cinemas={allCinemas} />

      {/* Pagination */}
      {!cinemaLoading && allCinemas?.length > 0 && (
        <div className="flex justify-center mt-6">
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
            className="font-serif"
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
