import { useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "./../../../assets/Animations/107043-success.json";
import Header from "../../../Components/Layout/Header/Header";
import Footer from "../../../Components/Layout/Footer/Footer";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../CheckOut/CheckOutStep/CheckOutStep";
const OrderSuccessPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const reload = () => {
      navigate("/");
    };
    window.addEventListener("popstate", reload);
  }, []);
  console.log(window.location.pathname);

  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={3} />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
