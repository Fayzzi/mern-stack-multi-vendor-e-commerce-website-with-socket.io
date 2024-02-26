import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isToday, isYesterday, format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { getEveryShopProducts } from "../../../Components/Redux/Reducers/SellerReducer";
import PropTypes from "prop-types";
import { getAllShopEvents } from "../../../Components/Redux/Reducers/EventReducer";
// import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Ratings from "./RatingsComponent/Ratings";

export default function ProductDetailsInfo({ eventData, data }) {
  const [active, setActive] = useState(1);
  const { ShopProducts } = useSelector((state) => state.seller);
  const { shopEvents } = useSelector((state) => state.events);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEveryShopProducts(data?.shopInfo?._id));
    dispatch(getAllShopEvents({ id: data?.shopInfo?._id }));
  }, [dispatch]);
  //we will reduce all products in an array
  const totalReviewsofShop =
    ShopProducts &&
    ShopProducts.reduce((acc, item) => acc + item?.reviews?.length, 0);
  //we will reduce all products in an array then reduce the rating of each review
  const totalRatingsofShop =
    ShopProducts &&
    ShopProducts.reduce(
      (acc, item) =>
        acc + item?.reviews?.reduce((sum, review) => sum + review?.rating, 0),
      0
    );
  const average = totalRatingsofShop / totalReviewsofShop || 0;
  return (
    <div className="bg-[#f5f6fb] mb-12 px-3 800px:px-10 rounded ">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            onClick={(e) => {
              setActive(1);
            }}
            className="text-[#000] text-[18px] font-[600] cursor-pointer 800px:text-[20px]"
          >
            Products Details
          </h5>
          {active === 1 ? (
            <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
          ) : null}
        </div>
        {!eventData ? (
          <div className="relative">
            <h5
              onClick={(e) => {
                setActive(2);
              }}
              className="text-[#000] text-[18px] font-[600] cursor-pointer 800px:text-[20px]"
            >
              Products Reviews
            </h5>
            {active === 2 ? (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
            ) : null}
          </div>
        ) : null}

        <div className="relative">
          <h5
            onClick={(e) => {
              setActive(3);
            }}
            className="text-[#000] text-[18px] font-[600] cursor-pointer 800px:text-[20px]"
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <div>
          <p className="py-2 leading-8 text-[18px] pb-10 whitespace-pre-line">
            {data?.description}
          </p>
        </div>
      ) : null}
      {active === 2 ? (
        <div className="w-full min-h-[40vh]">
          {data &&
            data?.reviews?.map((r, i) => (
              <div key={i} className="w-full flex p-3 items-center h-fit">
                <img
                  src={"http://localhost:3000/" + r?.user?.avatar}
                  alt=""
                  className="h-[50px] object-contain rounded-full  border"
                />
                <div>
                  <div className="flex gap-2 items-center">
                    <h1 className="pl-2 text-[17px] font-[500]">
                      {r?.user?.name}
                    </h1>
                    <Ratings rating={r?.rating} />
                  </div>

                  <h1 className="text-[15px] pl-2 ">{r?.comment}</h1>
                </div>
              </div>
            ))}
        </div>
      ) : null}
      {active === 3 ? (
        <div className="w-full  block 800px:flex p-5 800px:justify-between">
          <div className="w-full  800px:w-[50%] ">
            <Link
              to={"/shop/" + data?.shopInfo?._id}
              className="flex items-center"
            >
              <img
                src={"http://localhost:3000/" + data.shopInfo?.avatar}
                className="w-[50px] h-[50px] rounded-full"
                alt=""
              />
              <div className="ml-3">
                <h3 className="pt-3 text-[15px] text-blue-400 pb-3">
                  {data?.shopInfo?.name}
                </h3>
                <h5 className="pb-2 text-[15px]">({average}/5) Ratings</h5>
              </div>
            </Link>
            <p className="pb-2 leading-7">
              {data?.shopInfo?.description || "No Description"}
            </p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex  justify-end  ">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                {data?.shopInfo?.createdAt && (
                  <>
                    {isToday(new Date(data?.shopInfo?.createdAt)) && (
                      <span>
                        Today at:
                        {format(new Date(data?.shopInfo?.createdAt), "h:mm a")}
                      </span>
                    )}
                    {isYesterday(new Date(data?.shopInfo?.createdAt)) && (
                      <span>
                        Yesterday at:
                        {format(new Date(data?.shopInfo?.createdAt), "h:mm a")}
                      </span>
                    )}
                    {!isToday(new Date(data?.shopInfo?.createdAt)) &&
                      !isYesterday(new Date(data?.shopInfo?.createdAt)) && (
                        <span className="font-[500]">
                          {format(
                            new Date(data?.shopInfo?.createdAt),
                            "dd/MMM/yyyy h:mm a"
                          )}
                        </span>
                      )}
                  </>
                )}
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products:{" "}
                <span className="font-[500]">
                  {ShopProducts && ShopProducts.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Running Events:{" "}
                <span className="font-[500]">
                  {shopEvents && shopEvents.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews:{" "}
                <span className="font-[500]">{totalReviewsofShop}</span>
              </h5>
              <Link to={"/shop/" + data?.shopInfo._id}>
                <div className="w-[150px] bg-black h-[39.5px] my-3 flex items-center justify-center rounded-xl cursor-pointer">
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
ProductDetailsInfo.propTypes = {
  data: PropTypes.shape({ shopInfo: PropTypes.object.isRequired }).isRequired,
};
