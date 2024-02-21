import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../Redux/Reducers/CartItems";
import {
  addtoFavorites,
  removeFromFavorites,
} from "../../Redux/Reducers/FavoriteItems";
export default function ProductsDetailCard({ setOpen, data }) {
  const [count, setCount] = useState(1);
  const { cart } = useSelector((state) => state.cart);
  const { fav } = useSelector((state) => state.fav);

  const dispatch = useDispatch();
  const handleMessageSubmit = () => {};
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const Increment = () => {
    setCount(count + 1);
  };
  const addtocartHandeler = (id) => {
    const alreadyinCart = cart.find((i) => i._id === id);
    if (alreadyinCart) {
      toast.error("Product is already in cart!!");
    } else {
      if (data.stock < count) {
        toast.error(`Product stock is limited to ${data.stock}!`);
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Items added to cart successfully");
      }
    }
  };
  const addtofavhandeler = (data) => {
    dispatch(addtoFavorites(data));
    toast.dismiss();
    toast.success("Item is  added to favorites!!");
  };
  const FavoriteRemoverHandeler = (date) => {
    dispatch(removeFromFavorites(data));
    toast.dismiss();
    toast.success("Item is  removed to favorites!!");
  };
  return (
    <div className="">
      {data ? (
        <div className="fixed w-screen h-screen top-5 left-0 bg-transparent z-40 flex justify-center items-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] 800px:h-[75vh] overflow-y-scroll bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute top-2 right-4 z-50"
              onClick={() => {
                setOpen(false);
              }}
            />
            <div className="block  w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={"http://localhost:3000/" + data?.images[0]}
                  alt=""
                  className="object-contain h-[400px] w-full"
                />

                <Link to={"/shop/" + data?.shopInfo?._id} className="flex">
                  <img
                    src={"http://localhost:3000/" + data?.shopInfo?.avatar}
                    className="w-[50px] h-[50px] rounded-full mr-2"
                    alt=""
                  />
                  <div>
                    <h3 className="pt-3 text-[15px] text-blue-400 pb-3">
                      {data?.shopInfo?.name}
                    </h3>
                    <h5 className="pb-3 text-[15px]">
                      ({data?.shop?.ratings}) Ratings
                    </h5>
                  </div>
                </Link>
                <div
                  className="w-[150px] bg-black h-11 my-3 flex items-center justify-center rounded-2xl cursor-pointer mt-2 "
                  onClick={handleMessageSubmit}
                >
                  <span className="text-white flex items-center">
                    Send Message <AiOutlineMessage size={20} className="ml-1" />
                  </span>
                </div>
                <h5 className="text-[16px] text-red-500 mt-5">
                  ({data?.sold_out}) Sold
                </h5>
              </div>
              <div className="w-full  800px:w-[50%] pt-5 pl-5 pr-[5px]">
                <h1 className="text-[25px] font-[600] font-Roboto text-[#333]">
                  {data?.name}
                </h1>
                <p>{data?.description}</p>
                <div className="flex pt-3">
                  <h4 className="font-bold text-[18px] text-[#333] font-Roboto">
                    {data?.discountPrice}
                  </h4>
                  <h3 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through">
                    {data?.originalPrice ? data?.originalPrice + "$" : null}
                  </h3>
                </div>
                <div className="flex items-center  mt-12 justify-between pr-3">
                  <div>
                    <button
                      onClick={decrementCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      -
                    </button>
                    {
                      <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[9px]">
                        {count}
                      </span>
                    }
                    <button
                      onClick={Increment}
                      className="bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {fav.find((i) => i._id === data._id) ? (
                      <AiFillHeart
                        size={22}
                        className="cursor-pointer"
                        color={
                          fav.find((i) => i._id === data._id) ? "red" : "black"
                        }
                        onClick={(e) => {
                          e.preventDefault();

                          FavoriteRemoverHandeler(data);
                        }}
                        title="Remove from wish list"
                      />
                    ) : (
                      <AiOutlineHeart
                        className="cursor-pointer"
                        size={22}
                        color={
                          fav.find((i) => i._id === data._id) ? "red" : "black"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          addtofavhandeler(data);
                        }}
                        title="Add to wish list"
                      />
                    )}
                  </div>
                </div>
                <div
                  onClick={(e) => addtocartHandeler(data._id)}
                  className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
                >
                  <span className="text-white flex items-center">
                    Add to cart
                    <AiOutlineShoppingCart size={22} className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
