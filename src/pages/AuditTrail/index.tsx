/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Tag } from "antd";
import { getAllAuditTrails } from "../../store/slices/extras";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import ReusableTable from "../../components/shared/Table";
import Loader from "../../components/shared/Loader";
import { formatUserLabel, humanDateAndTime } from "../../utils";

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
    ).unwrap();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
      render: (user: any) =>
        user ? `${user?.surname}  ${user?.other_names}` : "Name not available",
    },
    {
      title: "Email",
      dataIndex: "user",
      key: "user",
      render: (user: any) => user?.email || "Email not available",
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => {
        let color = "default";
        const act = action?.toUpperCase();
        if (act?.includes("CREATE")) color = "green";
        else if (act?.includes("UPDATE")) color = "blue";
        else if (act?.includes("DELETE")) color = "red";
        else if (act?.includes("LOGIN")) color = "cyan";
        else if (act?.includes("LOGOUT")) color = "volcano";
        return <Tag color={color}>{action}</Tag>;
      },
    },
    { title: "User Agent", dataIndex: "user_agent", key: "user_agent" },
    { title: "Accessed Resource", dataIndex: "resource", key: "resource", render: (_:unknown, record: any) => formatUserLabel(record?.resource) || "Resource not available" },
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
