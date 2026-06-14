import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { scheduledAppointments } from '../../data/mockData';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AppointmentsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate calendar grid array
  const blanks = Array.from({ length: firstDayOfMonth }, () => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];
  
  // Pad the end to ensure full rows (multiples of 7)
  while (totalSlots.length % 7 !== 0) {
    totalSlots.push(null);
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Group appointments by date
  const appointmentsByDate = scheduledAppointments.reduce((acc, appt) => {
    if (!acc[appt.date]) {
      acc[appt.date] = [];
    }
    acc[appt.date].push(appt);
    return acc;
  }, {} as Record<string, typeof scheduledAppointments>);

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getFormattedDate = (day: number) => {
    // Return YYYY-MM-DD
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)]">
      
      {/* Calendar Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-border-color bg-white">
        <h2 className="text-xl font-bold text-text-dark">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 rounded-md hover:bg-hover-bg text-text-gray border border-border-color transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goToToday} className="px-4 py-2 font-medium text-sm text-text-dark hover:bg-hover-bg border border-border-color rounded-md transition-colors">
            Today
          </button>
          <button onClick={nextMonth} className="p-2 rounded-md hover:bg-hover-bg text-text-gray border border-border-color transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="min-w-[700px] flex flex-col h-full">
          <div className="grid grid-cols-7 border-b border-border-color bg-bg-base/50 shrink-0">
            {daysOfWeek.map(day => (
              <div key={day} className="px-4 py-3 text-center text-sm font-semibold text-text-gray uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 flex-1">
            {totalSlots.map((day, idx) => {
              const todayFlag = day ? isToday(day) : false;
              const dateStr = day ? getFormattedDate(day) : '';
              const dayAppointments = day ? (appointmentsByDate[dateStr] || []) : [];
              const scheduledCount = dayAppointments.filter(a => a.status === 'scheduled').length;
              const arrivedCount = dayAppointments.filter(a => a.status === 'arrived').length;
              
              return (
                <div 
                  key={idx} 
                  className={`min-h-[120px] p-2 border-b border-r border-border-color ${!day ? 'bg-bg-base/30' : 'bg-white hover:bg-hover-bg/50 transition-colors cursor-pointer group'} ${idx % 7 === 6 ? 'border-r-0' : ''}`}
                >
                  {day && (
                    <>
                      <div className="flex justify-between items-start">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${todayFlag ? 'bg-primary text-white shadow-md' : 'text-text-dark group-hover:bg-primary/10 group-hover:text-primary transition-colors'}`}>
                          {day}
                        </span>
                      </div>
                      
                      {/* Render Events */}
                      <div className="mt-2 flex flex-col gap-1.5 overflow-hidden">
                        {scheduledCount > 0 && (
                          <div className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-md text-xs font-semibold text-indigo-700 shadow-sm truncate">
                            {scheduledCount} Scheduled
                          </div>
                        )}
                        {arrivedCount > 0 && (
                          <div className="px-2.5 py-1.5 bg-green-50 border border-green-100 rounded-md text-xs font-semibold text-green-700 shadow-sm truncate">
                            {arrivedCount} Arrived
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
