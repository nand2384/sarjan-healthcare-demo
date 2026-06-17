import { useState } from 'react';
import { DoctorSidebar } from '../components/layout/DoctorSidebar';
import { Header } from '../components/layout/Header';
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { MyPatients } from '../pages/MyPatients';

export const DoctorApp = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <DoctorSidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          userName="SJ" 
          userRole="Dr. Sarah Jenkins" 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        {/* Render page based on activeTab */}
        {activeTab === 'My Patients' ? (
          <MyPatients />
        ) : (
          <DoctorDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </main>
    </div>
  );
};
