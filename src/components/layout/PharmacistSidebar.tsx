import React from 'react';
import { 
  Stethoscope, 
  Pill,
  ClipboardList,
  PackageSearch,
  Settings, 
  LogOut,
  X,
  LayoutGrid
} from 'lucide-react';

interface PharmacistSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (isOpen: boolean) => void;
  isCollapsed?: boolean;
}

export const PharmacistSidebar: React.FC<PharmacistSidebarProps> = ({ 
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
      group: 'Pharmacy',
      items: [
        { icon: <ClipboardList size={20} />, label: 'Prescriptions Queue' },
        { icon: <PackageSearch size={20} />, label: 'Inventory Management' },
        { icon: <Pill size={20} />, label: 'Dispense Logs' }
      ]
    }
  ];

  const navItemBaseClass = `flex items-center w-full py-2.5 rounded-xl text-text-gray font-medium text-[0.95rem] transition-all duration-200 hover:bg-primary/5 hover:text-primary ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`;
  const navItemActiveClass = `bg-primary text-white shadow-soft relative ${isCollapsed ? 'px-0' : 'px-4'}`;

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
      md:relative md:transform-none
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      ${isCollapsed ? 'w-[80px]' : 'w-[260px] md:w-full'} 
      bg-white border-r border-border-color flex flex-col py-6 shrink-0 h-full overflow-y-auto shadow-[4px_0_24px_-4px_rgba(0,0,0,0.02)]
    `}>
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-6'} mb-8 overflow-hidden relative shrink-0`}>
        <div className="bg-primary/10 p-2 rounded-xl text-primary shrink-0">
          <Stethoscope size={24} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-[1.1rem] text-text-dark leading-none tracking-tight">SARJAN</span>
            <span className="font-bold text-[0.7rem] text-primary tracking-[0.2em] uppercase mt-0.5">HEALTHCARE</span>
          </div>
        )}
        
        {/* Mobile Close Button */}
        {isMobileMenuOpen && setIsMobileMenuOpen && (
          <button 
            className="md:hidden absolute right-4 p-1.5 text-text-gray hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className={`flex-1 flex flex-col gap-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            {!isCollapsed && (
              <span className="text-[10px] font-bold text-text-light uppercase tracking-widest px-4 mb-1">
                {group.group}
              </span>
            )}
            {isCollapsed && (
              <div className="h-px bg-border-color mx-2 my-2" />
            )}
            {group.items.map((item) => {
              const isActive = activeTab === item.label;
              return (
                <button 
                  key={item.label}
                  className={`${navItemBaseClass} ${isActive ? navItemActiveClass : ''}`}
                  onClick={() => setActiveTab(item.label)}
                  title={isCollapsed ? item.label : ""}
                >
                  {React.cloneElement(item.icon as React.ReactElement, { className: 'min-w-[20px]', size: 18 } as any)}
                  {!isCollapsed && <span className="text-left truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={`flex flex-col gap-1 mt-6 shrink-0 border-t border-border-color pt-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <button className={navItemBaseClass} title={isCollapsed ? "Settings" : ""}>
          <Settings size={20} className="min-w-[20px]" />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <button className={`${navItemBaseClass} text-danger hover:bg-red-50 hover:text-danger mt-2`} title={isCollapsed ? "Log out" : ""}>
          <LogOut size={20} className="min-w-[20px]" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
};
