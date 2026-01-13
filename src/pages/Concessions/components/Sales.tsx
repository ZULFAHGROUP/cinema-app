/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { useAppSelector } from "../../../store/hook";

export default function Sales({ recentSales }: any) {
  const { orderStats } = useAppSelector(
    (state) => state.order
  );
  const salesStats = [
    {
      icon: DollarSign,
      color: "primary",
      label: "Today's Sales",
      value: "$1,247",
    },
    {
      icon: ShoppingCart,
      color: "accent",
      label: "Total Orders",
      value: orderStats?.totalOrders,
    },
    {
      icon: TrendingUp,
      color: "secondary",
      label: "Completed Orders",
      value: orderStats?.completedOrders,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salesStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div>
                  <p className="font-serif text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="font-sans text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Recent Sales</CardTitle>
          <CardDescription className="font-serif">
            Latest concession orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSales.map((sale: any) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-sans font-medium">{sale.items}</p>
                  <p className="text-sm font-serif text-muted-foreground">
                    {sale.time} • Cashier: {sale.cashier}
                  </p>
                </div>
                <p className="font-sans font-bold">${sale.total}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
