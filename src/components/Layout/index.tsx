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
import { Clapperboard } from "lucide-react";
import ScrollToTop from "../../utils/ScrollToTop";
import { IoIosArrowBack } from "react-icons/io";
import sideBarDetails from "../../constants/sidebar";
import PrivateRoute from "../../routes/privateRoute";
import {
  refreshProfile,
  signOut,
} from "../../store/slices/accounts";
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
  primary: "#fff8ea", // light warm cream
  secondary: "#c77e3b", // brand bronze
  secondaryDark: "#754f2c", // deep bronze
  extra: "#5480c7", // royal blue accent
  header: "#ffffff",
};

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
        (item.key !== "/dashboard" && location.pathname.startsWith(`${item.key}/`))
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

  const profileMenu = (
    <Menu
      className="rounded-xl p-1.5 shadow-lg border border-[#c77e3b]/15 min-w-44"
      items={[
        {
          key: "profile",
          label: <span className="font-medium">My Profile</span>,
          icon: <UserOutlined />,
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: <span className="text-red-600 font-medium">Logout</span>,
          icon: <FiLogOut className="text-red-600" />,
        },
      ]}
      onClick={(e) => {
        if (e.key === "logout") {
          dispatch(signOut());
          navigate("/auth/login");
        } else if (e.key === "profile") {
          openProfileModal();
        }
      }}
    />
  );

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
    (item) => !item.permissions?.length || hasAnyPermission(user, item.permissions)
  );

  const currentNavTitle =
    visibleSideBarDetails.find((item) => item.key === activeMenu)?.title ||
    "Dashboard";

  const renderMenuItems = () =>
    visibleSideBarDetails.map((item) => {
      const isSelected = activeMenu === item.key;
      if (item?.subMenu) {
        return {
          key: item.key,
          icon: <item.icon size={19} />,
          label: item.title,
          children: item.subMenu.map((subItem) => ({
            key: subItem.key,
            label: subItem.title,
            style:
              activeMenu === subItem.key
                ? {
                    background: COLORS.secondary,
                    color: "#fff",
                    borderRadius: "10px",
                  }
                : { borderRadius: "10px" },
          })),
        };
      }
      return {
        key: item.key,
        icon: <item.icon size={19} />,
        label: item.title,
        style: isSelected
          ? {
              background: `linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.secondaryDark})`,
              color: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(199, 126, 59, 0.28)",
              margin: "4px 10px",
              width: "calc(100% - 20px)",
            }
          : {
              borderRadius: "12px",
              margin: "4px 10px",
              width: "calc(100% - 20px)",
            },
      };
    });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.secondary,
          borderRadius: 10,
        },
        components: {
          Menu: {
            itemBg: "transparent",
            itemColor: "#57534e",
            itemHoverBg: "rgba(84, 128, 199, 0.14)",
            itemHoverColor: COLORS.extra,
            itemSelectedBg: COLORS.secondary,
            itemSelectedColor: "#fff",
          },
        },
      }}
    >
      <PrivateRoute>
        <Layout className="h-screen overflow-hidden bg-[#fff8ea]">
          <ScrollToTop />

          {/* Desktop Sidebar */}
          {!isMobile ? (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              style={{
                background: "linear-gradient(180deg, #fffdf8 0%, #fff8ea 100%)",
                height: "100vh",
                borderRight: `1px solid ${COLORS.secondary}26`,
              }}
              width={256}
              collapsedWidth={80}
            >
              <div
                className="px-4 py-4 flex items-center justify-center"
                style={{
                  borderBottom: `1px solid ${COLORS.secondary}20`,
                }}
              >
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 w-full justify-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c77e3b] to-[#754f2c] flex items-center justify-center text-white shadow-md shadow-[#c77e3b]/25 shrink-0 group-hover:scale-105 transition-transform">
                    <Clapperboard className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-base font-extrabold tracking-tight text-stone-900 leading-none">
                        Cinema<span className="text-[#c77e3b]">OS</span>
                      </span>
                      <span className="text-[11px] font-medium text-stone-500 mt-1 truncate">
                        Theater Management
                      </span>
                    </div>
                  )}
                </Link>
              </div>

              <div className="py-3 overflow-y-auto hide-scrollbar h-[calc(100vh-76px)]">
                <Menu
                  mode="inline"
                  selectedKeys={activeMenu ? [activeMenu] : []}
                  openKeys={openKeys}
                  onOpenChange={handleOpenChange}
                  style={{
                    backgroundColor: "transparent",
                    borderRight: "none",
                    fontWeight: 600,
                    fontSize: "13.5px",
                  }}
                  items={renderMenuItems()}
                  onClick={(e) => handleMenuClick(e.key)}
                />
              </div>
            </Sider>
          ) : (
            /* Mobile Drawer Sidebar */
            <Drawer
              placement="left"
              closable
              onClose={() => setIsDrawerVisible(false)}
              open={isDrawerVisible}
              styles={{
                body: {
                  padding: 0,
                  background: COLORS.primary,
                },
              }}
            >
              <div className="px-4 py-4 flex items-center gap-3 border-b border-[#c77e3b]/20">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c77e3b] to-[#754f2c] flex items-center justify-center text-white shadow-sm">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-stone-900">
                    Cinema<span className="text-[#c77e3b]">OS</span>
                  </span>
                </div>
              </div>
              <Menu
                mode="inline"
                selectedKeys={activeMenu ? [activeMenu] : []}
                style={{
                  backgroundColor: "transparent",
                  borderRight: "none",
                  fontWeight: 600,
                }}
                items={renderMenuItems()}
                onClick={(e) => {
                  handleMenuClick(e.key);
                  setOpenKeys([]);
                }}
              />
            </Drawer>
          )}

          {/* Main Layout */}
          <Layout className="bg-[#fff8ea] flex flex-col h-screen overflow-hidden">
            <Header
              style={{
                padding: "0 24px",
                background: "rgba(255, 248, 234, 0.88)",
                backdropFilter: "blur(12px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: `1px solid ${COLORS.secondary}22`,
                height: 64,
                flexShrink: 0,
                zIndex: 10,
              }}
            >
              <div className="flex items-center gap-3">
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() =>
                    isMobile ? setIsDrawerVisible(true) : setCollapsed(!collapsed)
                  }
                  className="hover:bg-[#c77e3b]/10! text-[#754f2c]! rounded-xl!"
                  style={{ fontSize: "16px", width: 38, height: 38 }}
                />
                <span className="text-sm font-bold text-stone-700 hidden sm:inline">
                  {currentNavTitle}
                </span>
              </div>

              <Dropdown overlay={profileMenu} placement="bottomRight" trigger={["click"]}>
                <Avatar
                  src={user?.profile_image_url || undefined}
                  className="ring-2 ring-[#c77e3b]/30 hover:ring-[#c77e3b] transition-all shadow-sm"
                  style={{
                    backgroundColor: COLORS.secondary,
                    cursor: "pointer",
                  }}
                >
                  {(user?.surname?.[0] || "U").toUpperCase()}
                </Avatar>
              </Dropdown>
            </Header>

            <Content
              className="hide-scrollbar flex-1 p-4 md:p-6 overflow-y-auto"
              style={{ background: COLORS.primary }}
            >
              <div className="max-w-[1440px] mx-auto">
                {canGoBack &&
                  !location.pathname.startsWith("/auth") &&
                  !location.pathname.includes("/dashboard") && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-[#c77e3b] border border-[#c77e3b]/20 text-xs font-semibold shadow-2xs transition-all cursor-pointer mb-4"
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
          title="My Profile"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#fff8ea]/70 border border-[#c77e3b]/20">
              <Avatar
                size={64}
                src={profileForm.preview_url || undefined}
                className="ring-2 ring-[#c77e3b]/30 shrink-0"
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
                  {user?.email} · {formatUserLabel(user?.role)}
                  {user?.cinema?.name ? ` · ${user.cinema.name}` : ""}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                  setProfileForm((p) => ({ ...p, other_names: e.target.value }))
                }
                required
              />
            </div>
            <Input
              label="Phone"
              value={profileForm.phone}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, phone: e.target.value }))
              }
              required
            />
            <div className="flex gap-2 pt-4 border-t border-stone-100">
              <SharedButton
                type="button"
                className="flex-1"
                loading={profileSaving}
                disabled={profileSaving || profileUploading}
                title="Save Profile"
                onClick={handleProfileSave}
              />
              <SharedButton
                type="button"
                variant="outline"
                title="Cancel"
                onClick={() => setProfileOpen(false)}
              />
            </div>
          </div>
        </DisplayModal>
      </PrivateRoute>
    </ConfigProvider>
  );
};

export default AppLayout;
