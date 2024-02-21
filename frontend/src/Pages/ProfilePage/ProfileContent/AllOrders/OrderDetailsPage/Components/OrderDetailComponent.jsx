import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { getAllOrders } from "../../../../../../Components/Redux/Reducers/Allorders";
import { BsFillBagFill } from "react-icons/bs";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { format } from "date-fns";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

export default function OrderDetailComponent() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("order");
  const { user } = useSelector((state) => state.user);
  const { orders, orderLoading } = useSelector((state) => state.orders);
  const [data, setData] = useState();
  const [review, setreview] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItems] = useState({});
  const [rating, setRating] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllOrders({ id: user?._id }));
  }, [dispatch, user]);
  useEffect(() => {
    const myOrders = orders && orders.find((o) => o?._id === id);
    setData(myOrders);
  }, [id, orders]);
  if (!data) {
    return <div className="min-h-screen">No data to show!!</div>;
  }

  const reviewButoon = (d) => {
    setSelectedItems({
      review: d,
    });

    setOpen(true);
  };
  const reviewHandler = async (e, productId, comment, ratings, shopId) => {
    e.preventDefault();
    console.log(productId, comment, ratings, shopId);
    try {
      await axios.put("/api/v2/product/post-review", {
        comment: comment,
        user: user,
        rating: ratings,
        productId: productId,
        orderId: id,
        shopId: shopId,
      });
      setRating(1);
      setreview("");
      setOpen(false);
      setSelectedItems({});
      dispatch(getAllOrders({ id: user?._id }));
      toast.success("Review Successfully added!");
    } catch (error) {
      toast.success(error.response.data.message);
    }
  };
  const RefundHandeler = async (e) => {
    e.preventDefault();
    axios
      .put(`/api/v2/orders/order-refund/${id}`, {
        status: "Refund Processing",
      })
      .then(() => {
        dispatch(getAllOrders({ id: user?._id }));
        toast.success("Refund requested!!");
      })
      .catch((e) => toast.error(e.response.data.message));
  };
  return (
    <div className="bg-gray-500 bg-opacity-10 ">
      <div className="w-11/12 mx-auto min-h-screen py-4">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="pl-5 text-[25px]">Order Details</h1>
          </div>
        </div>
        <div className="w-full 800px:flex  items-center justify-between pt-6">
          <h5>Order Id:#{data?._id.slice(0, 8)}</h5>
          {data && data?.createdAt && (
            <h5 className="my-4 800px:my-0">
              Placed on:
              {format(new Date(data?.createdAt), "PPPp")}
            </h5>
          )}{" "}
        </div>
        <div className="mt-4 rounded-md">
          {data &&
            data?.cart.map((item, index) => (
              <div className=" " key={index}>
                <div className="flex flex-col py-6 ">
                  <div className="800px:flex border-b-[2px] 800px:justify-between">
                    <div className="800px:flex py-5 px-4  ">
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
                          Shippment:
                          <strong>{item?.discountPrice * 0.1}</strong>
                        </h1>
                        <h1 className="text-[16px] my-4 ">
                          Total Price:(
                          {item?.qty}*{item?.discountPrice})+
                          {item?.discountPrice * 0.1}
                        </h1>
                      </div>
                    </div>
                    {data.status === "Delivered" ? (
                      data?.cart[0]?.isReviewed &&
                      data?.cart[0].isReviewed == true ? null : (
                        <button
                          onClick={(e) => reviewButoon(item)}
                          className="flex items-center justify-center bg-black rounded-md w-[150px] h-[45px]"
                        >
                          <h1 className="text-white">Write review</h1>
                        </button>
                      )
                    ) : (
                      <button className="w-[180px] bg-[#fce1e6]  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer">
                        <span className="text-[red] font-[600] text-[18px]">
                          {data?.status}
                        </span>
                      </button>
                    )}
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
                      {data?.paymentInfo?.status === "Successful" ? (
                        <div>
                          <h1>Payment Status:</h1>
                          <h1 className="text-[17px]">
                            {data?.paymentInfo?.status}
                          </h1>
                        </div>
                      ) : (
                        <div>
                          <h1>Payment Status:</h1>
                          <h1 className="text-[17px]">
                            {data?.paymentInfo?.type}
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex mb-4 mt-2 justify-end">
                  <strong>Total Price:</strong> $
                  {data?.totalPrice + data?.shippingPrice}
                </div>
                <div className="flex items-center justify-around">
                  <Link to={"/"}>
                    <div className="w-[150px] bg-black  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer">
                      <span className="text-[white] font-[600] text-[18px]">
                        Send Message
                      </span>
                    </div>
                  </Link>
                  {data.status === "Delivered" ? (
                    <button
                      onClick={(e) => RefundHandeler(e)}
                      className="w-[150px] bg-black  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
                    >
                      <span className="text-[white] font-[600] text-[18px]">
                        Request&nbsp;Refund
                      </span>
                    </button>
                  ) : null}
                  {data.status === "Refund Processing" ? (
                    <button className="w-[180px] bg-black  h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer">
                      <span className="text-[white] font-[600] text-[18px]">
                        Refund&nbsp;Processing
                      </span>
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
        </div>
        {open && selectedItem && (
          <div className="w-screen h-screen bg-black bg-opacity-50 fixed flex items-center z-[50] justify-center top-0 left-0">
            <div className="w-full p-2 800px:w-[55%] overflow-x-hidden relative h-full 800px:h-[75vh] rounded-md z-[50] bg-[white] overflow-y-scroll">
              <div className="absolute top-2 right-2">
                <RxCross1
                  className="cursor-pointer"
                  onClick={(e) => setOpen(false)}
                  size={25}
                />
              </div>
              <h2 className="text-[25px] my-6 font-[500] font-Poppins text-center">
                Give a Review
              </h2>
              <div className="flex w-full">
                <img
                  className="h-[150px] w-[150px] object-contain rounded-md"
                  src={
                    "http://localhost:3000/" + selectedItem?.review?.images[0]
                  }
                  alt=""
                />
                <h1 className="pl-2 text-[23px]">
                  {selectedItem?.review?.name}
                </h1>
                <h4 className="pl-3 text-[23px]">
                  US$
                  {selectedItem?.review?.discountPrice *
                    selectedItem?.review?.qty}
                </h4>
              </div>
              <br />
              <h5 className="pl-3 text-[20px] font-[500]">
                Give Ratings
                <span className="text-[red]">*</span>
              </h5>
              <div className="flex w-full ml-2 pt-1">
                {[1, 2, 3, 4, 5].map((i) =>
                  rating >= i ? (
                    <AiFillStar
                      className="mr-1 cursor-pointer"
                      color="rgb(246,186,0)"
                      size={25}
                      key={i}
                      onClick={(e) => setRating(i)}
                    />
                  ) : (
                    <AiOutlineStar
                      className="mr-1 cursor-pointer"
                      color="rgb(246,186,0)"
                      size={25}
                      key={i}
                      onClick={(e) => setRating(i)}
                    />
                  )
                )}
              </div>
              <br />
              <div className="w-full ml-3">
                <label htmlFor="" className="block text-[20px] font-[500]">
                  write a comment
                  <span className="ml-1 text-gray-400 font-light text-[16px]">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="comment"
                  id=""
                  className="w-[95%] mx-auto border p-2 resize-none rounded-md"
                  placeholder="How was the product? write your experience...."
                  cols="20"
                  value={review}
                  onChange={(e) => setreview(e.target.value)}
                  rows="5"
                ></textarea>
              </div>
              <div
                onClick={(e) =>
                  reviewHandler(
                    e,
                    selectedItem?.review?._id,
                    review,
                    rating,
                    selectedItem?.review?.shopInfo?._id
                  )
                }
                className="w-[150px] cursor-pointer flex items-center justify-center h-[45px] bg-black rounded-md p-2 mx-auto my-6"
              >
                <span className="text-white ">Submit</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
