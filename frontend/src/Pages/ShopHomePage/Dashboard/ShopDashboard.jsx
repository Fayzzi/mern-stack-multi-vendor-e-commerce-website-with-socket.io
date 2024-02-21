import React, { useEffect, useState } from "react";
import DashboardHeader from "../../../Components/Layout/Header/DashboardHeader";
import DashboardSidebar from "./SideBar/DashboardSidebar";
import DashboardHero from "./Hero/DashboardHero";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../../Components/Redux/Reducers/EventReducer";
import { getAllShopOrders } from "../../../Components/Redux/Reducers/Allorders";
import { getAllProducts } from "../../../Components/Redux/Reducers/ProductReducer";
import { getAllCoupons } from "../../../Components/Redux/Reducers/CouponsReducer";

export default function ShopDashboard() {
  const dispatch = useDispatch();

  const { seller } = useSelector((state) => state.seller);
  useEffect(() => {
    dispatch(getAllEvents({ id: seller._id }));
    dispatch(getAllShopOrders({ id: seller._id }));
    dispatch(getAllCoupons({ id: seller._id }));
    dispatch(getAllProducts({ id: seller._id }));
  }, [dispatch, seller]);
  return (
    <div className=" bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex  justify-between w-full">
        <div className="800px:w-[280px] w-fit">
          <DashboardSidebar active={1} />
        </div>
        <DashboardHero />
      </div>
    </div>
  );
}
