import  { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link,  useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { getAllShopOrders } from "../../../Components/Redux/Reducers/Allorders";
import Loader from "../../../Components/Loader/Loader";
import axios from "axios";

export default function OrdersDetailComponent() {
  const [searchParams] = useSearchParams();
  const { shoporderLoading, shoporders } = useSelector((state) => state.orders);
  const [data, setData] = useState();
  const p_d = searchParams.get("order");
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [statusSelected, setStatusSelected] = useState(data?.status || "");

  useEffect(() => {
    dispatch(getAllShopOrders({ id: seller?._id }));
  }, [dispatch, seller]);
  console.log(p_d, data);
  useEffect(() => {
    if (shoporders && p_d) {
      const valid = shoporders.find((order) => order?._id === p_d);
      setData(valid);
    }
  }, [p_d, shoporders]);

  const updateOrderHandler = async (e, orderId, productId, status, qty) => {
    e.preventDefault();

    try {
      await axios.put(`/api/v2/orders/updating-order-status/${orderId}`, {
        ProductId: productId,
        qty: qty,
        status: status,
      });

      alert("Successfully updated order");
    } catch (error) {
      console.error("Error updating order:", error.message);
      alert("Error updating order");
    }
  };

  if (shoporderLoading) {
    return <Loader />;
  }

  if (!data) {
    return <div className="min-h-screen">No data found for order {p_d}</div>;
  }

  return (
    <div className="bg-gray-500 bg-opacity-10">
      <div className="w-11/12 mx-auto min-h-screen py-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="pl-5 text-[25px]">Order Details</h1>
          </div>
          <Link to={"/dashboard-orders"}>
            <div className="w-[150px] bg-[#fce1e6]  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer">
              <span className="text-[red] font-[600] text-[18px]">
                Order List
              </span>
            </div>
          </Link>
        </div>
        <div className="w-full 800px:flex items-center justify-between pt-6">
          <h5>Order Id:#{data?._id.slice(0, 8)}</h5>
          {data && data?.createdAt && (
            <h5 className="my-4 800px:my-0">
              Placed on:
              {format(new Date(data?.createdAt), "PPPp")}
            </h5>
          )}
        </div>
        <div className="mt-4 rounded-md">
          {data &&
            data?.cart.map((item, index) => (
              <div className=" " key={index}>
                <div className="flex flex-col py-6 border-b-[2px]">
                  <div className="800px:flex py-5 px-4 border-b shadow-sm">
                    <img
                      className="h-[150px] object-contain w-[150px]"
                      src={"http://localhost:3000/" + item?.images[0]}
                      alt=""
                    />
                    <div className="800px:pl-4 800px:mt-0 my-4">
                      <h1 className="text-[20px] font-semibold">
                        {item?.name}
                      </h1>
                      <h1 className=" text-[16px] mt-1">{item?.category}</h1>
                      <h1 className="text-[16px] ">
                        Quantity:<strong>{item?.qty}</strong>
                      </h1>
                      <h1 className="text-[16px] ">
                        Item Price:<strong>{item?.discountPrice}</strong>
                      </h1>
                      <h1 className="text-[16px] ">
                        Shipment price:
                        <strong>{data?.shippingPrice.toFixed(2)}</strong>
                      </h1>
                      <h1 className="text-[16px] my-4 ">
                        Total Price:
                        <strong>
                          {data?.totalPrice + data?.shippingPrice}
                        </strong>
                      </h1>
                    </div>
                  </div>

                  <div className="mt-8 px-4">
                    <div className="800px:flex items-center justify-between">
                      <div>
                        <h1 className="text-[18px]">Shipping Address:</h1>
                        {data && (
                          <div className="py-4">
                            <h1 className="text-[17px]">
                              {data?.shippingAddres?.address1}
                            </h1>
                            <h1 className="text-[17px]">
                              {data?.shippingAddres?.address2}
                            </h1>
                            <h1 className="text-[17px]">
                              {data?.shippingAddres?.city}
                            </h1>
                            <h1 className="text-[17px]">
                              {data?.shippingAddres?.country}
                            </h1>
                            <h1 className="text-[17px]">
                              {data?.shippingAddres?.phoneNumber}
                            </h1>
                          </div>
                        )}
                      </div>
                      {data?.paymentInfo?.type === "Cash on delivery" ? (
                        <div>
                          <h1>Payment Type:</h1>
                          <h1 className="text-[17px]">
                            {data?.paymentInfo?.type}
                          </h1>
                        </div>
                      ) : (
                        <div>
                          <h1>Payment Status:</h1>
                          <h1 className="text-[17px]">
                            {data?.paymentInfo?.status}
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="my-8">
                    {data?.status !== "Delivered" &&
                    data?.status !== "Refund Processing" &&
                    data?.status !== "Refund Success" ? (
                      <select
                        className="p-2 rounded-md"
                        value={statusSelected}
                        onChange={(e) => setStatusSelected(e.target.value)}
                        name=""
                        id=""
                      >
                        {[
                          "Processing",
                          "Transfered to Delivery Partner",
                          "Shipping",
                          "Recieved",
                          "On the way",
                          "Delivered",
                        ].map((d, i) => (
                          <option key={i} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    ) : data?.status === "Delivered" ? (
                      <div className="w-[150px] flex items-center justify-center h-[45px] text-white p-2 rounded-md bg-black">
                        Delivered
                      </div>
                    ) : null}
                    {data?.status === "Refund Processing" && (
                      <select
                        className="p-2 rounded-md"
                        value={statusSelected}
                        onChange={(e) => setStatusSelected(e.target.value)}
                        name=""
                        id=""
                      >
                        {["Processing Refund", "Refund Success"].map((d, i) => (
                          <option key={i} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    )}
                    {data?.status === "Refund Success" && (
                      <div className="w-[150px] bg-black  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer">
                        <span className="text-[white] font-[600] text-[18px]">
                          Refund Success
                        </span>
                      </div>
                    )}
                  </div>
                  {data?.status !== "Delivered" &&
                    data?.status !== "Refund Success" && (
                      <button
                        onClick={(e) =>
                          updateOrderHandler(
                            e,
                            data._id,
                            item._id,
                            statusSelected,
                            item.qty
                          )
                        }
                        className="w-[150px] bg-[#fce1e6]  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
                      >
                        <span className="text-[red] font-[600] text-[18px]">
                          Update Order
                        </span>
                      </button>
                    )}
                </div>
                <div className="flex mb-4 mt-2 justify-end">
                  <strong>Total Price:</strong>${" "}
                  {data?.totalPrice + data?.shippingPrice}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
