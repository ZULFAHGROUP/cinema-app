import { useEffect } from "react";
import { getAllAuditTrails } from "../../store/slices/extras";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import ReusableTable from "../../components/shared/Table";

const AuditTrail = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllAuditTrails());
  }, [dispatch]);

  const { auditTrails, auditLoading } = useAppSelector((state) => state.extras);

  const columns = [
    {
      title: "Name",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Audit Trails</h2>
      </div>

      {auditLoading ? (
        <p>Loading...</p>
      ) : (
        <ReusableTable
          data={auditTrails || []}
          columns={columns}
          title="Audit Trail"
          searchField={[""]}
        />
      )}
    </div>
  );
};

export default AuditTrail;
