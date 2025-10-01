/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import { AlertTriangle, Edit, Package } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800";
    case "Out of Stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function Inventory({ products }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-sans flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Stock Alerts
          </CardTitle>
          <CardDescription className="font-serif">
            Items requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products
              .filter((product: any) => product.status !== "In Stock")
              .map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-sans font-medium">{product.name}</p>
                      <p className="text-sm font-serif text-muted-foreground">
                        Stock: {product.stock} / Min: {product.minStock}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={getStatusColor(product.status)}>
                      {product.status}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                      title="Reorder"
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="aspect-square relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                  <div
                    className={`absolute top-2 right-2 ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </div>
                </div>
                <div>
                  <h3 className="font-sans font-semibold">{product.name}</h3>
                  <p className="text-sm font-serif text-muted-foreground">
                    {product.category}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans font-bold text-lg">
                      ${product.price}
                    </p>
                    <p className="text-sm font-serif text-muted-foreground">
                      Cost: ${product.cost}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-medium">{product.stock}</p>
                    <p className="text-sm font-serif text-muted-foreground">
                      in stock
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                    icon={<Edit className="w-3 h-3" />}
                    title="Edit"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <Package className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
