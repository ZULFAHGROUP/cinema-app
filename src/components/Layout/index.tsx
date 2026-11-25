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
  primary: "#fff8ea", // light
  secondary: "#c77e3b", // dark
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
    setActiveMenu(location.pathname);
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
      items={[
        {
          key: "profile",
          label: "My Profile",
          icon: <UserOutlined />,
        },
        {
          key: "logout",
          label: <span style={{ color: "red" }}>Logout</span>,
          icon: <FiLogOut style={{ color: "red" }} />,
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

  const renderMenuItems = () =>
    visibleSideBarDetails.map((item) => {
      if (item?.subMenu) {
        return {
          key: item.key,
          icon: <item.icon size={20} />,
          label: item.title,
          children: item.subMenu.map((subItem) => ({
            key: subItem.key,
            label: subItem.title,
            style:
              activeMenu === subItem.key
                ? {
                    background: COLORS.secondary,
                    color: "#fff",
                    borderRadius: "6px",
                  }
                : {},
          })),
        };
      }
      return {
        key: item.key,
        icon: <item.icon size={20} />,
        label: item.title,
        style:
          activeMenu === item.key
            ? {
                background: COLORS.secondary,
                color: "#fff",
                borderRadius: "6px",
              }
            : {},
      };
    });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.secondary, // active color
          // colorText: COLORS.secondary, // default text
        },
        components: {
          Menu: {
            itemBg: COLORS.primary, // default background
            // itemColor: COLORS.secondary, // text color
            itemHoverBg: "#5480c7", // 👈 hover background
            itemHoverColor: "#fff", // 👈 hover text color
            itemSelectedBg: COLORS.secondary, // selected bg
            itemSelectedColor: "#fff", // selected text
          },
        },
      }}
    >
      <PrivateRoute>
        <Layout className="max-h-screen">
          <ScrollToTop />

          {/* 🖥 Desktop Sidebar */}
          {!isMobile ? (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              style={{
                backgroundColor: COLORS.primary,
                minHeight: "100vh",
                borderRight: `1px solid ${COLORS.secondary}30`,
              }}
              width={250}
            >
              <div
                className="logo p-4 flex justify-center text-lg font-bold"
                style={{
                  color: COLORS.secondary,
                  borderBottom: `1px solid ${COLORS.secondary}30`,
                }}
              >
                <Link to={"/dashboard"} style={{ color: COLORS.secondary }}>
                  Logo
                </Link>
              </div>

              <Menu
                mode="inline"
                selectedKeys={activeMenu ? [activeMenu] : []}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.secondary,
                  fontWeight: 500,
                }}
                items={renderMenuItems()}
                onClick={(e) => handleMenuClick(e.key)}
              />
            </Sider>
          ) : (
            /* 📱 Mobile Drawer Sidebar */
            <Drawer
              placement="left"
              closable
              onClose={() => setIsDrawerVisible(false)}
              open={isDrawerVisible}
              bodyStyle={{
                padding: 0,
                background: COLORS.primary,
              }}
            >
              <Menu
                mode="inline"
                selectedKeys={activeMenu ? [activeMenu] : []}
                style={{
                  backgroundColor: COLORS.primary,
                  color: COLORS.secondary,
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

          {/* Main Layout */}
          <Layout>
            <Header
              style={{
                padding: "0 16px",
                background: COLORS.primary,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() =>
                  isMobile ? setIsDrawerVisible(true) : setCollapsed(!collapsed)
                }
                style={{ fontSize: "16px" }}
              />
              <Dropdown overlay={profileMenu} placement="bottomRight" trigger={["click"]}>
                <Avatar
                  src={user?.profile_image_url || undefined}
                  style={{ backgroundColor: COLORS.secondary, cursor: "pointer" }}
                >
                  {(user?.surname?.[0] || "U").toUpperCase()}
                </Avatar>
              </Dropdown>
            </Header>

            <Content
              className="hide-scrollbar min-h-screen p-5 rounded-lg overflow-y-auto"
              style={{ background: COLORS.primary }}
            >
              {canGoBack &&
                !location.pathname.startsWith("/auth") &&
                !location.pathname.includes("/dashboard") && (
                  <p
                    onClick={goBack}
                    className="inline-flex gap-2 text-lg items-center cursor-pointer mb-3"
                  >
                    <IoIosArrowBack /> Back
                  </p>
                )}
              <Outlet />
            </Content>
          </Layout>
        </Layout>

        <DisplayModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          title="My Profile"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar
                size={64}
                src={profileForm.preview_url || undefined}
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
                    className="rounded-md"
                    loading={profileUploading}
                    title={profileUploading ? "Uploading..." : "Change Photo"}
                  />
                </Upload>
                <p className="text-xs text-muted-foreground mt-1">
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
            <div className="flex gap-2 pt-4 border-t">
              <SharedButton
                type="button"
                className="flex-1 rounded-md"
                loading={profileSaving}
                disabled={profileSaving || profileUploading}
                title="Save Profile"
                onClick={handleProfileSave}
              />
              <SharedButton
                type="button"
                variant="outline"
                className="rounded-md"
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
