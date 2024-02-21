import React from "react";
import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import WithDraw from "./Components/WithDraw";

export default function WithDrawMoney() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex  justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={7} />
        </div>

        <div className="w-full flex justify-center">
          <WithDraw />{" "}
        </div>
      </div>
    </div>
  );
}
