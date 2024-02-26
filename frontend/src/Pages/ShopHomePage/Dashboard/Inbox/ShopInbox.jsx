import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import InboxComp from "./Components/InboxComp";

export default function ShopInbox() {
  return (
    <div className=" bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={8} />
        </div>
        <div className="w-full justify-center flex">
          <InboxComp />
        </div>
      </div>
    </div>
  );
}
