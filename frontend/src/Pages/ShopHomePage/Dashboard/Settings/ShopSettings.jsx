import Footer from "../../../../Components/Layout/Footer/Footer";
import ShopSettComponents from "./Components/ShopSettComponents";
import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";

export default function ShopSettings() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex  justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={11} />
        </div>

        <div className="w-full flex justify-center">
          <ShopSettComponents />{" "}
        </div>
      </div>
    </div>
  );
}
