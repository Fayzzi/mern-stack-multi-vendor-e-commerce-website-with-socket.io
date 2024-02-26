import  { useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import AllOrders from "./AllOrders/AllOrders";
import TrackOrder from "./TrackOrders/TrackOrder";
import ChangePassword from "./PaymentMethod/PaymentMethods";
import Address from "./Address/Address";
import { updateUserData } from "../../../Components/Redux/Reducers/UserReducer";
import { toast } from "react-toastify";
import RefundOrders from "./RefundOrders/RefundOrders";
import { RxCross1 } from "react-icons/rx";
export default function ProfileContent({ active }) {
  const { user, error } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user ? user.name : "");
  const [email, setEmail] = useState(user && user ? user.email : "");
  const [password, setPassword] = useState("");
  const [profileImage, setprofileImage] = useState(false);
  const [phone, setPhone] = useState(
    user && user.phoneNumber ? user.phoneNumber : ""
  );
  const [picture, setPicture] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", picture ? picture : user?.avatar);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phone);
    dispatch(
      updateUserData({
        data: formData,
      })
    );
  };
  console.log(picture, user?.avatar);
  return (
    <div className="w-full">
      {/*Profile */}
      {active === 1 ? (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              {picture ? (
                <img
                  src={URL.createObjectURL(picture)}
                  alt=""
                  className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                />
              ) : (
                <img
                  onClick={(e) => setprofileImage(true)}
                  src={"http://localhost:3000/" + user?.avatar}
                  alt=""
                  className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                />
              )}
              <div className="h-[30px] w-[30px] cursor-pointer absolute bottom-[5px] right-2 bg-[white] rounded-full flex items-center justify-center">
                <label htmlFor="picker-file">
                  <AiOutlineCamera />
                  <input
                    type="file"
                    id="picker-file"
                    className="w-full h-full hidden"
                    onChange={(e) => setPicture(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
          {profileImage && (
            <div className="w-screen flex items-center justify-center backdrop-blur-sm   min-h-screen z-[1]  overflow-y-scroll    fixed top-0 left-0">
              <div className="fixed z-[2] top-2 right-2">
                <RxCross1
                  size={30}
                  color="black"
                  className="cursor-pointer"
                  onClick={(e) => setprofileImage(false)}
                />
              </div>
              <div className="md:w-[50vw] w-[90vw] bg-white/50   h-[90vh] flex items-center justify-center mx-auto">
                <img
                  src={"http://localhost:3000/" + user?.avatar}
                  alt=""
                  className=" w-full h-full top-0 left-0 object-contain border-[3px]"
                />
              </div>
            </div>
          )}
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              <div className="w-full 800px:flex block pb-3">
                <div className="800px:w-[50%] w-[100%] ">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-1 rounded-[5px] !w-[95%] 800px:mb-0 mb-4"
                  />
                </div>
                <div className="800px:w-[50%] w-full">
                  <label className="block pb-2">Email</label>
                  <input
                    type="email"
                    required
                    readOnly
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-1 rounded-[5px] !w-[95%] 800px:mb-0 mb-4"
                  />
                </div>
              </div>
              <div className="w-full 800px:flex  block pb-3">
                <div className="800px:w-[50%] w-full">
                  <label className="block pb-2">Phone number</label>
                  <input
                    type="number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-1 rounded-[5px] !w-[95%] 800px:mb-0 mb-4"
                  />
                </div>
                <div className="800px:w-[50%] w-full">
                  <label className="block pb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-1 rounded-[5px] !w-[95%] 800px:mb-0 mb-4"
                  />
                </div>
              </div>

              <button className="w-[150px]  bg-blue-700 h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer text-white">
                Update
              </button>
            </form>
          </div>
        </>
      ) : null}
      {/*Order */}
      {active === 2 ? (
        <div>
          <AllOrders />
        </div>
      ) : null}
      {/*Refunds */}
      {active === 3 ? (
        <div>
          <RefundOrders />
        </div>
      ) : null}

      {active === 5 ? (
        <div>
          <TrackOrder />
        </div>
      ) : null}
      {active === 6 ? (
        <div>
          <ChangePassword />
        </div>
      ) : null}
      {active === 7 ? (
        <div>
          <Address />
        </div>
      ) : null}
    </div>
  );
}
