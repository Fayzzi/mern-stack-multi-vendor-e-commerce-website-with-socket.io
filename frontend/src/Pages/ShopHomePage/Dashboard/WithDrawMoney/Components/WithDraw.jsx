import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllShopOrders } from "../../../../../Components/Redux/Reducers/Allorders";
import Chart from "chart.js/auto";
import { getAllProducts } from "../../../../../Components/Redux/Reducers/ProductReducer";

export default function WithDraw() {
  const { seller } = useSelector((state) => state.seller);
  const { shoporders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllShopOrders({ id: seller._id }));
    dispatch(getAllProducts({ id: seller._id }));
  }, [dispatch, seller]);

  const onlySaleProduct =
    shoporders && shoporders?.filter((p, i) => p.status === "Delivered");
  useEffect(() => {
    drawChart();
    drawPieChart(); // Corrected function name
  }, [shoporders]);

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
  const getEaningOfdelivered = () => {
    const earningall = {};
    onlySaleProduct &&
      onlySaleProduct.forEach((o) => {
        const monthHere = new Date(o?.createdAt).getMonth() + 1;
        earningall[monthHere] = (earningall[monthHere] || 0) + 1;
      });
    const finelData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      myData: earningall[index + 1] || 0,
    }));
    return finelData;
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
  console.log(getEarningsByMonth());
  const drawChart = () => {
    const ctx = document.getElementById("myChart");

    // Check if a Chart instance already exists on the canvas
    const existingChart = Chart.getChart(ctx);

    // Destroy the existing Chart instance if it exists
    if (existingChart) {
      existingChart.destroy();
    }

    const ordersByMonth = getOrdersByMonth();
    const ordersBydeliered = getEaningOfdelivered();

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
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },

              {
                label: "Delivered",
                data: ordersBydeliered.map((item) => item.myData),
                borderColor: "rgba(225, 12, 92, 0.5)",
                borderWidth: 2,
                backgroundColor: "rgba(225, 12, 92, .4)",
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "category",
                labels: ordersByMonth.map((item) => `Month ${item.month}`),
              },
              y: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
            responsive: true,
            aspectRatio: 2,
            maintainAspectRatio: false,
          },
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
  };

  const drawPieChart = () => {
    // Corrected function name
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
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
              {
                label: "Service Fee",
                data: earningByMonth.map((item) => item.earnings * 0.1),
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                backgroundColor: "rgba(255, 99, 132, 0.5)",
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "category",
                labels: earningByMonth.map((item) => `Month ${item.month}`),
              },
              y: {
                beginAtZero: true,
              },
            },
            responsive: true,
            aspectRatio: 2,
            maintainAspectRatio: false,
          },
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
  };

  return (
    <div className=" w-full p-2 ">
      <div className="w-full h-[50vh] shadow border p-2 rounded text-white">
        <canvas id="myChart" width="700" height="400"></canvas>
      </div>
      <div className="w-full h-[50vh] shadow border p-2 rounded text-white">
        <canvas id="PieChart" width="700" height="400"></canvas>
      </div>
    </div>
  );
}
