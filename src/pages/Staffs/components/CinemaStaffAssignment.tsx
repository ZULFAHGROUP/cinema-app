/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { List } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { getAllCinemas } from "../../../store/slices/cinema";
import {
  getCinemaStaff,
  assignCinemaStaff,
  removeCinemaStaff,
} from "../../../store/slices/cinemaStaff";
import {
  getManagers,
  getPosCashiers,
  getGeneralStaff,
} from "../../../store/slices/staff";
import { getAllRoles } from "../../../store/slices/roles";
import { UserPlus, Plus, Trash2 } from "lucide-react";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import ReusableTable from "../../../components/shared/Table";
import ReusableSelect from "../../../components/shared/Select";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { toast } from "react-toastify";
import Button from "../../../components/shared/Button";

export default function CinemaStaffAssignment() {
  const dispatch = useAppDispatch();
  const { 
    allCinemas, 
    page: cinemaPage,
    limit: cinemaLimit 
  } = useAppSelector((state) => state.cinema);

  const {
    roles,
    page: rolePage,
    limit: roleLimit,
  } = useAppSelector((state) => state.role);

  const {
    cinemaStaffList,
    loading: assignmentLoading,
    page: cinemaStaffPage,
    limit: cinemaStaffLimit,
    total: cinemaStaffTotal,
  } = useAppSelector((state) => state.cinemaStaff);
  
  const {
    managers,
    cashiers,
    generalStaff,
    loading: staffLoading,
    managersPagination,
    cashiersPagination,
    staffPagination,
  } = useAppSelector((state) => state.staff);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<{cinemaId: string, userId: string, name: string} | null>(null);

  useEffect(() => {
    dispatch(getAllCinemas({ page: cinemaPage , limit: cinemaLimit }));
    dispatch(getAllRoles({ page: rolePage, limit: roleLimit }));
    // Fetch all assignments on mount
    dispatch(getCinemaStaff({ page: cinemaStaffPage, limit: cinemaStaffLimit }));
  }, [dispatch]);

  const handleDeleteClick = (cinemaId: string, userId: string, name: string) => {
      setStaffToDelete({ cinemaId, userId, name });
      setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;

    try {
      await dispatch(
        removeCinemaStaff({ cinema_id: staffToDelete.cinemaId, user_id: staffToDelete.userId })
      ).unwrap();
      toast.success("Staff removed successfully");
      dispatch(getCinemaStaff({ page: cinemaStaffPage, limit: cinemaStaffLimit }));
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove staff");
    }
  };

  const handlePaginationChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    dispatch(getCinemaStaff({ page: current, limit: pageSize || 10 }));
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: any, record: any) => (
        <div className="flex flex-col text-left">
             <span className="font-medium">
                {record.user ? `${record.user.surname} ${record.user.other_names}` : `${record.surname} ${record.other_names}`}
            </span>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_: any, record: any) => (
          <span className="text-gray-500">{record.user ? record.user.email : record.email}</span>
      )
    },
    {
       title: "Cinema",
       key: "cinema",
       render: (_: any, record: any) => (
         <div>
          <span className="text-sm">
            {record.cinema ? record.cinema.name : "Unknown Cinema"}
         </span>
         <p className="text-xs text-gray-500">{record.cinema ? record.cinema.location : "Unknown Cinema Address"}</p>
         </div>
       )
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => {
        const name = record.user ? `${record.user.surname} ${record.user.other_names}` : `${record.surname} ${record.other_names}`;
        return (
          <Button   className="bg-transparent text-red-500! shadow-none!"  title="Remove"   icon={<Trash2 size={16} />}     onClick={() => handleDeleteClick(record.cinema_id, record.id || record.user_id, name)}
/>
                   );
      },
    },
  ];

  // Helper to fetch staff based on role
  const fetchStaffByRole = (roleName: string) => {
    const lowerRole = roleName.toLowerCase();
    // Reset page to 1 when filter changes ideally, or keep defaults
    if (lowerRole.includes("manager")) {
      dispatch(getManagers({ page: managersPagination.page, limit: managersPagination.limit }));
    } else if (lowerRole.includes("cashier") || lowerRole.includes("pos")) {
      dispatch(getPosCashiers({ page: cashiersPagination.page, limit: cashiersPagination.limit }));
    } else {
      dispatch(getGeneralStaff({ page: staffPagination.page, limit: staffPagination.limit }));
    }
  };

  const getAvailableStaff = (roleName?: string) => {
    if (!roleName) return [];
    const lowerRole = roleName.toLowerCase();
    if (lowerRole.includes("manager")) {
      return managers;
    } else if (lowerRole.includes("cashier") || lowerRole.includes("pos")) {
      return cashiers;
    } else {
      return generalStaff;
    }
  };

  const isAssigned = (userId: string, cinemaId: string) => {
     return cinemaStaffList.some((staff: any) => 
        (staff.user_id === userId || staff.id === userId) && 
        (staff.cinema_id === cinemaId) 
     );
  };

  const handleAssign = async (userId: string, cinemaId: string, onSuccess?: () => void) => {
    try {
     const response = await dispatch(
        assignCinemaStaff({ cinema_id: cinemaId, user_id: userId })
      ).unwrap();
    if (response.code === 200 || response.code === 201){
       toast.success("Staff assigned successfully");
      dispatch(getCinemaStaff({ page: cinemaStaffPage, limit: cinemaStaffLimit }));
      setIsAssignModalOpen(false);
      if (onSuccess) {
        onSuccess();
      }
      
    } 
    } catch (error: any) {
      toast.error(error.message || "Failed to assign staff");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
         <h2 className="text-lg font-semibold text-gray-800">Cinema Assignments</h2>
         <Button 
         title="New Assignment"
           variant="primary" 
           icon={<Plus size={16} />} 
           className="rounded-md"
           onClick={() => setIsAssignModalOpen(true)}
         />
               </div>

      {/* Assigned Staff Table */}
      <ReusableTable
        data={cinemaStaffList}
        columns={columns}
        title="Assigned Staff"
        showPagination={true}
        paginationMode="backend"
        paginationProps={{
            current: cinemaStaffPage,
            total: cinemaStaffTotal,
            pageSize: cinemaStaffLimit,
        }}
        onTableChange={handlePaginationChange}
        showSearch={true}
        searchField={["user.surname", "user.email", "cinema.name"]}
      />

      {/* Assignment Modal */}
      <DisplayModal
        open={isAssignModalOpen}
        title="Assign Staff to Cinema"
        onClose={() => setIsAssignModalOpen(false)}
        // width={800}
      >
        <Formik
          initialValues={{
            cinema_id: "",
            role_name: "",
          }}
          validationSchema={Yup.object({
            cinema_id: Yup.string().required("Cinema is required"),
            role_name: Yup.string().required("Role is required"),
          })}
          onSubmit={() => {}}
        >
          {({ values, setFieldValue, errors, touched, resetForm }) => {
            // Trigger fetch when role changes.
            // Note: In Formik, we can use an effect inside the component or handle it in onChange.
            // Handling in onChange is cleaner here.
            
            const onRoleChange = (role: string) => {
                setFieldValue("role_name", role);
                fetchStaffByRole(role);
            };

            const staffList = getAvailableStaff(values.role_name);

            return (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <ReusableSelect
                       label="Select Cinema"
                       name="cinema_id"
                       value={values.cinema_id}
                       options={allCinemas.map((c: any) => ({
                         label: c.name,
                         value: c.cinema_id,
                       }))}
                       onChange={(val) => setFieldValue("cinema_id", val)}
                       error={errors.cinema_id && touched.cinema_id ? errors.cinema_id : ""}
                       defaultOption="Choose a cinema"
                    />

                    <ReusableSelect
                       label="Select Role"
                       name="role_name"
                       value={values.role_name}
                       options={roles?.map((role: any) => ({
                         label: role.role_name,
                         value: role.role_name,
                       })) || []}
                       onChange={(val) => onRoleChange(val as string)}
                       error={errors.role_name && touched.role_name ? errors.role_name : ""}
                       defaultOption="Filter by role"
                    />
                </div>

                <div className="border rounded-lg overflow-hidden h-[250px] flex flex-col">
                    <div className="bg-gray-100 px-4 py-2 border-b font-medium text-sm text-gray-600">
                        Available Staff {values.role_name ? `(${values.role_name})` : ""}
                    </div>
                    {!values.role_name ? (
                      <div className="flex items-center justify-center flex-1 text-gray-400">
                        Select a role to view available staff
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto p-2">
                         <List
                            loading={staffLoading}
                            dataSource={staffList}
                            renderItem={(item: any) => (
                            <List.Item
                                actions={[
                                <Button
                                title={isAssigned(item.user_id, values.cinema_id) ? "Assigned" : "Assign"}               
                                variant="primary"                  
                                icon={<UserPlus size={16} />}
                                className="rounded-md"
                                onClick={() => handleAssign(item.user_id, values.cinema_id, resetForm)}
                                loading={assignmentLoading && isAssigned(item.user_id, values.cinema_id)}
                                disabled={assignmentLoading||!values.cinema_id || isAssigned(item.user_id, values.cinema_id)}
                                />
                                ]}
                                className="bg-white mb-2 rounded border px-3 py-2"
                            >
                                <List.Item.Meta
                                title={`${item.surname} ${item.other_names}`}
                                description={item.email}
                                />
                            </List.Item>
                            )}
                            locale={{ emptyText: "No staff found for this role" }}
                        />
                      </div>
                    )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </DisplayModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => {
            setShowDeleteModal(false);
            setStaffToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Remove Staff Assignment"
        content={`Are you sure you want to remove ${staffToDelete?.name} from this cinema?`}
      />
    </div>
  );
}
