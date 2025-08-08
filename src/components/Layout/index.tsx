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

interface AppLayoutProps {
  primaryColor?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ primaryColor = "#7da851" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, [location]);

  const profileMenu = (
    <Menu
      style={{
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
      }}
      items={[
        {
          key: "",
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

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const handleOpenChange = (keys: string[]) => {
    if (keys.length > 0) {
      setOpenKeys([keys[keys.length - 1]]);
    } else {
      setOpenKeys([]);
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryColor } }}>
      <PrivateRoute>
        <Layout className="max-h-screen">
          <ScrollToTop />
          {!isMobile ? (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              style={{ backgroundColor: primaryColor, minHeight: "100vh" }}
              width={250}
            >
              <div className="logo p-4 flex justify-center">
                <Link to={"/dashboard"}>Logo</Link>
              </div>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={activeMenu ? [activeMenu] : []}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                rootClassName="custom-menu"
                style={{ backgroundColor: primaryColor }}
                items={sideBarDetails.map((item) => {
                  if (item.subMenu) {
                    return {
                      key: item.key,
                      icon: <item.icon />,
                      label: item.title,
                      children: item.subMenu.map((subItem) => ({
                        key: subItem.key,
                        label: subItem.title,
                        style:
                          activeMenu === subItem.key
                            ? {
                                background: "white",
                                color: primaryColor,
                                fontWeight: "medium",
                              }
                            : { fontWeight: "medium" },
                      })),
                      style:
                        activeMenu === item.key ||
                        item.subMenu.some((sub) => sub.key === activeMenu)
                          ? {
                              background: "white",
                              color: primaryColor,
                              fontWeight: "bold",
                            }
                          : { fontWeight: "bold" },
                    };
                  }
                  return {
                    key: item.key,
                    icon: <item.icon />,
                    label: item.title,
                    style:
                      activeMenu === item.key
                        ? {
                            background: "#fff",
                            color: primaryColor,
                            fontWeight: "bold",
                          }
                        : { fontWeight: "bold" },
                  };
                })}
                onClick={(e) => handleMenuClick(e.key)}
              />
            </Sider>
          ) : (
            <Drawer
              title=""
              placement="left"
              closable={true}
              onClose={() => setIsDrawerVisible(false)}
              open={isDrawerVisible}
            >
              <Menu
                mode="inline"
                selectedKeys={activeMenu ? [activeMenu] : []}
                items={sideBarDetails.map((item) => {
                  if (item.subMenu) {
                    return {
                      key: item.key,
                      icon: <item.icon />,
                      label: item.title,
                      children: item.subMenu.map((subItem) => ({
                        key: subItem.key,
                        label: subItem.title,
                        style:
                          activeMenu === subItem.key
                            ? {
                                background: "white",
                                color: primaryColor,
                                fontWeight: "medium",
                              }
                            : { fontWeight: "medium" },
                      })),
                      style:
                        activeMenu === item.key ||
                        item.subMenu.some((sub) => sub.key === activeMenu)
                          ? {
                              background: "white",
                              color: primaryColor,
                              fontWeight: "bold",
                            }
                          : { fontWeight: "bold" },
                    };
                  }
                  return {
                    key: item.key,
                    icon: <item.icon />,
                    label: item.title,
                    style:
                      activeMenu === item.key
                        ? {
                            background: "white",
                            color: primaryColor,
                            fontWeight: "bold",
                          }
                        : { fontWeight: "bold" },
                  };
                })}
                onClick={(e) => {
                  handleMenuClick(e.key);
                  setOpenKeys([]);
                }}
              />
            </Drawer>
          )}

          <Layout>
            <Header
              style={{
                padding: "0 16px",
                background: "white",
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
                <Avatar style={{ backgroundColor: primaryColor }}>USER</Avatar>
              </Dropdown>
            </Header>

            <Content className="hide-scrollbar m-5 bg-gray-100 rounded-lg overflow-y-auto">
              {canGoBack && !location.pathname.startsWith("/auth") && (
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
