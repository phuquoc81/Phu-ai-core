import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function UsageChart ({ analytics }) {
  if (!analytics || analytics.length === 0) {
    return <p className="text-muted">No usage data yet.</p>;
  }

  const data = {
    labels: analytics.map(a => a._id),
    datasets: [
      {
        label: 'Credits used',
        data:  analytics.map(a => a.totalCredits),
        backgroundColor: 'rgba(108, 99, 255, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend:  { position: 'top' },
      title:   { display: true, text: 'Daily AI Credit Usage' },
    },
    scales: { y: { beginAtZero: true } },
  };

  return <Bar data={data} options={options} />;
}
