import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActivationPage from "./Pages/ActivationPage/ActivationPage";
import React, { useEffect, useState } from "react";

import HomePage from "./Pages/HomePage/HomePage";

import { useDispatch } from "react-redux";
const ProductsDetailPage = React.lazy(() =>
  import("./Pages/ProductDetailPage/ProductsDetailPage")
);
const ProfilePage = React.lazy(() => import("./Pages/ProfilePage/ProfilePage"));
import ProtectedRoutes from "./Protectedroutes/Protected";
const CheckOut = React.lazy(() => import("./Pages/CheckOut/CheckOut"));
import BecomeSeller from "./Pages/BecomeSeller/BecomeSeller";
import ShopActivationPage from "./Pages/ActivationPage/ShopActivationPage";
import ShopLoginPage from "./Pages/LoginPage/ShopLoginPage";
import SellerProtectedRoutes from "./Protectedroutes/SellerProtectRoutes";
import { GetUser } from "./Components/Redux/Reducers/UserReducer";
import { getSeller } from "./Components/Redux/Reducers/SellerReducer";
const ShopDashboard = React.lazy(() =>
  import("./Pages/ShopHomePage/Dashboard/ShopDashboard")
);
const ShopHomePage = React.lazy(() =>
  import("./Pages/ShopHomePage/ShopComponents/ShopHomePage")
);
import CreateEventPage from "./Pages/ShopHomePage/Dashboard/CreateEvents/CreateEventPage";
import AllEvents from "./Pages/ShopHomePage/Dashboard/AllEvents/AllEvents";
const AllCoupons = React.lazy(() =>
  import("./Pages/ShopHomePage/Dashboard/CouponsCode/AllCoupons")
);
import AllProducts from "./Pages/ShopHomePage/Dashboard/AllProducts/AllProducts";
import CreateProduct from "./Pages/ShopHomePage/Dashboard/CreateProduct/CreateProduct";
import { homapageProducts } from "./Components/Redux/Reducers/ProductReducer";
const Payment = React.lazy(() => import("./Pages/PaymentPage/PaymentPage"));

const OrderSuccessPage = React.lazy(() =>
  import("./Pages/PaymentPage/OrderSuccessPage/OrderSuccess")
);
import { getAllEventHomepage } from "./Components/Redux/Reducers/EventReducer";
const AllshopOrders = React.lazy(() =>
  import("./Pages/ShopHomePage/Dashboard/AllOrders/AllshopOrders")
);
const OrderDetails = React.lazy(() =>
  import("./Pages/OrderDetailsPage/OrderDetails")
);
const OrderDetailsPage = React.lazy(() =>
  import(
    "./Pages/ProfilePage/ProfileContent/AllOrders/OrderDetailsPage/OrderDetailsPage"
  )
);
const TrackOrderCom = React.lazy(() =>
  import(
    "./Pages/ProfilePage/ProfileContent/TrackOrders/TrackOrderComponent/TrackOrderCom"
  )
);
const AllRefunds = React.lazy(() =>
  import("./Pages/ShopHomePage/Dashboard/AllRefunds/AllRefunds")
);
const ShopSettings = React.lazy(() =>
  import("./Pages/ShopHomePage/Dashboard/Settings/ShopSettings")
);
const WithDrawMoney = React.lazy(() =>
  import("./Pages/ShopHomePage/Dashboard/WithDrawMoney/withDrawMoney")
);
const ShopInbox = React.lazy(() =>
  import("./Pages/ShopHomePage/Dashboard/Inbox/ShopInbox")
);
const UserInbox = React.lazy(() =>
  import("./Pages/ProfilePage/ProfileContent/Inbox/userInbox")
);
import Loader from "./Components/Loader/Loader";
import UserSuspense from "./Pages/SuspensePage/UserSuspense";
import ShopSuspense from "./Pages/SuspensePage/ShopSuspense";
import AnimatedRoutes from "./Pages/AnimatedRoutes/AnimatedRoutes";
function App() {
  const [stripeAPiKey, setStripeApiKey] = useState("");
  const [brainTreeClientToken, setbrainTreeClientToken] = useState("");

  // async function getStringApiKeys() {
  //   const { data } = await axios.get("/api/v2/payment/stripeapikey");
  //   setStripeApiKey(data.stripApiKey);
  // }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetUser());
    dispatch(homapageProducts());
    dispatch(getAllEventHomepage());
    dispatch(getSeller());
  }, [dispatch]);
  console.log(stripeAPiKey);
  return (
    <BrowserRouter>
      {/* {stripeAPiKey && (
        <Elements stripe={loadStripe(stripeAPiKey)}>
          <Routes>
            {" "}
            <Route
              path="/payment"
              element={
                <ProtectedRoutes>
                  <Payment />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </Elements>
      )} */}
      {}
      <AnimatedRoutes />
      <Routes>
        <Route element={<HomePage />} path={"/"} />

        <Route
          element={<ActivationPage />}
          path={"/activation/:activation_token"}
        />
        <Route element={<ShopLoginPage />} path={"/shoplogin"} />
        <Route
          element={<ShopActivationPage />}
          path={"/seller/activation/:activation_token"}
        />
        <Route
          path="/product/:id"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <ProductsDetailPage />
            </React.Suspense>
          }
        />

        <Route path="/createshop" element={<BecomeSeller />} />
        <Route
          path="/shop/:id"
          element={
            <React.Suspense fallback={<Loader />}>
              <ShopHomePage />
            </React.Suspense>
          }
        />
        <Route
          path="/payment"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <ProtectedRoutes>
                <Payment />
              </ProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/inbox"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <ProtectedRoutes>
                <UserInbox />
              </ProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <ShopDashboard />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard-details"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <WithDrawMoney />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard-messages"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <ShopInbox />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <AllshopOrders />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <ShopSettings />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <AllRefunds />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />

        <Route
          path="/dashboard-orders/orders/order"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <OrderDetails />
            </React.Suspense>
          }
        />
        <Route
          path="/profile/user/track/orders"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <TrackOrderCom />
            </React.Suspense>
          }
        />
        <Route
          path="/profile/user/orders"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <OrderDetailsPage />
            </React.Suspense>
          }
        />
        <Route
          path="/payment/success"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <OrderSuccessPage />
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoutes>
              <CreateProduct />
            </SellerProtectedRoutes>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <AllEvents />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />
        <Route
          path="/dashboard/coupons"
          element={
            <React.Suspense fallback={<ShopSuspense />}>
              <SellerProtectedRoutes>
                <AllCoupons />
              </SellerProtectedRoutes>
            </React.Suspense>
          }
        />

        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoutes>
              <CreateEventPage />
            </SellerProtectedRoutes>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoutes>
              <AllProducts />
            </SellerProtectedRoutes>
          }
        />

        <Route
          path="/checkout"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <ProtectedRoutes>
                <CheckOut />
              </ProtectedRoutes>
            </React.Suspense>
          }
        />

        <Route
          path="/profile"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <ProtectedRoutes>
                <ProfilePage />
              </ProtectedRoutes>
            </React.Suspense>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
