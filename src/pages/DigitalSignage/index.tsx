/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Modal, Select, Tabs } from "antd";
import { Calendar, Image as ImageIcon, Monitor, Plus, RotateCcw, Siren, TrendingUp } from "lucide-react";
import Button from "../../components/shared/Button";
import Loader from "../../components/shared/Loader";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllCinemas } from "../../store/slices/cinema";
import Signage from "../../services/network/signage";
import DisplaysManagement from "./components/DisplaysManagement";
import DisplayForm from "./components/DisplayForm";
import DisplayKeyModal from "./components/DisplayKeyModal";
import ContentLibrary from "./components/ContentLibrary";
import AddContentForm from "./components/AddContentForm";
import ScheduleManagement from "./components/ScheduleManagement";
import AddScheduleForm from "./components/AddScheduleForm";
import SignageAnalytics from "./components/SignageAnalytics";
import { useSignageData } from "./useSignageData";

const CINEMA_KEY = "signage:cinema";

type FormState =
  | { kind: "display"; item?: any }
  | { kind: "content"; item?: any }
  | { kind: "schedule"; item?: any }
  | null;

function SignagePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.accounts.data);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [activeTab, setActiveTab] = useState("displays");
  const [form, setForm] = useState<FormState>(null);
  const [newKey, setNewKey] = useState<{ name?: string; key: string } | null>(null);
  const [emergencyPicker, setEmergencyPicker] = useState(false);
  const [emergencyContentId, setEmergencyContentId] = useState<string>();
  // Signage is per cinema: Admin-role staff pick one; everyone else uses their own.
  const [cinemaId, setCinemaId] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem(CINEMA_KEY) || undefined;
    } catch {
      return undefined;
    }
  });

  useEffect(() => {
    if (isAdmin) dispatch(getAllCinemas({ page: 1, limit: 50 }));
  }, [dispatch, isAdmin]);

  // Default an Admin to the first cinema, and drop a remembered cinema that no longer exists.
  useEffect(() => {
    if (!isAdmin || !allCinemas?.length) return;
    if (!cinemaId || !allCinemas.some((c: any) => c.cinema_id === cinemaId)) {
      setCinemaId(allCinemas[0].cinema_id);
    }
  }, [isAdmin, allCinemas, cinemaId]);

  useEffect(() => {
    try {
      if (cinemaId) localStorage.setItem(CINEMA_KEY, cinemaId);
    } catch {
      // Remembering the cinema is only a convenience.
    }
  }, [cinemaId]);

  const scopedCinema = isAdmin ? cinemaId : undefined;
  const data = useSignageData(scopedCinema, !isAdmin || Boolean(cinemaId));
  const { settings, run } = data;
  const emergency = settings?.emergency_content;

  const closeForm = () => setForm(null);

  const saveDisplay = async (values: any) => {
    if (form?.kind === "display" && form.item) {
      await run(() => Signage.updateDisplay(form.item.display_id, values, scopedCinema), [data.loadDisplays]);
    } else {
      const created = await run(() => Signage.createDisplay(values, scopedCinema), [data.loadDisplays]);
      if (created?.display_key) setNewKey({ name: created.name, key: created.display_key });
    }
    closeForm();
  };

  const saveContent = async (values: any) => {
    await run(
      () =>
        form?.kind === "content" && form.item
          ? Signage.updateContent(form.item.content_id, values, scopedCinema)
          : Signage.createContent(values, scopedCinema),
      [data.loadContents]
    );
    closeForm();
  };

  const saveSchedule = async (values: any) => {
    await run(
      () =>
        form?.kind === "schedule" && form.item
          ? Signage.updateSchedule(form.item.schedule_id, values, scopedCinema)
          : Signage.createSchedule(values, scopedCinema),
      [data.loadSchedules, data.loadDisplays]
    );
    closeForm();
  };

  const updateSettings = (changes: any) =>
    run(() => Signage.updateSettings(changes, scopedCinema), [data.loadSettings, data.loadDisplays]).catch(
      () => undefined
    );

  const startEmergency = async (contentId: string) => {
    await run(() => Signage.startEmergency(contentId, scopedCinema), [data.loadSettings, data.loadDisplays]).catch(
      () => undefined
    );
    setEmergencyPicker(false);
  };

  const endEmergency = () =>
    run(() => Signage.endEmergency(scopedCinema), [data.loadSettings, data.loadDisplays]).catch(() => undefined);

  const addButton =
    activeTab === "displays"
      ? { title: "Add Display", onClick: () => setForm({ kind: "display" }) }
      : activeTab === "content"
      ? { title: "Add Content", onClick: () => setForm({ kind: "content" }) }
      : activeTab === "schedule"
      ? { title: "Add Schedule", onClick: () => setForm({ kind: "schedule" }) }
      : null;

  const tabItems = [
    {
      key: "displays",
      label: (
        <span className="flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Displays ({data.displayStats?.total_displays ?? 0})
        </span>
      ),
      children: (
        <DisplaysManagement
          displays={data.displays}
          cinemaId={scopedCinema}
          run={run}
          loadDisplays={data.loadDisplays}
          onEdit={(display) => setForm({ kind: "display", item: display })}
          onNewKey={(display, key) => setNewKey({ name: display.name, key })}
        />
      ),
    },
    {
      key: "content",
      label: (
        <span className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Content ({data.contentStats?.total_contents ?? 0})
        </span>
      ),
      children: (
        <ContentLibrary
          contents={data.contents}
          settings={settings}
          onEdit={(content) => setForm({ kind: "content", item: content })}
          onDelete={(content) =>
            run(() => Signage.deleteContent(content.content_id, scopedCinema), [
              data.loadContents,
              data.loadSchedules,
              data.loadSettings,
            ])
          }
          onSetDefault={(content) => updateSettings({ default_content_id: content.content_id })}
          onEmergency={(content) =>
            Modal.confirm({
              title: `Show "${content.name}" on every display now?`,
              content: "All screens in this cinema switch to it until you end the emergency.",
              okText: "Show it now",
              okButtonProps: { danger: true },
              onOk: () => startEmergency(content.content_id),
            })
          }
        />
      ),
    },
    {
      key: "schedule",
      label: (
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Schedule ({data.scheduleStats?.total_schedules ?? 0})
        </span>
      ),
      children: (
        <ScheduleManagement
          schedules={data.schedules}
          contents={data.contents}
          displays={data.displays}
          settings={settings}
          onEdit={(schedule) => setForm({ kind: "schedule", item: schedule })}
          onToggle={(schedule, isActive) =>
            run(() => Signage.updateSchedule(schedule.schedule_id, { is_active: isActive }, scopedCinema), [
              data.loadSchedules,
              data.loadDisplays,
            ]).catch(() => undefined)
          }
          onDelete={(schedule) =>
            run(() => Signage.deleteSchedule(schedule.schedule_id, scopedCinema), [data.loadSchedules])
          }
          onUpdateSettings={updateSettings}
        />
      ),
    },
    {
      key: "analytics",
      label: (
        <span className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Overview
        </span>
      ),
      children: (
        <SignageAnalytics
          displays={data.displays}
          displayStats={data.displayStats}
          contentStats={data.contentStats}
          scheduleStats={data.scheduleStats}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-sans font-bold text-foreground">Digital Signage</h1>
          <p className="text-sm text-muted-foreground font-serif">
            Lobby screens, what they show, and when
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Choose a cinema"
              value={cinemaId}
              onChange={setCinemaId}
              options={allCinemas?.map((c: any) => ({ value: c.cinema_id, label: c.name }))}
              className="w-52"
            />
          )}
          <Button
            variant="outline"
            className="rounded-md"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={data.reloadAll}
          />
          {!emergency && (
            <Button
              variant="outline"
              className="rounded-md text-red-600!"
              icon={<Siren className="w-4 h-4" />}
              title="Emergency"
              disabled={!data.contents.length}
              onClick={() => setEmergencyPicker(true)}
            />
          )}
          {addButton && (
            <Button
              className="rounded-md"
              icon={<Plus className="w-4 h-4" />}
              title={addButton.title}
              onClick={addButton.onClick}
            />
          )}
        </div>
      </div>

      {emergency && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-red-300 bg-red-50 p-4">
          <Siren className="w-5 h-5 text-red-600 animate-pulse" />
          <p className="flex-1 text-sm text-red-800">
            <strong>Emergency override:</strong> every display is showing "{emergency.name}".
          </p>
          <Button className="rounded-md bg-red-600!" title="End emergency" onClick={endEmergency} />
        </div>
      )}

      {data.loading && !data.displays.length && !data.contents.length ? (
        <Loader rows={8} />
      ) : data.error ? (
        <div className="border rounded-lg p-6 text-center">
          <p className="text-red-600 mb-2">{data.error}</p>
          <p className="text-sm text-muted-foreground">
            Signage needs the view_signage permission
            {isAdmin ? " and a cinema selected above" : " and a cinema assignment"}.
          </p>
        </div>
      ) : (
        <>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems.map((item) => ({ key: item.key, label: item.label }))}
          />
          {tabItems.find((item) => item.key === activeTab)?.children}
        </>
      )}

      {/* Forms are mounted only while open, so each opening starts fresh. */}
      <DisplayModal
        open={form?.kind === "display"}
        onClose={closeForm}
        title={form?.item ? `Edit ${form.item.name}` : "Add display"}
      >
        {form?.kind === "display" && <DisplayForm display={form.item} onSubmit={saveDisplay} onCancel={closeForm} />}
      </DisplayModal>

      <DisplayModal
        open={form?.kind === "content"}
        onClose={closeForm}
        title={form?.item ? `Edit ${form.item.name}` : "Create content"}
      >
        {form?.kind === "content" && <AddContentForm content={form.item} onSubmit={saveContent} onCancel={closeForm} />}
      </DisplayModal>

      <DisplayModal
        open={form?.kind === "schedule"}
        onClose={closeForm}
        title={form?.item ? "Edit schedule" : "Add schedule"}
      >
        {form?.kind === "schedule" && (
          <AddScheduleForm
            schedule={form.item}
            contents={data.contents}
            displays={data.displays}
            onSubmit={saveSchedule}
            onCancel={closeForm}
          />
        )}
      </DisplayModal>

      <Modal
        open={emergencyPicker}
        title="Emergency override"
        onCancel={() => setEmergencyPicker(false)}
        okText="Show on every display"
        okButtonProps={{ danger: true, disabled: !emergencyContentId }}
        onOk={() => emergencyContentId && startEmergency(emergencyContentId)}
      >
        <p className="text-sm mb-3">
          Every screen in this cinema switches to this content immediately, ahead of schedules, until you end it.
        </p>
        <Select
          className="w-full"
          placeholder="Choose content"
          value={emergencyContentId}
          onChange={setEmergencyContentId}
          options={data.contents.map((c) => ({ value: c.content_id, label: c.name }))}
        />
      </Modal>

      <DisplayKeyModal displayName={newKey?.name} displayKey={newKey?.key || null} onClose={() => setNewKey(null)} />
    </div>
  );
}

export default SignagePage;
