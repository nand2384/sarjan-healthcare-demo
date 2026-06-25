import { useState } from 'react';
import { AppointmentsFilterBar } from '../components/appointments/AppointmentsFilterBar';
import { AppointmentsList } from '../components/appointments/AppointmentsList';
import { AppointmentsCalendar } from '../components/appointments/AppointmentsCalendar';
import { type ScheduledAppointment } from '../data/mockData';

interface AppointmentsProps {
  localAppointmentsData: ScheduledAppointment[];
  handleMarkAsArrived: (appointmentId: string) => void;
}

export const Appointments = ({ localAppointmentsData, handleMarkAsArrived }: AppointmentsProps) => {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-dark">Appointments Master Queue</h1>
        <p className="text-text-gray mt-1 text-sm">Manage all scheduled appointments and active walk-in queues.</p>
      </div>

      <AppointmentsFilterBar view={view} setView={setView} />
      
      {view === 'list' ? (
        <AppointmentsList 
          appointments={localAppointmentsData}
          handleMarkArrived={handleMarkAsArrived}
        />
      ) : (
        <AppointmentsCalendar appointments={localAppointmentsData} />
      )}
    </div>
  );
};
