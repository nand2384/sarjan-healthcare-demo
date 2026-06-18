import { useState, useMemo } from 'react';
import { BarChart3, Users, UserPlus, Receipt, Printer, CalendarDays, TrendingUp, IndianRupee } from 'lucide-react';
import { mockAnalyticsData } from '../data/mockData';
import { CustomDateRangePicker } from '../components/common/CustomDateRangePicker';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

export const FinancialReports = () => {
  // Date State
  const todayDate = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(todayDate);
  const [toDate, setToDate] = useState(todayDate);

  // Quick Selectors
  const setQuickRange = (preset: 'today' | 'yesterday' | 'last7') => {
    const end = new Date();
    const start = new Date();

    if (preset === 'yesterday') {
      end.setDate(end.getDate() - 1);
      start.setDate(start.getDate() - 1);
    } else if (preset === 'last7') {
      start.setDate(start.getDate() - 6);
    }
    
    setToDate(end.toISOString().split('T')[0]);
    setFromDate(start.toISOString().split('T')[0]);
  };

  // Determine Active Preset
  const getActivePreset = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yDay = new Date();
    yDay.setDate(yDay.getDate() - 1);
    const yesterdayStr = yDay.toISOString().split('T')[0];

    const l7Day = new Date();
    l7Day.setDate(l7Day.getDate() - 6);
    const last7Str = l7Day.toISOString().split('T')[0];

    if (fromDate === todayStr && toDate === todayStr) return 'today';
    if (fromDate === yesterdayStr && toDate === yesterdayStr) return 'yesterday';
    if (fromDate === last7Str && toDate === todayStr) return 'last7';
    return 'custom';
  };
  const activePreset = getActivePreset();

  // Compute days difference for scaling mock data
  const daysDiff = useMemo(() => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return diffDays;
  }, [fromDate, toDate]);

  // Scale data based on selected range (Prototype logic to make UI feel alive)
  const scaledData = useMemo(() => {
    return mockAnalyticsData.map(doc => ({
      ...doc,
      totalConsulted: doc.totalConsulted * daysDiff,
      walkInCount: doc.walkInCount * daysDiff,
      advanceCount: doc.advanceCount * daysDiff,
      newPatientCount: doc.newPatientCount * daysDiff,
      returningPatientCount: doc.returningPatientCount * daysDiff,
      consultationRevenue: doc.consultationRevenue * daysDiff,
      testsRevenue: doc.testsRevenue * daysDiff,
      pharmacyRevenue: doc.pharmacyRevenue * daysDiff,
      cashRevenue: doc.cashRevenue * daysDiff,
      onlineRevenue: doc.onlineRevenue * daysDiff,
    }));
  }, [daysDiff]);

  // Calculate Clinic-Wide Totals
  const totalRevenue = scaledData.reduce((sum, doc) => sum + doc.consultationRevenue + doc.testsRevenue + doc.pharmacyRevenue, 0);
  const totalConsulted = scaledData.reduce((sum, doc) => sum + doc.totalConsulted, 0);
  const totalNewPatients = scaledData.reduce((sum, doc) => sum + doc.newPatientCount, 0);
  const totalWalkIns = scaledData.reduce((sum, doc) => sum + doc.walkInCount, 0);

  // Subtitle Logic
  const formattedFrom = new Date(fromDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTo = new Date(toDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const subtitle = fromDate === toDate 
    ? `Report for ${formattedFrom}`
    : `Report from ${formattedFrom} to ${formattedTo}`;

  // Chart Data Preparation
  const revenueChartData = {
    labels: scaledData.map(d => d.doctorName),
    datasets: [
      {
        label: 'Consultation Revenue',
        data: scaledData.map(d => d.consultationRevenue),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
      },
      {
        label: 'Tests Revenue',
        data: scaledData.map(d => d.testsRevenue),
        backgroundColor: 'rgba(139, 92, 246, 0.8)', // purple-500
      },
      {
        label: 'Pharmacy Revenue',
        data: scaledData.map(d => d.pharmacyRevenue),
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
      }
    ],
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { font: { family: "'Inter', sans-serif" } }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#4B5563',
        borderColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => `₹${context.raw.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false, drawBorder: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 11 } }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.03)', drawBorder: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 11 }, padding: 10 }
      }
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <BarChart3 className="text-primary" /> Financial Reports
          </h1>
          <p className="text-text-gray mt-1 text-base flex items-center gap-2">
            <CalendarDays size={16} /> {subtitle}
          </p>
        </div>

        {/* Date Range Picker UI */}
        <div className="flex flex-col items-end gap-3">
          <CustomDateRangePicker 
            startDate={fromDate} 
            endDate={toDate} 
            onChange={(start, end) => {
              setFromDate(start);
              setToDate(end);
            }} 
          />
          
          <div className="flex gap-2 items-center">
            <div className="flex rounded-lg shadow-sm">
              <button 
                onClick={() => setQuickRange('today')} 
                className={`text-xs px-3 py-1.5 font-medium transition-colors border border-border-color rounded-l-lg border-r-0 ${activePreset === 'today' ? 'bg-primary text-white border-primary' : 'bg-white text-text-dark hover:bg-gray-50'}`}
              >
                Today
              </button>
              <button 
                onClick={() => setQuickRange('yesterday')} 
                className={`text-xs px-3 py-1.5 font-medium transition-colors border border-border-color border-r-0 ${activePreset === 'yesterday' ? 'bg-primary text-white border-primary' : 'bg-white text-text-dark hover:bg-gray-50'}`}
              >
                Yesterday
              </button>
              <button 
                onClick={() => setQuickRange('last7')} 
                className={`text-xs px-3 py-1.5 font-medium transition-colors border border-border-color rounded-r-lg ${activePreset === 'last7' ? 'bg-primary text-white border-primary' : 'bg-white text-text-dark hover:bg-gray-50'}`}
              >
                Last 7 Days
              </button>
            </div>
            
            <button onClick={() => window.print()} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-text-dark text-white hover:bg-black rounded-lg font-medium transition-colors ml-2 shadow-sm">
              <Printer size={12} /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Top Section: Clinic-Wide KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-soft interactive-card border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
          <p className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2">Total Revenue</p>
          <h2 className="text-3xl font-extrabold text-text-dark flex items-center gap-1 tracking-tight">
            <IndianRupee size={28} /> {totalRevenue.toLocaleString('en-IN')}
          </h2>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-green-700 bg-green-50 w-fit px-2.5 py-1 rounded uppercase tracking-wider border border-green-100">
            <TrendingUp size={14} /> Selected Range
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft interactive-card border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
          <p className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2">Total Consulted</p>
          <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">{totalConsulted}</h2>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-text-gray bg-gray-50 w-fit px-2.5 py-1 rounded uppercase tracking-wider border border-gray-200/50">
            <Users size={14} className="text-blue-500" /> Patients Seen
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft interactive-card border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
          <p className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2">Total Walk-ins</p>
          <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">{totalWalkIns}</h2>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-text-gray bg-gray-50 w-fit px-2.5 py-1 rounded uppercase tracking-wider border border-gray-200/50">
            <Receipt size={14} className="text-amber-500" /> Direct Arrivals
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft interactive-card border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
          <p className="text-[11px] font-bold text-text-light uppercase tracking-wider mb-2">New Registrations</p>
          <h2 className="text-3xl font-extrabold text-text-dark tracking-tight">{totalNewPatients}</h2>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-text-gray bg-gray-50 w-fit px-2.5 py-1 rounded uppercase tracking-wider border border-gray-200/50">
            <UserPlus size={14} className="text-purple-500" /> First-time visits
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-2xl shadow-soft interactive-card border-none mb-8">
        <h3 className="text-lg font-bold text-text-dark mb-6">Revenue Breakdown per Doctor</h3>
        <div className="h-[300px]">
          <Bar data={revenueChartData} options={revenueChartOptions} />
        </div>
      </div>

      {/* Middle Section: Doctor Breakdown */}
      <h3 className="text-xl font-bold text-text-dark mb-4">Doctor Performance Details</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scaledData.map(doc => (
          <div key={doc.doctorId} className="bg-white rounded-2xl shadow-soft interactive-card overflow-hidden flex flex-col border-none">
            
            {/* Header */}
            <div className="p-6 border-b border-border-color bg-gray-50/30 flex justify-between items-center">
              <h4 className="font-bold text-text-dark text-lg">{doc.doctorName}</h4>
              <span className="bg-primary/10 text-primary text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border border-primary/20">
                {doc.totalConsulted} Consults
              </span>
            </div>

            {/* Revenue Block */}
            <div className="p-5 border-b border-border-color bg-green-50/20">
              <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-1">Generated Revenue</p>
              <h5 className="text-2xl font-bold text-green-700 flex items-center mb-3">
                <IndianRupee size={20} className="mr-1" /> {(doc.consultationRevenue + doc.testsRevenue + doc.pharmacyRevenue).toLocaleString('en-IN')}
              </h5>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white border border-green-100 rounded py-1.5">
                  <p className="text-text-gray font-medium mb-0.5">Consultation</p>
                  <p className="font-bold text-green-800">₹{doc.consultationRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-green-100 rounded py-1.5">
                  <p className="text-text-gray font-medium mb-0.5">Tests</p>
                  <p className="font-bold text-green-800">₹{doc.testsRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-green-100 rounded py-1.5">
                  <p className="text-text-gray font-medium mb-0.5">Pharmacy</p>
                  <p className="font-bold text-green-800">₹{doc.pharmacyRevenue.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-5 flex-1 grid grid-cols-2 gap-x-6 gap-y-4">
              
              {/* Visit Type */}
              <div className="col-span-2">
                <p className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3">Visit Type Breakdown</p>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-text-gray">Advance Booking</span>
                  <span className="font-semibold text-text-dark">{doc.advanceCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: doc.totalConsulted > 0 ? `${(doc.advanceCount / doc.totalConsulted) * 100}%` : '0%' }}></div>
                </div>

                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-text-gray">Walk-in</span>
                  <span className="font-semibold text-text-dark">{doc.walkInCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: doc.totalConsulted > 0 ? `${(doc.walkInCount / doc.totalConsulted) * 100}%` : '0%' }}></div>
                </div>
              </div>

              <div className="col-span-2 border-t border-dashed border-border-color my-2"></div>

              {/* Patient Type */}
              <div className="col-span-2">
                <p className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3">Patient Type Breakdown</p>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-text-gray">Returning / Existing</span>
                  <span className="font-semibold text-text-dark">{doc.returningPatientCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: doc.totalConsulted > 0 ? `${(doc.returningPatientCount / doc.totalConsulted) * 100}%` : '0%' }}></div>
                </div>

                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-text-gray">New Registrations</span>
                  <span className="font-semibold text-text-dark">{doc.newPatientCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: doc.totalConsulted > 0 ? `${(doc.newPatientCount / doc.totalConsulted) * 100}%` : '0%' }}></div>
                </div>
              </div>

              <div className="col-span-2 border-t border-dashed border-border-color my-2"></div>

              {/* Payment Method */}
              <div className="col-span-2">
                <p className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3">Payment Method Breakdown</p>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-text-gray">Online Income (UPI/Card)</span>
                  <span className="font-semibold text-text-dark">₹{doc.onlineRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                  <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: (doc.consultationRevenue + doc.testsRevenue + doc.pharmacyRevenue) > 0 ? `${(doc.onlineRevenue / (doc.consultationRevenue + doc.testsRevenue + doc.pharmacyRevenue)) * 100}%` : '0%' }}></div>
                </div>

                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-text-gray">Cash Income</span>
                  <span className="font-semibold text-text-dark">₹{doc.cashRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: (doc.consultationRevenue + doc.testsRevenue + doc.pharmacyRevenue) > 0 ? `${(doc.cashRevenue / (doc.consultationRevenue + doc.testsRevenue + doc.pharmacyRevenue)) * 100}%` : '0%' }}></div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};
