/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/shared/Cards";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import ReusableTable from "../../../components/shared/Table";
import { getAllOrders } from "../../../store/slices/order";
import Loader from "../../../components/shared/Loader";
import { formatCurrency } from "../../../utils";
import { getAllCinemas } from "../../../store/slices/cinema";
import { getCinemaOrders } from "../../../store/slices/order";
import { useState, useEffect } from "react";
import ReusableSelect from "../../../components/shared/Select";

export default function Sales({ recentSales,loading }: any) {
  const { orderStats } = useAppSelector(
    (state) => state.order
  );
  const { page,limit,total } = useAppSelector((state) => state.order);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const [selectedCinema, setSelectedCinema] = useState("");
  
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(getAllCinemas({ page: 1, limit: 100 }));
  }, [dispatch]);
  const salesStats = [
    {
      icon: DollarSign,
      color: "primary",
      label: "Today's Sales",
      value: "$1,247",
    },
    {
      icon: ShoppingCart,
      color: "accent",
      label: "Total Orders",
      value: orderStats?.totalOrders,
    },
    {
      icon: TrendingUp,
      color: "secondary",
      label: "Completed Orders",
      value: orderStats?.completedOrders,
    },
  ];

const columns = [
    {
      title: "Order Type",
      dataIndex: "order_type",
      key: "order_type",
          },
    {
      title: "Grand Total",
      dataIndex: "grand_total",
      key: "grand_total",
      render: (grand_total: number) => <span className="font-semibold">{formatCurrency(grand_total)}</span>,
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render:(payment_status: string) => <span className="capitalize">{payment_status.toLowerCase()}</span>
    },
    {
      title: "Grand Total",
      dataIndex: "vat_rate",
      key: "vat_rate",
      render: (vat_rate: number) => <span className="font-semibold">{vat_rate}</span>,
    },
    {
      title: "Vat Amount",
      dataIndex: "vat_amount",
      key: "vat_amount",
      render:(vat_amount: number) => <span className="capitalize">{formatCurrency(vat_amount)}</span>
    },
     {
      title: "Cinema Details",
      key: "cinema_id",
      render:(_:unknown,record: any) => <div className=""><p>{record?.cinema?.name}</p><p className="text-sm">{record?.cinema?.location}</p></div>
    },
    {
      title: "User",
      key: "surname",
      render:(_:unknown,record: any) => <div className=""><p>{record?.user?.surname} {record?.user?.other_names}</p><p className="text-xs">{record?.user?.email}</p><p className="text-xs">{record?.user?.phone}</p></div>
    },
     ];

const handleTableChange = (pagination: any) => {
    if (selectedCinema) {
      dispatch(
        getCinemaOrders({
          cinemaId: selectedCinema,
          page: pagination.current,
          limit: pagination.pageSize,
        })
      ).unwrap();
    } else {
      dispatch(
        getAllOrders({
          page: pagination.current,
          limit: pagination.pageSize,
        })
      ).unwrap();
    }
  };

  const handleCinemaChange = (value: string) => {
    setSelectedCinema(value);
    if (value) {
      dispatch(
        getCinemaOrders({
          cinemaId: value,
          page: 1,
          limit: 10,
        })
      ).unwrap();
    } else {
      dispatch(
        getAllOrders({
          page: 1,
          limit: 10,
        })
      ).unwrap();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salesStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div>
                  <p className="font-serif text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="font-sans text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-sans">All Sales</CardTitle>
          <CardDescription className="font-serif">
            <div className="w-full md:w-1/3">
              <ReusableSelect
                options={allCinemas.map((cinema: any) => ({
                  label: cinema.name,
                  value: cinema.cinema_id,
                }))}
                value={selectedCinema}
                onChange={(val) => handleCinemaChange(val as string)}
                defaultOption="Filter by Cinema"
                showSearch={true}
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
          {loading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={recentSales || []}
          columns={columns}
          title="Orders"
          searchField={["order_type"]}
          excludeColumns={["order_id", "cinema_id", "created_at", "updated_at","user_id"]}
          showPagination={true}
          paginationMode="backend"
          paginationProps={{
            total,
            current: page,
            pageSize: limit,
          }}
          onTableChange={handleTableChange}
        />
      )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
