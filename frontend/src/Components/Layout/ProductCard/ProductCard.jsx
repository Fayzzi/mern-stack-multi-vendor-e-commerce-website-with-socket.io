import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { PropTypes } from "prop-types";
import ProductsDetailCard from "./../POPUP/ProductsDetailCard";
import { useDispatch, useSelector } from "react-redux";
import {
  addtoFavorites,
  removeFromFavorites,
} from "./../../Redux/Reducers/FavoriteItems";
import { toast } from "react-toastify";
import { addToCart } from "../../Redux/Reducers/CartItems";
import Ratings from "../../../Pages/ProductDetailPage/ProductDetailWighet/RatingsComponent/Ratings";

const ProductCard = ({ data }) => {
  const { fav } = useSelector((state) => state.fav);
  const { cart } = useSelector((state) => state.cart);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const FavoriteHandler = () => {
    dispatch(addtoFavorites(data));
    toast.dismiss();
    toast.success("Item is added to favorites!!");
  };

  const FavoriteRemoverHandler = () => {
    dispatch(removeFromFavorites(data));
    toast.dismiss();
    toast.success("Item is removed from favorites!!");
  };

  const cartHandler = () => {
    const checkExisting = cart.find((i) => i._id === data._id);
    if (checkExisting) {
      toast.error("Product is already in cart!!");
    } else {
      const cartData = { ...data, qty: 1 };
      dispatch(addToCart(cartData));
      toast.dismiss();
      toast.success("Product is added to Cart!!");
    }
  };
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.6 }}
      className="w-full max-h-[430px] border h-fit pb-2 px-2 bg-white rounded-lg shadow-sm relative cursor-pointer"
    >
      <div className="flex justify-end"></div>
      <Link to={"/product/" + data._id}>
        <LazyLoadImage
          effect="opacity"
          src={"http://localhost:3000/" + data?.images[0]}
          className="w-full object-contain h-[200px]"
          alt=""
        />
      </Link>
      <Link to={"/shop/" + data?.shopInfo?._id}>
        <h5 className="pt-3 text-[15px] text-blue-400 pb-3">
          {data?.shopInfo?.name}
        </h5>
      </Link>
      <Link to={"/product/" + data._id}>
        <h4 className="pb-3 font-[500]">
          {data?.name?.length > 40
            ? data?.name?.slice(0, 40) + "..."
            : data?.name}
        </h4>
        <div className="">
          <Ratings rating={data?.rating} />
        </div>
        <div className="py-2 flex items-center justify-between ">
          <div className="flex">
            <h5 className="font-bold text-[18px] text-[#333] font-Roboto">
              {data?.discountPrice === 0
                ? data?.originalPrice
                : data?.discountPrice}
              $
            </h5>
            <h4 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through">
              {data?.originalPrice ? data?.originalPrice + "$" : null}
            </h4>
          </div>
          <span className="text-[17px] font-[400] text-[#68d284]">
            {data?.sold_out} sold
          </span>
        </div>
      </Link>
      {fav.find((i) => i._id === data._id) ? (
        <AiFillHeart
          size={22}
          className="cursor-pointer absolute right-2 top-5"
          color={fav.find((i) => i._id === data._id) ? "red" : "black"}
          onClick={(e) => {
            e.preventDefault();
            FavoriteRemoverHandler(data);
          }}
          title="Remove from wish list"
        />
      ) : (
        <AiOutlineHeart
          className="cursor-pointer absolute right-2 top-5"
          size={22}
          color={fav.find((i) => i._id === data._id) ? "red" : "black"}
          onClick={(e) => {
            e.preventDefault();
            FavoriteHandler(data);
          }}
          title="Add to wish list"
        />
      )}
      <AiOutlineEye
        className="cursor-pointer absolute right-2 top-14"
        size={22}
        color={"black"}
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        title="QuickView Product"
      />
      <AiOutlineShoppingCart
        className="cursor-pointer absolute right-2 top-24"
        size={25}
        color={"black"}
        onClick={(e) => {
          cartHandler(data);
        }}
        title="Add to cart"
      />
      {open ? <ProductsDetailCard setOpen={setOpen} data={data} /> : null}
    </motion.div>
  );
};

ProductCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProductCard;
