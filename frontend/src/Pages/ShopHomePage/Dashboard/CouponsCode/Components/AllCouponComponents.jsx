import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../../../../../Components/Loader/Loader";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { categoriesData } from "../../../../../static/data";
import { clearErrorsofCoupon } from "../../../../../Components/Redux/Reducers/CouponsReducer";
import {
  getAllCoupons,
  deleteOneCoupon,
  uploadCoupon,
} from "../../../../../Components/Redux/Reducers/CouponsReducer";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllProducts } from "../../../../../Components/Redux/Reducers/ProductReducer";
export default function AllCouponComponents() {
  const { coupons, couponLoading, couponError, couponUploadSuccess } =
    useSelector((state) => state.coupons);
  const { products } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedProducts, setSelected] = useState("");
  const [mini, setMini] = useState("");
  const [max, setmax] = useState("");
  const dispatch = useDispatch();

  const [popUp, setPopup] = useState(false);

  useEffect(() => {
    dispatch(getAllCoupons({ id: seller._id }));
    dispatch(getAllProducts({ id: seller._id }));
  }, [dispatch, seller]);
  useEffect(() => {
    if (couponError) {
      toast.error(couponError);
      dispatch(clearErrorsofCoupon());
    }
    if (couponUploadSuccess) {
      setPopup(false);
      setName("");
      setDiscount();
      setMini("");
      setmax("");
      setSelected("");
    }
  }, [couponError, couponUploadSuccess]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(seller._id);
    const formData = new FormData();
    formData.append("name", name), formData.append("discount", discount);
    formData.append("minAmount", mini);
    formData.append("maxAmount", max);
    formData.append("selectedProduct", selectedProducts);
    formData.append("shopInfo", seller._id);

    try {
      dispatch(uploadCoupon({ data: formData }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  console.log(seller._id);
  const DeleteProduct = (id) => {
    console.log(id);
    dispatch(deleteOneCoupon({ id: id }));
  };

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "P_name",
      headerName: "Product Name",
      minWidth: 150,
      flex: 1.5,
    },

    {
      field: "Discount",
      headerName: "Discount",
      minWidth: 150,
      flex: 0.8,
      type: "number",
    },

    {
      field: "preview",
      headerName: "",
      type: "number",
      sortable: false,
      minWidth: 80,
      flex: 0.8,
      renderCell: (params) => {
        const d = params.row.P_name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <Link to={"/product/" + product_name}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
    {
      field: "Delete",
      headerName: "",
      type: "number",
      sortable: false,

      flex: 0.8,
      renderCell: (params) => (
        <Button onClick={() => DeleteProduct(params.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = coupons.map((p) => ({
    id: p._id,
    P_name: p.name,
    Discount: p.discount + "%",
  }));

  return (
    <>
      {couponLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className=" select-none mb-6 flex justify-end items-center w-full">
            <div
              onClick={(e) => setPopup(true)}
              className="w-fit cursor-pointer bg-black  px-4 py-3  rounded-md"
            >
              <span className="text-white ">Create&nbsp;Code</span>
            </div>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            autoHeight
          />
          {popUp ? (
            <div className="fixed top-0 left-0 z-[50] w-full flex items-center justify-center h-screen bg-black bg-opacity-40">
              <div className="800px:w-[50%] w-[80%] bg-white shadow-md px-4 h-[90vh] rounded-md overflow-y-scroll relative">
                <div className="absolute top-3 right-5">
                  <RxCross1
                    size={25}
                    className="cursor-pointer"
                    onClick={(e) => setPopup(false)}
                  />
                </div>
                <h5 className="text-center my-8 text-[1.5rem] font-semibold">
                  Create Coupon Code
                </h5>
                <form onSubmit={handleSubmit} action="">
                  <div className="flex mb-6 flex-col gap-2">
                    <label htmlFor="">
                      Name <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="text"
                      name="cou-name"
                      id="co-name"
                      required
                      value={name}
                      placeholder="Enter unique name for this coupon...."
                      onChange={(e) => setName(e.target.value)}
                      className="py-2 px-2 shadow-sm border  rounded-md focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex mb-6 flex-col gap-2">
                    <label htmlFor="">
                      Discount Percentage <span className="text-[red]">*</span>
                    </label>
                    <input
                      type="number"
                      name="cou-name"
                      id="co-name"
                      value={discount}
                      required
                      max={100}
                      min={0}
                      placeholder="Enter Discount Percentage"
                      onChange={(e) => setDiscount(e.target.value)}
                      className="py-2 px-2 shadow-sm border  rounded-md focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex mb-6 flex-col gap-2">
                    <label htmlFor="">Minimum Amount</label>
                    <input
                      type="number"
                      name="cou-name"
                      id="co-name"
                      value={mini}
                      min={0}
                      placeholder="Enter minimum amount for this coupon...."
                      onChange={(e) => setMini(e.target.value)}
                      className="py-2 px-2 shadow-sm border  rounded-md focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex mb-6 flex-col gap-2">
                    <label htmlFor="">Maximum Amount</label>
                    <input
                      type="number"
                      name="cou-name"
                      id="co-name"
                      value={max}
                      min={0}
                      placeholder="Enter maximum amount for this coupon...."
                      onChange={(e) => setmax(e.target.value)}
                      className="py-2 px-2 shadow-sm border  rounded-md focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2 my-6">
                    <label htmlFor="" className="text-[1.1rem]">
                      Selected Product
                    </label>
                    <select
                      className="w-full border p-2 rounded-md"
                      value={selectedProducts}
                      onChange={(e) => setSelected(e.target.value)}
                    >
                      <option value={"Choose Your selected Products"}>
                        Choose Your selected Product
                      </option>
                      {products &&
                        products.map((d, i) => (
                          <option className="text-black" key={i} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                    </select>
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
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
