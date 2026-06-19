import { Calendar, FileText, Activity, Clock, Stethoscope, ChevronRight, FileCheck } from 'lucide-react';

export const PatientDashboardOverview = () => {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Good morning, John!</h2>
          <p className="text-text-gray mt-1">Here is a summary of your health and upcoming appointments.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Calendar size={16} /> Book Appointment
        </button>
      </div>

      {/* Hero / Next Appointment */}
      <div className="bg-gradient-to-br from-primary/90 to-primary text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Jun</span>
              <span className="text-2xl font-bold">24</span>
            </div>
            <div>
              <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                <Clock size={14} /> Next Appointment
              </p>
              <h3 className="text-2xl font-bold mb-1">General Checkup</h3>
              <p className="text-white/90 text-sm flex items-center gap-2">
                <Stethoscope size={16} /> Dr. Sarah Smith • 10:30 AM
              </p>
            </div>
          </div>
          <button className="bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap shrink-0">
            Reschedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Medical Records */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-border-color p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <FileText size={20} className="text-primary" /> Recent Records
            </h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border-color hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Activity size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-dark group-hover:text-primary transition-colors">Complete Blood Count (CBC)</h4>
                  <p className="text-xs font-medium text-text-gray mt-0.5">Lab Result • Jun 15, 2026</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-text-light group-hover:text-primary transition-colors" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border-color hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="flex gap-4 items-center">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-text-dark group-hover:text-primary transition-colors">Prescription: Amoxicillin</h4>
                  <p className="text-xs font-medium text-text-gray mt-0.5">Dr. John Doe • Jun 10, 2026</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-text-light group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>

        {/* Quick Stats / Pending Items */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
            <h3 className="text-lg font-bold text-text-dark mb-4">Pending Bills</h3>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-center">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Due in 3 days</p>
              <h4 className="text-3xl font-bold text-text-dark mb-3">₹450</h4>
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors">
                Pay Now
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4">Vital Summaries</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-text-gray">Blood Pressure</p>
                  <p className="text-lg font-bold text-text-dark">120/80</p>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">Normal</span>
              </div>
              <div className="w-full h-px bg-border-color/50"></div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-text-gray">Heart Rate</p>
                  <p className="text-lg font-bold text-text-dark">72 bpm</p>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">Normal</span>
              </div>
              <div className="w-full h-px bg-border-color/50"></div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-text-gray">Weight</p>
                  <p className="text-lg font-bold text-text-dark">75 kg</p>
                </div>
                <span className="text-[10px] font-bold bg-gray-100 text-text-gray px-2 py-0.5 rounded uppercase">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
