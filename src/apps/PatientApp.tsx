import { useState, useRef } from 'react';
import { PatientSidebar } from '../components/layout/PatientSidebar';
import { Header } from '../components/layout/Header';
import { PatientDashboardOverview } from '../components/dashboard/PatientDashboardOverview';
import { PatientAppointments } from '../pages/patient/PatientAppointments';
import { PatientBookAppointment } from '../pages/patient/PatientBookAppointment';
import { PatientMedicalRecords } from '../pages/patient/PatientMedicalRecords';
import { PatientBilling } from '../pages/patient/PatientBilling';
import { PatientProfile } from '../pages/patient/PatientProfile';
import { Panel, Group, type PanelImperativeHandle } from 'react-resizable-panels';
import { ResizeHandle } from '../components/common/ResizeHandle';

export const PatientApp = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarPanelRef = useRef<PanelImperativeHandle>(null);

  const toggleSidebar = () => {
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

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <PatientDashboardOverview />;
      case 'Appointments':
        return <PatientAppointments onBookClick={() => setActiveTab('Book Appointment')} />;
      case 'Book Appointment':
        return <PatientBookAppointment />;
      case 'Medical Records':
        return <PatientMedicalRecords />;
      case 'Billing & Invoices':
        return <PatientBilling />;
      case 'My Profile':
        return <PatientProfile />;
      default:
        return (
          <div className="flex items-center justify-center h-full p-6">
            <div className="flex flex-col items-center justify-center text-text-gray font-medium border-2 border-dashed border-border-color rounded-2xl w-full h-full">
              <span className="text-xl">{activeTab}</span>
              <span className="text-sm mt-2 text-text-light">Content (Coming Soon)</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-bg-light overflow-hidden font-sans">
      {/* Desktop Layout with Resizable Panels */}
      <Group orientation="horizontal" className="hidden md:flex w-full h-full">
        <Panel
          panelRef={sidebarPanelRef}
          defaultSize={260} 
          minSize={260} 
          maxSize={400}
          collapsible={true}
          collapsedSize={80}
          onResize={(size: any) => {
            const currentSize = typeof size === 'number' ? size : (size.inPixels || size);
            if (currentSize <= 100 && !isCollapsed) {
              setIsCollapsed(true);
            } else if (currentSize > 100 && isCollapsed) {
              setIsCollapsed(false);
            }
          }}
          className={`bg-white z-10 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'items-center' : ''}`}
        >
          <PatientSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isCollapsed={isCollapsed}
          />
        </Panel>

        <ResizeHandle />

        <Panel className="flex flex-col min-w-[50%] bg-bg-light">
          <Header 
            userName="John Doe" 
            userRole="Patient"
            onToggleCollapse={toggleSidebar}
            isCollapsed={isCollapsed}
          />
          
          <main className="flex-1 overflow-y-auto flex flex-col">
            {renderContent()}
          </main>
        </Panel>
      </Group>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-full overflow-hidden w-full">
        <PatientSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <Header 
          userName="John Doe" 
          userRole="Patient" 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto flex flex-col">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
