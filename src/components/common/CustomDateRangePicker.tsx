import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onChange: (start: string, end: string) => void;
}

export const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({ startDate, endDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date(startDate || new Date().toISOString()));

  // Interaction state
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [selectingStart, setSelectingStart] = useState<string | null>(null);



  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (dateStr: string) => {
    if (!selectingStart) {
      // First click: Select start date, clear end date
      setSelectingStart(dateStr);
    } else {
      // Second click: Select end date
      const start = new Date(selectingStart);
      const end = new Date(dateStr);

      if (end < start) {
        // User clicked backwards, swap them
        onChange(dateStr, selectingStart);
      } else {
        onChange(selectingStart, dateStr);
      }
      setSelectingStart(null);
      setIsOpen(false); // Close after selection complete
    }
  };

  const handleDayHover = (dateStr: string) => {
    if (selectingStart) {
      setHoverDate(dateStr);
    }
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month); // 0 (Sun) to 6 (Sat)

    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      // Format as YYYY-MM-DD
      const dateObj = new Date(year, month, i);
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      // Determine state for styling
      let isStart = false;
      let isEnd = false;
      let isBetween = false;

      const actStart = selectingStart ? selectingStart : startDate;
      const actEnd = selectingStart ? hoverDate : endDate;

      if (actStart && actEnd) {
        const d = new Date(dateStr).getTime();
        const s = new Date(actStart).getTime();
        const e = new Date(actEnd).getTime();

        if (d === s || d === e) {
          isStart = d === s;
          isEnd = d === e;
        } else if ((d > s && d < e) || (d > e && d < s)) {
          isBetween = true;
        }
      } else if (actStart && dateStr === actStart) {
        isStart = true;
      }

      // Base classes
      let cellClasses = "relative h-10 w-10 flex items-center justify-center text-sm cursor-pointer transition-colors";
      let textClasses = "z-10 relative flex items-center justify-center h-8 w-8 rounded-full transition-colors";

      if (isStart || isEnd) {
        // Only one date selected or this is start/end
        textClasses += " bg-primary text-white font-bold";
        if (isStart && actEnd && actStart !== actEnd) {
          // Half background for connecting highlight (start -> right)
          const s = new Date(actStart as string).getTime();
          const e = new Date(actEnd as string).getTime();
          if (s < e) {
            cellClasses += " before:absolute before:right-0 before:top-1 before:bottom-1 before:left-1/2 before:bg-primary/20";
          } else {
             cellClasses += " before:absolute before:left-0 before:top-1 before:bottom-1 before:right-1/2 before:bg-primary/20";
          }
        }
        if (isEnd && actStart && actStart !== actEnd) {
          // Half background for connecting highlight (end -> left)
           const s = new Date(actStart as string).getTime();
          const e = new Date(actEnd as string).getTime();
          if (s < e) {
            cellClasses += " before:absolute before:left-0 before:top-1 before:bottom-1 before:right-1/2 before:bg-primary/20";
          } else {
             cellClasses += " before:absolute before:right-0 before:top-1 before:bottom-1 before:left-1/2 before:bg-primary/20";
          }
        }
      } else if (isBetween) {
        cellClasses += " bg-primary/20 text-primary-dark font-medium";
      } else {
        textClasses += " text-text-dark hover:bg-gray-100";
      }

      days.push(
        <div 
          key={dateStr} 
          className={cellClasses}
          onClick={() => handleDayClick(dateStr)}
          onMouseEnter={() => handleDayHover(dateStr)}
        >
          <div className={textClasses}>{i}</div>
        </div>
      );
    }

    return days;
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          if (!isOpen) {
            setCurrentMonth(new Date(startDate || new Date().toISOString()));
            setSelectingStart(null);
          }
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-border-color rounded-lg shadow-sm hover:border-primary/50 hover:bg-gray-50 transition-colors w-64 justify-between"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-primary" />
          <span className="text-sm font-medium text-text-dark">
            {startDate === endDate 
              ? formatDateLabel(startDate)
              : `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`}
          </span>
        </div>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-border-color rounded-xl shadow-xl z-50 p-4 w-80">
          
          {/* Header (Month Navigation) */}
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded text-text-gray hover:text-text-dark transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-bold text-text-dark">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button 
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded text-text-gray hover:text-text-dark transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-bold text-text-gray w-10 h-6">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {renderCalendarDays()}
          </div>

          {/* Helper Text */}
          <div className="mt-4 pt-3 border-t border-border-color text-center">
            <p className="text-xs text-text-gray">
              {selectingStart ? 'Select end date...' : 'Select start date...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
