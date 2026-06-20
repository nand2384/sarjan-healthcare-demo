import React, { useState } from 'react';
import { type Doctor, type Patient, type PatientStatus, type ScheduledAppointment } from '../data/mockData';
import { PatientCard } from '../components/dashboard/PatientCard';
import { PatientCommandDrawer } from '../components/dashboard/PatientCommandDrawer';
import { X, Save, Clock, Phone, User, Calendar as CalendarIcon, FileWarning, CreditCard, CheckCircle } from 'lucide-react';

interface DoctorViewProps {
  doctorName: string;
  localDoctorsData: Doctor[];
  localAppointmentsData: ScheduledAppointment[];
  handleUpdateStatus: (patientId: string, newStatus: PatientStatus) => void;
  handleUpdatePatient: (patientId: string, updatedPatient: Partial<Patient>) => void;
  handleMarkAsArrived: (appointmentId: string) => void;
}

export const DoctorView = React.memo(function DoctorView({ 
  doctorName, 
  localDoctorsData, 
  localAppointmentsData, 
  handleUpdateStatus,
  handleUpdatePatient,
  handleMarkAsArrived
}: DoctorViewProps) {
  
  const [updatingPatient, setUpdatingPatient] = useState<Patient | null>(null);
  const [commandDrawerPatient, setCommandDrawerPatient] = useState<Patient | null>(null);

  const activeDoctor = localDoctorsData.find(d => d.name === doctorName);

  if (!activeDoctor) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className="text-text-gray">Doctor not found.</p>
      </div>
    );
  }

  // Find Currently Consulting Patient
  const currentlyConsulting = 
    activeDoctor.advanceQueue.find(p => p.status === 'in-consultation') ||
    activeDoctor.walkInQueue.find(p => p.status === 'in-consultation');

  // Filter out completed, walked-out, and currently consulting patients
  const advanceQueue = activeDoctor.advanceQueue.filter(
    p => p.status !== 'completed' && p.status !== 'walked-out' && p.status !== 'in-consultation'
  );
  
  const walkInQueue = activeDoctor.walkInQueue.filter(
    p => p.status !== 'completed' && p.status !== 'walked-out' && p.status !== 'in-consultation'
  );

  // Pending Appointments (Scheduled but not arrived)
  const pendingAppointments = localAppointmentsData.filter(
    appt => appt.doctorName === doctorName && appt.status === 'scheduled'
  );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto md:overflow-hidden bg-transparent p-4 md:p-6">
      
      {/* Top Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-border-color p-4 md:p-6 mb-4 md:mb-6 shrink-0 flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">{activeDoctor.name}</h2>
          <div className="flex flex-col mt-4">
            <span className="text-sm font-bold text-text-light uppercase tracking-wider mb-2">Currently Consulting</span>
            {currentlyConsulting ? (
              <button 
                onClick={() => setCommandDrawerPatient(currentlyConsulting)}
                className="flex flex-col gap-2 bg-gray-50 hover:bg-gray-100 border border-border-color rounded-lg p-4 text-left transition-colors w-full"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-text-dark">{currentlyConsulting.name}</span>
                  {currentlyConsulting.token && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-sm border border-green-200">
                      {currentlyConsulting.token}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-text-gray bg-gray-200 px-2 py-0.5 rounded">
                    {currentlyConsulting.type === 'advance' ? 'Advance Booking' : 'Walk-in'}
                  </span>
                </div>
                
                <div className="flex gap-4 mt-1 text-sm text-text-gray font-medium">
                  {currentlyConsulting.phone && <span className="flex items-center gap-1"><Phone size={14} /> {currentlyConsulting.phone}</span>}
                </div>

                {/* Warnings */}
                {(currentlyConsulting.missingForms || currentlyConsulting.paymentPending || currentlyConsulting.profileStatus === 'incomplete') && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-border-color">
                    {currentlyConsulting.missingForms && (
                      <span className="flex items-center gap-1 text-[11px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        <FileWarning size={12} /> Missing Forms
                      </span>
                    )}
                    {currentlyConsulting.paymentPending && (
                      <span className="flex items-center gap-1 text-[11px] uppercase font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        <CreditCard size={12} /> Payment Pending
                      </span>
                    )}
                    {currentlyConsulting.profileStatus === 'incomplete' && (
                      <span className="flex items-center gap-1 text-[11px] uppercase font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        <User size={12} /> Incomplete Profile
                      </span>
                    )}
                  </div>
                )}
              </button>
            ) : (
              <span className="text-text-gray italic border border-dashed border-border-color p-4 rounded-lg bg-gray-50 max-w-sm">No patient in consultation right now.</span>
            )}
          </div>
        </div>
      </div>

      {/* 3 Queues Container */}
      <div className="flex-none md:flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:overflow-hidden pb-6 md:pb-0">
        
        {/* Column 1: Advance Booking */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-border-color overflow-hidden min-h-[400px] md:min-h-0">
          <div className="flex justify-between items-center p-4 border-b border-border-color bg-gray-50/50 shrink-0">
            <h4 className="font-bold text-text-dark">Advance Booking</h4>
            <span className="bg-primary/5 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold border border-primary/10">
              {advanceQueue.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/30">
            {advanceQueue.length > 0 ? (
              advanceQueue.map(p => (
                <PatientCard 
                  key={p.id} 
                  patient={p} 
                  onUpdateProfile={setUpdatingPatient} 
                  onOpenDrawer={setCommandDrawerPatient} 
                />
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-text-light italic">No advance booking patients waiting.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Walk-in Queue */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-border-color overflow-hidden min-h-[400px] md:min-h-0">
          <div className="flex justify-between items-center p-4 border-b border-border-color bg-gray-50/50 shrink-0">
            <h4 className="font-bold text-text-dark">Walk-in Queue</h4>
            <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-blue-100/50">
              {walkInQueue.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/30">
            {walkInQueue.length > 0 ? (
              walkInQueue.map(p => (
                <PatientCard 
                  key={p.id} 
                  patient={p} 
                  onUpdateProfile={setUpdatingPatient} 
                  onOpenDrawer={setCommandDrawerPatient} 
                />
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-text-light italic">No walk-in patients waiting.</p>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Not Yet Arrived (Pending) */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-border-color overflow-hidden min-h-[400px] md:min-h-0">
          <div className="flex justify-between items-center p-4 border-b border-border-color bg-gray-50/50 shrink-0">
            <h4 className="font-bold text-text-dark">Not Yet Arrived</h4>
            <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-100/50">
              {pendingAppointments.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50/30">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map(appt => (
                <div key={appt.id} className="bg-white border border-border-color rounded-lg shadow-sm overflow-hidden flex flex-col relative transition-all hover:border-primary/50 hover:shadow-md shrink-0">
                  <div className="p-3 pb-2">
                    <h5 className="font-semibold text-text-dark text-sm flex items-center gap-1.5 mb-2">
                      <User size={14} className="text-slate-400" /> {appt.patientName}
                    </h5>
                    <div className="flex flex-col gap-1.5 text-xs text-text-gray font-medium">
                      <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> {appt.timeSlot}</span>
                      <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {appt.phone}</span>
                      <span className="flex items-center gap-1.5"><CalendarIcon size={12} className="text-slate-400" /> {appt.reasonForVisit}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleMarkAsArrived(appt.id)}
                    className="w-full bg-white hover:bg-primary/5 border-t border-border-color text-primary py-2.5 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer group mt-1"
                  >
                    <CheckCircle size={16} className="group-hover:scale-110 transition-transform text-primary/80 group-hover:text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">Mark As Arrived</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-text-light italic">No pending appointments.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Patient Command Drawer */}
      <PatientCommandDrawer 
        patient={commandDrawerPatient}
        isOpen={!!commandDrawerPatient}
        onClose={() => setCommandDrawerPatient(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePatient={handleUpdatePatient}
        isDoctorBusy={!!currentlyConsulting}
      />

      {/* Profile Complete Modal */}
      {updatingPatient && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-border-color flex justify-between items-center bg-transparent shrink-0">
              <div>
                <h3 className="text-xl font-bold text-text-dark">Complete Profile</h3>
                <p className="text-sm text-text-gray mt-1">Fill in the missing details for <span className="font-semibold text-text-dark">{updatingPatient.name}</span></p>
              </div>
              <button 
                onClick={() => setUpdatingPatient(null)}
                className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors shrink-0"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Basic Details Section */}
                <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm">
                  <h4 className="text-lg font-semibold text-text-dark mb-4 border-b border-border-color pb-2">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Date of Birth *</label>
                      <input type="date" className="w-full border border-border-color rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Gender *</label>
                      <select defaultValue="" className="w-full border border-border-color rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark bg-white">
                        <option value="" disabled>Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm">
                  <h4 className="text-lg font-semibold text-text-dark mb-4 border-b border-border-color pb-2">Address Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-text-dark mb-1">Street Address</label>
                      <textarea rows={2} placeholder="House No, Street, Landmark" className="w-full border border-border-color rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-text-dark bg-gray-50"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">City</label>
                      <input type="text" className="w-full border border-border-color rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">State</label>
                      <select defaultValue="" className="w-full border border-border-color rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark bg-white">
                        <option value="" disabled>Select State</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Maharashtra">Maharashtra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Pin Code</label>
                      <input type="text" placeholder="6-digit code" className="w-full border border-border-color rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark bg-gray-50" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 bg-transparent border-t border-border-color flex justify-end gap-4 shrink-0">
              <button 
                onClick={() => setUpdatingPatient(null)} 
                className="px-6 py-2.5 text-sm font-bold text-text-dark border border-border-color rounded-lg hover:bg-hover-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert("Profile fully updated!");
                  setUpdatingPatient(null);
                }} 
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark transition-colors"
              >
                <Save size={18} /> Save & Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
