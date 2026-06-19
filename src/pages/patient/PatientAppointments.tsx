import { useState } from 'react';
import { Calendar, Clock, Video, User, MapPin, Search, Check } from 'lucide-react';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'In-Person' | 'Video Consult';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  location: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    date: '10 July 2026',
    time: '10:30 AM',
    type: 'In-Person',
    status: 'Confirmed',
    location: 'Room 204, Floor 2, Sarjan Healthcare'
  },
  {
    id: 'apt-002',
    doctorName: 'Dr. Emily Chen',
    specialty: 'Dermatologist',
    date: '15 July 2026',
    time: '04:15 PM',
    type: 'Video Consult',
    status: 'Confirmed',
    location: 'Online'
  },
  {
    id: 'apt-003',
    doctorName: 'Dr. Michael Chang',
    specialty: 'Orthopedic',
    date: '02 June 2026',
    time: '11:00 AM',
    type: 'In-Person',
    status: 'Completed',
    location: 'Room 101, Floor 1, Sarjan Healthcare'
  },
  {
    id: 'apt-004',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    date: '15 May 2026',
    time: '09:00 AM',
    type: 'In-Person',
    status: 'Completed',
    location: 'Room 204, Floor 2, Sarjan Healthcare'
  }
];

export const PatientAppointments = ({ onBookClick }: { onBookClick?: () => void }) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = mockAppointments.filter(apt => {
    const isUpcoming = apt.status === 'Confirmed';
    if (activeTab === 'Upcoming' && !isUpcoming) return false;
    if (activeTab === 'Past' && isUpcoming) return false;

    if (searchTerm) {
      return apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
             apt.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-text-dark flex items-center gap-2">
            <Calendar className="text-primary" /> My Appointments
          </h1>
          <p className="text-text-gray mt-1 text-sm font-medium">
            Manage your upcoming clinic visits and view past consultation history.
          </p>
        </div>
        
        <button 
          onClick={onBookClick}
          className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <Calendar size={18} /> Book New Appointment
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden flex flex-col">
        
        {/* Toolbar & Tabs */}
        <div className="border-b border-border-color flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:px-6 bg-gray-50/50">
          <div className="flex bg-gray-200/60 p-1 rounded-lg w-full sm:w-auto relative z-0">
            <button
              onClick={() => setActiveTab('Upcoming')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all z-10 ${
                activeTab === 'Upcoming' ? 'bg-white text-primary shadow-sm' : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('Past')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all z-10 ${
                activeTab === 'Past' ? 'bg-white text-primary shadow-sm' : 'text-text-gray hover:text-text-dark'
              }`}
            >
              Past History
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
            <input 
              type="text" 
              placeholder="Search doctor or specialty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* List Body */}
        <div className="p-4 md:p-6 space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(apt => (
              <div 
                key={apt.id} 
                className="group relative border border-border-color rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all bg-white overflow-hidden"
              >
                {/* Decorative side accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${apt.status === 'Confirmed' ? 'bg-primary' : 'bg-gray-300'}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-2">
                  
                  {/* Info Section */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-extrabold shrink-0 border border-primary/20">
                      {apt.doctorName.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-text-dark text-lg">{apt.doctorName}</h3>
                      <p className="text-sm font-bold text-primary mb-3">{apt.specialty}</p>
                      
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-text-gray font-medium">
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          <Calendar size={14} className="text-text-light" /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          <Clock size={14} className="text-text-light" /> {apt.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {apt.type === 'Video Consult' ? <Video size={14} className="text-blue-500" /> : <User size={14} className="text-green-500" />}
                          {apt.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Status */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:gap-2 shrink-0 border-t md:border-t-0 md:border-l border-border-color pt-4 md:pt-0 md:pl-6 pl-2">
                    
                    <div className="flex flex-col gap-1 w-full">
                      {apt.status === 'Confirmed' ? (
                        <>
                          <button className="w-full text-center px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold rounded-lg transition-colors border border-transparent">
                            Reschedule
                          </button>
                          <button className="w-full text-center px-4 py-2 hover:bg-red-50 text-text-light hover:text-red-600 text-sm font-bold rounded-lg transition-colors">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-bold mx-auto md:mr-0">
                          <Check size={14} /> {apt.status}
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Location Footer (if in person or video link) */}
                <div className="mt-4 pt-3 border-t border-border-color/50 pl-2">
                  <p className="text-xs font-medium text-text-light flex items-center gap-1.5">
                    {apt.type === 'In-Person' ? <MapPin size={12} /> : <Video size={12} />}
                    {apt.location}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-text-light" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-1">No Appointments Found</h3>
              <p className="text-text-gray text-sm max-w-sm">
                You don't have any {activeTab.toLowerCase()} appointments matching your search criteria.
              </p>
              {activeTab === 'Upcoming' && (
                <button 
                  onClick={onBookClick}
                  className="mt-6 text-primary font-bold text-sm hover:underline flex items-center gap-1"
                >
                  Book an appointment now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
