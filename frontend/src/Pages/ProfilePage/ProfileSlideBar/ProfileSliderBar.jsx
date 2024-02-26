
import {
  
  AiOutlineLogin,
  AiOutlineMessage,
} from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { MdOutlinePassword, MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { LogoutUser } from "../../../Components/Redux/Reducers/UserReducer";
export default function ProfileSliderBar({ active, setActive }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandeler = () => {
    dispatch(LogoutUser());
    // localStorage.clear();
    navigate("/");
  };
  return (
    <div className="w-fit sticky top-10 left-0  bg-white shadow-md rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(1);
        }}
      >
        <RxPerson
          size={20}
          className="shrink-0"
          color={`${active === 1 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 1 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Profile
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(2);
        }}
      >
        <HiOutlineShoppingBag
          size={20}
          className="shrink-0"
          color={`${active === 2 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 2 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Orders
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(3);
        }}
      >
        <HiOutlineReceiptRefund
          size={20}
          className="shrink-0"
          color={`${active === 3 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Refunds
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(4) || navigate("/inbox");
        }}
      >
        <AiOutlineMessage
          size={20}
          className="shrink-0"
          color={`${active === 4 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 4 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Inbox
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(5);
        }}
      >
        <MdOutlineTrackChanges
          size={20}
          className="shrink-0"
          color={`${active === 5 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 5 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Track Orders
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(6);
        }}
      >
        <MdOutlinePassword
          size={20}
          className="shrink-0"
          color={`${active === 6 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 6 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Change Password
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(7);
        }}
      >
        <TbAddressBook
          size={20}
          className="shrink-0"
          color={`${active === 7 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 7 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Address
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer  mb-8"
        onClick={() => {
          setActive(8) || logoutHandeler();
        }}
      >
        <AiOutlineLogin
          size={20}
          className="shrink-0"
          color={`${active === 8 ? "red" : ""}`}
        />
        <span
          className={`pl-3 ${
            active === 8 ? "text-[red]" : ""
          } 800px:block hidden`}
        >
          Log Out
        </span>
      </div>
    </div>
  );
}
