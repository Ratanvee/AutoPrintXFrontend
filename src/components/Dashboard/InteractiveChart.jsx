"use client"

import { useRef, useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const InteractiveChart = ({ data, type = "line", height = 300 }) => {
  const chartRef = useRef()
  const [chartHeight, setChartHeight] = useState(height)
  const [fontSize, setFontSize] = useState(14)

  // Dynamically adjust chart size based on screen width
  useEffect(() => {
    const updateChartSize = () => {
      const width = window.innerWidth
      if (width < 480) {
        // Mobile
        setChartHeight(180)
        setFontSize(10)
      } else if (width < 768) {
        // Tablet
        setChartHeight(220)
        setFontSize(12)
      } else {
        // Desktop
        setChartHeight(height)
        setFontSize(14)
      }
    }

    updateChartSize()
    window.addEventListener("resize", updateChartSize)
    return () => window.removeEventListener("resize", updateChartSize)
  }, [height])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: fontSize },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#0a2463",
        borderWidth: 1,
        titleFont: { size: fontSize },
        bodyFont: { size: fontSize },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: fontSize } },
        grid: { display: false },
      },
      y: {
        ticks: { font: { size: fontSize } },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
      },
    },
  }

  const ChartComponent = type === "line" ? Line : Bar

  return (
    <div className="chart-container" style={{ height: chartHeight }}>
      <ChartComponent ref={chartRef} data={data} options={options} />
    </div>
  )
}

export default InteractiveChart
