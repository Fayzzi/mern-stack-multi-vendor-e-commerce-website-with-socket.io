import  { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { categoriesData } from "../../../../../static/data";
import {
  resetAll,
  uploadEvent,
} from "../../../../../Components/Redux/Reducers/EventReducer";
import { differenceInCalendarDays } from "date-fns";
export default function EventsFormComponent() {
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  console.log("category::::::::", category);
  const handleDateChange = (e) => {
    const selectedStartDate = new Date(e.target.value);
    setStartDate(selectedStartDate);
    setMinDate(new Date(selectedStartDate.getTime() + 3 * 24 * 60 * 60 * 1000));
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = new Date(e.target.value);
    setEndDate(selectedEndDate);
  };

  const { uploadEventSuccess, EventError } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    if (EventError) {
      toast.error(EventError);
    }
    if (uploadEventSuccess) {
      toast.success("Event Created successfully");
      dispatch(resetAll());
      navigate("/dashboard-events");
    }
  }, [dispatch, EventError, uploadEventSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("originalPrice", originalPrice);
    formData.append("discountPrice", discount);
    formData.append("stock", stock);
    formData.append("shopInfo", seller._id);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);

    dispatch(uploadEvent({ data: formData }));
  };

  const handleFilePicker = (e) => {
    e.preventDefault();
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  return (
    <div className="w-[90%] 1000px:w-[70%] bg-white shadow h-[88vh] rounded-[4px] p-3 overflow-x-scroll">
      <h5 className="text-[1.7rem] font-Poppins text-center">Create Event</h5>
      <form onSubmit={handleSubmit} action="">
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            name="product-name"
            placeholder="Enter Your Event Product Name"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-name"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={8}
            required
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            value={description}
            name="product-description"
            placeholder="Enter Your Event Product Description"
            className="focus:border-blue-500 outline-none resize-none  p-2 w-full appearance-none rounded-md border"
            id="p-desc"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            required
            className="w-full border p-2 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={""}>Choose a Category</option>
            {categoriesData &&
              categoriesData.map((d, i) => (
                <option key={i} value={d.title}>
                  {d.title}
                </option>
              ))}
          </select>
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Tags
          </label>
          <input
            onChange={(e) => setTags(e.target.value)}
            type="text"
            value={tags}
            name="product-tags"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-tags"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Original Price<span className="text-red-500">*</span>
          </label>
          <input
            onChange={(e) => setOriginalPrice(e.target.value)}
            type="number"
            value={originalPrice}
            required
            name="product-price"
            placeholder="Enter Your Event Product Price"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-price"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Price(with Discount) <span className="text-red-500">*</span>
          </label>
          <input
            required
            onChange={(e) => setDiscount(e.target.value)}
            type="number"
            value={discount}
            name="product-disc"
            placeholder="Enter Your Event Product Discount Price"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-dis"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            required
            onChange={(e) => setStock(e.target.value)}
            type="number"
            value={stock}
            name="product-stock"
            placeholder="Enter Your Event Product Stock"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-st"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Event Start date <span className="text-red-500">*</span>
          </label>
          <input
            required
            onChange={handleDateChange}
            type="date"
            value={startDate ? startDate.toISOString().slice(0, 10) : ""}
            min={new Date().toISOString().slice(0, 10)}
            name="product-stD"
            placeholder="Enter Your Event Start Date"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-stD"
          />
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label htmlFor="" className="text-[1.1rem]">
            Event End date <span className="text-red-500">*</span>
          </label>
          <input
            required
            onChange={handleEndDateChange}
            type="date"
            min={minDate ? minDate.toISOString().slice(0, 10) : ""}
            value={endDate ? endDate.toISOString().slice(0, 10) : ""}
            name="product-enD"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-enD"
          />
        </div>
        {startDate && endDate && (
          <span className="text-[red] mb-6 text-sm">
            Your Event will be running for{" "}
            {differenceInCalendarDays(new Date(endDate), new Date(startDate))}{" "}
            days
          </span>
        )}
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Product Images <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            {images &&
              images.map((d, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(d)}
                  className="h-[130px] w-full object-cover"
                  alt=""
                />
              ))}
            <div className="h-[130px] rounded-md flex items-center justify-center w-full bg-[#f5f5f5]">
              <label
                className="w-full h-full cursor-pointer flex items-center justify-center"
                htmlFor="image-picker"
              >
                <AiOutlinePlus size={35} />
              </label>
              <input
                type="file"
                multiple
                id="image-picker"
                className="w-full h-full hidden"
                onChange={handleFilePicker}
              />
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Create"
          className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
          name=""
          id=""
        />
      </form>
    </div>
  );
}
