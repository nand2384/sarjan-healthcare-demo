import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { dailyStats } from '../../data/mockData';

export const StatCards = React.memo(function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
      <div className="bg-white rounded-2xl border border-border-color/60 p-5 shadow-soft hover:shadow-md transition-all duration-200 flex items-center gap-4">
        <div className="bg-primary/5 p-3 rounded-xl text-primary border border-primary/10">
          <Calendar size={24} />
        </div>
        <div>
          <p className="text-text-gray text-sm font-medium">Total Appointments</p>
          <p className="text-text-dark text-2xl font-bold mt-0.5">{dailyStats.totalAppointments}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-border-color/60 p-5 shadow-soft hover:shadow-md transition-all duration-200 flex items-center gap-4">
        <div className="bg-amber-50/60 p-3 rounded-xl text-amber-600 border border-amber-100/50">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-text-gray text-sm font-medium">Remaining Today</p>
          <p className="text-text-dark text-2xl font-bold mt-0.5">{dailyStats.remainingAppointments}</p>
        </div>
      </div>
    </div>
  );
});
