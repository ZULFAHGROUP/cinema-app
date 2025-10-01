/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";

export default function Analytics({ products }:any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Top Selling Items</CardTitle>
          <CardDescription className="font-serif">
            Best performers this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products
              .sort((a:any, b:any) => b.price - a.price)
              .slice(0, 5)
              .map((product:any, index:number) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-serif">
                      {index + 1}
                    </span>
                    <span className="font-serif">{product.name}</span>
                  </div>
                  <span className="font-sans font-medium">
                    ${product.price}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">Category Performance</CardTitle>
          <CardDescription className="font-serif">
            Sales by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Snacks", "Beverages", "Candy", "Merchandise"].map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="font-serif">{category}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                  <span className="font-sans text-sm">
                    {Math.floor(Math.random() * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
