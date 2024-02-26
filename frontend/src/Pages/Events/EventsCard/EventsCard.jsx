import { useEffect, useRef, useState } from "react";
import CountDown from "../../../Components/CountDown/CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../Components/Redux/Reducers/CartItems";
import { motion, useAnimation, useInView } from "framer-motion";
export default function EventsCard({ data }) {
  const [currentImage, setCurrentImage] = useState(0);
  const { cart } = useSelector((state) => state.cart);
  const ref = useRef();
  const inView = useInView(ref, {
    once: true,
  });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const dispatch = useDispatch();
  // const nextImage = () => {
  //   const newimage = (currentImage + 1) % data?.images.length;
  //   setCurrentImage(newimage);
  // };
  // useEffect(() => {
  //   const timer = setInterval(nextImage, 3000);
  //   return () => clearInterval(timer);
  // }, [currentImage]);
  const addtocartHandeler = (data) => {
    const checkExisting = cart && cart.find((i) => i._id === data._id);
    if (checkExisting) {
      toast.dismiss();
      toast.error("Already added too cart!!");
    } else {
      const cartData = { ...data, qty: 1 };
      dispatch(addToCart(cartData));
      toast.dismiss();
      toast.success("Product is  added to Cart!!");
    }
  };
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
      className={`w-full block shadow-md border bg-white rounded-lg ${"unset  mb-12"} lg:flex p-2 `}
    >
      <div className="lg:w-[50%] w-full">
        <div
          style={{
            backgroundImage: `url(http://localhost:3000/${data?.images[currentImage]})`,
          }}
          className=" h-[300px] bg-contain bg-center bg-no-repeat transition-all ease-in-out duration-500 w-[50%] object-contain lg:w-[50%] m-auto"
        ></div>
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className="text-[25px] font-[600] font-Roboto text-[#333]">
          {data?.name}
        </h2>
        <p>{data?.description.slice(0, 550) + "...."}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-red-400 pr-3 line-through">
              {data?.originalPrice}
            </h5>
            <h5 className="font-bold text-[20px] text-black font-Roboto">
              {data?.discountPrice}
            </h5>
          </div>
          <div>
            <span className="pr-3 font-[400] text-[17px] text-green-400">
              {data?.sold_out} Sold
            </span>
          </div>
        </div>
        <CountDown data={data} />
        <div className="flex gap-4">
          <Link
            to={"/product/" + data._id + "?isEvent=true"}
            className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
          >
            <span className="text-white">Check&nbsp;Out</span>
          </Link>
          <div
            onClick={(e) => addtocartHandeler(data)}
            className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
          >
            <span className="text-white">Add to&nbsp;Cart</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
