/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export default function Sales({ recentSales }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-serif text-sm text-muted-foreground">
                  Today's Sales
                </p>
                <p className="font-sans text-2xl font-bold">$1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <ShoppingCart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-serif text-sm text-muted-foreground">
                  Orders
                </p>
                <p className="font-sans text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="font-serif text-sm text-muted-foreground">
                  Avg Order
                </p>
                <p className="font-sans text-2xl font-bold">$14.01</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
