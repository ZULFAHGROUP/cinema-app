"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/shared/Cards";
import Button from "../../components/shared/Button";
import { Tabs, Tag } from "antd";
import {
  Building2,
  Monitor,
  Armchair,
  Plus,
  Edit,
  Settings,
  Volume2,
} from "lucide-react";

function CinemaSetup() {
  const cinemas = [
    {
      id: 1,
      name: "Theater 1",
      screens: 1,
      totalSeats: 150,
      features: ["Dolby Atmos", "4K", "Reclining Seats"],
      status: "Active",
    },
    {
      id: 2,
      name: "Theater 2",
      screens: 1,
      totalSeats: 200,
      features: ["IMAX", "3D", "Premium Sound"],
      status: "Active",
    },
    {
      id: 3,
      name: "Theater 3",
      screens: 1,
      totalSeats: 120,
      features: ["Standard", "AC"],
      status: "Maintenance",
    },
  ];

  const screens = [
    {
      id: 1,
      name: "Screen A",
      theater: "Theater 1",
      size: "Large",
      resolution: "4K",
      soundSystem: "Dolby Atmos",
      status: "Active",
    },
    {
      id: 2,
      name: "Screen B",
      theater: "Theater 2",
      size: "IMAX",
      resolution: "4K",
      soundSystem: "IMAX Enhanced",
      status: "Active",
    },
  ];

  const seatLayout = Array.from({ length: 10 }, (_, row) =>
    Array.from({ length: 15 }, (_, seat) => ({
      id: `${String.fromCharCode(65 + row)}${seat + 1}`,
      row: String.fromCharCode(65 + row),
      number: seat + 1,
      type: seat < 2 || seat > 12 ? "premium" : "standard",
      status: Math.random() > 0.1 ? "available" : "maintenance",
    }))
  );

  return (
    <div className="p-6">
      <Tabs
        defaultActiveKey="theaters"
        items={[
          {
            key: "theaters",
            label: (
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Theaters
              </span>
            ),
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cinemas.map((theater) => (
                  <Card
                    key={theater.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-sans">
                          {theater.name}
                        </CardTitle>
                        <Tag
                          color={
                            theater.status === "Active" ? "green" : "orange"
                          }
                        >
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
                          {theater.features.map((feature) => (
                            <Tag key={feature} className="text-xs">
                              {feature}
                            </Tag>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1 gap-2 bg-transparent"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="gap-2 bg-transparent"
                          >
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            key: "screens",
            label: (
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Screens
              </span>
            ),
            children: (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Screen
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {screens.map((screen) => (
                    <Card key={screen.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="font-sans">
                            {screen.name}
                          </CardTitle>
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
                              <p className="font-serif text-muted-foreground">
                                Size
                              </p>
                              <p className="font-sans font-medium">
                                {screen.size}
                              </p>
                            </div>
                            <div>
                              <p className="font-serif text-muted-foreground">
                                Resolution
                              </p>
                              <p className="font-sans font-medium">
                                {screen.resolution}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="font-serif text-muted-foreground text-sm">
                              Sound System
                            </p>
                            <p className="font-sans font-medium">
                              {screen.soundSystem}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1 gap-2 bg-transparent"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="gap-2 bg-transparent"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
          {
            key: "seating",
            label: (
              <span className="flex items-center gap-2">
                <Armchair className="w-4 h-4" /> Seating
              </span>
            ),
            children: (
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans">
                    Seating Layout - Theater 1
                  </CardTitle>
                  <CardDescription className="font-serif">
                    Configure seat types and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="bg-gray-200 px-8 py-2 rounded-lg">
                        <p className="text-sm font-serif text-center">SCREEN</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {seatLayout.map((row, rowIndex) => (
                        <div
                          key={rowIndex}
                          className="flex items-center justify-center gap-1"
                        >
                          <span className="w-6 text-center text-sm font-serif text-muted-foreground">
                            {String.fromCharCode(65 + rowIndex)}
                          </span>
                          {row.map((seat) => (
                            <button
                              key={seat.id}
                              className={`
                                w-6 h-6 rounded text-xs font-serif transition-colors
                                ${
                                  seat.type === "premium"
                                    ? "bg-green-600 text-white hover:bg-green-500"
                                    : "bg-gray-300 text-black hover:bg-gray-400"
                                }
                                ${
                                  seat.status === "maintenance"
                                    ? "bg-red-500 text-white"
                                    : ""
                                }
                              `}
                              title={`${seat.id} - ${seat.type} - ${seat.status}`}
                            >
                              {seat.number}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        <span className="font-serif">Standard</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-600 rounded"></div>
                        <span className="font-serif">Premium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="font-serif">Maintenance</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}

export default CinemaSetup;
