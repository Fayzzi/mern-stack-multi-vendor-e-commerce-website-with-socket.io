import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import AllEventComponent from "./Component/AllEventComponent";

export default function AllEvents() {
  return (
    <div>
      <DashboardHeader />
      <div className="w-full flex justify-between ">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={5} />
        </div>

        <div className="flex  justify-center w-full ">
          <AllEventComponent />
        </div>
      </div>
    </div>
  );
}
