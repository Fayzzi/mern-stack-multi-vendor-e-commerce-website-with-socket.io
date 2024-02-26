import { useEffect } from "react";
import { Button } from "@material-ui/core";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import {
  deleteSingle,
  getAllProducts,
} from "../../../../../Components/Redux/Reducers/ProductReducer";
import Loader from "../../../../../Components/Loader/Loader";

export default function AllProductComponent() {
  const { products, productLoading } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const DeleteProduct = (id) => {
    console.log(id);
    dispatch(deleteSingle(id));
  };
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllProducts({ _id: seller?._id }));
  }, [dispatch]);

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
      field: "price",
      headerName: "Price",
      minWidth: 80,
      flex: 0.8,
    },
    {
      field: "Stock",
      headerName: "Stock",
      minWidth: 80,
      flex: 0.8,
      type: "number",
    },
    {
      field: "sold",
      headerName: "Sold out",
      minWidth: 80,
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
        const d = params.row.id;

        return (
          <Link to={"/product/" + d}>
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

  const rows = products.map((p) => ({
    id: p._id,
    P_name: p.name,
    price: "US$" + p.discountPrice,
    Stock: p.stock,
    sold: p.sold_out,
  }));

  return (
    <>
      {productLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            autoHeight
            pageSize={10}
          />
        </div>
      )}
    </>
  );
}
