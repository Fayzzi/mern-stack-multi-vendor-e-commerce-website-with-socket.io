import React from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, Routes, Route } from "react-router-dom";
import UserSuspense from "../SuspensePage/UserSuspense";
import EventsPage from "../Events/EventsPage";
import FaqPage from "../FAQPage/FaqPage";
import Bestselling from "../Best-selling/Best-selling";
import ProductsPage from "../ProductsPage/ProductsPage";
import LoginPage from "../LoginPage/LoginPage";
import SignUp from "../SignUp/SignUp";
export default function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route element={<LoginPage />} path={"/login"} />
        <Route element={<SignUp />} path={"/signUp"} />
        <Route
          path="/products"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <ProductsPage />
            </React.Suspense>
          }
        />
        <Route
          path="/best-selling"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <Bestselling />
            </React.Suspense>
          }
        />
        <Route
          path="/events"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <EventsPage />
            </React.Suspense>
          }
        />
        <Route
          path="/faq"
          element={
            <React.Suspense fallback={<UserSuspense />}>
              <FaqPage />
            </React.Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
