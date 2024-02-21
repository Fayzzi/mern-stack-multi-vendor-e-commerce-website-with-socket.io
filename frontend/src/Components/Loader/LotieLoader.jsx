import React from "react";
import Lottie from "react-lottie";
import animationData from "./../../assets/Animations/Animation - 1706886028809.json";
export default function LotieLoader() {
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
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
}
