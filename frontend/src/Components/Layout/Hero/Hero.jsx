import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView, useAnimation } from "framer-motion";

export default function Hero() {
  const ref = useRef(null);
  //const iref = useRef();
  const inView = useInView(ref, {
    once: true,
  });
  // const { scrollYProgress } = useScroll({
  //   target: iref,
  //   offset: ["start start", "end start"],
  // });
  // const ybg = useTransform(scrollYProgress, [0, 1], ["0%", "500%"]);

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 75 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="relative min-h-[70vh] !overflow-x-hidden !overflow-y-hidden 800px:min-h-[80vh] w-full bg-cover bg-no-repeat flex items-center"
      style={{
        // x: ybg,
        backgroundImage:
          "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)",
      }}
      ref={ref}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.6, delay: 1, ease: "easeInOut" }}
        className="w-11/12 mx-auto 800px:w-[70%]"
      >
        <h1 className="text-[2.4rem] leading-[1.2] 800px:text-[3.7rem] text-[#3d3a3a] font-[600] capitalize">
          Best Collection for <br /> home Decoration
        </h1>
        <p className="pt-5 text-[16px] font-Poppins font-[400] text-black">
          Explore ShopO, your premier online destination where style meets
          convenience. Our curated selection embodies quality, sophistication,
          and contemporary design, offering fashion-forward apparel and
          cutting-edge electronics. Immerse yourself in a seamless fusion of
          fashion and functionality, navigating a user-friendly interface that
          combines aesthetics with ease of use. Enjoy stress-free shopping with
          our secure checkout process. Welcome to a world of limitless
          possibilities – elevate your lifestyle with the click of a button at
          ShopO.
        </p>
        <Link to="/products" className="inline-block">
          <div className="w-[150px] bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer">
            <span className="text-white font-Poppins font-[400] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
