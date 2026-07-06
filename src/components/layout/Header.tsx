import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Bell, AlertTriangle, AlertCircle, Info, Menu, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { globalAlerts } from '../../data/mockData';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  navItems?: { label: string }[];
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onMenuClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  roles?: string[];
  activeRole?: string;
  onRoleChange?: (role: any) => void;
  patientProfiles?: Array<{ id: string; name: string; relation: string }>;
  activeProfileId?: string;
  onProfileChange?: (profileId: string) => void;
  onLogout?: () => void;
}

export const Header = React.memo(function Header({ 
  userName = "NS", 
  userRole = "Receptionist", 
  navItems, 
  activeTab, 
  setActiveTab, 
  onMenuClick, 
  isCollapsed = false, 
  onToggleCollapse,
  roles,
  activeRole,
  onRoleChange,
  patientProfiles,
  activeProfileId,
  onProfileChange,
  onLogout
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-[76px] bg-white border-b border-black/5 flex justify-between items-center px-4 md:px-8 shrink-0 relative z-20 sticky top-0">
      <div className="flex items-center gap-3 md:gap-6 flex-1 overflow-hidden">
        
        {/* Mobile Menu Toggle */}
        {onMenuClick && (
          <button 
            className="md:hidden p-2.5 bg-white/50 rounded-xl text-text-dark hover:bg-white transition-colors shadow-sm border border-border-color/50"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>
        )}

        {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center p-2.5 bg-white hover:bg-hover-bg border border-border-color rounded-xl text-text-gray hover:text-text-dark transition-all shadow-sm hover:shadow-soft cursor-pointer shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        )}

        {userRole !== 'Patient' && (
          <div className="hidden md:flex items-center bg-white/60 hover:bg-white focus-within:bg-white rounded-full border border-border-color px-5 py-2.5 w-[300px] lg:w-[450px] shrink-0 transition-all shadow-sm focus-within:shadow-soft focus-within:border-primary/30">
            <Search size={18} className="text-text-light" />
            <input 
              type="text" 
              placeholder="Search for patient, doctor, or staff..." 
              className="border-none bg-transparent outline-none ml-3 flex-1 text-[0.9rem] text-text-dark placeholder:text-text-light"
            />
          </div>
        )}

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
              <div className="px-4 py-3 border-b border-border-color bg-transparent">
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
        <div className="h-8 w-px bg-border-color hidden md:block"></div>

        <div className="relative w-auto md:w-64" ref={profileDropdownRef}>
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 cursor-pointer group focus:outline-none bg-transparent border-0 text-left w-auto md:w-64 justify-start md:justify-between px-2 py-1.5 rounded-xl hover:bg-hover-bg/80 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-dark text-white flex justify-center items-center font-bold shadow-soft group-hover:shadow-md transition-all text-sm tracking-wider uppercase shrink-0">
              {userName.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="hidden md:flex flex-col text-left flex-1 min-w-0">
              <span className="text-[0.9rem] font-bold text-text-dark leading-tight group-hover:text-primary transition-colors truncate">
                {userRole === "Receptionist" ? "Front Desk" : userName}
              </span>
              <span className="text-[0.75rem] font-semibold text-text-light truncate">{userRole}</span>
            </div>
            <ChevronDown size={16} className={`text-text-light ml-auto group-hover:text-primary transition-transform duration-200 hidden md:block shrink-0 ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-64 md:w-full bg-white border border-border-color rounded-xl shadow-lg py-2 z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header Details */}
              <div className="px-4 py-2.5 border-b border-border-color">
                <p className="text-sm font-bold text-text-dark truncate">{userRole === "Receptionist" ? "Front Desk" : userName}</p>
                <p className="text-xs font-medium text-text-light truncate">{userRole}</p>
              </div>

              {/* Staff Switch Portal */}
              {roles && roles.length > 1 && onRoleChange && (
                <div className="px-2 py-1.5 border-b border-border-color bg-gray-50/50">
                  <span className="block px-2 py-1 text-[10px] font-bold text-text-gray uppercase tracking-wider">
                    Switch Portal
                  </span>
                  {roles.map((r) => {
                    const isActive = activeRole === r;
                    const displayLabel = r === 'admin' ? 'Admin Portal' : r === 'doctor' ? 'Doctor Portal' : r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          onRoleChange(r);
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between border-0 bg-transparent cursor-pointer ${
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-text-dark hover:bg-hover-bg'
                        }`}
                      >
                        <span>{displayLabel}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Patient Switch Profile */}
              {patientProfiles && patientProfiles.length > 1 && onProfileChange && (
                <div className="px-2 py-1.5 border-b border-border-color bg-gray-50/50">
                  <span className="block px-2 py-1 text-[10px] font-bold text-text-gray uppercase tracking-wider">
                    Switch Profile
                  </span>
                  {patientProfiles.map((profile) => {
                    const isActive = activeProfileId === profile.id;
                    return (
                      <button
                        key={profile.id}
                        onClick={() => {
                          onProfileChange(profile.id);
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between border-0 bg-transparent cursor-pointer ${
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-text-dark hover:bg-hover-bg'
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span className="font-bold">{profile.name}</span>
                          <span className="text-[10px] text-text-light font-medium">{profile.relation}</span>
                        </div>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Logout Option */}
              <div className="px-2 pt-1.5">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border-0 bg-transparent cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
