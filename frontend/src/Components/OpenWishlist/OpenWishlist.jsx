import React from "react";
import { useState } from "react";
import { BiSolidCart } from "react-icons/bi";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoBagHandleOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromFavorites } from "../Redux/Reducers/FavoriteItems";
import { addToCart } from "../Redux/Reducers/CartItems";
import { toast } from "react-toastify";
export default function OpenWishlist({ setopen }) {
  const { fav } = useSelector((state) => state.fav);
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[40] bg-[#0000004b]">
      <div className="fixed top-0 right-0 min-h-full w-[35%] bg-white flex flex-col justify-between">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={(e) => setopen(false)}
            />
          </div>
          {/*Items length */}
          <div className="flex items-center p-4">
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">
              {fav.length.toString()}
            </h5>
          </div>
          {/*Cart Items */}
          <br />
          <div className="w-full border-t">
            {fav && fav.map((d, i) => <WishListSingle data={d} key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
const WishListSingle = ({ data }) => {
  const [value, setvalue] = useState(1);
  const totalPrice = data.discountPrice * value;
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const FavoriteRemoverHandeler = (data) => {
    dispatch(removeFromFavorites(data));
  };
  const cartAdder = (data) => {
    const checkExisting = cart.find((i) => i._id == data._id);
    if (checkExisting) {
      toast.error("Item is already in cart");
    } else {
      const addtocart = { ...data, qty: 1 };
      dispatch(addToCart(addtocart));
      toast.success("Item is added in cart");
    }
  };
  return (
    <div className="border-b p-4">
      <div className="w-full relative flex items-center ">
        <RxCross1
          onClick={(e) => FavoriteRemoverHandeler(data)}
          size={20}
          className="shrink-0 cursor-pointer"
        />
        <img
          className="w-[80px] h-[80px] select-none ml-2 object-contain"
          src={"http://localhost:3000/" + data?.images[0]}
          alt=""
        />
        <div className="pl-5">
          <h1 className="line-clamp-2 select-none">{data.name}</h1>
          <h1 className="font-[400] select-none  items-center text-[15px] text-gray-600">
            <h1>Price: {data.discountPrice}</h1>
          </h1>
          <h1 className="font-[600] select-none text-[#d02222] pt-[3px]">
            Total:${totalPrice}
          </h1>
        </div>
        <BsCartPlus
          onClick={(e) => cartAdder(data)}
          size={20}
          title="Add to cart"
          className="shrink-0 ml-2 absolute top-[50%] right-3"
        />
      </div>
    </div>
  );
};
