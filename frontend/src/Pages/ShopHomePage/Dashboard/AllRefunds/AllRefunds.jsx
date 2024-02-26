import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import AllRefundComponents from "./COmponents/AllRefundComponents";

export default function AllRefunds() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={10} />
        </div>
        <div className="w-full">
          <AllRefundComponents />
        </div>
      </div>
    </div>
  );
}
