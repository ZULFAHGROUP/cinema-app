/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/shared/Button";
import {
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Tag as TagIcon,
  Clock,
  Film,
  Monitor,
  Building2,
} from "lucide-react";
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
  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    dispatch(getAllMovies({ page: 1, limit: 100 }));
    dispatch(getAllScreenTypes({ page: 1, limit: 100 }));
    if (isAdmin) {
      dispatch(getAllCinemas({ page: 1, limit: 100 }));
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    const cinemaIdToUse = isAdmin ? selectedCinemaId || undefined : undefined;
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
        const cinemaIdToUse = isAdmin
          ? selectedCinemaId || undefined
          : undefined;
        await dispatch(
          getAllPriceRules({ page, limit, cinema_id: cinemaIdToUse })
        );
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting price rule");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Rule Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <TagIcon className="w-4 h-4" />
          </div>
          <span className="font-bold text-stone-900 capitalize">{name}</span>
        </div>
      ),
    },
    {
      title: "Ticket Price",
      dataIndex: "price",
      key: "price",
      render: (price: number | string) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs">
          {formatCurrency(Number(price) || 0)}
        </span>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: number) => (
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-xs">
          #{priority ?? 1}
        </span>
      ),
    },
    {
      title: "Active Days",
      dataIndex: "day_of_week",
      key: "day_of_week",
      render: (days: any) => {
        const list = Array.isArray(days)
          ? days
          : typeof days === "number"
          ? [days]
          : [];
        if (list.length === 0) {
          return (
            <span className="text-xs font-medium text-stone-500">All Days</span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {list.map((d: number) => (
              <span
                key={d}
                className="px-2 py-0.5 rounded-md bg-[#fff8ea] border border-[#c77e3b]/25 text-[#754f2c] text-[11px] font-semibold"
              >
                {DAYS_MAP[d] ?? d}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: "Time Window",
      key: "time_range",
      render: (_: any, record: any) => {
        const start = getHumanTime(record?.start_time);
        const end = getHumanTime(record?.end_time);
        if (!start && !end) {
          return (
            <span className="text-xs font-medium text-stone-500">All Day</span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700">
            <Clock className="w-3.5 h-3.5 text-[#c77e3b]" />
            {start || "00:00"} – {end || "23:59"}
          </span>
        );
      },
    },
    {
      title: "Target Movie",
      key: "movies",
      render: (_: any, record: any) =>
        record?.movie?.title ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800">
            <Film className="w-3.5 h-3.5 text-[#c77e3b] shrink-0" />
            <span className="truncate max-w-[160px]">{record.movie.title}</span>
          </span>
        ) : (
          <span className="text-xs text-stone-400">Any Movie</span>
        ),
    },
    {
      title: "Screen Format",
      key: "screen_type",
      render: (_: any, record: any) =>
        record?.screenType?.name ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5480c7]/10 text-[#5480c7] border border-[#5480c7]/20 text-xs font-semibold">
            <Monitor className="w-3 h-3" />
            {record.screenType.name}
          </span>
        ) : (
          <span className="text-xs text-stone-400">All Formats</span>
        ),
    },
    {
      title: "Bundled Products",
      key: "products",
      render: (_: any, record: any) =>
        Array.isArray(record?.products) && record.products.length > 0 ? (
          <span className="text-xs font-medium text-stone-700">
            {record.products.map((p: any) => p.name).join(", ")}
          </span>
        ) : (
          <span className="text-xs text-stone-400">None</span>
        ),
    },
    {
      title: "Cinema Scope",
      dataIndex: "cinema_id",
      key: "cinema_id",
      render: (cinema_id: string) => {
        if (!cinema_id) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              Global (All)
            </span>
          );
        }
        const cinema = allCinemas?.find((c: any) => c.cinema_id === cinema_id);
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#754f2c]">
            <Building2 className="w-3.5 h-3.5 text-[#c77e3b]" />
            {cinema?.name || "Branch"}
          </span>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit Rule",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete Rule",
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
          <button
            type="button"
            className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    const cinemaIdToUse = isAdmin ? selectedCinemaId || undefined : undefined;
    dispatch(
      getAllPriceRules({
        page: pagination.current,
        limit: pagination.pageSize,
        cinema_id: cinemaIdToUse,
      })
    ).unwrap();
  };

  return (
    <div className="space-y-5">
      {/* Sub-module Header Bar */}
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900">
            Dynamic Ticket Price Rules
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure ticket pricing by movie, screen experience, cinema branch,
            or day/time window
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <div className="w-56">
              <ReusableSelect
                name="cinema_filter"
                value={selectedCinemaId}
                onChange={(value) =>
                  setSelectedCinemaId((value as string) || "")
                }
                options={
                  allCinemas?.map((cinema: any) => ({
                    label: cinema.name,
                    value: cinema.cinema_id,
                  })) || []
                }
                defaultOption="All Cinema Branches"
                allowClear
              />
            </div>
          )}
          <Button
            icon={<Plus className="w-4 h-4" />}
            title="Add Price Rule"
            onClick={() => {
              setEditMode(false);
              setSelectedItem(null);
              setShowFormModal(true);
            }}
          />
        </div>
      </div>

      {loading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={priceRules || []}
          columns={columns as any}
          title={`Configured Price Rules (${total || priceRules?.length || 0})`}
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
        title={editMode ? "Edit Price Rule" : "Create Price Rule"}
        subtitle="If no cinema branch is selected, the rule applies globally across all cinemas."
        onClose={() => setShowFormModal(false)}
        width={760}
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
