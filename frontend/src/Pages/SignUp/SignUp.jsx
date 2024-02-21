import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function SignUp() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  const onsubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("file", picture);
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", Password);
    axios
      .post(`/api/v2/user/create-user`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        // if (res.data.success) {
        //   navigate("/");
        // }
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setPicture(null);
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };
  const handelfile = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };
  return (
    <motion.div
      // initial={{
      //   x: "100vw",
      // }}
      // exit={{
      //   x: "100vw",
      //   transition: { duration: 0.8, delay: 0.1, ease: "easeInOut" },
      // }}
      // animate={{ x: 0, transition: { duration: 0.8, delay: 0.25 } }} // Slide in from right
      className="min-h-screen bg-gray-50 flex flex-col justify-center  py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:max-w-md sm:mx-auto sm:w-full">
        <h2 className="my-6 text-center text-3xl font-extrabold text-gray-900">
          Create new Account
        </h2>
      </div>
      <div className=" sm:max-w-md sm:mx-auto sm:w-full">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={onsubmit} action="" className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="w-full appearance-none border py-2 px-3 block  rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  className="w-full appearance-none border py-2 px-3 block  rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "Password"}
                  name="Password"
                  id="Password"
                  autoComplete="current-password"
                  required
                  value={Password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="w-full relative appearance-none border py-2 px-3 block  rounded-md border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={(e) => {
                      setVisible(false);
                    }}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={(e) => {
                      setVisible(true);
                    }}
                  />
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="profile"
                className="block text-sm font-medium text-gray-700"
              ></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {picture ? (
                    <img
                      src={URL.createObjectURL(picture)}
                      alt="Picture"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="fileInput"
                  className="ml-5 flex items-center text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 justify-center px-4 py-2 border-gray-300 rounded-md shadow-sm"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="profile"
                    className="w-full h-full hidden"
                    id="fileInput"
                    accept=".jpg,.jpeg,.png"
                    onChange={handelfile}
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                SignUp
              </button>
            </div>
            <div className="flex items-center gap-2 w-full">
              <h4>already have Account?</h4>
              <Link to={"/login"} className="text-blue-500">
                {" "}
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default SignUp;
