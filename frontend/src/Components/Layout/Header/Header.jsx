import React, { useState } from "react";
import { Link } from "react-router-dom";
import { productData, categoriesData, navItems } from "./../../../static/data";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  AiFillAlert,
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShop,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BiMenuAltLeft } from "react-icons/bi";
import Widget from "../../../Components/DropDown/Widget.jsx";
import OpenCart from "../../OpenCart/OpenCart.jsx";
import OpenWishlist from "../../OpenWishlist/OpenWishlist.jsx";
import { RxCross1 } from "react-icons/rx";

export default function Header({ activeHeading }) {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const { homePageProducts, homePageProductLoading } = useSelector(
    (state) => state.products
  );
  const { cart } = useSelector((state) => state.cart);
  const { fav } = useSelector((state) => state.fav);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropdown, setDropDown] = useState(false);

  const [open, setopen] = useState(false);
  {
    /* 2nd part start */
  }
  const [opencart, setopenCart] = useState(false);
  const [openWishlist, setopenWishlist] = useState(false);
  const handleSearch = (e) => {
    const searched = e.target.value.trim();
    setSearch(searched);
    if (searched === "") {
      setSearchData(null);
    } else {
      const filteredProductData =
        homePageProducts &&
        homePageProducts.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      setSearchData(filteredProductData);
    }
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 250) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  return (
    <div className=" bg-opacity-10">
      <div className="w-11/12  mx-auto">
        <div className="hidden mb-4 800px:h-[50px] 800px:pt-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to={"/"}>
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
              />
            </Link>
          </div>
          {/*SearchBox*/}
          <div className="w-[50%] relative">
            <input
              type="text"
              value={search}
              name="search"
              onChange={handleSearch}
              placeholder="Search product here..."
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-0 cursor-pointer top-1"
            />
            {searchData && searchData.length !== 0 ? (
              <div className="absolute w-full min-h-fit bg-slate-50 shadow-sm z-[9] p-4">
                {searchData &&
                  searchData.slice(0, 5).map((data, index) => {
                    const name = data.name;
                    const Productname = name.replace(/\s+/g, "-");
                    return (
                      <Link key={index} to={"/product/" + data._id}>
                        <div className="w-full my-2 bg-gray-100 space-y-2 flex items-start py-3">
                          <img
                            src={"http://localhost:3000/" + data?.images[0]}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{data?.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>
          <div className="w-[150px] bg-black h-[50px] my-3 text-white flex items-center justify-center rounded-xl cursor-pointer">
            {isSeller ? (
              <Link to={"/dashboard/"}>
                <h1 className="text-[#fff] flex items-center">
                  {seller.name} <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            ) : (
              <Link to={"/createshop"}>
                <h1 className="text-[#fff] flex items-center">
                  Become Seller <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-[1]" : null
        } transition hidden  800px:flex items-center  justify-between w-full bg-[#3321cb] h-[70px]`}
      >
        <div className="w-11/12 mx-auto relative  justify-between flex items-center ">
          {/* Categories */}
          <div>
            {/*hidden an dup */}
            <div
              onClick={() => setDropDown(!dropdown)}
              className="relative h-[60px] hidden  mt-[10px] min-w-[270px]  1000px:block"
            >
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white text-lg font-[500] select-none rounded-t-md">
                All Categories
              </button>
              <IoIosArrowDown
                size={30}
                onClick={() => {
                  setDropDown(!dropdown);
                }}
                className="absolute right-2 top-4 cursor-pointer"
              />
              {dropdown ? (
                <Widget
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/*Navbar */}
          <div className="flex items-center">
            <div className="flex items-center">
              {navItems &&
                navItems.map((data, i) => (
                  <div key={i}>
                    <Link
                      to={data.url}
                      className={`${
                        activeHeading === i + 1
                          ? "text-green-400"
                          : "text-white"
                      } font-[500] px-6 cursor-pointer`}
                    >
                      {data.title}
                    </Link>
                  </div>
                ))}
            </div>
          </div>
          {/*Heart and cart */}
          <div className="flex">
            <div className="flex items-center">
              <div
                onClick={(e) => {
                  setopenWishlist(true);
                }}
                className="relative cursor-pointer mr-[15px]"
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-green-400 w-4 h-4  p-0 m-0 text-white text-[12px] leading-tight text-center">
                  {fav && fav.length.toString()}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => {
                  setopenCart(true);
                }}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 / 83%)"
                />
                <span className="absolute  right-0 top-0 rounded-full bg-green-400 w-4 h-4 p-0 m-0 text-white text-[12px] leading-tight text-center">
                  {cart.length}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to={"/profile"}>
                    <img
                      className="h-[30px] w-[30px] object-contain rounded-full"
                      src={"http://localhost:3000/" + user.avatar}
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to={"/login"}>
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>
            {/*Cart opener */}
            {opencart ? <OpenCart setopen={setopenCart} /> : null}
            {/*Cart opener */}
            {openWishlist ? <OpenWishlist setopen={setopenWishlist} /> : null}
          </div>
        </div>
      </div>
      {/*Mobile Header */}

      <div
        className={`${
          active === true ? "fixed top-0 left-0 z-50" : null
        } 800px:hidden  flex justify-between items-center h-[65px] bg-white w-full`}
      >
        <div>
          <BiMenuAltLeft
            onClick={(e) => {
              setopen(true);
            }}
            size={30}
            className="ml-2 cursor-pointer"
          />
        </div>
        {open ? (
          <div className="bg-[#0000005f]  w-full shadow-sm h-full z-50 fixed top-0 left-0">
            <div className="w-[70%] relative bg-white h-full p-4 ">
              <div className="flex justify-between  items-center">
                <div className="relative cursor-pointer select-none">
                  <AiOutlineHeart size={30} />
                  <span className="absolute top-0 right-0 text-[12px] h-4 w-4 bg-green-400 rounded-full flex items-center justify-center leading-tight text-white">
                    {fav && fav.length}
                  </span>
                </div>
                <RxCross1
                  className="mr-2 cursor-pointer"
                  size={25}
                  onClick={(e) => setopen(false)}
                />
              </div>
              <div>
                <input
                  placeholder="Search items here..."
                  value={search}
                  onChange={handleSearch}
                  type="text"
                  className="w-full border my-6 p-2 border-blue-700 rounded-md"
                />
                {searchData && searchData.length !== 0 ? (
                  <div className="p-4 w-full h-[400px] overflow-auto mb-3">
                    {searchData.map((d, i) => {
                      const name = d.name;
                      const productName = name.replace(/\s+/g, "-");
                      return (
                        <Link
                          to={"/product/" + productName}
                          className="w-full flex py-2 bg-gray-200 px-2 items-center  my-2"
                          key={i}
                        >
                          <img
                            src={d.image_Url[0].url}
                            className="h-10 w-10 object-contain mr-3"
                            alt=""
                          />
                          <h1 className="text-[12px] line-clamp-3">{d.name}</h1>
                        </Link>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
                {navItems &&
                  navItems.map((data, i) => (
                    <Link
                      to={data.url}
                      className={`${
                        activeHeading === i + 1
                          ? "bg-green-500  text-white"
                          : "hover:bg-green-300 transition duration-300 ease-in-out"
                      } w-fit p-3 rounded-md select-none`}
                      key={i}
                    >
                      {data.title}
                    </Link>
                  ))}
              </div>
              {isSeller === false ? (
                <div className="mt-7 ml-3">
                  <Link
                    to={"/createshop"}
                    className="p-3 bg-black rounded-md text-white flex items-center justify-center w-fit"
                  >
                    <h1>Become a Seller</h1>
                    <IoIosArrowForward
                      color="white"
                      className="ml-2 shrink-0"
                      size={20}
                    />
                  </Link>
                </div>
              ) : (
                <div className="mt-7 ml-3">
                  <Link
                    to={"/dashboard"}
                    className="p-3 bg-black rounded-md text-white flex items-center justify-center w-fit"
                  >
                    <h1>{seller.name}</h1>
                    <IoIosArrowForward
                      color="white"
                      className="ml-2 shrink-0"
                      size={20}
                    />
                  </Link>
                </div>
              )}
              {isAuthenticated === false ? (
                <div className="absolute bottom-6 flex items-center">
                  <Link
                    to={"/login"}
                    className="p-3 w-fit rounded-md text-[18px] font-[600]"
                  >
                    Login
                  </Link>
                  <h1 className="select-none">/ </h1>
                  <Link
                    to={"/signUp"}
                    className="p-3 w-fit rounded-md text-[18px] font-[600]"
                  >
                    SignUp
                  </Link>
                </div>
              ) : (
                <Link
                  to={"/profile"}
                  className="absolute bottom-6 border p-3 w-[90%] border-gray-400 justify-between rounded-lg items-center flex gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={"http://localhost:3000/" + user.avatar}
                      className="h-[50px] object-cover rounded-full w-[50px]"
                      alt=""
                    />
                    <h1 className="font-[600] text-[18px]">{user.name}</h1>
                  </div>
                  <IoIosArrowForward size={30} />
                </Link>
              )}
            </div>
          </div>
        ) : null}
        <div>
          <Link to={"/"}>
            <img
              src="https://shopo.quomodothemes.website/assets/images/logo.svg"
              alt=""
            />
          </Link>
        </div>
        <div className="relative cursor-pointer">
          <AiOutlineShoppingCart size={30} className="mr-2" />
          <span className="absolute top-0 right-2 w-4 h-4 text-white text-sm bg-green-400 rounded-full flex items-center justify-center leading-5 shrink-0">
            {cart.length}
          </span>
        </div>
      </div>
    </div>
  );
}
