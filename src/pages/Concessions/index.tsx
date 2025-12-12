/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import {
  Package,
  BarChart3,
  Truck,
  TrendingUp,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
// import Inventory from "./components/Inventory";
import InventoryManagement from "./components/InventoryManagement";
import Sales from "./components/Sales";
import Suppliers from "./components/Suppliers";
import Analytics from "./components/Analytics";
import POSMode from "./components/PosMode";
import AddProductForm from "./components/AddProductForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllProducts } from "../../store/slices/product";

function ConcessionsPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isPOSMode, setIsPOSMode] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");

  const dispatch = useAppDispatch();
  const { products, productPage, productLimit } = useAppSelector(
    (state) => state.product
  );
  const { user } = useAppSelector((state) => state.accounts.data);
  // const { allCinemas } = useAppSelector((state) => state.cinema);

  // Determine if user is admin
  const isAdmin = user?.role?.name?.toLowerCase() === "admin";
  const userCinemaId = user?.cinema_id;

  // Use selected cinema for admin, or user's cinema for others
  const activeCinemaId = isAdmin ? selectedCinemaId : userCinemaId;

  useEffect(() => {
    if (activeCinemaId) {
      dispatch(
        getAllProducts({
          page: productPage,
          limit: productLimit,
          cinema_id: activeCinemaId,
        })
      );
    }
  }, [dispatch, productPage, productLimit, activeCinemaId]);

  const [cart, setCart] = useState<any[]>([]);

  const suppliers = [
    {
      id: 1,
      name: "Snack Supply Co",
      contact: "John Smith",
      phone: "(555) 123-4567",
      email: "orders@snacksupply.com",
    },
    {
      id: 2,
      name: "Beverage Distributors",
      contact: "Sarah Johnson",
      phone: "(555) 234-5678",
      email: "sales@bevdist.com",
    },
    {
      id: 3,
      name: "Sweet Treats Inc",
      contact: "Mike Chen",
      phone: "(555) 345-6789",
      email: "orders@sweetreats.com",
    },
  ];

  const recentSales = [
    {
      id: 1,
      items: "Large Popcorn, Medium Soda",
      total: 14.98,
      time: "2 minutes ago",
      cashier: "Mike Chen",
    },
    {
      id: 2,
      items: "Candy Mix x2, Small Soda",
      total: 14.97,
      time: "5 minutes ago",
      cashier: "Emily Rodriguez",
    },
    {
      id: 3,
      items: "Nachos, Large Soda",
      total: 14.98,
      time: "8 minutes ago",
      cashier: "Mike Chen",
    },
  ];

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const processOrder = () => {
    setCart([]);
    alert("Order processed successfully!");
  };

  const tabItems = [
    {
      key: "inventory",
      label: (
        <span className="flex items-center gap-2">
          <Package className="w-4 h-4" /> Inventory
        </span>
      ),
      children: <InventoryManagement />,
    },
    {
      key: "sales",
      label: (
        <span className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" /> Sales
        </span>
      ),
      children: <Sales recentSales={recentSales} />,
    },
    {
      key: "suppliers",
      label: (
        <span className="flex items-center gap-2">
          <Truck className="w-4 h-4" /> Suppliers
        </span>
      ),
      children: <Suppliers suppliers={suppliers} />,
    },
    {
      key: "analytics",
      label: (
        <span className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Analytics
        </span>
      ),
      children: <Analytics products={products} />,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Concessions & Inventory
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Manage food, drinks, and inventory
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsPOSMode(!isPOSMode)}
              className="gap-2 rounded-md"
              variant={isPOSMode ? "primary" : "outline"}
              icon={<ShoppingCart className="w-4 h-4" />}
              title={isPOSMode ? "Exit POS" : "POS Mode"}
            />
            {!isPOSMode && (
              <Button
                onClick={() => setIsAddProductModalOpen(true)}
                className="gap-2 rounded-md"
                icon={<Plus className="w-4 h-4" />}
                title="Add Product"
              />
            )}
          </div>
        </div>

        {/* Tabs and Content */}
        {!isPOSMode ? (
          <>
            <div className="flex items-center flex-col md:flex-row justify-between mb-6">
              <div className="flex-1">
                <Tabs
                  activeKey={activeTab}
                  onChange={setActiveTab}
                  items={tabItems.map((item) => ({
                    key: item.key,
                    label: item.label,
                  }))}
                  className="concessions-tabs"
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {tabItems.find((item) => item.key === activeTab)?.children}
            </div>
          </>
        ) : (
          <div className="flex">
            <div className="flex-1 pr-80">
              <POSMode products={products} addToCart={addToCart} />
            </div>

            {/* POS Cart Sidebar */}
            <div className="w-80 bg-card border-l border-border p-6 fixed right-0 top-0 h-full overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-sans font-semibold text-lg">
                  Current Order
                </h3>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground font-serif text-center py-8">
                    No items in cart
                  </p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-sans font-medium text-sm">
                            {item.name}
                          </p>
                          <p className="font-serif text-sm text-muted-foreground">
                            ${item.price} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 border rounded hover:bg-gray-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-serif">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 border rounded hover:bg-gray-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-semibold">Total:</span>
                      <span className="font-sans font-bold text-lg">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={processOrder}
                      className="w-full rounded-md"
                      title="Process Order"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setCart([])}
                      className="w-full rounded-md"
                      title="Clear Cart"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <DisplayModal
        open={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        title="Add New Product"
      >
        <AddProductForm onCancel={() => setIsAddProductModalOpen(false)} />
      </DisplayModal>
    </div>
  );
}

export default ConcessionsPage;
