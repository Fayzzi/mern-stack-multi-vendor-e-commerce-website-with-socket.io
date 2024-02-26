import { AiOutlineGift } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import {  BiMessageSquareDetail } from "react-icons/bi";
export default function DashboardHeader() {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-[30] flex items-center justify-between px-4">
      <div>
        <Link to={"/dashboard"}>
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt=""
          />
        </Link>
      </div>
      <div className=" flex  items-center">
        <div className="flex items-center mr-4">
          <Link className="800px:block hidden" to={"/dashboard/coupons"}>
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link className="800px:block hidden" to={"/dashboard-events"}>
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link className="800px:block hidden" to={"/dashboard-products"}>
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link className="800px:block hidden" to={"/dashboard-orders"}>
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link className="800px:block hidden" to={"/dashboard-messages"}>
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to={"/shop/" + seller?._id}>
            <img
              className="h-[30px] w-[30px] object-cover rounded-full"
              src={"http://localhost:3000/" + seller?.avatar}
              alt=""
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
