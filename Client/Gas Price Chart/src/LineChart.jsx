// App.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const App = () => {
  const [data, setData] = useState({
    "2024-01-01": 10,
    "2024-01-02": 15,
    "2024-01-03": 20,
    "2024-01-04": 25,
    "2024-01-05": 30,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("YOUR_API_ENDPOINT");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   fetchData();

  //   // Fetch data every 30 minutes
  //   const interval = setInterval(fetchData, 30 * 60 * 1000);

  //   // Cleanup function to clear interval
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div>
      <h1>Line Chart</h1>
      <LineChart data={data} />
    </div>
  );
};

const LineChart = ({ data }) => {
  // Assuming data is an object with keys as dates and values as prices
  const dates = Object.keys(data);
  const prices = Object.values(data);
  const formattedDates = dates.map((date) =>
    new Date(date).toLocaleDateString()
  );
  const chartRef = useRef(null); // Ref to hold the chart instance

  useEffect(() => {
    // Render the chart when data changes
    if (chartRef.current) {
      // Destroy the previous chart instance if it exists
      chartRef.current.chartInstance.destroy();
    }
  }, [data]);

  console.log(formattedDates, prices);
  const chartData = {
    labels: formattedDates,
    datasets: [
      {
        label: "Price",
        data: prices,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  console.log("returning");
  return (
    <div>
      <Line ref={chartRef} data={chartData} />
    </div>
  );
};

export default App;
