import React, { useState } from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { type Doctor, type Patient, type PatientStatus } from '../data/mockData';
import { User } from 'lucide-react';
import { PatientCommandDrawer } from '../components/dashboard/PatientCommandDrawer';

interface DashboardProps {
  localDoctorsData: Doctor[];
  handleUpdateStatus?: (patientId: string, newStatus: PatientStatus) => void;
  handleUpdatePatient?: (patientId: string, updatedPatient: Partial<Patient>) => void;
}

export const Dashboard = React.memo(function Dashboard({ localDoctorsData, handleUpdateStatus, handleUpdatePatient }: DashboardProps) {
  const [drawerPatient, setDrawerPatient] = useState<Patient | null>(null);
  const [drawerDoctorBusy, setDrawerDoctorBusy] = useState<boolean>(false);
  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-bg-base">
      <StatCards />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {localDoctorsData.map(doctor => {
          const isAway = doctor.status === 'away';
          
          // Find currently consulting patient
          const consulting = 
            doctor.advanceQueue.find(p => p.status === 'in-consultation') ||
            doctor.walkInQueue.find(p => p.status === 'in-consultation');

          // Find next patient in queue (waiting)
          const nextPatient = 
            doctor.advanceQueue.find(p => p.status === 'waiting') ||
            doctor.walkInQueue.find(p => p.status === 'waiting');

          // Determine lively colors based on status
          let borderColors = 'border-border-color';
          if (doctor.status === 'available') borderColors = 'border-green-200 hover:border-green-400 hover:shadow-green-100 shadow-sm transition-all';
          else if (doctor.status === 'busy') borderColors = 'border-amber-200 hover:border-amber-400 hover:shadow-amber-100 shadow-sm transition-all';

          return (
            <div 
              key={doctor.id} 
              className={`bg-white rounded-xl border p-5 flex flex-col h-full ${
                isAway ? 'border-gray-200 opacity-60 grayscale bg-gray-50' : borderColors
              }`}
            >
              <div className="flex justify-between items-start mb-4 border-b border-border-color pb-3">
                <div>
                  <h3 className="font-bold text-lg text-text-dark">{doctor.name}</h3>
                  <p className="text-xs text-text-gray">{doctor.specialty} • Room {doctor.room}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  doctor.status === 'available' ? 'bg-green-100 text-green-700' :
                  doctor.status === 'busy' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {doctor.status}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                {/* Currently Consulting */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-light uppercase tracking-wider mb-1">Currently Consulting</span>
                  {consulting ? (
                    <button 
                      onClick={() => {
                        setDrawerPatient(consulting);
                        setDrawerDoctorBusy(true);
                      }}
                      className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary-dark p-2 rounded-lg border border-primary/10 transition-colors w-full text-left"
                    >
                      <User size={16} className="shrink-0" />
                      <span className="font-semibold text-sm truncate flex-1">{consulting.name}</span>
                      {consulting.token && <span className="text-xs bg-white px-1.5 py-0.5 rounded shadow-sm font-bold border border-primary/10 shrink-0">{consulting.token}</span>}
                    </button>
                  ) : (
                    <span className="text-sm text-text-gray italic border border-dashed border-border-color p-2 rounded-lg bg-gray-50">No patient</span>
                  )}
                </div>

                {/* Next in Queue */}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-light uppercase tracking-wider mb-1">Next in Queue</span>
                  {nextPatient ? (
                    <button 
                      onClick={() => {
                        setDrawerPatient(nextPatient);
                        setDrawerDoctorBusy(!!consulting);
                      }}
                      className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-text-dark p-2 rounded-lg border border-border-color transition-colors w-full text-left"
                    >
                      <User size={16} className="text-text-gray shrink-0" />
                      <span className="font-medium text-sm truncate flex-1">{nextPatient.name}</span>
                      {nextPatient.token && <span className="text-xs bg-white px-1.5 py-0.5 rounded shadow-sm font-bold border border-border-color shrink-0">{nextPatient.token}</span>}
                    </button>
                  ) : (
                    <span className="text-sm text-text-gray italic border border-dashed border-border-color p-2 rounded-lg bg-gray-50">Queue empty</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {handleUpdateStatus && handleUpdatePatient && (
        <PatientCommandDrawer 
          patient={drawerPatient}
          isOpen={!!drawerPatient}
          onClose={() => setDrawerPatient(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePatient={handleUpdatePatient}
          isDoctorBusy={drawerDoctorBusy}
        />
      )}
    </div>
  );
});
