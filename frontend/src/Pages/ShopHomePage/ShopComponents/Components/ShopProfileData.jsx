import { useEffect, useState } from "react";
import ProductCard from "../../../../Components/Layout/ProductCard/ProductCard";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEveryShopProducts } from "../../../../Components/Redux/Reducers/SellerReducer";
import Loader from "../../../../Components/Loader/Loader";
import ShopEvents from "./ShopEvents/ShopEvents";
import Ratings from "../../../ProductDetailPage/ProductDetailWighet/RatingsComponent/Ratings";
import { format, isToday, isYesterday } from "date-fns";
export default function ShopProfileData() {
  const { seller, ShopProducts, shopProductLoading } = useSelector(
    (state) => state.seller
  );
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEveryShopProducts(id));
  }, [dispatch, id]);
  const [active, setActive] = useState(1);
  return (
    <div className="w-full">
      <div className="w-full flex  items-center justify-between">
        <div className="w-full  flex items-center  gap-x-5">
          <div
            onClick={(e) => setActive(1)}
            className="flex items-center select-none"
          >
            <h5
              className={`${
                active === 1 ? "text-red-500" : "text-[#333]"
              } font-[600]  lg:text-[1.1rem]  cursor-pointer`}
            >
              Shop&nbsp;Products
            </h5>
          </div>
          <div
            onClick={(e) => setActive(2)}
            className="flex items-center select-none"
          >
            <h5
              className={`${
                active === 2 ? "text-red-500" : "text-[#333]"
              } font-[600] lg:text-[1.1rem]  cursor-pointer`}
            >
              Running&nbsp;Events
            </h5>
          </div>
          <div
            onClick={(e) => setActive(3)}
            className="flex items-center select-none"
          >
            <h5
              className={`${
                active === 3 ? "text-red-500" : "text-[#333]"
              } font-[600] lg:text-[1.1rem]  cursor-pointer`}
            >
              Shop&nbsp;Reviews
            </h5>
          </div>
        </div>
        <div>
          {seller && seller?._id === id && (
            <div>
              <Link to={"/dashboard"}>
                <div className="w-[100px] bg-black h-[50px] my-3 flex items-center justify-center rounded-md cursor-pointer">
                  <span className="text-white text-[.9rem]">
                    Go&nbsp;Dashboard
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <br />
      {shopProductLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        active === 1 && (
          <div className="grid grid-cols-2 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border">
            {ShopProducts &&
              ShopProducts.map((d, i) => <ProductCard data={d} key={i} />)}
          </div>
        )
      )}
      {ShopProducts && ShopProducts.length === 0 && active === 1 ? (
        <span className="flex flex-col w-full h-full items-center justify-center">
          No products uploaded!!
        </span>
      ) : null}
      {active === 2 && <ShopEvents />}
      {active === 3 && (
        <div className="w-full min-h-screen">
          {ShopProducts &&
            ShopProducts.map((data, i) => (
              <div className="" key={i}>
                {data?.reviews?.map((d, index) => (
                  <div className="flex items-center my-3" key={index}>
                    <img
                      className="h-[50px] w-[50px] rounded-full object-cover"
                      src={"http://localhost:3000/" + d?.user?.avatar}
                      alt=""
                    />
                    <div className="">
                      <div className="flex gap-2">
                        <h1 className="pl-4 text-[15px] font-[500]">
                          {d?.user?.name}
                        </h1>
                        <Ratings rating={d?.rating} />
                      </div>
                      <h1 className="pl-4 py-1 text-[16px] text-[gray]">
                        {d?.comment}
                      </h1>
                      {d && d?.craetedAt && (
                        <>
                          {isToday(new Date(d?.craetedAt)) && (
                            <span className="pl-4 text-[14px] text-[gray]">
                              Today at{" "}
                              {format(new Date(d?.craetedAt), "h:mm a")}
                            </span>
                          )}
                          {isYesterday(new Date(d?.craetedAt)) && (
                            <span className="pl-4 text-[14px] text-[gray]">
                              Yesterday at{" "}
                              {format(new Date(d?.craetedAt), "h:mm a")}
                            </span>
                          )}
                          {!isToday(new Date(d?.craetedAt)) &&
                            !isYesterday(new Date(d?.craetedAt)) && (
                              <span className="pl-4 text-[14px] text-[gray]">
                                {format(
                                  new Date(d?.craetedAt),
                                  "yyyy-MM-dd h:mm a"
                                )}
                              </span>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
