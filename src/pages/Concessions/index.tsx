/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import Inventory from "./components/Inventory";
import Sales from "./components/Sales";
import Suppliers from "./components/Suppliers";
import Analytics from "./components/Analytics";
import POSMode from "./components/PosMode";
import AddProductForm from "./components/AddProductForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";

function ConcessionsPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isPOSMode, setIsPOSMode] = useState(false);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Large Popcorn",
      category: "Snacks",
      price: 8.99,
      cost: 2.5,
      stock: 45,
      minStock: 20,
      supplier: "Snack Supply Co",
      image: "/bowl-of-popcorn.png",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Medium Soda",
      category: "Beverages",
      price: 5.99,
      cost: 1.2,
      stock: 8,
      minStock: 15,
      supplier: "Beverage Distributors",
      image: "/soda-cup.png",
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Candy Mix",
      category: "Candy",
      price: 4.99,
      cost: 1.8,
      stock: 32,
      minStock: 25,
      supplier: "Sweet Treats Inc",
      image: "/candy-mix.png",
      status: "In Stock",
    },
    {
      id: 4,
      name: "Nachos with Cheese",
      category: "Snacks",
      price: 7.99,
      cost: 2.2,
      stock: 0,
      minStock: 10,
      supplier: "Snack Supply Co",
      image: "/plate-of-loaded-nachos.png",
      status: "Out of Stock",
    },
  ]);

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

  const handleAddProduct = (productData: any) => {
    const newProduct = {
      id: products.length + 1,
      ...productData,
      image: "/placeholder.svg",
      status:
        productData.stock > productData.minStock
          ? "In Stock"
          : productData.stock > 0
          ? "Low Stock"
          : "Out of Stock",
    };
    setProducts([...products, newProduct]);
    setIsAddProductModalOpen(false);
  };

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
      children: <Inventory products={products} />,
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
        <AddProductForm
          suppliers={suppliers}
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddProductModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default ConcessionsPage;
