import React, { useState } from 'react';
import { 
  Stethoscope, 
  BarChart3, 
  Users,
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen,
  LogOut,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: <BarChart3 size={20} />, label: 'Financial Reports' },
    { icon: <Users size={20} />, label: 'Staff Management' },
    { icon: <Settings size={20} />, label: 'Pricing Management' },
  ];

  const navItemBaseClass = `flex items-center py-3 rounded-lg text-text-gray font-medium text-[0.95rem] transition-all duration-200 hover:bg-hover-bg hover:text-primary ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`;
  const navItemActiveClass = `bg-hover-bg text-primary relative before:content-[''] before:absolute ${isCollapsed ? 'before:-left-2' : 'before:-left-4'} before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-primary before:rounded-r-md`;

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
      md:relative md:transform-none
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      ${isCollapsed ? 'w-[80px]' : 'w-[260px]'} 
      bg-white border-r border-border-color flex flex-col py-6 shrink-0
    `}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-6'} mb-10 overflow-hidden relative`}>
        <Stethoscope className="text-primary min-w-[28px]" size={28} />
        {!isCollapsed && <span className="font-bold text-[1.1rem] text-primary leading-tight whitespace-nowrap">SARJAN<br />HEALTHCARE</span>}
        
        {/* Mobile Close Button */}
        {isMobileMenuOpen && setIsMobileMenuOpen && (
          <button 
            className="md:hidden absolute right-4 p-1 text-text-gray hover:bg-gray-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className={`flex-1 flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navItems.map((item) => (
          <button 
            key={item.label}
            className={`${navItemBaseClass} ${activeTab === item.label ? navItemActiveClass : ''}`}
            onClick={() => setActiveTab(item.label)}
            title={isCollapsed ? item.label : ""}
          >
            {React.cloneElement(item.icon as React.ReactElement, { className: 'min-w-[20px]' } as any)}
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={`flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <button className={navItemBaseClass} title={isCollapsed ? "Settings" : ""}>
          <Settings size={20} className="min-w-[20px]" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button 
          className={navItemBaseClass} 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <PanelLeftOpen size={20} className="min-w-[20px]" /> : <PanelLeftClose size={20} className="min-w-[20px]" />}
          {!isCollapsed && <span>Collapse</span>}
        </button>
        <button className={`${navItemBaseClass} text-danger hover:bg-red-50 hover:text-danger mt-6`} title={isCollapsed ? "Log out" : ""}>
          <LogOut size={20} className="min-w-[20px]" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
};
