/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import {
  Monitor,
  ImageIcon,
  Calendar,
  TrendingUp,
  Settings,
  Plus,
} from "lucide-react";
import DisplaysManagement from "./components/DisplaysManagement";
import ContentLibrary from "./components/ContentLibrary";
import ScheduleManagement from "./components/ScheduleManagement";
import SignageAnalytics from "./components/SignageAnalytics";
import AddContentForm from "./components/AddContentForm";
import AddScheduleForm from "./components/AddScheduleForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";

function SignagePage() {
  const [activeTab, setActiveTab] = useState("displays");
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState("lobby-main");
  const [isPlaying, setIsPlaying] = useState(true);

  const [displays] = useState([
    {
      id: "lobby-main",
      name: "Lobby Main Display",
      location: "Main Lobby",
      status: "online",
      content: "Now Showing Carousel",
      resolution: "1920x1080",
      lastUpdate: "2 minutes ago",
    },
    {
      id: "concession-menu",
      name: "Concession Menu Board",
      location: "Concession Stand",
      status: "online",
      content: "Menu & Pricing",
      resolution: "1920x1080",
      lastUpdate: "5 minutes ago",
    },
    {
      id: "theater-1-entrance",
      name: "Theater 1 Entrance",
      location: "Theater 1",
      status: "offline",
      content: "Movie Information",
      resolution: "1366x768",
      lastUpdate: "1 hour ago",
    },
    {
      id: "parking-info",
      name: "Parking Information",
      location: "Entrance",
      status: "online",
      content: "Parking & Directions",
      resolution: "1920x1080",
      lastUpdate: "10 minutes ago",
    },
  ]);

  const [contentTemplates, setContentTemplates] = useState([
    {
      id: "now-showing",
      name: "Now Showing Carousel",
      type: "Movie Carousel",
      description: "Rotating display of current movies with showtimes",
      thumbnail: "/movie-carousel-display.png",
    },
    {
      id: "concession-menu",
      name: "Concession Menu",
      type: "Menu Display",
      description: "Food and beverage menu with pricing",
      thumbnail: "/concession-menu-board.png",
    },
    {
      id: "promotional",
      name: "Promotional Banner",
      type: "Advertisement",
      description: "Special offers and upcoming events",
      thumbnail: "/promotional-cinema-banner.png",
    },
    {
      id: "emergency-info",
      name: "Emergency Information",
      type: "Safety Display",
      description: "Emergency exits and safety procedures",
      thumbnail: "/emergency-information-display.png",
    },
  ]);

  const [scheduleItems, setScheduleItems] = useState([
    { id: 1, time: "09:00", content: "Welcome Message", duration: "30 min" },
    {
      id: 2,
      time: "09:30",
      content: "Now Showing Carousel",
      duration: "6 hours",
    },
    { id: 3, time: "15:30", content: "Promotional Banner", duration: "1 hour" },
    {
      id: 4,
      time: "16:30",
      content: "Now Showing Carousel",
      duration: "Until Close",
    },
  ]);

  const handleAddContent = (contentData: any) => {
    const newContent = {
      id: `content-${contentTemplates.length + 1}`,
      ...contentData,
      thumbnail: "/placeholder.svg",
    };
    setContentTemplates([...contentTemplates, newContent]);
    setIsAddContentModalOpen(false);
  };

  const handleDeleteContent = (contentId: string) => {
    setContentTemplates(contentTemplates.filter((c) => c.id !== contentId));
  };

  const handleAddSchedule = (scheduleData: any) => {
    const newSchedule = {
      id: scheduleItems.length + 1,
      ...scheduleData,
    };
    setScheduleItems([...scheduleItems, newSchedule]);
    setIsAddScheduleModalOpen(false);
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    setScheduleItems(scheduleItems.filter((s) => s.id !== scheduleId));
  };

  const tabItems = [
    {
      key: "displays",
      label: (
        <span className="flex items-center gap-2">
          <Monitor className="w-4 h-4" /> Displays
        </span>
      ),
      children: (
        <DisplaysManagement
          displays={displays}
          selectedDisplay={selectedDisplay}
          setSelectedDisplay={setSelectedDisplay}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      ),
    },
    {
      key: "content",
      label: (
        <span className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Content
        </span>
      ),
      children: (
        <ContentLibrary
          contentTemplates={contentTemplates}
          onDelete={handleDeleteContent}
        />
      ),
    },
    {
      key: "schedule",
      label: (
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Schedule
        </span>
      ),
      children: (
        <ScheduleManagement
          scheduleItems={scheduleItems}
          onDelete={handleDeleteSchedule}
        />
      ),
    },
    {
      key: "analytics",
      label: (
        <span className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Analytics
        </span>
      ),
      children: (
        <SignageAnalytics
          displays={displays}
          contentTemplates={contentTemplates}
          scheduleItems={scheduleItems}
        />
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Digital Signage
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Manage displays and content across your cinema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-md"
              icon={<Settings className="w-4 h-4" />}
              title="Display Settings"
            />
            {activeTab === "content" && (
              <Button
                onClick={() => setIsAddContentModalOpen(true)}
                className="gap-2 rounded-md"
                icon={<Plus className="w-4 h-4" />}
                title="Add Content"
              />
            )}
            {activeTab === "schedule" && (
              <Button
                onClick={() => setIsAddScheduleModalOpen(true)}
                className="gap-2 rounded-md"
                icon={<Plus className="w-4 h-4" />}
                title="Add Schedule"
              />
            )}
          </div>
        </div>

        <div className="flex items-center flex-col md:flex-row justify-between mb-6">
          <div className="flex-1">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems.map((item) => ({
                key: item.key,
                label: item.label,
              }))}
              className="signage-tabs"
            />
          </div>
        </div>

        <div className="tab-content">
          {tabItems.find((item) => item.key === activeTab)?.children}
        </div>
      </div>

      <DisplayModal
        open={isAddContentModalOpen}
        onClose={() => setIsAddContentModalOpen(false)}
        title="Create New Content"
      >
        <AddContentForm
        // onSubmit={handleAddContent}
        // onCancel={() => setIsAddContentModalOpen(false)}
        />
      </DisplayModal>

      <DisplayModal
        open={isAddScheduleModalOpen}
        onClose={() => setIsAddScheduleModalOpen(false)}
        title="Add Schedule Item"
      >
        <AddScheduleForm
        //   contentTemplates={contentTemplates}
        //   onSubmit={handleAddSchedule}
        //   onCancel={() => setIsAddScheduleModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default SignagePage;
