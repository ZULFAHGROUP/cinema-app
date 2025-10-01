/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "../../../components/shared/Cards";

export default function POSMode({ products, addToCart }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-sans font-semibold">Point of Sale</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products
          .filter((product: any) => product.status !== "Out of Stock")
          .map((product: any) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <h3 className="font-sans font-medium text-sm">
                    {product.name}
                  </h3>
                  <p className="font-sans font-bold">${product.price}</p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
