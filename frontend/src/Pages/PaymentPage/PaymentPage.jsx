// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { useEffect } from "react";

// import { useSelector } from "react-redux";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { RxCross1 } from "react-icons/rx";
// import styles from "../../Styles/Styles";
import Header from "../../Components/Layout/Header/Header";
import CheckoutSteps from "../CheckOut/CheckOutStep/CheckOutStep";
import PaymentComponent from "./Component/PaymentComponent";
import Footer from "../../Components/Layout/Footer/Footer";

const Payment = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <PaymentComponent />
      <br />
      <br />
      <Footer />
    </div>
  );
};

export default Payment;
