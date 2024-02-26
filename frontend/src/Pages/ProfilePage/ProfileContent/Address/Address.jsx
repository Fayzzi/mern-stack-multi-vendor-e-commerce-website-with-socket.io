import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import {
  deleteAddress,
  uploadAddress,
} from "../../../../Components/Redux/Reducers/UserReducer";
import { clearErrors } from "../../../../Components/Redux/Reducers/UserReducer";
export default function Address() {
  const [open, setOpen] = useState(false);
  const [country, setcountry] = useState("");
  const [city, setcity] = useState("");
  const [zipCode, setzipCode] = useState("");
  const [address1, setaddress1] = useState("");
  const [adress2, setadress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user, updateAddressSuccess, updateAddressError } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (updateAddressError) {
      toast.error(updateAddressError);
      dispatch(clearErrors());
    }
    if (updateAddressSuccess) {
      setOpen(false);
      setcountry("");
      setcity("");
      setaddress1("");
      setadress2("");
      setAddressType("");
      setzipCode();
    }
  }, [updateAddressError, user, updateAddressSuccess, dispatch]);
  console.log(user);
  const adressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];
  const handleDelete = (e, id) => {
    e.preventDefault();
    dispatch(deleteAddress({ id: id._id }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("country", country);
    formData.append("city", city);
    formData.append("address1", address1);
    formData.append("address2", adress2);
    formData.append("zipCode", zipCode);
    formData.append("addressType", addressType);
    dispatch(uploadAddress({ data: formData }));
    console.log(formData.get("addressType"));
  };
  console.log(addressType);
  return (
    <div className="w-full px-5">
      <div className="flex w-full items-center justify-between">
        <h1 className="800px:text-[25px] text-[19px] font-[600] text-black pb-2">
          My Addressess
        </h1>
        <button
          onClick={(e) => setOpen(true)}
          className="800px:w-[150px] px-3 bg-black h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer"
        >
          <h1 className="text-white">Add New</h1>
        </button>
      </div>
      {user.addresses.length > 0 &&
        user.addresses.map((d, i) => (
          <div
            key={i}
            className="w-full mb-6 bg-white h-[fit] py-2 rounded-[4px] flex items-center justify-between px-1 shadow pr-10"
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">
                {d.addressType === "Home" ? (
                  <span className="text-[15px] 800px:text-[17px] ">
                    Home Address
                  </span>
                ) : d.addressType === "Office" ? (
                  <span className="text-[15px] 800px:text-[17px] ">Office</span>
                ) : (
                  <span className="text-[15px] 800px:text-[17px]  ">
                    Default
                  </span>
                )}
              </h5>
            </div>
            <div className="flex items-center pl-8">
              <h6 className="text-[15px] 800px:text-[17px] ">
                {d?.address1}
                {","}
                {d?.country}
                {","} {d?.city}
              </h6>
            </div>
            <div className="flex items-center pl-8">
              <h6>
                {user && user?.phoneNumber === null ? (
                  <span className="text-[15px] 800px:text-[17px] ">
                    No Contact added
                  </span>
                ) : (
                  user?.phoneNumber
                )}
              </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                onClick={(e) => handleDelete(e, d)}
                size={25}
                className="cursor-pointer shrink-0"
              />
            </div>
          </div>
        ))}
      {user && user.addresses.length === 0 && <div>No saved Addresses</div>}

      {open ? (
        <div className="fixed top-0 left-0 w-full h-screen z-[1] flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="w-[90%] 800px:w-[39%] h-[80vh] 800px:h-[75vh] z-[50] bg-white rounded-md overflow-y-scroll relative">
            <div className="absolute top-2 right-3">
              <RxCross1
                className="cursor-pointer"
                size={25}
                onClick={(e) => setOpen(false)}
              />
            </div>
            <h1 className="text-[25px] mt-8 mb-4 text-center">
              Add New Address
            </h1>
            <form
              className="w-full px-6 py-2 flex flex-col gap-4"
              onSubmit={handleSubmit}
              aria-required
            >
              <div className="gap-2 flex flex-col">
                <h1>country:</h1>
                <select
                  required
                  className="w-full p-1 border-[5px]"
                  value={country}
                  onChange={(e) => setcountry(e.target.value)}
                >
                  <option value="">Choose your country</option>
                  {Country &&
                    Country.getAllCountries().map((d) => (
                      <option key={d.isoCode} value={d.isoCode}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="gap-2 flex flex-col">
                <h1>Chose your city:</h1>
                <select
                  required
                  className="w-full p-1 border-[5px]"
                  value={city}
                  onChange={(e) => setcity(e.target.value)}
                >
                  <option value="">Choose your City</option>
                  {State &&
                    State.getStatesOfCountry(country).map((d) => (
                      <option key={d.isoCode} value={d.isoCode}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="gap-2 flex flex-col">
                <h1>Address1:</h1>
                <input
                  type="text"
                  name="address-1"
                  id="Address-1"
                  required
                  value={address1}
                  className="w-full p-2 shadow-sm  rounded-md outline-none  border-[2px] focus:border-blue-500"
                  onChange={(e) => setaddress1(e.target.value)}
                />
              </div>
              <div className="gap-2 flex flex-col">
                <h1>Address 2:</h1>
                <input
                  type="text"
                  name="address-2"
                  id="Address-2"
                  value={adress2}
                  className="w-full p-2 shadow-sm  rounded-md outline-none  border-[2px] focus:border-blue-500"
                  onChange={(e) => setadress2(e.target.value)}
                />
              </div>
              <div className="gap-2 flex flex-col">
                <h1>ZipCode:</h1>
                <input
                  type="number"
                  name="zip"
                  id="zip-code"
                  required
                  value={zipCode}
                  className="w-full p-2 shadow-sm  rounded-md outline-none  border-[2px] focus:border-blue-500"
                  onChange={(e) => setzipCode(e.target.value)}
                />
              </div>
              <div className="gap-2 flex flex-col">
                <h1>Address Type:</h1>
                <select
                  required
                  className="w-full p-1 mb-6 border-[5px]"
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                >
                  <option value="">Choose your Address Type</option>
                  {adressTypeData &&
                    adressTypeData.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full pb-2">
                <input
                  type="submit"
                  className="w-full border-blue-500 outline-none border  p-2  rounded-md shadow-sm"
                />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
