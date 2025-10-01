/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";

export default function Suppliers({ suppliers }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map((supplier: any) => (
        <Card key={supplier.id}>
          <CardHeader>
            <CardTitle className="font-sans">{supplier.name}</CardTitle>
            <CardDescription className="font-serif">
              Contact: {supplier.contact}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="font-serif">
                <span className="text-muted-foreground">Phone:</span>{" "}
                {supplier.phone}
              </p>
              <p className="font-serif">
                <span className="text-muted-foreground">Email:</span>{" "}
                {supplier.email}
              </p>
              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  title="Contact"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  title="Order"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
