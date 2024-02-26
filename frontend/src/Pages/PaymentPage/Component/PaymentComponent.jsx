import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../Styles/Styles";
import { RxCross1 } from "react-icons/rx";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-toastify";
// import {
//   CardCvcElement,
//   CardExpiryElement,
//   CardNumberElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../../../Components/Redux/Reducers/CartItems";
export default function PaymentComponent() {
  const [select, setSelect] = useState(0);
  const [brainTreeClientToken, setbrainTreeClientToken] = useState("");
  const [instance, setinstance] = useState("");

  const [open, setOpen] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const shipping = orderData?.shippingPrice?.toFixed(2);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  async function getNewBraintreeToken() {
    try {
      const { data } = await axios.get("/api/v2/braintree/get-braintree-token");
      setbrainTreeClientToken(data?.clientToken);
    } catch (error) {
      console.error("Error fetching new Braintree client token:", error);
    }
  }
  useEffect(() => {
    getNewBraintreeToken();
  }, []);
  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);
  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latest-array"));
    setOrderData(orderData);
  }, [setOrderData]);
  console.log("This is Cart", orderData?.cart);
  //card payment handeler
  const paymentHandeler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const { nonce } = await instance.requestPaymentMethod();
      axios
        .post("/api/v2/braintree/braintree-payments", {
          nonce,
          totalPrice: orderData?.totalPrice,
          cart: orderData?.cart,
          shippingAddres: orderData?.shippingAddress,
          user: user,
        })
        .then(({ data }) => {
          setloading(false);

          dispatch(clearCart());
          navigate("/payment/success");

          toast.success(data.message);
        })
        .catch((error) => {
          console.error(error); // Log the error for debugging
          toast.error(error.response?.data?.message || "An error occurred");
          setloading(false);
        });
    } catch (error) {
      console.error(error); // Log the error for debugging
      toast.error(error.response?.data?.message || "An error occurred");
      setloading(false);
    }
  };
  console.log(
    orderData?.totalPrice,
    orderData?.eachShopDataInArray,
    orderData?.shippingAddress,
    user
  );
  //CASH ON DELIVERY
  const cashonDeliveryHandeler = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/v2/payment/cash-on-delivery",
        {
          totalPrice: orderData?.totalPrice,
          cart: orderData?.cart,
          shippingAddres: orderData?.shippingAddress,
          user: user,
          shippingPrice: orderData?.shippingPrice,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(({ data }) => {
        navigate("/payment/success");
        dispatch(clearCart());
        toast.success(data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            {/* select buttons */}
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div
                  className="w-[50px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
                  onClick={() => setSelect(1)}
                >
                  {select === 1 ? (
                    <div className="w-[13px] absolute right-1 h-[13px] bg-[#1d1a1acb] rounded-full" />
                  ) : (
                    <div className="w-[13px] absolute left-1 h-[13px] bg-[#1d1a1acb] rounded-full" />
                  )}
                </div>
                <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                  Pay with Debit/credit card
                </h4>
              </div>

              {/* pay with card */}
              {select === 1 ? (
                <div className="w-full border-b">
                  {!brainTreeClientToken ? (
                    ""
                  ) : (
                    <DropIn
                      options={{
                        authorization: brainTreeClientToken,
                      }}
                      onInstance={(instance) => setinstance(instance)}
                    />
                  )}
                  {loading ? (
                    <button className="w-full p-2 rounded-md  border-[red]">
                      Loading....
                    </button>
                  ) : (
                    <button
                      onClick={paymentHandeler}
                      disabled={!orderData?.shippingAddress || !instance}
                      className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                    >
                      Make payment
                    </button>
                  )}
                </div>
              ) : null}
            </div>

            <br />
            {/* paypal payment */}
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div
                  className="w-[50px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
                  onClick={() => setSelect(2)}
                >
                  {select === 2 ? (
                    <div className="w-[13px] absolute right-1 h-[13px] bg-[#1d1a1acb] rounded-full" />
                  ) : (
                    <div className="w-[13px] absolute left-1 h-[13px] bg-[#1d1a1acb] rounded-full" />
                  )}
                </div>
                <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                  Pay with Paypal
                </h4>
              </div>

              {/* pay with payement */}
              {select === 2 ? (
                <div className="w-full flex border-b">
                  <div
                    className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                    onClick={() => setOpen(true)}
                  >
                    Pay Now
                  </div>
                  {open && (
                    <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
                      <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-8 relative overflow-y-scroll">
                        <div className="w-full flex justify-end p-3">
                          <RxCross1
                            size={30}
                            className="cursor-pointer absolute top-3 right-3"
                            onClick={() => setOpen(false)}
                          />
                        </div>
                        Paypal Scrip Provider
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <br />
            {/* cash on delivery */}
            <div>
              <div className="flex w-full pb-5 border-b mb-2">
                <div
                  className="w-[50px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
                  onClick={() => setSelect(3)}
                >
                  {select === 3 ? (
                    <div className="w-[13px] absolute right-1 h-[13px] bg-[#1d1a1acb] rounded-full" />
                  ) : (
                    <div className="w-[13px] absolute left-1 h-[13px] bg-[#1d1a1acb] rounded-full" />
                  )}
                </div>
                <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                  Cash on Delivery
                </h4>
              </div>

              {/* cash on delivery */}
              {select === 3 ? (
                <div className="w-full flex">
                  <form onSubmit={cashonDeliveryHandeler} className="w-full">
                    <input
                      type="submit"
                      value="Confirm"
                      className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                    />
                  </form>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                subtotal:
              </h3>
              <h5 className="text-[18px] font-[600]">
                ${orderData?.subTotalPrice}
              </h5>
            </div>
            <br />
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                shipping:
              </h3>
              <h5 className="text-[18px] font-[600]">${shipping}</h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                Discount:
              </h3>
              <h5 className="text-[18px] font-[600]">
                {orderData?.discountPriceCalculated
                  ? "$" + orderData.discountPriceCalculated
                  : "-"}
              </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">
              ${orderData?.totalPrice}
            </h5>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
