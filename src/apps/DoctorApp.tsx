import { useState, useRef } from 'react';
import { DoctorSidebar } from '../components/layout/DoctorSidebar';
import { Header } from '../components/layout/Header';
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { MyPatients } from '../pages/MyPatients';
import { Panel, Group, type PanelImperativeHandle } from 'react-resizable-panels';
import { ResizeHandle } from '../components/common/ResizeHandle';

export const DoctorApp = ({ 
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
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar - Rendered outside of Panels so it can be fixed/absolute correctly */}
      <div className="md:hidden">
        <DoctorSidebar 
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
          <DoctorSidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsMobileMenuOpen(false);
            }} 
            isCollapsed={isCollapsed}
          />
        </Panel>
        
        <ResizeHandle className="hidden md:flex" />

        <Panel minSize={50} className="flex flex-col h-full overflow-hidden w-full bg-gray-50/30">
          <Header 
            userName={currentUser?.name || "Dr. Sarah Jenkins"} 
            userRole="Dr. Sarah Jenkins" 
            onMenuClick={() => setIsMobileMenuOpen(true)}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
            roles={currentUser?.roles}
            activeRole={currentUser?.activeRole}
            onRoleChange={onRoleChange}
            onLogout={onLogout}
          />
          
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'My Patients' ? (
              <MyPatients />
            ) : (
              <DoctorDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
          </main>
        </Panel>
      </Group>

      {/* Main content for mobile */}
      <main className="md:hidden flex-1 flex flex-col overflow-y-auto w-full h-full bg-gray-50/30">
        <Header 
          userName={currentUser?.name || "Dr. Sarah Jenkins"} 
          userRole="Dr. Sarah Jenkins" 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          roles={currentUser?.roles}
          activeRole={currentUser?.activeRole}
          onRoleChange={onRoleChange}
          onLogout={onLogout}
        />
        
        <div className="flex-1">
          {activeTab === 'My Patients' ? (
            <MyPatients />
          ) : (
            <DoctorDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </div>
      </main>

    </div>
  );
};
