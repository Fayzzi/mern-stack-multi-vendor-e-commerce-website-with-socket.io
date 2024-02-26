import { Button } from "@material-ui/core";
import { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../../../../../Components/Loader/Loader";
import { DataGrid } from "@material-ui/data-grid";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSingleEvent,
  getAllShopEvents,
} from "../../../../../Components/Redux/Reducers/EventReducer";

export default function AllEventComponent() {
  const { Events, EventLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllShopEvents({ _id: seller?._id }));
  }, [dispatch]);
  const DeleteProduct = (id) => {
    console.log(id);
    dispatch(deleteSingleEvent(id));
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
      field: "start",
      headerName: "Start date",
      minWidth: 80,
      type: "number",
      flex: 1.5,
    },
    {
      field: "End",
      headerName: "End date",
      minWidth: 80,
      type: "number",
      flex: 1.5,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 150,
      flex: 0.8,
    },
    {
      field: "Stock",
      headerName: "Stock",
      minWidth: 150,
      flex: 0.8,
      type: "number",
    },
    {
      field: "sold",
      headerName: "Sold out",
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
          <Link to={"/product/" + params.row.id + "?isEvent=true"}>
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

  const rows = Events.map((p) => ({
    id: p._id,
    P_name: p.name,
    price: "US$" + p.discountPrice,
    Stock: p.stock,
    sold: p.sold_out,
    start: p.start_date.slice(0, 10),
    End: p.end_date.slice(0, 10),
  }));

  return (
    <>
      {EventLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
}
