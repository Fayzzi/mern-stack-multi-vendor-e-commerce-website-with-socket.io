import React from "react";
import Lottie from "react-lottie";
import animationData from "./../../assets/Animations/Animation - 1704350590431.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};
export default Loader;
