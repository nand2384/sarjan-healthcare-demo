import React from 'react';
import { 
  LayoutGrid, 
  Calendar,
  CalendarPlus,
  FileText, 
  CreditCard,
  User,
  LogOut,
  X,
  Stethoscope
} from 'lucide-react';

interface PatientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  isCollapsed?: boolean;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  isCollapsed = false
}) => {

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { icon: <LayoutGrid size={20} />, label: 'Dashboard' }
      ]
    },
    {
      group: 'My Health',
      items: [
        { icon: <Calendar size={20} />, label: 'Appointments' },
        { icon: <CalendarPlus size={20} />, label: 'Book Appointment' },
        { icon: <FileText size={20} />, label: 'Medical Records' }
      ]
    },
    {
      group: 'Account',
      items: [
        { icon: <CreditCard size={20} />, label: 'Billing & Invoices' },
        { icon: <User size={20} />, label: 'My Profile' }
      ]
    }
  ];

  const navItemBaseClass = `flex items-center w-full py-2.5 rounded-xl text-text-gray font-medium text-[0.95rem] transition-all duration-200 hover:bg-primary/5 hover:text-primary ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`;
  const navItemActiveClass = `bg-primary/5 text-primary relative before:content-[''] before:absolute ${isCollapsed ? 'before:-left-2' : 'before:-left-4'} before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-primary before:rounded-r-md font-bold`;

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 md:relative 
      ${isCollapsed ? 'w-[80px]' : 'w-[260px] md:w-full'} h-full
      bg-white border-r border-border-color flex flex-col py-6 transition-all duration-300 shrink-0
      ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
    `}>
      {/* Mobile Close Button */}
      {isMobileMenuOpen && (
        <button 
          onClick={() => setIsMobileMenuOpen?.(false)}
          className="absolute top-4 right-4 p-2 text-text-gray hover:bg-gray-100 rounded-lg md:hidden"
        >
          <X size={20} />
        </button>
      )}

      {/* Logo Area */}
      <div className={`px-6 mb-8 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
          <Stethoscope size={24} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-[1.1rem] text-text-dark leading-none tracking-tight">SARJAN</span>
            <span className="font-bold text-[0.7rem] text-primary tracking-[0.2em] uppercase mt-0.5">HEALTHCARE</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <nav className="space-y-6">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {!isCollapsed && (
                <div className="px-4 text-[11px] font-bold text-text-light uppercase tracking-wider mb-2">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = activeTab === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveTab(item.label);
                      setIsMobileMenuOpen?.(false);
                    }}
                    className={`${navItemBaseClass} ${isActive ? navItemActiveClass : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={isActive ? 'text-primary' : ''}>{item.icon}</span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="p-4 mt-auto">
        <button className={`w-full flex items-center py-3 rounded-xl text-text-gray font-bold text-sm transition-colors hover:bg-red-50 hover:text-red-600 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}>
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
