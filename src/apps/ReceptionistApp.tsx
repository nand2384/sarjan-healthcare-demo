import { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Dashboard } from '../pages/Dashboard';
import { Appointments } from '../pages/Appointments';
import { PatientRegistration } from '../pages/PatientRegistration';
import { DoctorView } from '../pages/DoctorView';
import { doctorsData, scheduledAppointments, type Patient, type PatientStatus } from '../data/mockData';

export const ReceptionistApp = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Lifted State
  const [localDoctorsData, setLocalDoctorsData] = useState(doctorsData);
  const [localAppointmentsData, setLocalAppointmentsData] = useState(scheduledAppointments);

  const topNavItems = [
    { label: 'Dashboard' },
    { label: 'Appointments' },
    { label: 'Register Patient' }
  ];

  const handleUpdateStatus = (patientId: string, newStatus: PatientStatus) => {
    setLocalDoctorsData(prevData => prevData.map(doc => {
      const updateQueue = (queue: Patient[]) => 
        queue.map(p => p.id === patientId ? { ...p, status: newStatus } : p);

      return {
        ...doc,
        advanceQueue: updateQueue(doc.advanceQueue),
        walkInQueue: updateQueue(doc.walkInQueue)
      };
    }));
  };

  const handleUpdatePatient = (patientId: string, updates: Partial<Patient>) => {
    setLocalDoctorsData(prevData => prevData.map(doc => {
      const updateQueue = (queue: Patient[]) => 
        queue.map(p => p.id === patientId ? { ...p, ...updates } : p);

      return {
        ...doc,
        advanceQueue: updateQueue(doc.advanceQueue),
        walkInQueue: updateQueue(doc.walkInQueue)
      };
    }));
  };
  const handleMarkAsArrived = (appointmentId: string) => {
    // 1. Find the appointment
    const appt = localAppointmentsData.find(a => a.id === appointmentId);
    if (!appt) return;

    // 2. Mark it as arrived
    setLocalAppointmentsData(prev => prev.map(a => 
      a.id === appointmentId ? { ...a, status: 'arrived' } : a
    ));

    // 3. Create a Patient object and add it to the doctor's advance queue
    setLocalDoctorsData(prevDoctors => prevDoctors.map(doc => {
      if (doc.id === appt.doctorId) {
        const newPatient: Patient = {
          id: `p_new_${Date.now()}`,
          name: appt.patientName,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'advance',
          status: 'waiting',
          phone: appt.phone,
          profileStatus: 'incomplete', // Force profile completion
        };
        return {
          ...doc,
          advanceQueue: [...doc.advanceQueue, newPatient]
        };
      }
      return doc;
    }));

    // Alert to show successful queuing
    alert('Patient successfully added to the Dashboard Queue!');
  };

  const isMainTab = ['Dashboard', 'Appointments', 'Register Patient'].includes(activeTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false); // Close menu on mobile after selection
        }} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <Header 
          navItems={topNavItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        {/* Render page based on activeTab */}
        {activeTab === 'Dashboard' && (
          <Dashboard 
            localDoctorsData={localDoctorsData}
            handleUpdateStatus={handleUpdateStatus}
            handleUpdatePatient={handleUpdatePatient}
          />
        )}
        {activeTab === 'Appointments' && (
          <Appointments 
            localAppointmentsData={localAppointmentsData}
            handleMarkAsArrived={handleMarkAsArrived}
          />
        )}
        {activeTab === 'Register Patient' && <PatientRegistration />}
        
        {/* Doctor View */}
        {!isMainTab && (
          <DoctorView 
            doctorName={activeTab}
            localDoctorsData={localDoctorsData}
            localAppointmentsData={localAppointmentsData}
            handleUpdateStatus={handleUpdateStatus}
            handleUpdatePatient={handleUpdatePatient}
            handleMarkAsArrived={handleMarkAsArrived}
          />
        )}
      </main>
    </div>
  );
};
