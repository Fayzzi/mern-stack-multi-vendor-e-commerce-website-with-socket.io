import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LogoutSeller,
  getEveryShopProducts,
} from "../../../../Components/Redux/Reducers/SellerReducer";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../../Components/Loader/Loader";

export default function Shopinfo() {
  const [shopData, setShopData] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const [loading, setLoading] = useState(true);
  const { ShopProducts, shopProductLoading } = useSelector(
    (state) => state.seller
  );
  //we will reduce all products in an array
  const totalReviewsofShop =
    ShopProducts &&
    ShopProducts.reduce((acc, item) => acc + item.reviews.length, 0);
  //all ratings/total reviews
  const totalRatingsofShop =
    ShopProducts &&
    ShopProducts.reduce(
      (acc, item) =>
        acc + item.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );
  const average = totalRatingsofShop / totalReviewsofShop || 0;
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEveryShopProducts(id));
  }, [dispatch]);
  useEffect(() => {
    axios
      .get("/api/v2/shop/showShop/" + id)
      .then(({ data }) => {
        setShopData(data.shopData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  const logouthandler = async (e) => {
    e.preventDefault();
    dispatch(LogoutSeller());
    // localStorage.clear();
  };

  if (loading || shopProductLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="w-full py-5">
        <div className="w-full flex items-center justify-center">
          <img
            className="h-[8rem] w-[8rem] object-cover rounded-full"
            src={`http://localhost:3000/${shopData?.avatar}`}
            alt=""
          />
        </div>
        <h3 className="text-center py-2 text-[1.1rem]">
          {shopData?.name || "N/A"}
        </h3>
        <p className="text-[1rem] text-[#000000a6] flex items-center px-[10px]">
          {shopData?.description || "No description available"}
        </p>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[1rem]">Address:</h5>
        <h4 className="text-[#000000a6] text-[1rem]">
          {shopData?.address || "N/A"}
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[1rem]">Phone Number:</h5>
        <h4 className="text-[#000000a6] text-[1rem]">
          {shopData?.phoneNumber || "N/A"}
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[1rem]">Total Products:</h5>
        <h4 className="text-[#000000a6] text-[1rem]">
          {ShopProducts && ShopProducts.length}
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[1rem]">Shop Rating:</h5>
        <h4 className="text-[#000000a6] text-[1rem]">{average}/5</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[1rem]">Joined on:</h5>
        <h4 className="text-[#000000a6] text-[1rem]">
          {shopData?.createdAt?.slice(0, 10) || "N/A"}
        </h4>
      </div>
      {seller && seller._id === shopData._id && (
        <div className="py-3 px-4">
          <Link
            to={"/settings"}
            className="w-[full] bg-black h-[50px] my-3 flex items-center justify-center rounded-md cursor-pointer"
          >
            <span className="text-white">Edit Shop</span>
          </Link>
          <div
            onClick={logouthandler}
            className="w-[full] bg-black h-[50px] my-3 flex items-center justify-center rounded-md cursor-pointer"
          >
            <span className="text-white">LogOut</span>
          </div>
        </div>
      )}
    </div>
  );
}
