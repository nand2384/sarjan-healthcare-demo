import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronRight, CheckCircle2 } from 'lucide-react';

const mockDoctors = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', education: 'MD, FACC', fee: 500, room: 'Room 201', avatarBg: 'bg-teal-50 text-teal-600 border-teal-100' },
  { id: 'd2', name: 'Dr. Michael Chang', specialty: 'Orthopedics', education: 'MS, MCh', fee: 450, room: 'Room 105', avatarBg: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'd3', name: 'Dr. Emily Chen', specialty: 'Dermatology', education: 'MD, DNB', fee: 400, room: 'Room 302', avatarBg: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 'd4', name: 'Dr. Robert Smith', specialty: 'General Medicine', education: 'MBBS, MD', fee: 350, room: 'Room 101', avatarBg: 'bg-amber-50 text-amber-600 border-amber-100' },
];

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'];

const availableDates = [
  { id: 'd1', day: 'Today', date: '24', value: '2026-06-24', slots: 3 },
  { id: 'd2', day: 'Tomorrow', date: '25', value: '2026-06-25', slots: 5 },
  { id: 'd3', day: 'Wed', date: '26', value: '2026-06-26', slots: 2 },
  { id: 'd4', day: 'Thu', date: '27', value: '2026-06-27', slots: 8 },
  { id: 'd5', day: 'Fri', date: '28', value: '2026-06-28', slots: 1 },
];

export const PatientBookAppointment = (_props: { profile?: any }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    doctorId: '',
    date: '',
    time: ''
  });

  const handleConfirm = () => {
    if (formData.reason && formData.doctorId && formData.date && formData.time) {
      setIsSuccess(true);
    }
  };

  const selectedDoctorObj = mockDoctors.find(d => d.id === formData.doctorId);

  if (isSuccess) {
    const doctor = mockDoctors.find(d => d.id === formData.doctorId);
    return (
      <div className="p-6 md:p-8 space-y-6 bg-transparent animate-in fade-in zoom-in-95 duration-200">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-text-dark mb-2">Appointment Confirmed!</h2>
          <p className="text-text-gray text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Your appointment with <span className="font-bold text-text-dark">{doctor?.name}</span> is confirmed for <span className="font-bold text-text-dark">{formData.date}</span> at <span className="font-bold text-text-dark">{formData.time}</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => {
                setIsSuccess(false);
                setFormData({ reason: '', doctorId: '', date: '', time: '' });
              }}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-text-dark rounded-xl font-bold transition-colors"
            >
              Book Another
            </button>
            <button 
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <CalendarIcon size={18} /> Add to Calendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          <CalendarIcon className="text-primary" /> Book Appointment
        </h1>
        <p className="text-text-gray mt-1 text-sm font-medium">
          Schedule a new clinic visit by filling out the details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Booking Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden">
          
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Reason & Doctor Selection */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Reason for Visit <span className="text-red-500">*</span></label>
                <select 
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-border-color rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="" disabled>Select Reason</option>
                  <option value="General Checkup">General Checkup</option>
                  <option value="2nd Opinion">2nd Opinion</option>
                  <option value="Tests / Reports">Tests / Reports</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Select Doctor <span className="text-red-500">*</span></label>
                <select 
                  value={formData.doctorId}
                  onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-border-color rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="" disabled>Choose a doctor...</option>
                  {mockDoctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialty})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-text-dark">Available Dates <span className="text-red-500">*</span></label>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {availableDates.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setFormData({...formData, date: d.value})}
                      className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-xl border transition-all ${
                        formData.date === d.value
                          ? 'border-primary bg-primary text-white shadow-md'
                          : 'border-border-color bg-gray-50 text-text-dark hover:border-primary/50'
                      }`}
                    >
                      <span className={`text-xs font-bold ${formData.date === d.value ? 'text-white/80' : 'text-text-gray'}`}>{d.day}</span>
                      <span className="text-xl font-bold my-0.5">{d.date}</span>
                      <span className={`text-[10px] font-bold ${formData.date === d.value ? 'text-white' : 'text-green-600'}`}>{d.slots} slots</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Choose Time Slot <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setFormData({...formData, time})}
                      disabled={!formData.date}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        formData.time === time 
                          ? 'border-primary bg-primary text-white shadow-sm' 
                          : 'border-border-color bg-gray-50 text-text-gray hover:border-primary/50 hover:bg-white hover:text-text-dark'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border-color bg-gray-50/50 flex justify-end">
            <button 
              onClick={handleConfirm}
              disabled={!formData.reason || !formData.doctorId || !formData.date || !formData.time}
              className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2"
            >
              Confirm Booking <ChevronRight size={18} />
            </button>
          </div>

        </div>

        {/* Right Side: Dynamic Doctor Profile / Guidelines */}
        <div className="lg:col-span-1 space-y-6">
          {selectedDoctorObj ? (
            <div className="bg-white rounded-2xl shadow-soft border border-border-color p-6 flex flex-col interactive-card">
              <h3 className="text-xs font-bold text-text-light uppercase tracking-wider mb-4 border-b border-border-color/60 pb-2">Selected Doctor Profile</h3>
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-sm border ${selectedDoctorObj.avatarBg}`}>
                  {selectedDoctorObj.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-text-dark text-base">{selectedDoctorObj.name}</h4>
                  <p className="text-xs text-text-gray font-medium">{selectedDoctorObj.education}</p>
                  <span className="inline-block bg-primary/5 text-primary-dark font-bold px-2 py-0.5 rounded border border-primary/10 text-[9px] uppercase tracking-wide mt-1.5">
                    {selectedDoctorObj.specialty}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border-color/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-gray font-semibold">Consultation Fee</span>
                  <span className="text-text-dark font-bold text-sm">₹{selectedDoctorObj.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-gray font-semibold">OPD Chamber</span>
                  <span className="text-text-dark font-medium">{selectedDoctorObj.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-gray font-semibold">Availability</span>
                  <span className="text-green-600 font-bold">Mon - Sat (9 AM - 5 PM)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft border border-border-color p-6 flex flex-col items-center justify-center text-center py-10 interactive-card">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                <CalendarIcon size={20} />
              </div>
              <h4 className="font-bold text-text-dark text-sm">Select a Doctor</h4>
              <p className="text-xs text-text-gray mt-1 max-w-[200px]">
                Choose a doctor from the form to view their profile, fees, and schedule details.
              </p>
            </div>
          )}

          {/* Guidelines / FAQs Card */}
          <div className="bg-white rounded-2xl shadow-soft border border-border-color p-6 flex flex-col interactive-card">
            <h3 className="text-xs font-bold text-text-light uppercase tracking-wider mb-4 border-b border-border-color/60 pb-2">Booking Guidelines</h3>
            
            <ul className="space-y-3 text-xs text-text-gray font-medium">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Appointments can be rescheduled or cancelled up to 2 hours before the slot.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Please arrive at the clinic 15 minutes prior to your selected time slot.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span>Carry past prescriptions and reports during your visit.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
