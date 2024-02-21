import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AiOutlineEye } from "react-icons/ai";
import { DataGrid } from "@material-ui/data-grid";
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
      minWidth: 100,
      flex: 1,
    },
    {
      field: "p_name",
      headerName: "Product Name",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Product Price",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "shipment",
      headerName: "Shipment Price",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "preview",
      headerName: "",
      type: "number",
      sortable: false,
      minWidth: 80,
      flex: 0.8,
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
        <div className="w-full min-h-screen text-white ">
          <DataGrid
            rows={rows}
            columns={coloums}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>
    </div>
  );
}
