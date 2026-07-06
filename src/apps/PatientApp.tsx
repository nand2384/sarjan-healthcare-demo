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

const PATIENT_PROFILES = [
  { id: 'p1', name: 'John Doe', relation: 'Self', uhid: 'UHID-9002341', dob: '1992-04-10', gender: 'Male', email: 'john.doe@gmail.com', phone: '9876543210', address: '123 Oak Street, Cityville' },
  { id: 'p2', name: 'Jane Doe', relation: 'Mother', uhid: 'UHID-9002342', dob: '1965-08-12', gender: 'Female', email: 'jane.doe@gmail.com', phone: '9876543210', address: '123 Oak Street, Cityville' },
  { id: 'p3', name: 'Jimmy Doe', relation: 'Son', uhid: 'UHID-9002343', dob: '2018-11-20', gender: 'Male', email: 'jimmy.doe@gmail.com', phone: '9876543210', address: '123 Oak Street, Cityville' }
];

export const PatientApp = ({ onLogout }: { onLogout?: () => void }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState('p1');
  const sidebarPanelRef = useRef<PanelImperativeHandle>(null);

  const activeProfile = PATIENT_PROFILES.find(p => p.id === activeProfileId) || PATIENT_PROFILES[0];

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
        return <PatientDashboardOverview profile={activeProfile} />;
      case 'Appointments':
        return <PatientAppointments onBookClick={() => setActiveTab('Book Appointment')} profile={activeProfile} />;
      case 'Book Appointment':
        return <PatientBookAppointment profile={activeProfile} />;
      case 'Medical Records':
        return <PatientMedicalRecords profile={activeProfile} />;
      case 'Billing & Invoices':
        return <PatientBilling profile={activeProfile} />;
      case 'My Profile':
        return <PatientProfile profile={activeProfile} />;
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
            userName={activeProfile.name} 
            userRole="Patient"
            onToggleCollapse={toggleSidebar}
            isCollapsed={isCollapsed}
            patientProfiles={PATIENT_PROFILES}
            activeProfileId={activeProfileId}
            onProfileChange={setActiveProfileId}
            onLogout={onLogout}
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
          userName={activeProfile.name} 
          userRole="Patient" 
          onMenuClick={() => setIsMobileMenuOpen(true)}
          patientProfiles={PATIENT_PROFILES}
          activeProfileId={activeProfileId}
          onProfileChange={setActiveProfileId}
          onLogout={onLogout}
        />
        
        <main className="flex-1 overflow-y-auto flex flex-col">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
