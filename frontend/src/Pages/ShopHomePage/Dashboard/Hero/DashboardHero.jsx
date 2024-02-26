import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllShopOrders } from "../../../../Components/Redux/Reducers/Allorders";
import { getAllProducts } from "../../../../Components/Redux/Reducers/ProductReducer";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import Chart from "chart.js/auto";
import { CiBoxList } from "react-icons/ci";
export default function DashboardHero() {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { shoporders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  const [deliveredProducts, setDeliveredProducts] = useState(null);
  useEffect(() => {
    dispatch(getAllProducts({ id: seller._id }));
    dispatch(getAllShopOrders({ id: seller._id }));
  }, [dispatch, seller]);
  useEffect(() => {
    drawChart();
    drawPieChart(); // Corrected function name
  }, [shoporders]);
  useEffect(() => {
    const orderData =
      shoporders && shoporders.filter((item) => item.status === "Delivered");
    setDeliveredProducts(orderData);
  }, [shoporders]);
  const totalEarningWithoutTax =
    deliveredProducts &&
    deliveredProducts.reduce(
      (acc, item) =>
        acc + item.cart.reduce((summ, i) => summ + i.discountPrice * i.qty, 0),
      0
    );
  const serviceTax =
    deliveredProducts &&
    deliveredProducts.reduce(
      (acc, item) =>
        acc + item.cart.reduce((summ, i) => summ + i.discountPrice * 0.1, 0),
      0
    );

  const coloums = [
    {
      field: "id",
      headerName: "Order Id",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "p_name",
      headerName: "Product Name",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Product Price",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "shipment",
      headerName: "Shipment Price",
      minWidth: 130,
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
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
          <Link to={"/dashboard-orders/orders/order?order=" + d}>
            <Button>
              <AiOutlineEye size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];
  const rows =
    shoporders &&
    shoporders.map((order) => {
      // Calculate item quantity from each shop in each order
      const itemsQty = order.cart.reduce(
        (itemAcc, item) => itemAcc + item.qty,
        0
      );

      // Calculate total price from each shop in each order
      const total = order?.totalPrice;
      // Calculate shipping price from each shop in each order
      const shippingPrice = order?.shippingPrice;

      return {
        id: order?._id,
        itemsQty,
        p_name: order?.cart[0]?.name,
        shipment: "US$ " + shippingPrice.toFixed(2),
        price: "US$ " + total,
        status: order?.status,
      };
    });
  //charts
  const onlySaleProduct =
    shoporders && shoporders?.filter((p) => p.status === "Delivered");
  //processing
  const processingproducts =
    shoporders && shoporders?.filter((p) => p.status === "Processing");
  //Refunded Products
  const RefundedProducts =
    shoporders && shoporders?.filter((p) => p.status === "Refund Success");

  const getEarningsByMonth = () => {
    const earningsByMonth = {};

    onlySaleProduct?.forEach((order) => {
      const monthNumber = new Date(order?.createdAt).getMonth() + 1;
      earningsByMonth[monthNumber] =
        (earningsByMonth[monthNumber] || 0) + (order?.totalPrice || 0);
    });

    const allMonthsEarnings = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      earnings: earningsByMonth[index + 1] || 0,
    }));

    return allMonthsEarnings;
  };
  const getRefundsP = () => {
    const RePro = {};
    RefundedProducts &&
      RefundedProducts.forEach((o) => {
        const montAm = new Date(o?.createdAt).getMonth() + 1;
        RePro[montAm] = (RePro[montAm] || 0) + 1;
      });
    const OkAll = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      orderD: RePro[index + 1] || 0,
    }));
    return OkAll;
  };
  const getPRocessing = () => {
    const RePro = {};
    processingproducts &&
      processingproducts.forEach((o) => {
        const montAm = new Date(o?.createdAt).getMonth() + 1;
        RePro[montAm] = (RePro[montAm] || 0) + 1;
      });
    const OkAll = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      orderD: RePro[index + 1] || 0,
    }));
    return OkAll;
  };

  const getOrdersByMonth = () => {
    const ordersByMonth = {};

    shoporders?.forEach((order) => {
      const monthNumber = new Date(order?.createdAt).getMonth() + 1;
      ordersByMonth[monthNumber] = (ordersByMonth[monthNumber] || 0) + 1;
    });
    {
      /* this will return an object absed on each month like {1:2,} */
    }
    const allMonthsOrders = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      orderCount: ordersByMonth[index + 1] || 0,
    }));

    return allMonthsOrders;
  };
  const onlyDeliverredProducts = () => {
    const products = {};
    onlySaleProduct?.forEach((order) => {
      const monthN = new Date(order?.createdAt).getMonth() + 1;
      products[monthN] = (products[monthN] || 0) + 1;
    });
    const deliverredOrders = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      orderCount: products[index + 1] || 0,
    }));
    return deliverredOrders;
  };

  const drawChart = () => {
    const ctx = document.getElementById("myChart");

    // Check if a Chart instance already exists on the canvas
    const existingChart = Chart.getChart(ctx);

    // Destroy the existing Chart instance if it exists
    if (existingChart) {
      existingChart.destroy();
    }

    const ordersByMonth = getOrdersByMonth();
    const okOrders = onlyDeliverredProducts();
    const okAllpas = getRefundsP();
    const okProcces = getPRocessing();
    if (ctx) {
      try {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: ordersByMonth.map((item) => `Month ${item.month}`),
            datasets: [
              {
                label: "Order Count",
                data: ordersByMonth.map((item) => item.orderCount),
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                hoverBorderColor: "rgba(12,12,12,.7)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
              {
                label: "Delivered",
                data: okOrders.map((item) => item.orderCount),
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                hoverBorderColor: "rgba(12,12,12,.7)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
              {
                label: "Refunded",
                data: okAllpas.map((item) => item.orderD),
                borderColor: "rgba(0, 225, 70, 1)",
                borderWidth: 2,
                hoverBorderColor: "rgba(12,12,12,.7)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
              {
                label: "Proccessing",
                data: okProcces.map((item) => item.orderD),
                borderColor: "rgba(225, 225, 70, 1)",
                borderWidth: 2,
                hoverBorderColor: "rgba(12,12,12,.7)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false, // Set to false to make it responsive
            aspectRatio: 2, // Adjust the aspect ratio as needed
          },
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
  };

  const drawPieChart = () => {
    const ctx = document.getElementById("PieChart");
    const existingPie = Chart.getChart(ctx);

    // Destroy the existing Chart instance if it exists
    if (existingPie) {
      existingPie.destroy();
    }

    const earningByMonth = getEarningsByMonth();

    if (ctx) {
      try {
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: earningByMonth.map((item) => `Month ${item.month}`),
            datasets: [
              {
                label: "Earnings",
                data: earningByMonth.map((item) => item.earnings),
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                hoverBorderColor: "rgba(12,12,12,.7)",
                backgroundColor: "rgba(75,192,192, 0.5)",
              },
              {
                label: "Service Fee",
                data: earningByMonth.map((item) => item.earnings * 0.1),
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                hoverBorderColor: "rgba(12,12,12,.7)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
          },
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
  };

  return (
    <div className="w-full overflow-hidden p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] shadow bg-white rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3 className="text-[18px] leading-5 font-[400] font-Roboto text-[#00000085]">
              Total Sellings{" "}
              <span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="font-[500] pt-2 pl-[36px] text-[22px] ">
            {totalEarningWithoutTax}+{serviceTax}
          </h5>
          <Link to={"/dashboard-details"}>
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Details</h5>
          </Link>
        </div>
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] shadow bg-white rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3 className="text-[18px] leading-5 font-[400] font-Roboto text-[#00000085]">
              All Orders{" "}
            </h3>
          </div>
          <h5 className="font-[500] pt-2 pl-[36px] text-[22px] ">
            {shoporders && shoporders?.length}
          </h5>
          <Link to={"/dashboard-orders"}>
            <h5 className="pt-4 pl-2 text-[#077f9c]">View orders</h5>
          </Link>
        </div>
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] shadow bg-white rounded px-2 py-5">
          <div className="flex items-center">
            <CiBoxList size={30} className="mr-2" fill="#00000085" />
            <h3 className="text-[18px] leading-5 font-[400] font-Roboto text-[#00000085]">
              All Products{" "}
            </h3>
          </div>
          <h5 className="font-[500] pt-2 pl-[36px] text-[22px] ">
            {products && products.length}
          </h5>
          <Link to={"/dashboard-products"}>
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
      </div>
      <br />
      <h1 className="text-[22px] font-Poppins text-gray-900 mb-3">
        Montly Stats
      </h1>
      <div className="flex  flex-col gap-1">
        <div className="w-[80vw]  my-2 h-[50vh] shadow border p-2 rounded text-white">
          <canvas
            id="PieChart"
            className="bg-white"
            width="700"
            height="400"
          ></canvas>
        </div>
        <div className="  w-[80vw] my-2 h-[50vh] shadow border p-2 rounded text-white">
          <canvas
            className="bg-white"
            id="myChart"
            width="700"
            height="400"
          ></canvas>
        </div>
      </div>
      <h3 className="font-Poppins text-[22px] pb-2">Latest Orders</h3>
      <div className="w-full p-2 min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={rows}
          columns={coloums}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
}
