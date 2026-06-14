import React from 'react';
import { PlusCircle, UserPlus, CreditCard } from 'lucide-react';

export const ActionToolbar = React.memo(function ActionToolbar() {
  return (
    <div className="flex gap-4 mb-6">
      <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-[#0f6e5e] transition-colors">
        <UserPlus size={18} />
        Register Walk-in
      </button>
      <button className="flex items-center gap-2 bg-white border border-border-color text-text-dark px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-hover-bg hover:text-primary transition-colors">
        <PlusCircle size={18} />
        New Appointment
      </button>
      <button className="flex items-center gap-2 bg-white border border-border-color text-text-dark px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-hover-bg hover:text-primary transition-colors">
        <CreditCard size={18} />
        Collect Payment
      </button>
    </div>
  );
});
