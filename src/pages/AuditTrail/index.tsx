/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { getAllAuditTrails } from "../../store/slices/extras";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import ReusableTable from "../../components/shared/Table";
import Loader from "../../components/shared/Loader";
import { humanDateAndTime } from "../../utils";

// const AuditTrail = () => {
//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     dispatch(getAllAuditTrails());
//   }, [dispatch]);

//   const { auditTrails, auditLoading } = useAppSelector((state) => state.extras);

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "user_id",
//       key: "user_id",
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       key: "action",
//     },
//     {
//       title: "User Agent",
//       dataIndex: "user_agent",
//       key: "user_agent",
//     },
//     {
//       title: "Time and Date",
//       dataIndex: "created_at",
//       key: "created_at",
//       render: (created_at: any) => humanDateAndTime(created_at),
//     },
//   ];

//   return (
// <div className="space-y-4">
//   <div className="flex justify-between items-center mb-2">
//     <h2 className="text-lg font-semibold">Audit Trails</h2>
//   </div>

//   {auditLoading ? (
//     <Loader rows={10} />
//   ) : (
//     <ReusableTable
//       data={auditTrails || []}
//       columns={columns}
//       title="Audit Trail"
//       searchField={[""]}
//     />
//   )}
// </div>
//   );
// };

const AuditTrail = () => {
  const dispatch = useAppDispatch();

  const { auditTrails, auditLoading, page, limit, total } = useAppSelector(
    (state) => state.extras
  );

  useEffect(() => {
    dispatch(getAllAuditTrails({ page, limit }));
  }, [dispatch, page, limit]);

  const handleTableChange = (pagination: any) => {
    dispatch(
      getAllAuditTrails({
        page: pagination.current,
        limit: pagination.pageSize,
      })
    );
  };

  const columns = [
    { title: "Name", dataIndex: "user_id", key: "user_id" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Action", dataIndex: "action", key: "action" },
    { title: "User Agent", dataIndex: "user_agent", key: "user_agent" },
    {
      title: "Time and Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: any) => humanDateAndTime(created_at),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Audit Trails</h2>
      </div>

      {auditLoading ? (
        <Loader rows={10} />
      ) : (
        <ReusableTable
          data={auditTrails}
          columns={columns}
          title="Audit Trail"
          showPagination={true}
          paginationMode="backend"
          paginationProps={{
            total,
            current: page,
            pageSize: limit,
          }}
          onTableChange={handleTableChange}
          searchField={[""]}
        />
      )}
    </div>
  );
};

export default AuditTrail;
