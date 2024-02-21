import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductDetailsInfo from "./ProductDetailsInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  addtoFavorites,
  removeFromFavorites,
} from "../../../Components/Redux/Reducers/FavoriteItems";
import { toast } from "react-toastify";
import { addToCart } from "../../../Components/Redux/Reducers/CartItems";
import { getEveryShopProducts } from "../../../Components/Redux/Reducers/SellerReducer";
import { getAllShopEvents } from "../../../Components/Redux/Reducers/EventReducer";
import axios from "axios";
import CountDown from "../../../Components/CountDown/CountDown";
export default function ProductsdetailWidget({ data, eventData }) {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const { fav } = useSelector((state) => state.fav);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { ShopProducts } = useSelector((state) => state.seller);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { shopEvents } = useSelector((state) => state.events);
  useEffect(() => {
    dispatch(getEveryShopProducts(data?.shopInfo?._id));
    dispatch(getAllShopEvents({ id: data?.shopInfo?._id }));
  }, [dispatch]);
  //we will reduce all products in an array
  const totalReviewsofShop =
    ShopProducts &&
    ShopProducts.reduce((acc, item) => acc + item.reviews.length, 0);
  //we will reduce all products in an array then reduce the rating of each review
  const totalRatingsofShop =
    ShopProducts &&
    ShopProducts.reduce(
      (acc, item) =>
        acc + item.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );
  const average = totalRatingsofShop / totalReviewsofShop || 0;
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const cartHandeler = (date) => {
    const checkExisting = cart.find((i) => i._id === data._id);
    if (checkExisting) {
      toast.dismiss();
      toast.error("Product is already in cart!!");
    } else {
      const cartData = { ...data, qty: count };
      dispatch(addToCart(cartData));
      toast.dismiss();
      toast.success("Product is  added to Cart!!");
    }
  };
  useEffect(() => {
    setSelect(0);
  }, [data]);

  const Increment = () => {
    setCount(count + 1);
  };
  const handleMessageSubmit = async (data) => {
    if (isAuthenticated) {
      const groupTitle = user?._id + data?._id;
      const userId = user?._id;
      const sellerId = data?.shopInfo?._id;
      console.log(groupTitle, "/-/", userId, "/-/", sellerId);
      await axios
        .post("/api/v2/conversation/create-new-conversation", {
          groupTitle,
          userId,
          sellerId,
        })
        .then((response) => {
          navigate("/inbox?" + response.data.newConversationRoom._id);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
        });
    } else {
      toast.error("Please login first!!");
    }
  };
  const addtofavoritesHandeler = (data) => {
    dispatch(addtoFavorites(data));
  };
  const removefromFavHandeler = (data) => {
    dispatch(removeFromFavorites(data));
  };
  console.log("eventData:", eventData);
  return (
    <div>
      {data ? (
        <div className="w-11/12 mx-auto ">
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={"http://localhost:3000/" + data?.images[select]}
                  alt=""
                  className="800px:w-[90%]  1100px:h-[400px] 800px:h-[550px] object-contain w-full border"
                />
                {data?.images?.length > 1 && (
                  <div className="w-[100%] my-6  ">
                    <Slider
                      className="slider"
                      dots={true}
                      infinite={false}
                      speed={500}
                      slidesToShow={2}
                      slidesToScroll={1}
                    >
                      {data.images.map((image, index) => (
                        <div key={index}>
                          <img
                            onClick={(e) => setSelect(index)}
                            src={`http://localhost:3000/${image}`}
                            alt=""
                            className="800px:w-[90%] 1100px:h-[300px] 800px:h-[350px] object-contain w-full "
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
              </div>
              <div className="w-full 800px:w-[50%] p-8">
                <h1 className="text-[25px] font-[600]  font-Roboto text-[#333]">
                  {data?.name}
                </h1>
                <p>{data?.description}</p>
                <div className="flex pt-3">
                  <h1 className="font-bold text-[18px] text-[#333] font-Roboto">
                    {data?.discountPrice}$
                  </h1>
                  <h3 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through">
                    {data?.originalPrice ? data?.originalPrice + "$" : null}
                  </h3>
                </div>
                {eventData ? <CountDown data={data} /> : null}
                <div className="flex items-center   mt-12 justify-between pr-3">
                  <div>
                    <button
                      onClick={decrementCount}
                      className="bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      -
                    </button>
                    {
                      <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[9px]">
                        {count}
                      </span>
                    }
                    <button
                      onClick={Increment}
                      className="bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {fav.find((i) => i._id === data._id) ? (
                      <AiFillHeart
                        size={22}
                        className="cursor-pointer"
                        color={
                          fav.find((i) => i._id === data._id) ? "red" : "black"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          removefromFavHandeler(data);
                        }}
                        title="Remove from wish list"
                      />
                    ) : (
                      <AiOutlineHeart
                        className="cursor-pointer"
                        size={22}
                        color={
                          fav.find((i) => i._id === data._id) ? "red" : "black"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          addtofavoritesHandeler(data);
                        }}
                        title="Add to wish list"
                      />
                    )}
                  </div>
                </div>
                <div
                  onClick={(e) => cartHandeler(data)}
                  className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer mt-6"
                >
                  <span className="text-white flex gap-3">
                    Add to cart
                    <AiOutlineShoppingCart size={23} />
                  </span>
                </div>
                <div className="flex items-center justify-between  mt-8 p-3">
                  <Link
                    to={"/shop/" + data?.shopInfo?._id}
                    className="flex items-center gap-3  "
                  >
                    <img
                      src={"http://localhost:3000/" + data.shopInfo?.avatar}
                      className="w-[50px] h-[50px] rounded-full"
                      alt=""
                    />
                    <div>
                      <h1 className="pt-3 text-[15px] text-blue-400 pb-3">
                        {data?.shopInfo?.name}
                      </h1>
                      <h3 className="pb-3 text-[15px]">
                        ({average}/5) Ratings
                      </h3>
                    </div>
                  </Link>
                  <div
                    onClick={() => {
                      handleMessageSubmit(data);
                    }}
                    className="w-[150px] bg-[#6443d1] h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsInfo eventData={eventData} data={data} />
        </div>
      ) : (
        <span className="flex flex-col items-center justify-center h-full min-h-screen text-[20px]">
          Some Error has occured please go back to homepage
        </span>
      )}
    </div>
  );
}
ProductsdetailWidget.propTypes = {
  data: PropTypes.object.isRequired,
};
