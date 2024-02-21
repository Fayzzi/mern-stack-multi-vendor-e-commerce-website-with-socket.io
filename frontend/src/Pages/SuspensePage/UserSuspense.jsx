import React, { useEffect } from "react";
import Header from "../../Components/Layout/Header/Header";
import Footer from "../../Components/Layout/Footer/Footer";
import Loader from "../../Components/Loader/Loader";

export default function UserSuspense() {
  return (
    <div>
      <Header />
      <div className="min-h-screen w-full">
        <Loader />
      </div>
      <Footer />
    </div>
  );
}
