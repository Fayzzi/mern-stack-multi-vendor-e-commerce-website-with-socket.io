import Shopinfo from "./Components/Shopinfo";
import ShopProfileData from "./Components/ShopProfileData";
export default function ShopHomePage() {
  return (
    <div className=" bg-[#f5f5f5]">
      <div className="w-11/12 mx-auto ">
        <div className="w-full flex py-10 justify-between">
          <div className="w-[25%] hidden md:block bg-[#fff] rounded-sm shadow-sm overflow-y-scroll h-[95vh] sticky top-10 left-0 z-10">
            <Shopinfo />
          </div>
          <div className="md:w-[72%] w-full mx-auto  rounded-sm">
            <ShopProfileData />
          </div>
        </div>
      </div>
    </div>
  );
}
