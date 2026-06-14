import { useState } from 'react';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { Header } from '../components/layout/Header';
import { FinancialReports } from '../pages/FinancialReports';

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
        {activeTab === 'Staff Management' && (
          <div className="flex-1 flex items-center justify-center bg-bg-base">
            <h2 className="text-xl font-medium text-text-gray">Staff Management (Coming Soon)</h2>
          </div>
        )}
        {activeTab === 'Pricing Management' && (
          <div className="flex-1 flex items-center justify-center bg-bg-base">
            <h2 className="text-xl font-medium text-text-gray">Pricing Management (Coming Soon)</h2>
          </div>
        )}
      </main>
    </div>
  );
};
