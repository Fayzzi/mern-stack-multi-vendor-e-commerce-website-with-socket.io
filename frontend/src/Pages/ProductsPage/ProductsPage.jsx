import { useEffect, useState } from "react";
import Header from "../../Components/Layout/Header/Header";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../Components/Layout/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import Loader from "./../../Components/Loader/Loader";
import Footer from "../../Components/Layout/Footer/Footer";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { homePageProductLoading, homePageProducts } = useSelector(
    (state) => state.products
  );
  const [data, setData] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [applyFilters, setApplyFilters] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (homePageProducts) {
      let filteredData = homePageProducts;

      if (categoryData !== null) {
        filteredData = homePageProducts.filter(
          (i) => i.category === categoryData
        );
      }

      // Apply filters only if the user clicked the "Apply Filters" button

      setData(filteredData);
    }
  }, [categoryData, homePageProducts, minPrice, maxPrice, applyFilters]);

  const handleApplyFilters = () => {
    // Set applyFilters to true when the user clicks "Apply Filters"
    setApplyFilters(true);
    if (data) {
      const filteredData = data.filter((product) => {
        const productPrice = parseInt(product.discountPrice);
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
      setData(filteredData);
    }
    setApplyFilters(false);
  };

  return (
    <div>
      <Header activeHeading={3} />
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
          {/* Price Filter */}
          <div className="w-full flex justify-between ">
            <div className="md:flex sticky hidden  top-20 left-0 max-w-[280px] w-[200px] lg:min-w-[250px] lg:mr-12 mr-2 shadow border p-2 h-fit rounded  flex-col mb-4">
              <label className="mr-2 text-black mb-2">Price Range:</label>
              <label className="mr-2 text-black">Minimum:</label>
              <span>{minPrice}</span>
              <input
                type="range"
                min={0}
                max={10000}
                step={10}
                value={minPrice}
                onChange={(e) => setMinPrice(parseInt(e.target.value))}
                className="border my-2 p-1 mr-2"
              />
              <label className="mr-2  text-black">Maximum:</label>
              <span className="my-2">{maxPrice}</span>
              <input
                type="range"
                min={0}
                max={10000}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="border p-1 mb-6 ml-2"
              />
              <button
                onClick={handleApplyFilters}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply Filters
              </button>
            </div>

            {data && data.length > 0 && (
              <div className="min-h-screen">
                <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 shrink-0 xl:gap-[30px] mb-12">
                  {data.map((d, i) => (
                    <ProductCard data={d} key={i} />
                  ))}
                </div>
              </div>
            )}
            {data && data.length === 0 ? (
              <h1 className="font-bold min-h-screen flex justify-center flex-col w-full items-center   text-xl ">
                There are no products available
              </h1>
            ) : null}
          </div>
        </motion.div>
      )}
      <Footer />
    </div>
  );
}
