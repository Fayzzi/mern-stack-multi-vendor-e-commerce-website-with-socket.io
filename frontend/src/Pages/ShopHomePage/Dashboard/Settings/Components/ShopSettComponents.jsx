import axios from "axios";
import { useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSeller } from "../../../../../Components/Redux/Reducers/SellerReducer";

export default function ShopSettComponents() {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const [picture, setPicture] = useState(null);
  const [Name, setName] = useState(seller && seller?.name);
  const [Email, setEmail] = useState(seller && seller?.email);
  const [phone, setphone] = useState(seller && seller?.phoneNumber);
  const [Address, setAddress] = useState(seller && seller?.address);
  const [ZipCode, setZipCode] = useState(seller && seller?.zipCode);
  const [password, setpassword] = useState("");
  const [description, setDescription] = useState(
    seller && seller?.description ? seller?.description : ""
  );
  const updateData = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", Name);
    formData.append("email", Email);
    formData.append("password", password);
    formData.append("description", description);
    formData.append("image", picture ? picture : seller?.avatar);
    formData.append("phoneNumber", phone);
    formData.append("zipCode", ZipCode);
    formData.append("address", Address);
    axios
      .put("/api/v2/shop/update-shop-info", formData)
      .then(() => {
        toast.success("Success");
        dispatch(getSeller());
      })
      .catch((e) => toast.error(e.response.data.message));
  };
  return (
    <div className="min-h-screen w-11/12 mx-auto">
      <div className="flex my-3 800px:w-[80%] mx-auto w-full flex-col justify-center">
        <div className="w-fit mx-auto relative ">
          {picture ? (
            <img
              className="w-[150px] relative rounded-full object-cover cursor-pointer border-green-500 border h-[150px]"
              src={URL.createObjectURL(picture)}
              alt=""
            />
          ) : (
            <img
              className="w-[150px] relative rounded-full object-cover cursor-pointer border-green-500 border h-[150px]"
              src={`http://localhost:3000/${seller?.avatar}`}
              alt=""
            />
          )}
          <div className="h-[35px] w-[35px] cursor-pointer absolute bottom-[5px] right-2 bg-[white] rounded-full flex items-center justify-center">
            <label htmlFor="picker-file">
              <AiOutlineCamera />
              <input
                type="file"
                accept=".png,.jpg,.jpeg"
                id="picker-file"
                className="w-full h-full hidden "
                onChange={(e) => setPicture(e.target.files[0])}
              />
            </label>
          </div>
        </div>
        <br />
        <h1 className="font-Poppins text-[21px] font-[500]">Shop Info</h1>
        <form
          aria-required
          onSubmit={updateData}
          className="grid grid-cols-1 w-full gap-5 my-2 800px:grid-cols-2"
          action=""
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="">Name</label>
            <input
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border shadow rounded-md "
              name="seller-name"
              id="name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Email</label>
            <input
              type="email"
              readOnly
              value={Email}
              className="w-full p-2 border shadow rounded-md "
              name="seller-email"
              id="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Address</label>
            <input
              type="text"
              className="w-full p-2 border shadow rounded-md "
              name="seller-address"
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
              id="address"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">ZipCode</label>
            <input
              type="text"
              className="w-full p-2 border shadow rounded-md "
              name="seller-zip"
              id="zip"
              value={ZipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 border shadow rounded-md "
              name="seller-phone"
              id="phone"
              value={phone}
              onChange={(e) => setphone(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border shadow rounded-md "
              name="seller-name"
              id="name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border shadow rounded-md "
              name=""
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              id=""
            />
          </div>
          <div></div>
          <input
            type="submit"
            name=""
            value={"Update Shop"}
            id=""
            className="border p-2  rounded border-green-500 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}
