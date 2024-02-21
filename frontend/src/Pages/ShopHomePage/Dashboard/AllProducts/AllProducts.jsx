import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import AllProductComponent from "./Component/AllProductComponent";
import DashboardSidebar from "../SideBar/DashboardSidebar";
import DashboardHeader from "../../../../Components/Layout/Header/DashboardHeader";
import { getAllProducts } from "../../../../Components/Redux/Reducers/ProductReducer";

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
