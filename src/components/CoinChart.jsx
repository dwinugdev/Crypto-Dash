import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import Spinner from './Spinner';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LinearScale,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const API_URL = import.meta.env.VITE_COIN_API_URL;

const CoinChart = ({ coinId }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          `${API_URL}/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        const prices = data.prices.map((price) => ({
          x: price[0],
          y: price[1],
        }));

        setChartData({
          labels: prices.map((p) => p.x),
          datasets: [
            {
              label: 'Price (USD)',
              data: prices,
              fill: true,
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0)',
              pointRadius: 0,
              tension: 0.3,
            },
          ],
        });
      } catch (err) {
        setError(err.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, [coinId]);

  if (loading) return <p>Loading Chart...</p>;
  return (
    <div style={{ marginTop: '30px' }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            filler: { propagate: true },
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
            y: {
              ticks: {
                callback: (value) => `$${value.toLocaleString()}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CoinChart;
