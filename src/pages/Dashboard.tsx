import React, { useState } from 'react';
import { StatCards } from '../components/dashboard/StatCards';
import { type Doctor, type Patient, type PatientStatus, type ScheduledAppointment } from '../data/mockData';
import { User, CalendarDays, Clock, Phone, Stethoscope, CheckCircle, ArrowRight } from 'lucide-react';
import { PatientCommandDrawer } from '../components/dashboard/PatientCommandDrawer';

interface DashboardProps {
  localDoctorsData: Doctor[];
  handleUpdateStatus?: (patientId: string, newStatus: PatientStatus) => void;
  handleUpdatePatient?: (patientId: string, updatedPatient: Partial<Patient>) => void;
  localAppointmentsData?: ScheduledAppointment[];
  handleMarkAsArrived?: (appointmentId: string) => void;
}

export const Dashboard = React.memo(function Dashboard({ 
  localDoctorsData, 
  handleUpdateStatus, 
  handleUpdatePatient,
  localAppointmentsData,
  handleMarkAsArrived
}: DashboardProps) {
  const [drawerPatient, setDrawerPatient] = useState<Patient | null>(null);
  const [drawerDoctorBusy, setDrawerDoctorBusy] = useState<boolean>(false);
  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent">
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

          return (
            <div 
              key={doctor.id} 
              className={`bg-white rounded-2xl border border-border-color/80 p-5 flex flex-col h-full shadow-soft hover:border-primary/40 hover:shadow-md transition-all duration-250 ${
                isAway ? 'opacity-70 grayscale-[20%] bg-gray-50/30' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4 border-b border-border-color pb-3">
                <div>
                  <h3 className="text-lg font-bold text-text-dark">{doctor.name}</h3>
                  <p className="text-xs text-text-gray">{doctor.specialty}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  doctor.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60' :
                  doctor.status === 'busy' ? 'bg-amber-50 text-amber-700 border-amber-100/60' :
                  'bg-gray-50 text-gray-600 border-gray-200/60'
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
                      className="flex items-center gap-2.5 bg-white hover:bg-emerald-50/40 text-text-dark hover:text-emerald-700 p-2.5 rounded-lg border border-border-color hover:border-emerald-200 shadow-sm transition-all w-full text-left cursor-pointer group"
                    >
                      <User size={16} className="text-emerald-500/80 group-hover:scale-105 transition-transform shrink-0" />
                      <span className="font-semibold text-sm truncate flex-1">{consulting.name}</span>
                      {consulting.token && <span className="text-xs bg-emerald-50/80 text-emerald-700 px-1.5 py-0.5 rounded shadow-sm font-bold border border-emerald-100 shrink-0">{consulting.token}</span>}
                    </button>
                  ) : (
                    <span className="text-xs text-text-gray italic border border-dashed border-border-color/80 p-2.5 rounded-lg bg-gray-50/50 flex items-center justify-center">No patient</span>
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
                      className="flex items-center gap-2.5 bg-white hover:bg-primary/5 text-text-dark hover:text-primary p-2.5 rounded-lg border border-border-color hover:border-primary/30 shadow-sm transition-all w-full text-left cursor-pointer group"
                    >
                      <User size={16} className="text-slate-400 group-hover:scale-105 transition-transform shrink-0" />
                      <span className="font-medium text-sm truncate flex-1">{nextPatient.name}</span>
                      {nextPatient.token && <span className="text-xs bg-blue-50/80 text-blue-700 px-1.5 py-0.5 rounded shadow-sm font-bold border border-blue-100/50 shrink-0">{nextPatient.token}</span>}
                    </button>
                  ) : (
                    <span className="text-xs text-text-gray italic border border-dashed border-border-color/80 p-2.5 rounded-lg bg-gray-50/50 flex items-center justify-center">Queue empty</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Incoming Appointments Timeline */}
      {localAppointmentsData && localAppointmentsData.length > 0 && (
        <div className="mt-8 bg-white border border-border-color/60 shadow-soft rounded-2xl p-5 md:p-6 flex flex-col shrink-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-border-color/60">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="text-primary" size={22} />
              <div>
                <h3 className="text-lg font-bold text-text-dark">Today's Upcoming Appointments</h3>
                <p className="text-xs text-text-gray mt-0.5">Roster of expected arrivals and check-in statuses</p>
              </div>
            </div>
            <span className="bg-primary/5 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold border border-primary/10">
              {localAppointmentsData.filter(a => a.status === 'scheduled').length} Pending
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {localAppointmentsData.map(appt => {
              const isArrived = appt.status === 'arrived';
              return (
                <div 
                  key={appt.id} 
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border rounded-xl transition-all duration-200 gap-4 group ${
                    isArrived 
                      ? 'border-emerald-100 bg-emerald-50/5' 
                      : 'border-border-color hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                    {/* Time Slot badge */}
                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-center ${
                      isArrived 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' 
                        : 'bg-slate-50 text-text-gray border-border-color'
                    }`}>
                      <Clock size={14} />
                      {appt.timeSlot}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-dark text-sm truncate">{appt.patientName}</span>
                        <span className="text-[10px] text-text-gray px-2 py-0.5 rounded bg-slate-50 border border-border-color">
                          {appt.reasonForVisit}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-text-gray font-medium">
                        <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {appt.phone}</span>
                        <span className="flex items-center gap-1.5"><Stethoscope size={12} className="text-slate-400" /> {appt.doctorName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center self-end md:self-center shrink-0">
                    {isArrived ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-lg shadow-sm">
                        <CheckCircle size={14} /> Arrived & Queued
                      </span>
                    ) : (
                      handleMarkAsArrived && (
                        <button 
                          onClick={() => handleMarkAsArrived(appt.id)}
                          className="px-4 py-2 text-xs font-bold text-primary hover:text-white border border-primary/20 hover:bg-primary rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          Check In Patient <ArrowRight size={14} />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
