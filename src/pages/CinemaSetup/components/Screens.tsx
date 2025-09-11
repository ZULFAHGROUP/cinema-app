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
import { Edit, Volume2 } from "lucide-react";

const Screens = ({ screens }: any) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {screens.map((screen: any) => (
          <Card key={screen.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-sans">{screen.name}</CardTitle>
                <Tag color="blue">{screen.status}</Tag>
              </div>
              <CardDescription className="font-serif">
                {screen.theater}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-serif text-muted-foreground">Size</p>
                    <p className="font-sans font-medium">{screen.size}</p>
                  </div>
                  <div>
                    <p className="font-serif text-muted-foreground">
                      Resolution
                    </p>
                    <p className="font-sans font-medium">{screen.resolution}</p>
                  </div>
                </div>
                <div>
                  <p className="font-serif text-muted-foreground text-sm">
                    Sound System
                  </p>
                  <p className="font-sans font-medium">{screen.soundSystem}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 gap-2 bg- rounded-md"
                    icon={<Edit className="w-3 h-3" />}
                    title="Edit"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 bg- rounded-md"
                    icon={<Volume2 className="w-3 h-3" />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Screens;
