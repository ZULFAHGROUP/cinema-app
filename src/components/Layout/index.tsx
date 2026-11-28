import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Drawer,
  ConfigProvider,
  Upload,
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { FiLogOut } from "react-icons/fi";
import { Calendar } from "lucide-react";
import ScrollToTop from "../../utils/ScrollToTop";
import { IoIosArrowBack } from "react-icons/io";
import sideBarDetails from "../../constants/sidebar";
import PrivateRoute from "../../routes/privateRoute";
import { refreshProfile, signOut } from "../../store/slices/accounts";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { hasAnyPermission } from "../../utils/permissions";
import DisplayModal from "../shared/Modal/DisplayModal";
import Input from "../shared/Input";
import SharedButton from "../shared/Button";
import Accounts from "../../services/network/accounts";
import { toast } from "react-toastify";
import { formatUserLabel } from "../../utils";

const { Header, Sider, Content } = Layout;

const COLORS = {
  primary: "#fff8ea",
  secondary: "#c77e3b",
  secondaryDark: "#754f2c",
  extra: "#5480c7",
  ink: "#12161c",
  line: "#e6dfd3",
};

/** Habyta-inspired architectural logo mark */
const BrandMark = ({ collapsed }: { collapsed?: boolean }) => (
  <div className="flex items-center gap-2.5">
    <svg
      width="34"
      height="34"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="3"
        y="9"
        width="12"
        height="22"
        rx="3"
        fill="#754f2c"
        opacity="0.45"
      />
      <rect x="18" y="5" width="13" height="26" rx="3" fill="#12161c" />
      <circle cx="24.5" cy="17" r="3" fill="#c77e3b" />
    </svg>
    {!collapsed && (
      <div className="flex flex-col text-left leading-none">
        <span className="font-display text-[19px] font-bold tracking-tight text-[#12161c]">
          Cinema<span className="text-[#c77e3b]">OS</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 mt-1">
          Operations
        </span>
      </div>
    )}
  </div>
);

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    surname: "",
    other_names: "",
    phone: "",
    profile_temp_upload_id: "",
    preview_url: "",
  });
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.accounts.data);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    const matchingItem = sideBarDetails.find(
      (item) =>
        location.pathname === item.key ||
        (item.key !== "/dashboard" &&
          location.pathname.startsWith(`${item.key}/`))
    );
    setActiveMenu(matchingItem?.key || location.pathname);
  }, [location]);

  const openProfileModal = () => {
    setProfileForm({
      surname: user?.surname || "",
      other_names: user?.other_names || "",
      phone: user?.phone || "",
      profile_temp_upload_id: "",
      preview_url: user?.profile_image_url || "",
    });
    setProfileOpen(true);
  };

  const handleProfileImageUpload = async (file: File) => {
    setProfileUploading(true);
    try {
      const res = await Accounts.uploadProfileImage(file);
      setProfileForm((prev) => ({
        ...prev,
        profile_temp_upload_id: res.data?.data?.temp_upload_id || "",
        preview_url: res.data?.data?.url || prev.preview_url,
      }));
      toast.success("Profile image uploaded");
    } catch (err: any) {
      toast.error(err?.message || "Image upload failed");
    } finally {
      setProfileUploading(false);
    }
  };

  const handleProfileSave = async () => {
    setProfileSaving(true);
    try {
      const payload: any = {
        surname: profileForm.surname,
        other_names: profileForm.other_names,
        phone: profileForm.phone,
      };
      if (profileForm.profile_temp_upload_id) {
        payload.profile_temp_upload_id = profileForm.profile_temp_upload_id;
      }
      const res = await Accounts.updateProfile(payload);
      toast.success(res.data?.message || "Profile updated");
      await dispatch(refreshProfile());
      setProfileOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const profileMenuItems = [
    {
      key: "profile",
      label: <span className="font-semibold text-[#12161c]">My Profile</span>,
      icon: <UserOutlined className="text-[#c77e3b]" />,
      onClick: () => openProfileModal(),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: <span className="text-red-600 font-semibold">Sign Out</span>,
      icon: <FiLogOut className="text-red-600" />,
      onClick: () => {
        dispatch(signOut());
        navigate("/auth/login");
      },
    },
  ];

  const handleMenuClick = (key: string) => {
    setActiveMenu(key);
    navigate(key);
    setOpenKeys([]);
    if (isMobile) {
      setIsDrawerVisible(false);
    }
  };

  function goBack() {
    if (canGoBack) {
      navigate(-1);
    }
  }

  const handleOpenChange = (keys: string[]) => {
    if (keys.length > 0) {
      setOpenKeys([keys[keys.length - 1]]);
    } else {
      setOpenKeys([]);
    }
  };

  const visibleSideBarDetails = sideBarDetails.filter(
    (item) =>
      !item.permissions?.length || hasAnyPermission(user, item.permissions)
  );

  const currentNavTitle =
    visibleSideBarDetails.find((item) => item.key === activeMenu)?.title ||
    "Dashboard";

  const todayShort = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const renderMenuItems = () =>
    visibleSideBarDetails.map((item) => {
      const isSelected = activeMenu === item.key;
      if (item?.subMenu) {
        return {
          key: item.key,
          icon: <item.icon size={18} />,
          label: item.title,
          children: item.subMenu.map((subItem) => ({
            key: subItem.key,
            label: subItem.title,
            style:
              activeMenu === subItem.key
                ? {
                    background: COLORS.secondary,
                    color: "#ffffff",
                    borderRadius: "10px",
                  }
                : { borderRadius: "10px" },
          })),
        };
      }
      return {
        key: item.key,
        icon: <item.icon size={18} />,
        label: item.title,
        style: isSelected
          ? {
              background: COLORS.secondary,
              color: "#ffffff",
              borderRadius: "10px",
              margin: "3px 12px",
              width: "calc(100% - 24px)",
              fontWeight: 600,
            }
          : {
              borderRadius: "10px",
              margin: "3px 12px",
              width: "calc(100% - 24px)",
            },
      };
    });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.secondary,
          borderRadius: 10,
          fontFamily:
            '"Plus Jakarta Sans", "Inter Tight", -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          Menu: {
            itemBg: "transparent",
            itemColor: "#57534e",
            itemHoverBg: "#fff8ea",
            itemHoverColor: "#12161c",
            itemSelectedBg: COLORS.secondary,
            itemSelectedColor: "#ffffff",
            itemHeight: 40,
          },
        },
      }}
    >
      <PrivateRoute>
        <Layout className="h-screen overflow-hidden bg-[#fff8ea]">
          <ScrollToTop />

          {/* Clean Flat White Architectural Sidebar */}
          {!isMobile ? (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              style={{
                background: "#ffffff",
                height: "100vh",
                borderRight: `1px solid ${COLORS.line}`,
              }}
              width={248}
              collapsedWidth={76}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div
                    className="px-5 h-16 flex items-center"
                    style={{
                      borderBottom: `1px solid ${COLORS.line}`,
                    }}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center w-full"
                    >
                      <BrandMark collapsed={collapsed} />
                    </Link>
                  </div>

                  {!collapsed && (
                    <div className="px-6 pt-4 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                        Modules
                      </p>
                    </div>
                  )}

                  <div className="py-2 overflow-y-auto hide-scrollbar max-h-[calc(100vh-160px)]">
                    <Menu
                      mode="inline"
                      selectedKeys={activeMenu ? [activeMenu] : []}
                      openKeys={openKeys}
                      onOpenChange={handleOpenChange}
                      style={{
                        backgroundColor: "transparent",
                        borderRight: "none",
                        fontWeight: 500,
                        fontSize: "13.5px",
                      }}
                      items={renderMenuItems()}
                      onClick={(e) => handleMenuClick(e.key)}
                    />
                  </div>
                </div>

                {/* Bottom Flat Operator Card */}
                <div className="p-3 m-3 rounded-xl bg-[#fff8ea] border border-[#e6dfd3]">
                  <Dropdown
                    menu={{ items: profileMenuItems }}
                    placement="topRight"
                    trigger={["click"]}
                  >
                    <div className="flex items-center gap-2.5 cursor-pointer">
                      <Avatar
                        size={34}
                        src={user?.profile_image_url || undefined}
                        className="shrink-0"
                        style={{
                          backgroundColor: COLORS.secondaryDark,
                          color: "#fff8ea",
                          fontWeight: 700,
                        }}
                      >
                        {(user?.surname?.[0] || "U").toUpperCase()}
                      </Avatar>
                      {!collapsed && (
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#12161c] truncate">
                            {user?.surname} {user?.other_names}
                          </p>
                          <p className="text-[11px] text-[#754f2c] font-medium truncate">
                            {formatUserLabel(user?.role) || "Operator"}
                          </p>
                        </div>
                      )}
                    </div>
                  </Dropdown>
                </div>
              </div>
            </Sider>
          ) : (
            <Drawer
              placement="left"
              closable
              onClose={() => setIsDrawerVisible(false)}
              open={isDrawerVisible}
              styles={{
                body: {
                  padding: 0,
                  background: "#ffffff",
                },
              }}
            >
              <div className="px-5 py-4 border-b border-[#e6dfd3]">
                <BrandMark />
              </div>
              <Menu
                mode="inline"
                selectedKeys={activeMenu ? [activeMenu] : []}
                style={{
                  backgroundColor: "transparent",
                  borderRight: "none",
                  fontWeight: 500,
                }}
                items={renderMenuItems()}
                onClick={(e) => {
                  handleMenuClick(e.key);
                  setOpenKeys([]);
                }}
              />
            </Drawer>
          )}

          {/* Main Workspace */}
          <Layout className="bg-[#fff8ea] flex flex-col h-screen overflow-hidden">
            <Header
              style={{
                padding: "0 24px",
                background: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${COLORS.line}`,
                height: 64,
                flexShrink: 0,
                zIndex: 10,
              }}
            >
              <div className="flex items-center gap-2.5">
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() =>
                    isMobile
                      ? setIsDrawerVisible(true)
                      : setCollapsed(!collapsed)
                  }
                  className="hover:bg-[#fff8ea]! text-[#12161c]! border border-[#e6dfd3]! rounded-lg!"
                  style={{ fontSize: "15px", width: 34, height: 34 }}
                />

                <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#faf6ed] border border-[#e6dfd3] text-[10px] font-semibold uppercase tracking-[0.06em] text-[#754f2c]">
                  <span className="w-1 h-1 rounded-full bg-[#c77e3b]" />
                  {currentNavTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff8ea] border border-[#e6dfd3] text-xs font-semibold text-[#754f2c]">
                  <Calendar className="w-3.5 h-3.5 text-[#c77e3b]" />
                  <span>{todayShort}</span>
                </div>

                <Dropdown
                  menu={{ items: profileMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white hover:bg-[#fff8ea] border border-[#e6dfd3] cursor-pointer transition-colors">
                    <Avatar
                      size={30}
                      src={user?.profile_image_url || undefined}
                      style={{
                        backgroundColor: COLORS.secondary,
                        fontWeight: 700,
                      }}
                    >
                      {(user?.surname?.[0] || "U").toUpperCase()}
                    </Avatar>
                    <span className="hidden md:inline text-xs font-semibold text-[#12161c]">
                      {user?.surname || "Account"}
                    </span>
                  </div>
                </Dropdown>
              </div>
            </Header>

            <Content
              className="hide-scrollbar flex-1 p-4 md:p-7 overflow-y-auto"
              style={{ background: COLORS.primary }}
            >
              <div className="max-w-[1380px] mx-auto">
                {canGoBack &&
                  !location.pathname.startsWith("/auth") &&
                  !location.pathname.includes("/dashboard") && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#faf6ed] text-[#12161c] border border-[#e6dfd3] text-xs font-semibold transition-colors cursor-pointer mb-4"
                    >
                      <IoIosArrowBack className="text-sm" /> Back
                    </button>
                  )}
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>

        <DisplayModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          title="My Operator Profile"
          subtitle="Update your personal details and profile avatar"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#fff8ea] border border-[#e6dfd3]">
              <Avatar
                size={60}
                src={profileForm.preview_url || undefined}
                className="shrink-0"
                style={{ backgroundColor: COLORS.secondary }}
              >
                {(profileForm.surname?.[0] || "U").toUpperCase()}
              </Avatar>
              <div>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleProfileImageUpload(file);
                    return false;
                  }}
                >
                  <SharedButton
                    type="button"
                    variant="outline"
                    size="xs"
                    loading={profileUploading}
                    title={profileUploading ? "Uploading..." : "Change Photo"}
                  />
                </Upload>
                <p className="text-xs text-stone-500 mt-1.5">
                  {user?.email} ·{" "}
                  <span className="font-semibold text-[#754f2c]">
                    {formatUserLabel(user?.role)}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Surname"
                value={profileForm.surname}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, surname: e.target.value }))
                }
                required
              />
              <Input
                label="Other Names"
                value={profileForm.other_names}
                onChange={(e) =>
                  setProfileForm((p) => ({
                    ...p,
                    other_names: e.target.value,
                  }))
                }
                required
              />
            </div>
            <Input
              label="Phone Number"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, phone: e.target.value }))
              }
              required
            />
            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#e6dfd3]">
              <SharedButton
                type="button"
                variant="outline"
                title="Cancel"
                onClick={() => setProfileOpen(false)}
              />
              <SharedButton
                type="button"
                className="min-w-[140px]"
                loading={profileSaving}
                disabled={profileSaving || profileUploading}
                title="Save Profile"
                onClick={handleProfileSave}
              />
            </div>
          </div>
        </DisplayModal>
      </PrivateRoute>
    </ConfigProvider>
  );
};

export default AppLayout;
