import Button from "../../../components/shared/Button";
import { Tag } from "antd";

export default function AdminSettings() {
  const settingsSections = [
    {
      title: "System Access",
      description: "Configure system-wide access settings",
      settings: [
        {
          name: "Multi-factor Authentication",
          description: "Require 2FA for all admin accounts",
          action: "Configure",
        },
        {
          name: "Session Timeout",
          description: "Auto-logout after inactivity",
          action: "Set Time",
        },
        {
          name: "Password Policy",
          description: "Minimum requirements for passwords",
          action: "Update",
        },
      ],
    },
    {
      title: "Audit & Logging",
      description: "Monitor system activity and changes",
      settings: [
        {
          name: "Activity Logging",
          description: "Track all user actions",
          status: "Enabled",
        },
        {
          name: "Failed Login Attempts",
          description: "Monitor security breaches",
          status: "Enabled",
        },
        {
          name: "Data Export Logs",
          description: "Track data access and exports",
          status: "Enabled",
        },
      ],
    },
    {
      title: "Backup & Recovery",
      description: "Data protection and recovery options",
      settings: [
        {
          name: "Automatic Backups",
          description: "Daily system backups",
          status: "Active",
        },
        {
          name: "Last Backup",
          description: "January 15, 2024 at 2:00 AM",
          action: "Backup Now",
        },
        {
          name: "Recovery Testing",
          description: "Verify backup integrity",
          action: "Test Recovery",
        },
      ],
    },
    {
      title: "System Maintenance",
      description: "Scheduled maintenance and updates",
      settings: [
        {
          name: "System Updates",
          description: "Check for software updates",
          action: "Check Updates",
        },
        {
          name: "Database Optimization",
          description: "Optimize database performance",
          action: "Optimize",
        },
        {
          name: "Cache Management",
          description: "Clear system cache",
          action: "Clear Cache",
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {settingsSections.map((section, index) => (
        <div key={index} className="border rounded-lg p-6">
          <div className="mb-4">
            <h3 className="font-sans font-semibold text-lg">{section.title}</h3>
            <p className="text-sm text-muted-foreground font-serif">
              {section.description}
            </p>
          </div>
          <div className="space-y-4">
            {section.settings.map((setting, settingIndex) => (
              <div
                key={settingIndex}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1">
                  <p className="font-serif font-medium">{setting.name}</p>
                  <p className="text-sm font-serif text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
                <div>
                  {setting.status ? (
                    <Tag color="green">{setting.status}</Tag>
                  ) : (
                    <Button
                      variant="outline"
                      title={setting.action || "Action"}
                      className="rounded-md text-sm py-1"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
