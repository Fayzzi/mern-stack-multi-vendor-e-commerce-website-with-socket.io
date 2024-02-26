import { useEffect } from "react";

import { useSelector } from "react-redux";
import AllProductComponent from "./Component/AllProductComponent";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";

export default function AllProducts() {
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <div>
      <DashboardHeader />
      <div className="flex  justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={3} />
        </div>
        <AllProductComponent />
      </div>
    </div>
  );
}
