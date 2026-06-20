
import { Users, Calendar, Wallet, Stethoscope, ArrowUpRight, ArrowDownRight, Activity, Clock, ShieldAlert, Star, TrendingUp } from 'lucide-react';

export const AdminDashboardOverview = () => {
  const stats = [
    { label: 'Total Patients', value: '1,248', trend: '+12%', isPositive: true, icon: <Users size={20} /> },
    { label: 'Appointments Today', value: '42', trend: '+5%', isPositive: true, icon: <Calendar size={20} /> },
    { label: 'Active Staff', value: '24', trend: '0%', isPositive: true, icon: <Stethoscope size={20} /> },
    { label: "Today's Revenue", value: '₹45,200', trend: '-2%', isPositive: false, icon: <Wallet size={20} /> }
  ];

  const recentLogs = [
    { time: '10:42 AM', action: 'System Backup', user: 'System', status: 'Success' },
    { time: '09:15 AM', action: 'New Doctor Profile Added', user: 'Admin (You)', status: 'Success' },
    { time: '08:30 AM', action: 'Failed Login Attempt', user: 'Unknown', status: 'Warning' },
    { time: '08:00 AM', action: 'Pricing Updated', user: 'Admin (You)', status: 'Success' },
  ];

  const pendingActions = [
    { type: 'Review', title: '5-Star Review from John D.', time: '2 hours ago', icon: <Star size={16} className="text-yellow-500" /> },
    { type: 'Alert', title: 'Low Inventory: Amoxicillin', time: '5 hours ago', icon: <ShieldAlert size={16} className="text-red-500" /> },
    { type: 'Request', title: 'Leave Request: Dr. Sarah', time: '1 day ago', icon: <Clock size={16} className="text-blue-500" /> },
  ];

  // Simple CSS bar chart data
  const revenueData = [40, 65, 45, 80, 55, 90, 75];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Admin Dashboard Overview</h2>
          <p className="text-text-gray mt-1">Here is what's happening in your clinic today.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft hover:bg-primary-dark transition-colors">
          <TrendingUp size={16} /> Generate Report
        </button>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-border-color hover:border-primary/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-primary/5 text-primary rounded-xl group-hover:bg-primary/10 transition-colors">
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-sm font-medium text-text-gray mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-text-dark">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-border-color p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Revenue Trends</h3>
              <p className="text-sm text-text-gray">Past 7 Days</p>
            </div>
            <select className="bg-gray-50 border border-border-color text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 h-[200px] mt-auto">
            {revenueData.map((val, idx) => (
              <div key={idx} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full relative h-full flex items-end bg-gray-50 rounded-t-md overflow-hidden">
                  <div 
                    className="w-full bg-primary/80 group-hover:bg-primary transition-all rounded-t-md relative"
                    style={{ height: `${val}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-text-dark text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none z-10">
                      ₹{val * 1000}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-text-gray">{days[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-dark">Action Required</h3>
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{pendingActions.length}</span>
          </div>
          <div className="flex flex-col gap-4">
            {pendingActions.map((action, idx) => (
              <div key={idx} className="flex gap-4 p-3 rounded-xl border border-border-color hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="mt-0.5 p-2 bg-white rounded-lg shadow-sm border border-border-color group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark mb-0.5">{action.title}</h4>
                  <p className="text-xs text-text-gray font-medium flex items-center gap-2">
                    <span className="uppercase tracking-wider">{action.type}</span> • {action.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent System Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            <h3 className="text-lg font-bold text-text-dark">Recent Audit Logs</h3>
          </div>
          <button className="text-sm font-bold text-primary hover:text-primary-dark transition-colors">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-y border-border-color text-[10px] font-bold text-text-gray uppercase tracking-wider">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log, idx) => (
                <tr key={idx} className="border-b border-border-color/50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-text-gray">{log.time}</td>
                  <td className="py-3 px-4 text-sm font-bold text-text-dark">{log.action}</td>
                  <td className="py-3 px-4 text-sm text-text-gray">{log.user}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold tracking-wide border ${
                      log.status === 'Success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
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
