import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";
import Loader from "./../../../Components/Loader/Loader";
import { Link } from "react-router-dom";
export default function FeaturedProducts() {
  const { homePageProducts, homePageProductLoading } = useSelector(
    (state) => state.products
  );

  return (
    <div>
      <div className="w-11/12 mx-auto">
        <div className=" flex justify-between text-center items-center md:text-start  font-Roboto pb-[20px]">
          <h1 className="text-[27px] font-[600]">Featured Products</h1>
          <Link
            to={"/products"}
            className="text-[blue] text-[15px] cursor-pointer "
          >
            View All &rarr;
          </Link>
        </div>
        {homePageProductLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 gap-[20px] md:grid-cols-3 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {homePageProducts && homePageProducts.length > 0 ? (
              homePageProducts.map((d, i) => <ProductCard data={d} key={i} />)
            ) : (
              <span className="flex flex-col items-center w-fulltext-ce justify-center h-[100px] text-[20px]">
                No products uploaded!!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
