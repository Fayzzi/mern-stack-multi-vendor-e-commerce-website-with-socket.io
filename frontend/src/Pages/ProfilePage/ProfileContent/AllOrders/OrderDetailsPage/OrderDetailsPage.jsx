import React from "react";
import Header from "../../../../../Components/Layout/Header/Header";
import Footer from "../../../../../Components/Layout/Footer/Footer";
import OrderDetailComponent from "./Components/OrderDetailComponent";

export default function OrderDetailsPage() {
  return (
    <div>
      <Header />
      <OrderDetailComponent />
      <Footer />
    </div>
  );
}
