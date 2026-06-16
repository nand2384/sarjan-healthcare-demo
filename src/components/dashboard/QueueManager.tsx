import React, { useState } from 'react';
import { type Patient, type PatientStatus, type Doctor } from '../../data/mockData';
import { X, Save, UserX } from 'lucide-react';
import { PatientCommandDrawer } from './PatientCommandDrawer';
import { PatientCard } from './PatientCard';

interface QueueManagerProps {
  localDoctorsData: Doctor[];
  handleUpdateStatus: (patientId: string, newStatus: PatientStatus) => void;
  handleUpdatePatient: (patientId: string, updatedPatient: Partial<Patient>) => void;
}

export const QueueManager = React.memo(function QueueManager({ localDoctorsData, handleUpdateStatus, handleUpdatePatient }: QueueManagerProps) {
  const [activeDoctorId, setActiveDoctorId] = useState(localDoctorsData[0]?.id);
  const [updatingPatient, setUpdatingPatient] = useState<Patient | null>(null);
  const [commandDrawerPatient, setCommandDrawerPatient] = useState<Patient | null>(null);

  const activeDoctor = localDoctorsData.find(d => d.id === activeDoctorId) || localDoctorsData[0];

  // Filter out completed and walked-out patients from the active view
  const advanceQueue = activeDoctor?.advanceQueue.filter(p => p.status !== 'completed' && p.status !== 'walked-out') || [];
  const walkInQueue = activeDoctor?.walkInQueue.filter(p => p.status !== 'completed' && p.status !== 'walked-out') || [];


  return (
    <div className="bg-white rounded-xl border border-border-color shadow-sm flex flex-col h-[calc(100vh-250px)] relative">
      {/* Doctor Tabs */}
      <div className="flex border-b border-border-color overflow-x-auto bg-bg-base/50 rounded-t-xl px-2 pt-2 gap-1">
        {localDoctorsData.map(doctor => {
          const activeCount = 
            doctor.advanceQueue.filter(p => p.status !== 'completed' && p.status !== 'walked-out').length + 
            doctor.walkInQueue.filter(p => p.status !== 'completed' && p.status !== 'walked-out').length;

          return (
            <button 
              key={doctor.id}
              onClick={() => setActiveDoctorId(doctor.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap rounded-t-lg transition-colors border-b-2 ${
                activeDoctorId === doctor.id 
                  ? 'bg-white text-primary border-primary shadow-[0_-4px_6px_-2px_rgba(0,0,0,0.02)]' 
                  : 'text-text-gray border-transparent hover:text-text-dark hover:bg-white/50'
              }`}
            >
              {doctor.name}
              {activeCount > 0 && (
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeDoctorId === doctor.id ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'
                }`}>
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Doctor Info */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-border-color shrink-0">
        <div>
          <h2 className="text-xl font-bold text-text-dark">{activeDoctor.name}</h2>
          <p className="text-sm text-text-gray">{activeDoctor.specialty}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
          activeDoctor.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
          activeDoctor.status === 'busy' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-300'
        }`}>
          {activeDoctor.status}
        </span>
      </div>
      
      {/* Queues container */}
      <div className="grid grid-cols-2 divide-x divide-border-color flex-1 overflow-hidden">
        {/* Advance Queue */}
        <div className="flex flex-col bg-gray-50/30 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border-color/50 shrink-0 bg-white/50">
            <h4 className="font-bold text-text-dark">Advance Booking</h4>
            <span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {advanceQueue.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {advanceQueue.length > 0 ? (
              advanceQueue.map(p => <PatientCard key={p.id} patient={p} onUpdateProfile={setUpdatingPatient} onOpenDrawer={setCommandDrawerPatient} />)
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-text-light italic border border-dashed border-border-color rounded-lg px-6 py-4">No scheduled patients</p>
              </div>
            )}
          </div>
        </div>

        {/* Walk-in Queue */}
        <div className="flex flex-col bg-gray-50/30 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-border-color/50 shrink-0 bg-white/50">
            <h4 className="font-bold text-text-dark">Walk-in Queue</h4>
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold">
              {walkInQueue.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {walkInQueue.length > 0 ? (
              walkInQueue.map(p => <PatientCard key={p.id} patient={p} onUpdateProfile={setUpdatingPatient} onOpenDrawer={setCommandDrawerPatient} />)
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-text-light italic border border-dashed border-border-color rounded-lg px-6 py-4">No walk-in patients</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Command Drawer (Slide-over) */}
      <PatientCommandDrawer 
        patient={commandDrawerPatient}
        isOpen={!!commandDrawerPatient}
        onClose={() => setCommandDrawerPatient(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePatient={handleUpdatePatient}
      />

      {/* Full Screen Update Modal */}
      {updatingPatient && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white shadow-2xl w-full h-full max-w-[1200px] rounded-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-border-color flex justify-between items-center bg-bg-base">
              <div>
                <h3 className="font-bold text-text-dark text-2xl flex items-center gap-3">
                  <UserX className="text-red-500" size={28} /> Complete Patient Profile
                </h3>
                <p className="text-text-gray mt-1 text-sm">
                  Updating demographic and contact records for <strong className="text-text-dark text-base">{updatingPatient.name}</strong>
                </p>
              </div>
              <button 
                onClick={() => setUpdatingPatient(null)} 
                className="text-text-gray hover:text-text-dark hover:bg-white border border-transparent hover:border-border-color rounded-md p-2 transition-all shadow-sm"
              >
                <X size={24} />
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
            <div className="px-8 py-5 bg-bg-base border-t border-border-color flex justify-end gap-4 shrink-0">
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
