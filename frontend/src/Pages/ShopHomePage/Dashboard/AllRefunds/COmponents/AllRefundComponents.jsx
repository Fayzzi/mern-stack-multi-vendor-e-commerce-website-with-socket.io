import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import Loader from "../../../../../Components/Loader/Loader";
import { MdTrackChanges } from "react-icons/md";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllShopOrders } from "../../../../../Components/Redux/Reducers/Allorders";
import { AiOutlineEye } from "react-icons/ai";

export default function AllRefundComponents() {
  const { seller } = useSelector((state) => state.seller);
  const { shoporderLoading, shoporders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const myRefund =
    shoporders &&
    shoporders.filter((item) => item.status === "Refund Processing");
  useEffect(() => {
    dispatch(getAllShopOrders({ id: seller._id }));
  }, [dispatch, seller]);
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
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
      field: "Price",
      headerName: "Product Price",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "shipment",
      headerName: "Shipping",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 100,
      headerName: "Check",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <>
          <Link to={`/dashboard-orders/orders/order?order=${params.id}`}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        </>
      ),
    },
  ];

  const row =
    myRefund &&
    myRefund.map((order) => {
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
        Price: "US$ " + total,
        status: order?.status,
      };
    });

  if (shoporderLoading) {
    return <Loader />;
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
}
