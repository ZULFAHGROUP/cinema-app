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
} from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { FiLogOut } from "react-icons/fi";
import ScrollToTop from "../../utils/ScrollToTop";
import { IoIosArrowBack } from "react-icons/io";
import sideBarDetails from "../../constants/sidebar";
import PrivateRoute from "../../routes/privateRoute";

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

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, [location]);

  const profileMenu = (
    <Menu
      items={[
        {
          key: "/profile",
          label: "Profile",
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
          navigate("/");
        } else {
          navigate(e.key);
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

  const renderMenuItems = () =>
    sideBarDetails.map((item) => {
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
              <Dropdown overlay={profileMenu} placement="bottomRight">
                <Avatar style={{ backgroundColor: COLORS.secondary }}>
                  USER
                </Avatar>
              </Dropdown>
            </Header>

            <Content
              className="hide-scrollbar p-5 rounded-lg overflow-y-auto"
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
      </PrivateRoute>
    </ConfigProvider>
  );
};

export default AppLayout;
