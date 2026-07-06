import { Calendar, FileText, Activity, Clock, Stethoscope, ChevronRight } from 'lucide-react';

interface ProfileData {
  greetingName: string;
  nextAppointment: {
    month: string;
    day: string;
    type: string;
    doctor: string;
    time: string;
  } | null;
  records: Array<{
    title: string;
    type: string;
    date: string;
    doctor?: string;
  }>;
  pendingBill: number;
  vitals: {
    bp: string;
    bpStatus: string;
    hr: string;
    hrStatus: string;
    weight: string;
    weightStatus: string;
  };
}

const PROFILE_DASHBOARD_DATA: Record<string, ProfileData> = {
  p1: {
    greetingName: "John",
    nextAppointment: { month: "Jun", day: "24", type: "General Checkup", doctor: "Dr. Sarah Jenkins", time: "10:30 AM" },
    records: [
      { title: "Complete Blood Count (CBC)", type: "Lab Result", date: "Jun 15, 2026" },
      { title: "Prescription: Paracetamol", type: "Prescription", date: "May 10, 2026", doctor: "Dr. Sarah Jenkins" }
    ],
    pendingBill: 450,
    vitals: { bp: "120/80", bpStatus: "Normal", hr: "72 bpm", hrStatus: "Normal", weight: "75 kg", weightStatus: "Stable" }
  },
  p2: {
    greetingName: "Jane",
    nextAppointment: { month: "Jul", day: "15", type: "Cardiology Review", doctor: "Dr. Michael Chen", time: "11:30 AM" },
    records: [
      { title: "Lipid Profile Test", type: "Lab Result", date: "Jun 18, 2026" },
      { title: "Prescription: Amlodipine", type: "Prescription", date: "May 22, 2026", doctor: "Dr. Michael Chen" }
    ],
    pendingBill: 500,
    vitals: { bp: "140/90", bpStatus: "Elevated", hr: "80 bpm", hrStatus: "Normal", weight: "62 kg", weightStatus: "Stable" }
  },
  p3: {
    greetingName: "Jimmy",
    nextAppointment: { month: "Aug", day: "10", type: "Dental Checkup", doctor: "Dr. Sarah Jenkins", time: "09:30 AM" },
    records: [
      { title: "Pediatric Vaccination Card", type: "Lab Result", date: "Jun 02, 2026" },
      { title: "Prescription: Vitamin C drops", type: "Prescription", date: "Jun 02, 2026", doctor: "Dr. Sarah Jenkins" }
    ],
    pendingBill: 0,
    vitals: { bp: "95/60", bpStatus: "Normal", hr: "95 bpm", hrStatus: "Normal", weight: "25 kg", weightStatus: "Normal" }
  }
};

export const PatientDashboardOverview = ({ profile }: { profile: any }) => {
  const data = PROFILE_DASHBOARD_DATA[profile.id] || PROFILE_DASHBOARD_DATA.p1;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-text-dark">Good morning, {data.greetingName}!</h2>
          <p className="text-text-gray mt-1">Here is a summary of your health and upcoming appointments.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft hover:bg-primary-dark transition-colors border-0 cursor-pointer">
          <Calendar size={16} /> Book Appointment
        </button>
      </div>

      {/* Hero / Next Appointment */}
      {data.nextAppointment ? (
        <div className="bg-gradient-to-br from-primary/90 to-primary text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center border border-white/20 shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{data.nextAppointment.month}</span>
                <span className="text-2xl font-bold">{data.nextAppointment.day}</span>
              </div>
              <div>
                <p className="text-white/80 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Clock size={14} /> Next Appointment
                </p>
                <h3 className="text-2xl font-bold mb-1">{data.nextAppointment.type}</h3>
                <p className="text-white/90 text-sm flex items-center gap-2">
                  <Stethoscope size={16} /> {data.nextAppointment.doctor} • {data.nextAppointment.time}
                </p>
              </div>
            </div>
            <button className="bg-white text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap shrink-0 border-0 cursor-pointer">
              Reschedule
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-primary/90 to-primary text-white rounded-2xl p-6 shadow-md relative overflow-hidden text-center py-8">
          <p className="text-sm font-semibold opacity-90">No upcoming appointments scheduled.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Medical Records */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-border-color p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <FileText size={20} className="text-primary" /> Recent Records
            </h3>
            <button className="text-sm font-bold text-primary hover:underline border-0 bg-transparent cursor-pointer">View All</button>
          </div>
          
          <div className="space-y-4">
            {data.records.map((rec, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border-color hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="flex gap-4 items-center">
                  <div className={`p-3 rounded-xl ${rec.type === 'Lab Result' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark group-hover:text-primary transition-colors">{rec.title}</h4>
                    <p className="text-xs font-medium text-text-gray mt-0.5">
                      {rec.type === 'Lab Result' ? 'Lab Result' : `${rec.doctor}`} • {rec.date}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-text-light group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats / Pending Items */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
            <h3 className="text-lg font-bold text-text-dark mb-4">Pending Bills</h3>
            {data.pendingBill > 0 ? (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-center">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Due in 3 days</p>
                <h4 className="text-3xl font-bold text-text-dark mb-3">₹{data.pendingBill}</h4>
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors border-0 cursor-pointer">
                  Pay Now
                </button>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">All Clear</p>
                <h4 className="text-xl font-bold text-text-dark mb-1">No Pending Bills</h4>
                <p className="text-xs text-text-gray">You are all caught up!</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4">Vital Summaries</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-text-gray">Blood Pressure</p>
                  <p className="text-lg font-bold text-text-dark">{data.vitals.bp}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  data.vitals.bpStatus === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>{data.vitals.bpStatus}</span>
              </div>
              <div className="w-full h-px bg-border-color/50"></div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-text-gray">Heart Rate</p>
                  <p className="text-lg font-bold text-text-dark">{data.vitals.hr}</p>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">{data.vitals.hrStatus}</span>
              </div>
              <div className="w-full h-px bg-border-color/50"></div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-text-gray">Weight</p>
                  <p className="text-lg font-bold text-text-dark">{data.vitals.weight}</p>
                </div>
                <span className="text-[10px] font-bold bg-gray-100 text-text-gray px-2 py-0.5 rounded uppercase">{data.vitals.weightStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
