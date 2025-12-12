/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/shared/Button";
import { Edit, Trash2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  deletePriceRule,
  getAllPriceRules,
} from "../../../../store/slices/priceRule";
import { getAllMovies } from "../../../../store/slices/movie";
import { getAllScreenTypes } from "../../../../store/slices/screenType";
import { getAllCinemas } from "../../../../store/slices/cinema";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ReusableSelect from "../../../../components/shared/Select";
import { toast } from "react-toastify";
import PriceRuleForm from "./components/PriceRuleForm";
import ReusableTable from "../../../../components/shared/Table";
import Loader from "../../../../components/shared/Loader";

const DAYS_MAP: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

const PriceRule = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");

  const dispatch = useAppDispatch();
  const { priceRules, loading, page, limit, total } = useAppSelector(
    (state) => state.priceRule
  );
  const { movies } = useAppSelector((state) => state.movie);
  const { screenTypes } = useAppSelector((state) => state.screenType);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { user } = useAppSelector((state) => state.accounts.data);
  
  const userCinemaId = user?.cinema_id;
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    dispatch(getAllMovies({ page: 1, limit:1000 }));
    dispatch(getAllScreenTypes({ page: 1, limit: 100 }));
    if (isAdmin) {
      dispatch(getAllCinemas({ page: 1, limit: 100 }));
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    const cinemaIdToUse = isAdmin ? selectedCinemaId : userCinemaId;
    dispatch(getAllPriceRules({ page, limit, cinema_id: cinemaIdToUse || undefined }));
  }, [dispatch, page, limit, isAdmin, userCinemaId, selectedCinemaId]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deletePriceRule(selectedItem.price_rule_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        const cinemaIdToUse = isAdmin ? selectedCinemaId : userCinemaId;
        await dispatch(getAllPriceRules({ page, limit, cinema_id: cinemaIdToUse || undefined }));
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting price rule");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    //   render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
    {
      title: "Days",
      dataIndex: "day_of_week",
      key: "day_of_week",
      render: (days: number[]) => 
        days.map((d) => DAYS_MAP[d]).join(", "),
    },
    {
      title: "Time Range",
      key: "time_range",
      render: (_: any, record: any) => 
        `${record.start_time} - ${record.end_time}`,
    },
    {
      title: "Cinema",
      dataIndex: "cinema_id",
      key: "cinema_id",
      render: (cinema_id: string) => {
        if (!cinema_id) return "General";
        const cinema = allCinemas?.find((c: any) => c.cinema_id === cinema_id);
        return cinema?.name || cinema_id;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify">
          <Button
            variant="secondary"
            size="sm"
            icon={<Edit className="w-3 h-3" />}
            className="rounded-md"
            onClick={() => {
              setSelectedItem(record);
              setEditMode(true);
              setShowFormModal(true);
            }}
          />
          <Button
            variant="primary"
            size="sm"
            icon={<Trash2 className="w-3 h-3" />}
            className="rounded-md"
            onClick={() => {
              setSelectedItem(record);
              setShowDeleteModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    const cinemaIdToUse = isAdmin ? selectedCinemaId : userCinemaId;
    dispatch(
      getAllPriceRules({
        page: pagination.current,
        limit: pagination.pageSize,
        cinema_id: cinemaIdToUse || undefined,
      })
    ).unwrap();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Price Rules</h2>
        <Button
          className="rounded-md"
          icon={<Plus className="w-4 h-4" />}
          title="Add New"
          onClick={() => {
            setEditMode(false);
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        />
      </div>

      {/* Cinema Filter for Admin */}
      {isAdmin && (
        <div className="mb-4 w-64">
          <ReusableSelect
            label="Filter by Cinema"
            name="cinema_filter"
            value={selectedCinemaId}
            onChange={(value) => setSelectedCinemaId(value as string)}
            options={[
              { label: "All Cinemas", value: "" },
              ...(allCinemas?.map((cinema: any) => ({
                label: cinema.name,
                value: cinema.cinema_id,
              })) || []),
            ]}
            defaultOption="Select cinema"
          />
        </div>
      )}

      {loading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={priceRules || []}
          columns={columns}
          title="Price Rules"
          searchField={["name"]}
          excludeColumns={["price_rule_id", "movie_id", "screen_type_id"]}
          showPagination={true}
          paginationMode="backend"
          paginationProps={{
            total,
            current: page,
            pageSize: limit,
          }}
          onTableChange={handleTableChange}
        />
      )}

      {/* Add / Edit Modal */}
      <DisplayModal
        open={showFormModal}
        title={editMode ? "Edit Price Rule" : "Add Price Rule"}
        onClose={() => setShowFormModal(false)}
        width={800}
      >
        <PriceRuleForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          priceRuleData={selectedItem}
          movies={movies}
          screenTypes={screenTypes}
        />
      </DisplayModal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        item={selectedItem?.name}
      />
    </div>
  );
};

export default PriceRule;
