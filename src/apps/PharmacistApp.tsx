import { useState, useRef } from 'react';
import { PharmacistSidebar } from '../components/layout/PharmacistSidebar';
import { Header } from '../components/layout/Header';
import { PrescriptionsQueue } from '../pages/PrescriptionsQueue';
import { PharmacistDashboardOverview } from '../components/dashboard/PharmacistDashboardOverview';
import { InventoryManagement } from '../pages/pharmacist/InventoryManagement';
import { DispenseLogs } from '../pages/pharmacist/DispenseLogs';
import { Panel, Group, type PanelImperativeHandle } from 'react-resizable-panels';
import { ResizeHandle } from '../components/common/ResizeHandle';

export const PharmacistApp = () => {
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
        <PharmacistSidebar 
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
          <PharmacistSidebar 
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
            userName="Mike Roberts" 
            userRole="Pharmacist" 
            onMenuClick={() => setIsMobileMenuOpen(true)}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            {activeTab === 'Dashboard' && <PharmacistDashboardOverview />}
            {activeTab === 'Prescriptions Queue' && <PrescriptionsQueue />}
            {activeTab === 'Inventory Management' && <InventoryManagement />}
            {activeTab === 'Dispense Logs' && <DispenseLogs />}
          </main>
        </Panel>
      </Group>

      {/* Main content for mobile */}
      <div className="md:hidden flex flex-col h-full overflow-hidden w-full">
        <Header 
          userName="Mike Roberts" 
          userRole="Pharmacist" 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-4">
            {activeTab === 'Dashboard' && <PharmacistDashboardOverview />}
            {activeTab === 'Prescriptions Queue' && <PrescriptionsQueue />}
            {activeTab === 'Inventory Management' && <InventoryManagement />}
            {activeTab === 'Dispense Logs' && <DispenseLogs />}
        </main>
      </div>
    </div>
  );
};
