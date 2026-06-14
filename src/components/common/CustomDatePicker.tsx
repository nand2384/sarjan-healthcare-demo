import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CustomDatePickerProps {
  selectedDate: string;
  onChange: (date: string) => void;
  doctorId: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, onChange, doctorId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock availability logic based on doctor
  // d1: Mon, Wed, Fri
  // d2: Tue, Thu, Sat
  // d3: Mon, Tue, Wed, Thu, Fri
  const isDateAvailable = (date: Date, dId: string) => {
    if (!dId) return false;
    const day = date.getDay(); // 0 is Sunday, 1 is Monday...
    const today = new Date();
    today.setHours(0,0,0,0);
    if (date < today) return false;

    if (dId === 'd1') return day === 1 || day === 3 || day === 5;
    if (dId === 'd2') return day === 2 || day === 4 || day === 6;
    if (dId === 'd3') return day >= 1 && day <= 5;
    return true;
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12);
    if (isDateAvailable(date, doctorId)) {
      // Format as YYYY-MM-DD
      const formatted = date.toISOString().split('T')[0];
      onChange(formatted);
      setIsOpen(false);
    }
  };

  // formatting helper for the input display
  let displayDate = '';
  if (selectedDate) {
    const d = new Date(selectedDate + "T12:00:00"); // Avoid timezone issues
    displayDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={`w-full border rounded-md px-4 py-2.5 flex items-center justify-between cursor-pointer bg-white transition-colors ${isOpen ? 'ring-2 ring-primary/20 border-primary' : 'border-border-color'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={displayDate ? "text-text-dark" : "text-text-gray"}>{displayDate || "Select Date"}</span>
        <CalendarIcon size={18} className="text-text-gray" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-border-color p-4 z-50 w-72 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex justify-between items-center mb-4">
            <button 
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft size={20} className="text-text-dark" />
            </button>
            <h4 className="font-bold text-text-dark">
              {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <button 
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight size={20} className="text-text-dark" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-semibold text-text-gray">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {blanks.map(blank => (
              <div key={`blank-${blank}`} className="h-8"></div>
            ))}
            {days.map(day => {
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12);
              const available = isDateAvailable(date, doctorId);
              const isSelected = selectedDate === date.toISOString().split('T')[0];

              return (
                <button
                  key={day}
                  type="button"
                  disabled={!available}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDateClick(day);
                  }}
                  className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors mx-auto
                    ${!doctorId ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                    ${doctorId && available && !isSelected ? 'bg-blue-50 text-blue-700 font-semibold hover:bg-blue-600 hover:text-white cursor-pointer' : ''}
                    ${doctorId && !available ? 'text-gray-300 cursor-not-allowed line-through opacity-50' : ''}
                    ${isSelected ? 'bg-primary text-white font-bold shadow-md' : ''}
                  `}
                  title={!doctorId ? "Select a doctor first" : !available ? "Doctor not available" : "Available"}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {!doctorId && (
            <p className="text-xs text-red-500 mt-3 text-center font-medium">Select a doctor first to see schedule.</p>
          )}
        </div>
      )}
    </div>
  );
};
