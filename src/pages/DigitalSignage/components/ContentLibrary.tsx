/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag } from "antd";
import Button from "../../../components/shared/Button";
import { Edit, Trash2 } from "lucide-react";

interface ContentLibraryProps {
  contentTemplates: any[];
  onDelete: (contentId: string) => void;
}

export default function ContentLibrary({
  contentTemplates,
  onDelete,
}: ContentLibraryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {contentTemplates.map((template) => (
        <div key={template.id} className="border rounded-lg overflow-hidden">
          <div className="aspect-video bg-muted">
            <img
              src={template.thumbnail || "/placeholder.svg"}
              alt={template.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif font-medium">{template.name}</h4>
              <Tag>{template.type}</Tag>
            </div>
            <p className="font-serif text-sm text-muted-foreground mb-4">
              {template.description}
            </p>
            <div className="flex items-center gap-2">
              <Button className="flex-1 rounded-md" title="Deploy" />
              <Button
                variant="outline"
                icon={<Edit className="w-4 h-4" />}
                className="rounded-md px-3"
              />
              <Button
                variant="outline"
                icon={<Trash2 className="w-4 h-4" />}
                className="rounded-md px-3"
                onClick={() => {
                  if (window.confirm(`Delete ${template.name}?`)) {
                    onDelete(template.id);
                  }
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}