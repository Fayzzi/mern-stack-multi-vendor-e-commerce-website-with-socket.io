import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiShoppingBag } from "react-icons/fi";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { PiFilesDuotone } from "react-icons/pi";
import { LuFileUp } from "react-icons/lu";
import { FaChartArea } from "react-icons/fa";

export default function DashboardSidebar({ active }) {
  return (
    <div className="w-full h-fit bg-white shadow-md rounded-md overflow-y-scroll sticky top-0 left-0 z-10">
      {/*Single Item */}
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard"} className="w-full flex items-center">
          <RxDashboard
            size={30}
            color={`${active === 1 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 1 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>
      {/*Single Item */}
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard-orders"} className="w-full flex items-center">
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden  text-[18px] font-[400] ${
              active === 2 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Orders
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard-products"} className="w-full flex items-center">
          <PiFilesDuotone
            size={30}
            color={`${active === 3 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 3 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Products
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link
          to={"/dashboard-create-product"}
          className="w-full flex items-center"
        >
          <VscNewFile
            size={30}
            color={`${active === 4 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 4 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Add Product
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard-events"} className="w-full flex items-center">
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 5 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 5 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Events
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link
          to={"/dashboard-create-event"}
          className="w-full flex items-center"
        >
          <LuFileUp size={30} color={`${active === 6 ? "crimson" : "#555"}`} />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 6 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Create Event
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard-details"} className="w-full flex items-center">
          <FaChartArea
            size={30}
            color={`${active === 7 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 7 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Shop Details
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard-messages"} className="w-full flex items-center">
          <BiMessageSquareDetail
            size={30}
            color={`${active === 8 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 8 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Shop Inbox
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard/coupons"} className="w-full flex items-center">
          <AiOutlineGift
            size={30}
            color={`${active === 9 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 9 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Discount Codes
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/dashboard-refunds"} className="w-full flex items-center">
          <HiOutlineReceiptRefund
            size={30}
            color={`${active === 10 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 10 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Refunds
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center px-6 py-4">
        <Link to={"/settings"} className="w-full flex items-center">
          <CiSettings
            size={30}
            color={`${active === 11 ? "crimson" : "#555"}`}
          />
          <h5
            className={`pl-2 800px:block hidden text-[18px] font-[400] ${
              active === 11 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
}
