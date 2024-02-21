import React from "react";
import DashboardHeader from "../../Components/Layout/Header/DashboardHeader";
import OrdersDetailComponent from "./Components/OrdersDetailComponent";
import Footer from "../../Components/Layout/Footer/Footer";

export default function OrderDetails() {
  return (
    <div>
      <DashboardHeader />
      <OrdersDetailComponent />
      <Footer />
    </div>
  );
}
