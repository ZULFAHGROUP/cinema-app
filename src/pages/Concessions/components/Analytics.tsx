/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import { formatCurrency } from "../../../utils";

export default function Analytics({ products }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
          <CardDescription>Best performers this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...(products || [])]
              .sort((a: any, b: any) => b.price - a.price)
              .slice(0, 5)
              .map((product: any, index: number) => (
                <div
                  key={product.id || index}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#fff8ea]/50 border border-[#c77e3b]/15"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#c77e3b] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-stone-800 text-sm">
                      {product.name}
                    </span>
                  </div>
                  <span className="font-bold text-[#754f2c] text-sm">
                    {formatCurrency(Number(product.price) || 0)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Sales distribution by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Snacks", pct: 45 },
              { name: "Beverages", pct: 32 },
              { name: "Candy", pct: 15 },
              { name: "Merchandise", pct: 8 },
            ].map((category) => (
              <div key={category.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-stone-700">
                    {category.name}
                  </span>
                  <span className="font-bold text-[#754f2c]">
                    {category.pct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#faf6ed] border border-[#e6dfd3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c77e3b] rounded-full"
                    style={{ width: `${category.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
