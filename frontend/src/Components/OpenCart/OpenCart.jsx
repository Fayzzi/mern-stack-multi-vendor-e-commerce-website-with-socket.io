import React, { useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { HiMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../Redux/Reducers/CartItems";
import { toast } from "react-toastify";
export default function OpenCart({ setopen }) {
  const { cart } = useSelector((state) => state.cart);
  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.qty * item.discountPrice;
  }, 0);

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
            <IoBagHandleOutline size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">
              {cart && cart.length.toString()}
            </h5>
          </div>
          {/*Cart Items */}
          <br />
          {cart && cart.length === 0 ? (
            <div className="w-full flex items-center justify-center h-[30vh]  border-t">
              No items in cart
            </div>
          ) : (
            <div className="w-full border-t">
              {cart && cart.map((d, i) => <CartSingle data={d} key={i} />)}
            </div>
          )}
        </div>
        <div className="px-5 mb-3">
          <Link to={"/checkout"}>
            <div className="h-[45px] flex items-center justify-center w-full bg-red-500 rounded-[5px]">
              <h1 className="text-white textt-[18px] font-[600]">
                Check out Now(${totalPrice})
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
const CartSingle = ({ data }) => {
  const dispatch = useDispatch();
  const removeFromCartHandeler = (data) => {
    dispatch(removeFromCart(data));
  };

  const [value, setvalue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;
  const increament = (data) => {
    if (data.stock < value) {
      toast.error(`Product stock is limited to ${data.stock}!`);
    } else {
      setvalue(value + 1);
      //also update the data in localStorage
      const updateCartData = { ...data, qty: value + 1 };
      dispatch(addToCart(updateCartData));
    }
  };
  const decreament = (data) => {
    setvalue(value === 1 ? 1 : value - 1);
    //also update the data in localStorage
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    dispatch(addToCart(updateCartData));
  };

  return (
    <div className="border-b p-4">
      <div className="w-full relative flex items-center ">
        <div className="flex flex-col gap-1">
          <div
            onClick={(e) => {
              increament(data);
            }}
            className="bg-[#e44343] select-none border border-[#e4434373] rounded-full h-[25px] w-[25px] flex items-center justify-center cursor-pointer"
          >
            <HiPlus className="select-none" size={18} color="white" />
          </div>
          <span className="pl-[10px] select-none">{data.qty}</span>
          <div
            onClick={(e) => decreament(data)}
            className={`${
              value === 1 ? "bg-[7d879c]" : " bg-red-500 "
            } border border-[#e4434373] rounded-full h-[25px] w-[25px] flex items-center justify-center cursor-pointer`}
          >
            <HiMinus
              className="select-none"
              size={18}
              color={value === 1 ? "#7d879c" : "white"}
            />
          </div>
        </div>
        <img
          className="w-[80px] h-[80px] select-none ml-2 object-contain"
          src={"http://localhost:3000/" + data?.images[0]}
          alt=""
        />
        <div className="pl-5">
          <h1 className="whitespace-nowrap select-none">{data.name}</h1>
          <h1 className="font-[400] select-none items-center text-[15px] text-gray-600">
            Price: {data.discountPrice}
          </h1>
          <h1 className="font-[600] select-none text-[#d02222] pt-[3px]">
            Total:${totalPrice}
          </h1>
        </div>
        <RxCross1
          onClick={() => removeFromCartHandeler(data)}
          size={20}
          className="cursor-pointer absolute right-0 top-[50%]"
        />
      </div>
    </div>
  );
};
