import { useState } from 'react';
import { Clock, TrendingDown, Users, AlertCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { doctorsData } from '../data/mockData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const WaitTimeAnalytics = () => {
  const [timeRange, setTimeRange] = useState('Today');

  // Mock data for wait times
  const labels = doctorsData.map(d => d.name);
  
  // Calculate current actual average wait time from mock queues
  const currentWaitTimes = doctorsData.map(doc => {
    const allWaiting = [...doc.advanceQueue, ...doc.walkInQueue].filter(p => p.status === 'waiting');
    if (allWaiting.length === 0) return 0;
    const total = allWaiting.reduce((sum, p) => sum + (p.waitTime || 0), 0);
    return Math.round(total / allWaiting.length);
  });

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Average Wait Time (mins)',
        data: currentWaitTimes,
        backgroundColor: currentWaitTimes.map(time => 
          time > 30 ? 'rgba(239, 68, 68, 0.7)' : // Red if > 30mins
          time > 15 ? 'rgba(245, 158, 11, 0.7)' : // Amber if > 15mins
          'rgba(34, 197, 94, 0.7)' // Green if <= 15mins
        ),
        borderColor: currentWaitTimes.map(time => 
          time > 30 ? 'rgb(239, 68, 68)' : 
          time > 15 ? 'rgb(245, 158, 11)' : 
          'rgb(34, 197, 94)'
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: { label: (context: any) => `${context.raw} mins avg wait` }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.03)', drawBorder: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 11 }, padding: 10 }
      }
    }
  };

  // Mock historical trend data
  const lineChartData = {
    labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
    datasets: [
      {
        label: 'Clinic Average',
        data: [12, 18, 25, 35, 20, 15, 28, 22],
        borderColor: '#138B78', // Primary
        backgroundColor: 'rgba(19, 139, 120, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#138B78',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.03)', drawBorder: false, borderDash: [5, 5] },
        ticks: { font: { family: "'Inter', sans-serif", size: 11 }, padding: 10 }
      }
    }
  };

  const highestWaitDoc = labels[currentWaitTimes.indexOf(Math.max(...currentWaitTimes))];
  const avgWaitAll = Math.round(currentWaitTimes.reduce((a, b) => a + b, 0) / currentWaitTimes.filter(t => t > 0).length || 0);

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <Clock className="text-primary" /> Operational & Wait Time Analytics
          </h1>
          <p className="text-text-gray mt-1">Monitor patient flow, identify bottlenecks, and track doctor efficiency.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-border-color shadow-sm w-max">
          {['Today', 'Yesterday', 'This Week'].map((preset) => (
            <button
              key={preset}
              onClick={() => setTimeRange(preset)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                timeRange === preset 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-2xl shadow-soft interactive-card">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50/80 p-3 rounded-xl text-blue-600 shadow-sm">
              <Clock size={24} />
            </div>
            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-green-100">
              <TrendingDown size={14} /> 12%
            </span>
          </div>
          <p className="text-text-gray text-sm font-semibold">Clinic Avg Wait Time</p>
          <h3 className="text-3xl font-extrabold text-text-dark mt-1 tracking-tight">{avgWaitAll} mins</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft interactive-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-50 p-3 rounded-xl text-red-600 shadow-sm border border-red-100">
              <AlertCircle size={24} />
            </div>
          </div>
          <p className="text-text-gray text-sm font-semibold">Longest Wait Bottleneck</p>
          <h3 className="text-xl font-extrabold text-text-dark mt-1 truncate">{highestWaitDoc}</h3>
          <p className="text-[10px] text-red-600 font-bold mt-2 uppercase tracking-widest bg-red-50 inline-block px-2 py-0.5 rounded shadow-sm border border-red-100">Needs Assistance</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft interactive-card">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-indigo-50/80 p-3 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
              <Users size={24} />
            </div>
          </div>
          <p className="text-text-gray text-sm font-semibold">Patients Currently Waiting</p>
          <h3 className="text-3xl font-extrabold text-text-dark mt-1 tracking-tight">
            {doctorsData.reduce((sum, doc) => sum + [...doc.advanceQueue, ...doc.walkInQueue].filter(p => p.status === 'waiting').length, 0)}
          </h3>
        </div>
        
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-text-dark mb-6">Current Wait Time by Doctor</h3>
          <div className="flex-1 min-h-[300px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-text-dark mb-6">Wait Time Trend ({timeRange})</h3>
          <div className="flex-1 min-h-[300px]">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
