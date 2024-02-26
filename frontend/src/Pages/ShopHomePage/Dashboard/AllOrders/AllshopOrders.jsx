import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AiOutlineEye } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllShopOrders } from "../../../../Components/Redux/Reducers/Allorders";

export default function AllshopOrders() {
  const { shoporderLoading, shoporders } = useSelector((state) => state.orders);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllShopOrders({ _id: seller?._id }));
  }, [dispatch]);
  const coloums = [
    {
      field: "id",
      headerName: "Order Id",
      width: 150,
    },
    {
      field: "p_name",
      headerName: "Product Name",
      width: 150,
    },
    {
      field: "price",
      headerName: "Product Price",
      width: 150,
    },
    {
      field: "shipment",
      headerName: "Shipment Price",
      width: 150,
    },

    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      width: 150,
    },
    {
      field: "preview",
      headerName: "preview",
      type: "number",
      sortable: false,
      width: 80,

      renderCell: (params) => {
        const d = params.row.id;

        return (
          <Link to={"/dashboard-orders/orders/order?order=" + d}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];
  const rows =
    shoporders &&
    shoporders.map((order) => {
      // Calculate item quantity from each shop in each order
      const itemsQty = order.cart.reduce(
        (itemAcc, item) => itemAcc + item.qty,
        0
      );

      // Calculate total price from each shop in each order
      const total = order?.totalPrice;
      // Calculate shipping price from each shop in each order
      const shippingPrice = order?.shippingPrice;

      return {
        id: order?._id,
        itemsQty,
        p_name: order?.cart[0]?.name,
        shipment: "US$ " + shippingPrice.toFixed(2),
        price: "US$ " + total,
        status: order?.status,
      };
    });
  return (
    <div>
      <DashboardHeader />
      <div className="flex gap-4 ">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={2} />
        </div>
        <div className="mx-auto w-[70%] lg:w-[70%]">
          <h1 className="text-3xl p-3 my-4 font-bold mb-4">All Orders</h1>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid rows={rows} columns={coloums} pageSize={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
