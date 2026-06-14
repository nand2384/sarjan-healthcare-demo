import { useState } from 'react';
import { scheduledAppointments, type ScheduledAppointment } from '../../data/mockData';
import { Phone, CheckCircle2, UserCheck, Calendar } from 'lucide-react';

export const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<ScheduledAppointment[]>(scheduledAppointments);

  const handleMarkArrived = (id: string) => {
    // In a real app, this would trigger an API call to move the patient to the actual Queue.
    // For now, we update the local state to show a success state.
    setAppointments(prev => prev.map(appt => 
      appt.id === id ? { ...appt, status: 'arrived' } : appt
    ));

    // Optional: Alert or toast to simulate the action
    alert('Patient successfully added to the Dashboard Queue!');
  };

  return (
    <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border-color bg-indigo-50/30 flex items-center gap-2">
        <Calendar size={18} className="text-indigo-600" />
        <h3 className="font-semibold text-text-dark">Scheduled Roster - Today</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
          <tr className="bg-bg-base border-b border-border-color text-text-gray text-xs uppercase tracking-wider">
            <th className="p-4 font-semibold">Patient Name</th>
            <th className="p-4 font-semibold">Contact</th>
            <th className="p-4 font-semibold">Reason</th>
            <th className="p-4 font-semibold">Doctor</th>
            <th className="p-4 font-semibold">Time Slot</th>
            <th className="p-4 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-color text-sm text-text-dark">
          {appointments.map(appt => {
            const isArrived = appt.status === 'arrived';
            return (
              <tr key={appt.id} className={`transition-colors ${isArrived ? 'bg-green-50/30 opacity-70' : 'hover:bg-hover-bg'}`}>
                <td className="p-4 font-bold text-text-dark">{appt.patientName}</td>
                <td className="p-4 text-text-gray">
                  <div className="flex items-center gap-2">
                    <Phone size={14} /> {appt.phone}
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {appt.reasonForVisit}
                  </span>
                </td>
                <td className="p-4 font-medium">{appt.doctorName}</td>
                <td className="p-4">
                  <span className="text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md text-xs font-bold border border-indigo-100">
                    {appt.timeSlot}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {isArrived ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-green-700 bg-green-100 border border-green-200">
                      <CheckCircle2 size={16} /> Arrived & Queued
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleMarkArrived(appt.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-colors shadow-sm"
                    >
                      <UserCheck size={16} /> Mark as Arrived
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
          {appointments.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-text-gray italic">
                No scheduled appointments for today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};
