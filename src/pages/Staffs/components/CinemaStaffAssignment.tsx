/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Input, Select, Tag } from "antd";
import { ArrowRightLeft, Building2, Trash2, UserCheck, UserX } from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { getAllCinemas } from "../../../store/slices/cinema";
import { getCinemaStaff, assignCinemaStaff, removeCinemaStaff } from "../../../store/slices/cinemaStaff";
import Staff, { AssignmentFilters } from "../../../services/network/staff";
import ReusableTable from "../../../components/shared/Table";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import StatCards from "../../../components/shared/StatCards";
import Button from "../../../components/shared/Button";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const ROLE_COLORS: Record<string, string> = { Manager: "gold", Staff: "blue", Cashier: "purple" };

/**
 * Managers, staff and cashiers each work at one cinema; Admins work across all of them
 * and are never assigned. This tab answers: who has no cinema yet, which cinemas have
 * nobody, and who works where.
 */
export default function CinemaStaffAssignment() {
  const dispatch = useAppDispatch();
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { cinemaStaffList, loading, page, limit, total } = useAppSelector((state) => state.cinemaStaff);

  // Everyone who can be assigned, with their role and current cinema (if any).
  const [people, setPeople] = useState<any[]>([]);
  // Every assignment, unfiltered, so the cards don't change with the search box.
  const [summary, setSummary] = useState<{ stats: any; cinemaIds: Set<string> }>({
    stats: null,
    cinemaIds: new Set(),
  });
  const [pickedCinema, setPickedCinema] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toRemove, setToRemove] = useState<any>(null);
  const [toMove, setToMove] = useState<any>(null);
  const [moveTo, setMoveTo] = useState<string>();
  const [searchText, setSearchText] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState<string | undefined>();
  const search = useDebouncedValue(searchText.trim());

  const loadPeople = useCallback(async () => {
    const tag = (label: string) => (r: any) =>
      r.data.data.admins.map((a: any) => ({ ...a, roleLabel: label }));
    const lists = await Promise.all([
      Staff.getManagers(1, 50).then(tag("Manager")),
      Staff.getStaffs(1, 50).then(tag("Staff")),
      Staff.getPosCashiers(1, 50).then(tag("Cashier")),
    ]);
    setPeople(lists.flat());
  }, []);

  const loadSummary = useCallback(async () => {
    const response = await Staff.getCinemaStaff(1, 50, {});
    const { assignments, stats } = response.data.data;
    setSummary({ stats, cinemaIds: new Set(assignments.map((a: any) => a.cinema_id)) });
  }, []);

  const loadTable = useCallback(
    (pageNumber = 1) => {
      const filters: AssignmentFilters = { search: search || undefined, cinema_id: cinemaFilter };
      return dispatch(getCinemaStaff({ page: pageNumber, limit, filters }));
    },
    [dispatch, search, cinemaFilter, limit]
  );

  const refreshAll = async () => {
    try {
      await Promise.all([loadPeople(), loadSummary(), loadTable(page)]);
    } catch (error: any) {
      toast.error(error?.message || "Could not load assignments");
    }
  };

  useEffect(() => {
    dispatch(getAllCinemas({ page: 1, limit: 50 }));
    loadPeople().catch(() => undefined);
    loadSummary().catch(() => undefined);
  }, [dispatch, loadPeople, loadSummary]);

  // Back to page 1 whenever the search or cinema filter changes.
  useEffect(() => {
    loadTable(1);
  }, [loadTable]);

  const cinemaName = (id?: string) =>
    allCinemas?.find((c: any) => c.cinema_id === id)?.name || "Unknown cinema";
  const roleOf = (adminId: string) => people.find((p) => p.admin_id === adminId)?.roleLabel;
  const cinemaOptions = (allCinemas || []).map((c: any) => ({ value: c.cinema_id, label: c.name }));

  const unassigned = people.filter((p) => p.is_active && !p.cinema);
  const emptyCinemas = (allCinemas || []).filter((c: any) => !summary.cinemaIds.has(c.cinema_id));
  const stats = summary.stats;

  const assign = async (person: any, cinemaId?: string) => {
    if (!cinemaId) return;
    setBusyId(person.admin_id);
    try {
      await dispatch(assignCinemaStaff({ admin_id: person.admin_id, cinema_id: cinemaId })).unwrap();
      toast.success(`${person.surname} ${person.other_names} now works at ${cinemaName(cinemaId)}`);
      await refreshAll();
    } catch (error: any) {
      toast.error(error?.message || "Could not assign");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async () => {
    if (!toRemove) return;
    try {
      await dispatch(removeCinemaStaff({ admin_id: toRemove.admin_id, cinema_id: toRemove.cinema_id })).unwrap();
      toast.success('Removed. They\'re now under "Needs a cinema".');
      await refreshAll();
    } catch (error: any) {
      toast.error(error?.message || "Could not remove");
    } finally {
      setToRemove(null);
    }
  };

  // A person works at one cinema at a time, so moving is remove then assign.
  const closeMove = () => {
    setToMove(null);
    setMoveTo(undefined);
  };
  const move = async () => {
    if (!toMove || !moveTo) return;
    try {
      await dispatch(removeCinemaStaff({ admin_id: toMove.admin_id, cinema_id: toMove.cinema_id })).unwrap();
      await dispatch(assignCinemaStaff({ admin_id: toMove.admin_id, cinema_id: moveTo })).unwrap();
      toast.success(`Moved to ${cinemaName(moveTo)}`);
    } catch (error: any) {
      toast.error(error?.message || 'Could not move. Check "Needs a cinema" and assign them again.');
    } finally {
      closeMove();
      await refreshAll();
    }
  };

  const statItems = [
    {
      label: "Have a cinema",
      value: stats?.total_assignments ?? 0,
      hint: `${stats?.managers ?? 0} managers · ${stats?.staff ?? 0} staff · ${stats?.pos_cashiers ?? 0} cashiers`,
      icon: UserCheck,
      tone: "good" as const,
    },
    {
      label: "Needs a cinema",
      value: stats?.unassigned_staff ?? unassigned.length,
      hint: unassigned.length ? "Assign them below" : undefined,
      icon: UserX,
      tone: unassigned.length ? ("warning" as const) : ("neutral" as const),
    },
    {
      label: "Cinemas with no staff",
      value: emptyCinemas.length,
      hint: `of ${allCinemas?.length ?? 0} cinemas`,
      icon: Building2,
      tone: emptyCinemas.length ? ("danger" as const) : ("neutral" as const),
    },
  ];

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: any, record: any) =>
        record.admin ? `${record.admin.surname} ${record.admin.other_names}` : "Unknown staff",
    },
    {
      title: "Role",
      key: "role",
      render: (_: any, record: any) => {
        const role = roleOf(record.admin_id);
        return role ? <Tag color={ROLE_COLORS[role]}>{role}</Tag> : "-";
      },
    },
    {
      title: "Email",
      key: "email",
      render: (_: any, record: any) => <span className="text-gray-500">{record.admin?.email}</span>,
    },
    {
      title: "Works at",
      key: "cinema",
      render: (_: any, record: any) => (
        <div>
          <p className="text-sm">{record.cinema?.name || cinemaName(record.cinema_id)}</p>
          <p className="text-xs text-gray-500">{record.cinema?.location}</p>
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2 justify-end">
          <Button
            size="xs"
            variant="outline"
            className="rounded-md"
            icon={<ArrowRightLeft size={14} />}
            title="Move"
            onClick={() => setToMove(record)}
          />
          <Button
            size="xs"
            variant="outline"
            className="rounded-md text-red-600!"
            icon={<Trash2 size={14} />}
            title="Remove"
            onClick={() => setToRemove(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Managers, staff and cashiers each work at one cinema. Admins work across all cinemas.
      </p>

      <StatCards items={statItems} />

      {/* Who still needs a cinema: only shown when someone does. */}
      {unassigned.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
          <h3 className="font-semibold">Needs a cinema ({unassigned.length})</h3>
          <div className="divide-y divide-amber-200">
            {unassigned.map((person) => (
              <div key={person.admin_id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="flex-1 min-w-48">
                  <p className="font-medium">
                    {person.surname} {person.other_names}{" "}
                    <Tag color={ROLE_COLORS[person.roleLabel]}>{person.roleLabel}</Tag>
                  </p>
                  <p className="text-xs text-muted-foreground">{person.email}</p>
                </div>
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="Choose cinema"
                  value={pickedCinema[person.admin_id]}
                  onChange={(value) => setPickedCinema((p) => ({ ...p, [person.admin_id]: value }))}
                  options={cinemaOptions}
                  className="w-56"
                />
                <Button
                  size="xs"
                  className="rounded-md"
                  title="Assign"
                  loading={busyId === person.admin_id}
                  disabled={busyId === person.admin_id || !pickedCinema[person.admin_id]}
                  onClick={() => assign(person, pickedCinema[person.admin_id])}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Who works where */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-semibold">Who works where</h3>
            <p className="text-sm text-muted-foreground">Search, or pick a cinema to see its team.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Input.Search
              allowClear
              placeholder="Search name, email or cinema"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full md:w-64!"
            />
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="All cinemas"
              value={cinemaFilter}
              onChange={setCinemaFilter}
              options={cinemaOptions}
              className="w-52"
            />
          </div>
        </div>
        <ReusableTable
          data={loading ? [] : cinemaStaffList}
          columns={columns}
          title={cinemaFilter ? `${cinemaName(cinemaFilter)} team (${total})` : `All assignments (${total})`}
          showSearch={false}
          showPagination
          paginationMode="backend"
          paginationProps={{ current: page, total, pageSize: limit }}
          onTableChange={(p: any) => loadTable(p.current)}
        />
      </div>

      <ConfirmationModal
        open={Boolean(toRemove)}
        onCancel={() => setToRemove(null)}
        onConfirm={remove}
        title="Remove from cinema"
        content={`Remove ${toRemove?.admin?.surname} ${toRemove?.admin?.other_names} from ${cinemaName(
          toRemove?.cinema_id
        )}? They keep their account but can't work until you assign them again.`}
      />

      <DisplayModal
        open={Boolean(toMove)}
        title={`Reassign ${toMove?.admin?.surname ?? ""} ${toMove?.admin?.other_names ?? ""}`}
        subtitle="Transfer this staff member to a different cinema branch"
        onClose={closeMove}
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#754f2c]">
                Current Branch
              </p>
              <p className="text-sm font-bold text-stone-900">
                {cinemaName(toMove?.cinema_id)}
              </p>
            </div>
            <ArrowRightLeft className="text-[#c77e3b]" size={18} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              New Cinema Branch <span className="text-[#c77e3b]">*</span>
            </label>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select destination cinema branch"
              value={moveTo}
              onChange={setMoveTo}
              options={cinemaOptions.filter((c: any) => c.value !== toMove?.cinema_id)}
              className="w-full min-h-[40px]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200/80">
            <Button variant="outline" title="Cancel" onClick={closeMove} />
            <Button
              className="min-w-[140px]"
              title="Confirm Transfer"
              disabled={!moveTo}
              onClick={move}
            />
          </div>
        </div>
      </DisplayModal>
    </div>
  );
}
