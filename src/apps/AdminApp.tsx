import { useState } from 'react';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { Header } from '../components/layout/Header';
import { FinancialReports } from '../pages/FinancialReports';
import { StaffManagement } from '../pages/StaffManagement';
import { PricingManagement } from '../pages/PricingManagement';
import { WaitTimeAnalytics } from '../pages/WaitTimeAnalytics';
import { GlobalAnnouncements } from '../pages/GlobalAnnouncements';
import { ClinicProfile } from '../pages/ClinicProfile';
import { PatientReviews } from '../pages/PatientReviews';
import { AuditLogs } from '../pages/AuditLogs';

export const AdminApp = () => {
  const [activeTab, setActiveTab] = useState('Financial Reports');
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
      
      <AdminSidebar 
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
          userName="AD" 
          userRole="Admin" 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        {/* Render page based on activeTab */}
        {activeTab === 'Financial Reports' && <FinancialReports />}
        {activeTab === 'Staff & Doctor Management' && <StaffManagement />}
        {activeTab === 'Pricing & Lab Catalog' && <PricingManagement />}
        {activeTab === 'Wait Time Analytics' && <WaitTimeAnalytics />}
        {activeTab === 'Global Announcements' && <GlobalAnnouncements />}
        {activeTab === 'Clinic Profile' && <ClinicProfile />}
        {activeTab === 'Patient Reviews' && <PatientReviews />}
        {activeTab === 'Audit Logs' && <AuditLogs />}
      </main>
    </div>
  );
};
