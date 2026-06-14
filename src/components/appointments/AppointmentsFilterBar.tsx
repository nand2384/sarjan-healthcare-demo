import { Search, Filter, Plus } from 'lucide-react';

export const AppointmentsFilterBar = ({ view, setView }: { view: 'list' | 'calendar', setView: (v: 'list' | 'calendar') => void }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border-color shadow-sm mb-6">
      <div className="flex gap-4 items-center">
        <div className="flex items-center bg-bg-base rounded-md border border-border-color px-3 py-2 w-[300px]">
          <Search size={16} className="text-text-light" />
          <input 
            type="text" 
            placeholder="Search appointments..." 
            className="border-none bg-transparent outline-none ml-2 flex-1 text-sm text-text-dark placeholder:text-text-light"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border-color rounded-md text-sm font-medium text-text-gray hover:bg-hover-bg transition-colors">
          <Filter size={16} /> Filter
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex bg-bg-base rounded-lg p-1 border border-border-color">
          <button 
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button 
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            onClick={() => setView('calendar')}
          >
            Calendar
          </button>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-[#0f6e5e] transition-colors">
          <Plus size={16} /> New Appointment
        </button>
      </div>
    </div>
  );
};
