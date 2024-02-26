import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export default function Component() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("order");
  const { orders } = useSelector((state) => state.orders);
  const data = orders && orders.find((item) => item._id === id);
  if (!data) {
    return <div>No data to show!!</div>;
  }

  return (
    <div className="w-11/12 mx-auto">
      <>
        {data && data?.status === "Refund Processing" ? (
          <div className="min-h-screen flex items-center justify-center">
            Your Order Refund is Processing in the shop!!
          </div>
        ) : data?.status === "Transfered to Delivery Partner" ? (
          <div className="min-h-screen flex items-center justify-center">
            Your Order is on the way for delivery partner!!
          </div>
        ) : data?.status === "Shipping" ? (
          <div className="min-h-screen flex items-center justify-center">
            Your Order is coming with our delivery partner!!
          </div>
        ) : data?.status === "Recieved" ? (
          <div className="min-h-screen flex items-center justify-center">
            Your Order is in the city.Our Delivery man will deliver it shortly!!
          </div>
        ) : data?.status === "On the way" ? (
          <div className="min-h-screen flex items-center justify-center">
            Your Order is On the way to be delivered by our delivery man!!
          </div>
        ) : data?.status === "Delivered" ? (
          <div className="min-h-screen flex items-center justify-center">
            Your Order is Delivered!!
          </div>
        ) : data?.status === "Processing" ? (
          <div className="min-h-screen flex items-center justify-center">
            Your Order is Processing in the shop!!
          </div>
        ) : null}
      </>
    </div>
  );
}
