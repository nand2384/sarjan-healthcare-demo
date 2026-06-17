import React from 'react';
import { 
  Stethoscope, 
  LayoutGrid, 
  Settings, 
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
  X
} from 'lucide-react';
import { doctorsData } from '../../data/mockData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = React.memo(function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  isCollapsed = false,
  onToggleCollapse 
}: SidebarProps) {

  const navItems = [
    { icon: <LayoutGrid size={20} />, label: 'Dashboard' }
  ];

  const navItemBaseClass = `flex items-center w-full py-3 rounded-lg text-text-gray font-medium text-[0.95rem] transition-all duration-200 hover:bg-hover-bg hover:text-primary ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`;
  const navItemActiveClass = `bg-hover-bg text-primary relative before:content-[''] before:absolute ${isCollapsed ? 'before:-left-2' : 'before:-left-4'} before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-primary before:rounded-r-md`;

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 md:relative 
      ${isCollapsed ? 'w-[80px]' : 'w-[260px] md:w-full'} h-full
      bg-white border-r border-border-color flex flex-col py-6 transition-all duration-300 shrink-0
      ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className={`flex items-center justify-between ${isCollapsed ? 'px-0 justify-center' : 'px-6'} mb-10 overflow-hidden`}>
        <div className="flex items-center gap-3">
          <Stethoscope className="text-primary min-w-[28px]" size={28} />
          {!isCollapsed && <span className="font-bold text-[1.1rem] text-primary leading-tight whitespace-nowrap">SARJAN<br />HEALTHCARE</span>}
        </div>
        
        {/* Mobile Close Button */}
        {!isCollapsed && setIsMobileMenuOpen && (
          <button 
            className="md:hidden p-1.5 rounded-md text-text-gray hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className={`flex-1 flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-4'} overflow-y-auto`}>
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

        <div className="mt-6 mb-2 flex flex-col gap-1">
          {!isCollapsed && <p className="text-xs font-bold text-text-light uppercase tracking-wider px-4 mb-2">Doctors in OPD</p>}
          {isCollapsed && <div className="border-t border-border-color mx-2 mb-2"></div>}
          
          {doctorsData.map(doc => (
            <button 
              key={doc.id}
              className={`${navItemBaseClass} ${activeTab === doc.name ? navItemActiveClass : ''}`}
              onClick={() => setActiveTab(doc.name)}
              title={isCollapsed ? doc.name : ""}
            >
              <div className="relative inline-flex items-center justify-center">
                <User size={20} className="min-w-[20px]" />
                <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${doc.status === 'available' ? 'bg-green-500' : doc.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'}`}></span>
              </div>
              {!isCollapsed && <span className="truncate text-left flex-1">{doc.name}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className={`flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <button className={navItemBaseClass} title={isCollapsed ? "Settings" : ""}>
          <Settings size={20} className="min-w-[20px]" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button 
          className={navItemBaseClass} 
          onClick={onToggleCollapse}
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
});
