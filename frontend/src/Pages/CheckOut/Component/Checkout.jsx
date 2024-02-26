import  { useState } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../../../Styles/Styles";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [phoneNumber, setphoneNumber] = useState(
    user && user.phoneNumber ? user.phoneNumber : ""
  );
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeisValid, setCouponCodeisValid] = useState(null);
  //discount price taken from coupon percentage
  const [d_price, set_d_price] = useState("");
  let shippingPrice = 0;
  const navigate = useNavigate();
  const handlePaymentPageNavigation = (e) => {
    e.preventDefault();
    if (address1 === "" || country === "" || city === "" || zipCode === "") {
      toast.error("Please provide correct Shipping Address!!");
    } else if (phoneNumber === "") {
      toast.error("Please provide correct phone Number!!");
    } else {
      //sending data from this page to payment page
      //address
      const shippingAddress = {
        address1,
        country,
        city,
        address2,
        zipCode,
        phoneNumber,
      };
      //complete order data with address and price
      const orderData = {
        subTotalPrice,
        cart,
        totalPrice,
        shippingPrice,
        discountPriceCalculated,
        shippingAddress,
        user,
      };
      //updating local storage with the updated orders array
      localStorage.setItem("latest-array", JSON.stringify(orderData));
      navigate("/payment");
    }
  };
  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);
  const handleCouponValidation = async (e) => {
    e.preventDefault();
    const name = couponCode;
    axios.get("/api/v2/coupon/get-coupon/" + name).then((response) => {
      //validating coupon code
      if (response.data.couponCode !== null) {
        const isCouponValid =
          cart &&
          cart.filter(
            (i) => i.shopInfo._id === response.data.couponCode?.shopInfo
          );

        if (isCouponValid === 0) {
          toast.error("coupon code is not valid for this shop!!");
          setCouponCode("");
        } else {
          //finding eligible product for coupon code
          //only carted item with shopId===response.data.couponCode.shopInfo(id) will be allowed
          //finding the price of all products together from same shop
          const CouponEligibleProductsTogetherPrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          //extracting the discount percentage from the database
          const couponCodeValue = response.data.couponCode.discount;
          const discountPriceFromCoupon =
            (CouponEligibleProductsTogetherPrice * couponCodeValue) / 100;
          set_d_price(discountPriceFromCoupon);
          setCouponCodeisValid(response.data.couponCode);
          setCouponCode("");
        }
      }
      if (response.data.couponCode === null) {
        toast.error("coupon code doenst exist");
        setCouponCode("");
        setCouponCodeisValid("");
      }
    });
  };

  //total of allproducts from each shop
  const eachShopData = new Map();

  for (const item of cart) {
    const shopId = item.shopInfo._id;
    if (!eachShopData.has(shopId)) {
      eachShopData.set(shopId, []);
    }
    eachShopData.get(shopId).push(item);
  }

  let eachShopDataInArray = [];
  for (const [shopId, items] of eachShopData) {
    const shopDetails = {
      shopId,
      items: items,
    };
    shopDetails.shippingTotal = shopDetails.items.reduce((acc, item) => {
      return acc + item.qty * item.discountPrice * 0.1;
    }, 0);

    shopDetails.itemPrices = shopDetails.items.reduce((acc, item) => {
      return acc + item.qty * item.discountPrice;
    }, 0);

    eachShopDataInArray.push(shopDetails);
  }
  console.log(eachShopDataInArray);
  const subTotalPrice = eachShopDataInArray.reduce(
    (acc, shop) => acc + shop.itemPrices,
    0
  );

  //10% of shipping cost
  shippingPrice = subTotalPrice * 0.1;
  //discout price from coupon
  const discountPriceCalculated = couponCodeisValid ? d_price : "";
  //total price after applying coupon
  const totalPrice = couponCodeisValid
    ? (subTotalPrice + shippingPrice - discountPriceCalculated).toFixed(2)
    : subTotalPrice + shippingPrice;

  return (
    <div className="w-full overflow-y-hidden  flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] overflow-y-hidden block 800px:flex">
        {/* Shipping Info */}
        <div className="w-full  800px:w-[65%]">
          <div className="w-full 800px:w-[95%] !bg-white border rounded-md p-5 pb-8">
            <h5 className="text-[18px] font-[500]">Shipping Address</h5>
            <br />
            <form>
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    value={user && user.name}
                    required
                    className={`${styles.input} !w-[95%]`}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="email"
                    value={user && user.email}
                    required
                    className={`${styles.input}`}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    required
                    value={phoneNumber}
                    onChange={(e) => setphoneNumber(e.target.value)}
                    className={`${styles.input} !w-[95%]`}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="number"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className={`${styles.input}`}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Country</label>
                  <select
                    className="w-[95%] border h-[40px] rounded-[5px]"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option className="block pb-2" value="">
                      Choose your country
                    </option>
                    {Country &&
                      Country.getAllCountries().map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">City</label>
                  <select
                    className="w-[95%] border h-[40px] rounded-[5px]"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option className="block pb-2" value="">
                      Choose your City
                    </option>
                    {State &&
                      State.getStatesOfCountry(country).map((item) => (
                        <option key={item.isoCode} value={item.isoCode}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Address1</label>
                  <input
                    type="address"
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className={`${styles.input} !w-[95%]`}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Address2</label>
                  <input
                    type="address"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    required
                    className={`${styles.input}`}
                  />
                </div>
              </div>

              <div></div>
            </form>
            {user && user.addresses.length > 0 && (
              <h5
                className="text-[18px] cursor-pointer inline-block"
                onClick={() => setUserInfo(!userInfo)}
              >
                Choose From saved address
              </h5>
            )}
            {userInfo && (
              <div>
                {user &&
                  user.addresses.map((item, index) => (
                    <div key={index} className="w-full flex mt-1">
                      <input
                        type="checkbox"
                        className="mr-3"
                        value={item.addressType}
                        onClick={() =>
                          setAddress1(item.address1) ||
                          setAddress2(item.address2) ||
                          setZipCode(item.zipCode) ||
                          setCountry(item.country) ||
                          setCity(item.city)
                        }
                      />
                      <h2>{item.addressType}</h2>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        {/* Cart Info */}
        <div className="w-full 800px:w-[35%] ml-0 800px:ml-9 800px:mt-0 mt-8">
          <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                subtotal:
              </h3>
              {eachShopDataInArray &&
                eachShopDataInArray.map((d, i) => (
                  <div key={i}>
                    <h1 className="font-bold">Shop{i + 1}</h1>
                    {d.items.map((data, index) => (
                      <h1 key={index}>
                        {data.name}&rarr;{data.discountPrice}
                      </h1>
                    ))}
                    Total&rarr;{d.itemPrices}
                  </div>
                ))}
            </div>
            <br />
            <div className="">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                shipping:
              </h3>
              {eachShopDataInArray &&
                eachShopDataInArray.map((d, i) => (
                  <div key={i}>
                    <h1 className="font-bold">Shop{i + 1}</h1>
                    {d.items.map((data, index) => (
                      <h1 key={index}>
                        shipping of Product{index + 1}&rarr;{" "}
                        {data.discountPrice * 0.1}
                      </h1>
                    ))}
                  </div>
                ))}
              <h5 className="text-[18px] font-[600]">
                Total&rarr;${shippingPrice}
              </h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">
                Discount:
              </h3>
              <h5 className="text-[18px] font-[600]">
                -{" "}
                {discountPriceCalculated
                  ? "$" + discountPriceCalculated.toString()
                  : null}
              </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">
              ${totalPrice}
            </h5>
            <br />
            <form onSubmit={handleCouponValidation} aria-required>
              <input
                type="text"
                className={`${styles.input} h-[40px] pl-2`}
                placeholder="Coupoun code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                required
              />
              <input
                className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Apply code"
                type="submit"
              />
            </form>
          </div>
        </div>
      </div>
      <div
        onClick={handlePaymentPageNavigation}
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

export default Checkout;
