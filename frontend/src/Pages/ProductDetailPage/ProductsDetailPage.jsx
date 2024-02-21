import React, { useEffect, useState } from "react";
import Header from "../../Components/Layout/Header/Header";
import Footer from "../../Components/Layout/Footer/Footer";
import ProductsdetailWidget from "./ProductDetailWighet/ProductsdetailWidget";
import { useParams, useSearchParams } from "react-router-dom";
import SuggestedProductWidget from "./ProductDetailWighet/SuggestedProductWidget";
import { useSelector } from "react-redux";
import Loader from "./../../Components/Loader/Loader";
export default function ProductsDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
  const { HomepageEvents } = useSelector((state) => state.events);
  const { homePageProducts, homePageProductLoading } = useSelector(
    (state) => state.products
  );
  const [data1, setData] = useState(null);
  const [suggested, setSuggested] = useState(null);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (eventData) {
      const filteredData = HomepageEvents.find((product) => product._id === id);
      setData(filteredData);
    } else {
      if (eventData === null && homePageProducts) {
        const filteredData = homePageProducts.find(
          (product) => product._id === id
        );
        setData(filteredData);
      }
    }
  }, [homePageProducts, HomepageEvents, eventData, id]);
  console.log(data1);

  useEffect(() => {
    if (data1) {
      const filteredSuggestions = homePageProducts.filter(
        (product) => product.category === data1.category && product._id !== id
      );
      const slicedData = filteredSuggestions.slice(0, 4);
      setSuggested(slicedData);
    }
  }, [data1, homePageProducts, id]);

  console.log(suggested);
  if (homePageProductLoading) {
    return <Loader />;
  }
  return (
    <div>
      <Header />
      <div className="min-h-screen ">
        <ProductsdetailWidget eventData={eventData} data={data1} />
      </div>

      {!eventData && suggested && suggested.length > 0 && (
        <SuggestedProductWidget data={suggested} />
      )}
      <Footer />
    </div>
  );
}
