import { useState } from 'react';
import { ReceptionistApp } from './apps/ReceptionistApp';
import { AdminApp } from './apps/AdminApp';
import { DoctorApp } from './apps/DoctorApp';
import { PharmacistApp } from './apps/PharmacistApp';
import { PatientApp } from './apps/PatientApp';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { type UserRole } from './types/roles';
import { Settings, LayoutGrid } from 'lucide-react';

interface CurrentUser {
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
}

function App() {
  const [view, setView] = useState<'landing' | 'login' | 'app'>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('receptionist');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (currentUser) {
      setCurrentUser(prev => prev ? {
        ...prev,
        activeRole: newRole
      } : null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  return (
    <>
      {/* App Router */}
      {view === 'landing' && (
        <LandingPage 
          onNavigateToLogin={() => setView('login')} 
        />
      )}

      {view === 'login' && (
        <LoginPage 
          onLogin={(email, role) => {
            let roles: UserRole[] = [role];
            let name = 'Staff Member';
            if (email.toLowerCase().includes('sarah') || (email.toLowerCase().includes('doctor') && email.toLowerCase().includes('admin'))) {
              roles = ['doctor', 'admin'];
              name = 'Dr. Sarah Jenkins';
            } else if (email.toLowerCase().includes('doctor')) {
              roles = ['doctor', 'admin']; // Sarah Jenkins has dual roles
              name = 'Dr. Sarah Jenkins';
            } else if (email.toLowerCase().includes('admin')) {
              roles = ['admin'];
              name = 'Clinic Administrator';
            } else if (email.toLowerCase().includes('pharm')) {
              roles = ['pharmacist'];
              name = 'Pharmacist Staff';
            } else if (email.toLowerCase().includes('patient')) {
              roles = ['patient'];
              name = 'John Doe';
            } else if (email.toLowerCase().includes('receptionist')) {
              roles = ['receptionist'];
              name = 'Front Desk';
            }

            setCurrentUser({
              name,
              email,
              roles,
              activeRole: role
            });
            setCurrentRole(role);
            setView('app');
          }}
          onBack={() => setView('landing')}
        />
      )}
      
      {view === 'app' && (
        <>
          {currentRole === 'receptionist' && <ReceptionistApp currentUser={currentUser} onLogout={handleLogout} />}
          {currentRole === 'admin' && <AdminApp currentUser={currentUser} onRoleChange={handleRoleChange} onLogout={handleLogout} />}
          {currentRole === 'doctor' && <DoctorApp currentUser={currentUser} onRoleChange={handleRoleChange} onLogout={handleLogout} />}
          {currentRole === 'pharmacist' && <PharmacistApp currentUser={currentUser} onLogout={handleLogout} />}
          {currentRole === 'patient' && <PatientApp onLogout={handleLogout} />}
        </>
      )}

      {/* Developer Role Switcher (Floating Widget) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
        
        {isOpen && (
          <div className="bg-white rounded-xl shadow-2xl border border-border-color p-3 mb-3 w-56 flex flex-col gap-1 pointer-events-auto animate-in slide-in-from-bottom-2 fade-in duration-200">
            <div className="text-[10px] font-extrabold text-text-gray uppercase tracking-wider px-2 py-1 mb-1">
              Developer Demo Switcher
            </div>
            {(['receptionist', 'doctor', 'pharmacist', 'admin', 'patient'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  let email = `${role}@sarjan.com`;
                  let roles: UserRole[] = [role];
                  let name = role.charAt(0).toUpperCase() + role.slice(1);
                  if (role === 'doctor') {
                    roles = ['doctor', 'admin'];
                    name = 'Dr. Sarah Jenkins';
                  } else if (role === 'admin') {
                    name = 'Clinic Administrator';
                  } else if (role === 'patient') {
                    name = 'John Doe';
                  }
                  setCurrentUser({
                    name,
                    email,
                    roles,
                    activeRole: role
                  });
                  setCurrentRole(role);
                  setView('app');
                  setIsOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'app' && currentRole === role 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-dark hover:bg-gray-100'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
              </button>
            ))}

            <div className="border-t border-border-color my-1 pt-2">
              <button 
                onClick={() => {
                  setView('landing');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  view === 'landing' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-gray hover:bg-gray-100 hover:text-text-dark'
                }`}
              >
                <LayoutGrid size={16} /> Patient Main Site
              </button>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`pointer-events-auto w-12 h-12 bg-white border border-border-color rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
            isOpen ? 'rotate-90 text-primary shadow-xl bg-gray-50' : 'text-text-gray hover:text-primary hover:shadow-xl'
          }`}
        >
          <Settings size={22} />
        </button>

      </div>
    </>
  );
}

export default App;
