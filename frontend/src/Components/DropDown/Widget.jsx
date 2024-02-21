import React from "react";
import { useNavigate } from "react-router-dom";

export default function Widget({ categoriesData, setDropDown }) {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    navigate("/products?category=" + e.title);
    setDropDown(false);
  };
  return (
    <div className="pb-4 w-[270px]   bg-white absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((data, index) => (
          <div
            key={index}
            onClick={() => {
              handleSubmit(data);
            }}
            className="flex items-center"
          >
            <img
              src={data.image_Url}
              style={{
                width: "25px",
                height: "25px",
                objectFit: "contain",
                marginLeft: "10px",
                userSelect: "none",
              }}
              alt=""
            />
            <h3 className="m-3 cursor-pointer select-none">{data.title}</h3>
          </div>
        ))}
    </div>
  );
}
