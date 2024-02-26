import { useEffect, useState } from "react";
import Header from "./../../Components/Layout/Header/Header";
import ProfileSliderBar from "./ProfileSlideBar/ProfileSliderBar";
import ProfileContent from "./ProfileContent/ProfileContent";
import Footer from "../../Components/Layout/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../Components/Redux/Reducers/Allorders";
export default function ProfilePage() {
  const [active, setActive] = useState(1);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    dispatch(getAllOrders({ id: user._id }));
  }, [dispatch, user]);
  return (
    <div>
      <Header />
      <div className=" bg-[#f5f5f5]  w-full">
        <div className="w-11/12 mx-auto flex py-10">
          <div className="800px:w-[335px] w-[50px] ">
            <ProfileSliderBar active={active} setActive={setActive} />
          </div>
          <ProfileContent active={active} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
