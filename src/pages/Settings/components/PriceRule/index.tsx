/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/shared/Button";
import { Edit, Trash2, Plus, MoreVertical } from "lucide-react";
import { Dropdown } from "antd";
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
import { formatCurrency, getHumanTime } from "../../../../utils";

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
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    dispatch(getAllMovies({ page: 1, limit:1000 }));
    dispatch(getAllScreenTypes({ page: 1, limit: 100 }));
    if (isAdmin) {
      dispatch(getAllCinemas({ page: 1, limit: 100 }));
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    const cinemaIdToUse = isAdmin ? selectedCinemaId : undefined;
    dispatch(getAllPriceRules({ page, limit, cinema_id: cinemaIdToUse }));
  }, [dispatch, page, limit, isAdmin, selectedCinemaId]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deletePriceRule(selectedItem.price_rule_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        const cinemaIdToUse = isAdmin ? selectedCinemaId : undefined;
        await dispatch(getAllPriceRules({ page, limit, cinema_id: cinemaIdToUse }));
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
            render: (name: string) => <p className="capitalize">{name}</p>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <p>{formatCurrency(price)}</p>,
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
        days.map((d) => DAYS_MAP[d]).join(", ") || "All",
    },
    {
      title: "Time Range",
      key: "time_range",
      render: (_: any, record: any) => 
        `${getHumanTime(record.start_time)} - ${getHumanTime(record.end_time)}` || "All",
    },{
      title: "Products",
      key: "products",
      render: (_: any, record: any) => 
        record?.products?.map((product: any) => product.name).join(", ") || "Not set",
    },{
      title: "Movies",
      key: "movies",
      render: (_: any, record: any) => 
        record?.movie?.title || "All",
    },{
      title: "Screen Type",
      key: "screen_type",
      render: (_: any, record: any) => 
        record?.screenType?.name || "All",
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
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: "Edit",
                        icon: <Edit className="w-4 h-4" />,
                        onClick: () => {
                          setSelectedItem(record);
                          setEditMode(true);
                          setShowFormModal(true);
                        },
                      },
                      {
                        key: "delete",
                        label: "Delete",
                        danger: true,
                        icon: <Trash2 className="w-4 h-4" />,
                        onClick: () => {
                          setSelectedItem(record);
                          setShowDeleteModal(true);
                        },
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button
                    size="sm"
                    className="p-0 bg-transparent w-fit shadow-none text-black!"
                    icon={<MoreVertical size={18} />}
                  />
                </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    const cinemaIdToUse = isAdmin ? selectedCinemaId : undefined;
    dispatch(
      getAllPriceRules({
        page: pagination.current,
        limit: pagination.pageSize,
        cinema_id: cinemaIdToUse,
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
          columns={columns as any}
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
        <p className="text-sm text-gray-600">Note: If no cinema is selected, the price rule will be applied to all cinemas.</p>
        <p className="text-sm text-gray-600 mb-4">Price rule can be set based on movie, screen type,and  day of week.</p>
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
