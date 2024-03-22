// import * as React from 'react';
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
export default function BasicLineChart() {
  const [labels, setLabels] = useState(null);
  const [prices, setPrices] = useState(null);

  const fetchDataFromAPI = async () => {
    const labels_list = [];
    const prices_list = [];
    try {
      const response = await axios.get("http://localhost:3000/");
      response.data.forEach((item) => {
        labels_list.push(
          new Date(item.timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        );
        let floatDigit = item.price.replace(/[^\d.]/g, "");
        prices_list.push(parseFloat(floatDigit));
      });
      setLabels(labels_list);
      setPrices(prices_list);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
    const intervalId = setInterval(fetchDataFromAPI, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {labels && prices ? (
        <Line
          data={{
            labels: [...labels],
            datasets: [
              {
                label: "Med Gas Price",
                data: [...prices],
                backgroundColor: "#ffffff", // Background color for the line
                borderColor: "#0096cd", // Border color for the line
              },
            ],
          }}
          options={{
            scales: {
              x: {
                grid: {
                  color: "rgba(255, 255, 255, 0.1)", // Color of the grid lines on x-axis
                },
                ticks: {
                  color: "white", // Color of the x-axis labels
                },
              },
              y: {
                grid: {
                  color: "rgba(255, 255, 255, 0.1)", // Color of the grid lines on y-axis
                },
                ticks: {
                  color: "white", // Color of the y-axis labels
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  color: "white", // Color of the legend labels
                },
              },
            },
            layout: {
              padding: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
              },
            },
          }}
          width={500} // Width of the chart
          height={400} // Height of the chart
        />
      ) : (
        <div className="loader">
          <div className="loader-wheel"></div>
          <div className="loader-text"></div>
        </div>
      )}
    </>
  );
}
