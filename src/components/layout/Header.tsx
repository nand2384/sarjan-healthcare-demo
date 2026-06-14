import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Bell, AlertTriangle, AlertCircle, Info, Menu } from 'lucide-react';
import { globalAlerts } from '../../data/mockData';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  navItems?: { label: string }[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onMenuClick?: () => void;
}

export const Header = React.memo(function Header({ userName = "NS", userRole = "Receptionist", navItems, activeTab, setActiveTab, onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[72px] bg-white border-b border-border-color flex justify-between items-center px-4 md:px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-3 md:gap-6 flex-1 overflow-hidden">
        
        {/* Mobile Menu Toggle */}
        {onMenuClick && (
          <button 
            className="md:hidden p-2 rounded-md text-text-gray hover:bg-gray-100 transition-colors"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
        )}

        <div className="hidden md:flex items-center bg-bg-base rounded-md border border-border-color px-4 py-2 w-[300px] lg:w-[400px] shrink-0">
          <Search size={18} className="text-text-light" />
          <input 
            type="text" 
            placeholder="Search for patient" 
            className="border-none bg-transparent outline-none ml-2 flex-1 text-[0.9rem] text-text-dark placeholder:text-text-light"
          />
        </div>

        {/* Top Navigation for Receptionist */}
        {navItems && navItems.length > 0 && setActiveTab && (
          <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide flex-1">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 ${
                  activeTab === item.label 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-gray hover:bg-hover-bg hover:text-text-dark'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-2 shrink-0">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            className="relative p-2 rounded-full hover:bg-hover-bg transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="text-text-gray" />
            {globalAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-border-color rounded-xl shadow-lg overflow-hidden flex flex-col z-50">
              <div className="px-4 py-3 border-b border-border-color bg-bg-base">
                <h3 className="font-semibold text-text-dark text-sm">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {globalAlerts.length > 0 ? (
                  globalAlerts.map(alert => {
                    let icon, textClass;
                    switch(alert.type) {
                      case 'danger':
                        icon = <AlertCircle size={16} className="text-red-500 mt-0.5" />;
                        textClass = 'text-text-dark';
                        break;
                      case 'warning':
                        icon = <AlertTriangle size={16} className="text-amber-500 mt-0.5" />;
                        textClass = 'text-text-dark';
                        break;
                      default:
                        icon = <Info size={16} className="text-blue-500 mt-0.5" />;
                        textClass = 'text-text-gray';
                    }
                    return (
                      <div key={alert.id} className="flex gap-3 p-4 border-b border-border-color last:border-0 hover:bg-hover-bg transition-colors cursor-pointer">
                        <div className="shrink-0">{icon}</div>
                        <p className={`text-sm ${textClass} leading-tight`}>{alert.message}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-sm text-text-light italic">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Name dropdown */}
        <div className="flex items-center gap-1.5 border-l border-border-color pl-4 md:pl-6 text-[0.9rem] text-text-gray cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold md:mr-2">
            {userName}
          </div>
          <span className="hidden md:inline font-medium text-text-dark">{userRole}</span>
          <ChevronDown size={14} className="hidden md:block" />
        </div>
      </div>
    </header>
  );
});
