import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

export default function Ratings({ rating }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <AiFillStar
          key={i}
          color="gold"
          size={20}
          className="mr-2 cursor-pointer"
        />
      );
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      // Half star (when i is equal to the rounded-up value of rating, and rating is not an integer)
      stars.push(
        <BsStarHalf
          key={i}
          color="gold"
          size={20}
          className="mr-2 cursor-pointer"
        />
      );
    } else {
      stars.push(
        <AiOutlineStar
          key={i}
          size={20}
          color="gold"
          className="mr-2 cursor-pointer"
        />
      );
    }
  }

  return <div className="flex">{stars}</div>;
}
