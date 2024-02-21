import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import AllCouponComponents from "./Components/AllCouponComponents";

export default function AllCoupons() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={9} />
        </div>
        <div className="flex justify-center w-full">
          <AllCouponComponents />
        </div>
      </div>
    </div>
  );
}
