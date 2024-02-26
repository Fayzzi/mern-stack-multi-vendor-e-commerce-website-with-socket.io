import Header from "../../Components/Layout/Header/Header";
import CheckoutSteps from "./CheckOutStep/CheckOutStep";
import Checkout from "./Component/Checkout";
import Footer from "../../Components/Layout/Footer/Footer";
export default function CheckOut() {
  return (
    <div className="bg-gray-400 bg-opacity-10">
      <Header />
      <br />
      <br />
      <div className="min-h-screen">
        <div className="w-screen  flex items-center justify-center">
          <CheckoutSteps active={1} />
        </div>
        <Checkout />
      </div>
      <Footer />
    </div>
  );
}
