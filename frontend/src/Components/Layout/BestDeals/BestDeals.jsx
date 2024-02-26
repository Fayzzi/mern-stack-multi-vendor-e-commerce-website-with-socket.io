import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";
import Loader from "../../Loader/Loader";

export default function BestDeals() {
  const [data, setData] = useState([]);
  const { homePageProducts, homePageProductLoading } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (homePageProducts) {
      const d = [...homePageProducts].sort((a, b) => {
        return b.sold_out - a.sold_out;
      });
      const firstfive = d.slice(0, 5);
      setData(firstfive);
    }
  }, [homePageProducts]);
  return (
    <div className="w-11/12 mx-auto ">
      <div className="text-[27px] text-center md:text-start font-[600] font-Roboto pb-[20px]">
        <h1>Best Deals</h1>
      </div>
      {homePageProductLoading ? (
        <Loader />
      ) : (
        <div>
          {data && data.length > 0 ? (
            <div className="grid grid-cols-2 gap-[20px] md:grid-cols-3 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data && data.map((d, i) => <ProductCard key={i} data={d} />)}
            </div>
          ) : (
            <span className="flex flex-col items-center justify-center h-[100px] text-[20px]">
              No products uploaded!!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
