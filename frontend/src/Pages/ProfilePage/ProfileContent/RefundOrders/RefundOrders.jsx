import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "./../../../../Components/Loader/Loader";
import { getAllOrders } from "../../../../Components/Redux/Reducers/Allorders";

export default function RefundOrders() {
  const { orders, orderLoading } = useSelector((state) => state.orders);
  const eligibleOrder =
    orders && orders.filter((item) => item?.status === "Refund Processing");

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
          <Link to={`/profile/user/orders?order=${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        </>
      ),
    },
  ];

  const rows =
    eligibleOrder &&
    eligibleOrder
      .filter((order) => order.status === "Refund Processing")
      .map((order) => {
        const itemsQty = order.cart.reduce(
          (itemAcc, item) => itemAcc + item.qty,
          0
        );
        const total = order?.totalPrice;
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

  if (orderLoading) {
    return <Loader />;
  }

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
      />
    </div>
  );
}
