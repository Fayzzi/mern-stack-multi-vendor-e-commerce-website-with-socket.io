import { brandingData, categoriesData } from "../../../static/data";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-11/12 mx-auto hidden sm:block">
        <div className="branding my-12 flex justify-between w-full border shadow-sm bg-white p-5 rounded-md">
          {brandingData &&
            brandingData.map((data, i) => (
              <div className="flex items-start" key={i}>
                {data.icon}
                <div className="px-3 ">
                  <h3 className="font-bold text-sm md:text-base">
                    {data.title}
                  </h3>
                  <p className="text-xs md:text-sm">{data.Description}</p>
                </div>
              </div>
            ))}
        </div>
        <div
          id="categories"
          className="w-11/12 mx-auto bg-white p-2 rounded-lg mb-12"
        >
          <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl-gap-[30px]">
            {categoriesData &&
              categoriesData.map((data, i) => {
                const handleSubmit = (data) => {
                  navigate("/products?category=" + data.title);
                };
                return (
                  <div
                    className="w-full relative h-[100px] transition-all duration-500 hover:shadow flex items-center hover:-translate-y-2 hover:scale-[1.1] justify-between cursor-pointer  hover:bg-slate-200 rounded-md p-2 overflow-hidden"
                    key={data.id}
                    onClick={() => handleSubmit(data)}
                  >
                    <h5 className="text-[18px] leading-[1.3]">{data.title}</h5>
                    <img
                      src={data.image_Url}
                      className="w-[120px] object-cover"
                      alt=""
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
