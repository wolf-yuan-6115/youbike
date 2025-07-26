import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";

interface HistoryProp {
  at: string;
  available: number;
  empty: number;
}

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

export default function (history: HistoryProp[]) {
  const labels = history.map((item) =>
    dayjs(item.at).format("MM-DD HH:mm:ss"),
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Available",
        data: history.map((item) => item.available),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.2,
      },
      {
        label: "Empty",
        data: history.map((item) => item.empty),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Station Usage Over Time",
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
