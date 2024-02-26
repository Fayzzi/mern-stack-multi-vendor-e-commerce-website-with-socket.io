import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import CreateProductComponent from "./Component/CreateProductComponent";

export default function CreateProduct() {
  return (
    <div className=" bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={4} />
        </div>
        <div className="w-full justify-center flex">
          <CreateProductComponent />
        </div>
      </div>
    </div>
  );
}
