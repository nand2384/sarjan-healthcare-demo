import { useState, useRef } from 'react';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { Header } from '../components/layout/Header';
import { FinancialReports } from '../pages/FinancialReports';
import { StaffManagement } from '../pages/StaffManagement';
import { PricingManagement } from '../pages/PricingManagement';
import { GlobalAnnouncements } from '../pages/GlobalAnnouncements';
import { AdminDashboardOverview } from '../components/dashboard/AdminDashboardOverview';
import { ClinicProfile } from '../pages/ClinicProfile';
import { PatientReviews } from '../pages/PatientReviews';
import { AuditLogs } from '../pages/AuditLogs';
import { Panel, Group, type PanelImperativeHandle } from 'react-resizable-panels';
import { ResizeHandle } from '../components/common/ResizeHandle';

export const AdminApp = ({ 
  currentUser, 
  onRoleChange, 
  onLogout 
}: { 
  currentUser: any; 
  onRoleChange?: (role: any) => void; 
  onLogout?: () => void; 
}) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarPanelRef = useRef<PanelImperativeHandle>(null);

  const toggleCollapse = () => {
    const panel = sidebarPanelRef.current;
    if (panel) {
      if (isCollapsed) {
        panel.expand();
        setIsCollapsed(false);
      } else {
        panel.collapse();
        setIsCollapsed(true);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden relative bg-gray-50/50">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileMenuOpen(false);
          }} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isCollapsed={false}
        />
      </div>

      <Group orientation="horizontal" className="hidden md:flex w-full h-full">
        <Panel 
          panelRef={sidebarPanelRef}
          defaultSize={260} 
          minSize={260} 
          maxSize={400}
          collapsible={true}
          collapsedSize={80}
          onResize={(size) => {
            if (size.inPixels <= 100 && !isCollapsed) {
              setIsCollapsed(true);
            } else if (size.inPixels > 100 && isCollapsed) {
              setIsCollapsed(false);
            }
          }}
          className="transition-all duration-300 ease-in-out"
        >
          <AdminSidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsMobileMenuOpen(false);
            }} 
            isCollapsed={isCollapsed}
          />
        </Panel>

        <ResizeHandle className="hidden md:flex" />

        <Panel minSize={50} className="flex flex-col h-full overflow-hidden w-full">
          <Header 
            userName={currentUser?.name || "Admin"} 
            userRole="Clinic Administrator" 
            onMenuClick={() => setIsMobileMenuOpen(true)}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
            roles={currentUser?.roles}
            activeRole={currentUser?.activeRole}
            onRoleChange={onRoleChange}
            onLogout={onLogout}
          />
          
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'Dashboard' && <AdminDashboardOverview />}
            {activeTab === 'Financial Reports' && <FinancialReports />}
            {activeTab === 'Staff & Doctor Management' && <StaffManagement />}
            {activeTab === 'Pricing & Lab Catalog' && <PricingManagement />}
            {activeTab === 'Global Announcements' && <GlobalAnnouncements />}
            {activeTab === 'Clinic Profile' && <ClinicProfile />}
            {activeTab === 'Patient Reviews' && <PatientReviews />}
            {activeTab === 'Audit Logs' && <AuditLogs />}
          </main>
        </Panel>
      </Group>

      {/* Main content for mobile */}
      <div className="md:hidden flex flex-col h-full overflow-hidden w-full">
        <Header 
          userName={currentUser?.name || "Admin"} 
          userRole="Clinic Administrator" 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          roles={currentUser?.roles}
          activeRole={currentUser?.activeRole}
          onRoleChange={onRoleChange}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'Financial Reports' && <FinancialReports />}
          {activeTab === 'Staff & Doctor Management' && <StaffManagement />}
          {activeTab === 'Pricing & Lab Catalog' && <PricingManagement />}
          {activeTab === 'Global Announcements' && <GlobalAnnouncements />}
          {activeTab === 'Clinic Profile' && <ClinicProfile />}
          {activeTab === 'Patient Reviews' && <PatientReviews />}
          {activeTab === 'Audit Logs' && <AuditLogs />}
        </main>
      </div>
    </div>
  );
};
