import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { dailyStats } from '../../data/mockData';

export const StatCards = React.memo(function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
      <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-lg text-primary">
          <Calendar size={24} />
        </div>
        <div>
          <p className="text-text-gray text-sm font-medium">Total Appointments</p>
          <p className="text-text-dark text-2xl font-bold">{dailyStats.totalAppointments}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm flex items-center gap-4">
        <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-text-gray text-sm font-medium">Remaining Today</p>
          <p className="text-text-dark text-2xl font-bold">{dailyStats.remainingAppointments}</p>
        </div>
      </div>
    </div>
  );
});
