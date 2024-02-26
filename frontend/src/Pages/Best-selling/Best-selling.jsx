import { useEffect, useState } from "react";
import Header from "../../Components/Layout/Header/Header";
import ProductCard from "../../Components/Layout/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import Footer from "../../Components/Layout/Footer/Footer";
import { motion } from "framer-motion";

export default function Bestselling() {
  const [data, setData] = useState([]);
  const { homePageProducts, homePageProductLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (homePageProducts) {
      const sortedProducts = [...homePageProducts].sort((a, b) => {
        return b.sold_out - a.sold_out; // Return a positive number for descending order
      });

      setData(sortedProducts);
    }
  }, [homePageProducts]);

  return (
    <div>
      <Header activeHeading={2} />
      <br />
      <br />
      {homePageProductLoading ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ x: "100vw" }} // Start off-screen to the right
          animate={{ x: 0, transition: { duration: 0.8, delay: 0.25 } }} // Slide in from right
          exit={{ x: "100vw", transition: { duration: 0.8, delay: 0.1 } }} // Slide out to the left
          className="w-11/12 mx-auto"
        >
          {homePageProducts && homePageProducts.length > 0 && (
            <div className="min-h-screen">
              <div className="grid grid-cols-2 gap-[20px] md:grid-cols-3 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                {data && data.map((d, i) => <ProductCard data={d} key={i} />)}
              </div>
            </div>
          )}
          {homePageProducts?.length === 0 ? (
            <h1 className="font-bold text-xl text-center">
              There are no products available
            </h1>
          ) : null}
        </motion.div>
      )}
      <Footer />
    </div>
  );
}
