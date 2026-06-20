
import { AlertTriangle, CheckCircle2, TrendingUp, PackageSearch, Clock, ClipboardList, Activity } from 'lucide-react';

export const PharmacistDashboardOverview = () => {
  const stats = [
    { label: 'Pending Prescriptions', value: '12', trend: '+3', isPositive: false, icon: <ClipboardList size={20} /> },
    { label: 'Dispensed Today', value: '84', trend: '+15%', isPositive: true, icon: <CheckCircle2 size={20} /> },
    { label: 'Low Stock Alerts', value: '5', trend: '-2', isPositive: true, icon: <AlertTriangle size={20} /> },
    { label: 'Total Inventory Items', value: '1,432', trend: 'Steady', isPositive: true, icon: <PackageSearch size={20} /> }
  ];

  const recentDispensations = [
    { time: '10:45 AM', patient: 'Alice Smith', rxId: 'RX-1001', items: 2, status: 'Completed' },
    { time: '10:30 AM', patient: 'Mark Johnson', rxId: 'RX-0998', items: 1, status: 'Completed' },
    { time: '10:15 AM', patient: 'Sarah Connor', rxId: 'RX-0997', items: 4, status: 'Completed' },
    { time: '09:50 AM', patient: 'James Bond', rxId: 'RX-0995', items: 1, status: 'Completed' },
  ];

  const lowStockAlerts = [
    { medicine: 'Amoxicillin 500mg', currentStock: '15 strips', reorderLevel: '20 strips', status: 'Critical' },
    { medicine: 'Paracetamol 650mg', currentStock: '30 strips', reorderLevel: '50 strips', status: 'Warning' },
    { medicine: 'Atorvastatin 10mg', currentStock: '12 strips', reorderLevel: '15 strips', status: 'Warning' },
    { medicine: 'Metoprolol 25mg', currentStock: '5 strips', reorderLevel: '10 strips', status: 'Critical' },
  ];

  const expiryAlerts = [
    { medicine: 'Ciprofloxacin 500mg', expiryDate: '2026-07-15', daysLeft: '26 days', status: 'Critical' },
    { medicine: 'Ibuprofen 400mg', expiryDate: '2026-08-01', daysLeft: '43 days', status: 'Warning' },
    { medicine: 'Azithromycin 250mg', expiryDate: '2026-07-20', daysLeft: '31 days', status: 'Critical' },
    { medicine: 'Cetirizine 10mg', expiryDate: '2026-08-15', daysLeft: '57 days', status: 'Warning' },
  ];

  // Simple CSS bar chart data for dispensations
  const chartData = [45, 60, 55, 85, 70, 95, 84];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Pharmacy Dashboard</h2>
          <p className="text-text-gray mt-1">Overview of today's pharmacy operations and inventory.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft hover:bg-primary-dark transition-colors">
          <TrendingUp size={16} /> Order Inventory
        </button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-soft interactive-card border-none relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary/10 transition-colors">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {stat.trend}
              </div>
            </div>
            <h3 className="text-sm font-medium text-text-gray mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-text-dark">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Weekly Dispensations Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft interactive-card border-none p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Prescriptions Dispensed</h3>
              <p className="text-sm text-text-gray">Past 7 Days</p>
            </div>
            <select className="bg-gray-50 border border-border-color text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-1.5 h-[200px] mt-auto relative">
            {/* SVG Trend Line / Area Chart Overlay */}
            <div className="absolute inset-x-0 top-0 h-[178px] pointer-events-none z-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="overlayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#138B78" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#138B78" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path 
                  d="M 7.1,55 L 21.4,40 L 35.7,45 L 50.0,15 L 64.3,30 L 78.6,5 L 92.9,16 L 92.9,100 L 7.1,100 Z" 
                  fill="url(#overlayGrad)"
                />
                {/* Spline Path */}
                <path 
                  d="M 7.1,55 L 21.4,40 L 35.7,45 L 50.0,15 L 64.3,30 L 78.6,5 L 92.9,16" 
                  fill="none" 
                  stroke="#138B78" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            {chartData.map((val, idx) => (
              <div key={idx} className="w-full flex flex-col items-center gap-2 group relative z-20">
                <div className="w-full relative h-full flex items-end bg-hover-bg rounded-t-xl overflow-hidden">
                  <div 
                    className="w-full bg-gradient-to-t from-primary/50 to-primary/80 group-hover:from-primary/70 group-hover:to-primary transition-all rounded-t-xl relative"
                    style={{ height: `${val}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-9 left-1/2 -translate-x-1/2 bg-text-dark text-white text-[10px] font-extrabold py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap transition-opacity pointer-events-none z-30">
                      {val} Rx
                    </div>
                  </div>
                </div>
                <span className={`text-[10px] font-bold ${idx === chartData.length - 1 ? 'text-primary' : 'text-text-gray'}`}>{days[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-soft interactive-card border-none p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-text-dark">Low Stock Alerts</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{lowStockAlerts.length}</span>
          </div>
          <div className="flex flex-col gap-2.5 overflow-y-auto pr-2 custom-scrollbar">
            {lowStockAlerts.map((alert, idx) => (
              <div key={idx} className={`flex flex-col p-2.5 rounded-xl border transition-all duration-200 hover:shadow-soft ${
                alert.status === 'Critical' ? 'bg-red-50/30 border-red-200 hover:border-red-300' : 'bg-orange-50/30 border-orange-200 hover:border-orange-300'
              } group`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-bold text-text-dark truncate max-w-[110px]" title={alert.medicine}>{alert.medicine}</h4>
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                    alert.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-text-gray font-semibold">
                  <span>Stock: <strong className="text-text-dark">{alert.currentStock}</strong></span>
                  <span>Min: {alert.reorderLevel}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-1.5 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
            View All Inventory
          </button>
        </div>

        {/* Expiry Date Alerts */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-soft interactive-card border-none p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-text-dark">Expiry Alerts</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{expiryAlerts.length}</span>
          </div>
          <div className="flex flex-col gap-2.5 overflow-y-auto pr-2 custom-scrollbar">
            {expiryAlerts.map((alert, idx) => (
              <div key={idx} className={`flex flex-col p-2.5 rounded-xl border transition-all duration-200 hover:shadow-soft ${
                alert.status === 'Critical' ? 'bg-red-50/30 border-red-200 hover:border-red-300' : 'bg-orange-50/30 border-orange-200 hover:border-orange-300'
              } group`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-bold text-text-dark truncate max-w-[110px]" title={alert.medicine}>{alert.medicine}</h4>
                  <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                    alert.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-text-gray font-semibold">
                  <span>Expiry: <strong className="text-text-dark">{alert.expiryDate}</strong></span>
                  <span>{alert.daysLeft}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-1.5 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
            View Expiring Items
          </button>
        </div>
      </div>

      {/* Bottom Section: Recent Dispensations */}
      <div className="bg-white rounded-2xl shadow-soft interactive-card border-none p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            <h3 className="text-lg font-bold text-text-dark">Recently Dispensed</h3>
          </div>
          <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">View Dispense Logs</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-y border-border-color text-[10px] font-bold text-text-gray uppercase tracking-wider">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Rx ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Items Dispensed</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDispensations.map((log, idx) => (
                <tr key={idx} className="border-b border-border-color/50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-text-gray flex items-center gap-2"><Clock size={14}/> {log.time}</td>
                  <td className="py-3 px-4 text-sm font-bold text-text-dark">{log.rxId}</td>
                  <td className="py-3 px-4 text-sm text-text-dark font-medium">{log.patient}</td>
                  <td className="py-3 px-4 text-sm text-text-gray">{log.items} medicines</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-bold tracking-wide">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
