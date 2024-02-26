import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../../../../static/data";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import { uploadProduct } from "../../../../../Components/Redux/Reducers/ProductReducer";
import { RxCross1 } from "react-icons/rx";
export default function CreateProductComponent() {
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discount, setDiscount] = useState();
  const [stock, setStock] = useState();
  const { uploadSuccess, products, productError } = useSelector(
    (state) => state.products
  );
  useEffect(() => {
    if (productError) {
      toast.error(productError);
    }
    if (uploadSuccess) {
      toast.success("Product uploaded successfully");
      navigate("/dashboard");
      window.location.reload();
    }
    console.log(products);
  }, [dispatch, productError, uploadSuccess]);
  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(seller._id);
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image); // Use array notation to handle multiple files
    });

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("originalPrice", originalPrice);
    formData.append("discountPrice", discount);
    formData.append("stock", stock);
    formData.append("shopId", seller._id);
    dispatch(uploadProduct({ data: formData }));
  };
  const filePicker = (e) => {
    e.preventDefault();
    // Convert FileList to array
    const selectedFiles = Array.from(e.target.files);
    // Update state with the array of files
    setImages((prev) => [...prev, ...selectedFiles]);
  };
  const removeImage = (e) => {
    setImages((prev) => prev.filter((f) => f !== e));
  };

  return (
    <div className="w-[90%] 1000px:w-[70%] bg-white shadow h-[88vh] rounded-[4px] p-3 overflow-x-scroll">
      <h5 className="text-[1.7rem] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handlesubmit} action="">
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
            placeholder="Enter Your Product Name"
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
            placeholder="Enter Your Product Description"
            className="focus:border-blue-500 outline-none resize-none  p-2 w-full appearance-none rounded-md border"
            id="p-desc"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border p-2 rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={"Choose a category"}>Choose a Category</option>
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
            Original Price
          </label>
          <input
            onChange={(e) => setOriginalPrice(e.target.value)}
            type="number"
            value={originalPrice}
            name="product-price"
            placeholder="Enter Your Product Price"
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
            type="text"
            value={discount}
            name="product-disc"
            placeholder="Enter Your Product Discount Price"
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
            type="text"
            value={stock}
            name="product-stock"
            placeholder="Enter Your Product Stock"
            className="focus:border-blue-500 outline-none  p-2 w-full appearance-none rounded-md border"
            id="p-st"
          />
        </div>
        <div className="flex flex-col gap-2 my-6">
          <label htmlFor="" className="text-[1.1rem]">
            Product Images <span className="text-red-500">*</span>
          </label>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            {images &&
              images.map((d, i) => (
                <div key={i} className="relative">
                  <img
                    key={i}
                    src={URL.createObjectURL(d)}
                    className="h-[130px] w-full object-cover"
                    alt=""
                  />
                  <div className="absolute bg-black bg-opacity-50 p-2 rounded-full top-0 right-1">
                    <RxCross1
                      onClick={(e) => removeImage(d)}
                      className="cursor-pointer"
                      color="white"
                      size={20}
                    />
                  </div>
                </div>
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
                onChange={filePicker}
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
