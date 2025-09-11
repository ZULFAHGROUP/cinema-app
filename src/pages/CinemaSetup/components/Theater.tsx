/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import Button from "../../../components/shared/Button";
import { Tag } from "antd";
import { Edit, Settings } from "lucide-react";

const Theater = ({ cinemas }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cinemas.map((theater: any) => (
        <Card key={theater.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-sans">{theater.name}</CardTitle>
              <Tag color={theater.status === "Active" ? "green" : "orange"}>
                {theater.status}
              </Tag>
            </div>
            <CardDescription className="font-serif">
              {theater.screens} screen • {theater.totalSeats} seats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {theater.features.map((feature: any) => (
                  <Tag key={feature} className="text-xs">
                    {feature}
                  </Tag>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  title="Edit"
                  icon={<Edit className="w-3 h-3" />}
                  className="flex-1 gap-2 bg- rounded-md"
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="gap-2 bg- rounded-md"
                  icon={<Settings className="w-3 h-3" />}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Theater;
