import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirm, setconfirm] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/api/v2/user/update-password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirm,
      })
      .then(({ data }) => {
        toast.dismiss();
        toast.success(data.message);
        setOldPassword("");
        setconfirm("");
        setnewPassword("");
      })
      .catch((e) => {
        toast.dismiss();

        toast.error(e.response.data.message);
      });
  };
  return (
    <div className="w-full px-5">
      <div className="w-full">
        <h1 className="text-[25px] text-center w-full font-[600] text-black pb-2">
          Change Password
        </h1>

        <form
          className="w-full flex flex-col gap-3   800px:w-[70%] mx-auto mt-5"
          aria-required
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] 800px:text-[19px] font-semibold">
              Enter your Old Password
            </h1>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className=" border shadow-sm rounded-md  p-2 w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] 800px:text-[19px] font-semibold">
              Enter your New Password
            </h1>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              className=" border shadow-sm rounded-md  p-2 w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] 800px:text-[19px] font-semibold">
              Confirm Password
            </h1>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setconfirm(e.target.value)}
              className=" border shadow-sm rounded-md  p-2 w-full"
            />
          </div>
          <input
            type="submit"
            className="w-full border-blue-500 outline-none border  p-2  rounded-md shadow-sm"
          />
        </form>
      </div>
    </div>
  );
}
