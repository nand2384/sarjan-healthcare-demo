import { type Patient } from '../../data/mockData';
import { AlertTriangle, FileWarning, CreditCard, UserX } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onUpdateProfile?: (p: Patient) => void;
  onOpenDrawer?: (p: Patient) => void;
}

export const PatientCard = ({ patient, onUpdateProfile, onOpenDrawer }: PatientCardProps) => {
  const isOverdue = patient.waitTime && patient.waitTime > 30;

  return (
    <div 
      className={`bg-white border rounded-lg shadow-sm transition-all shrink-0 ${isOverdue ? 'border-red-300 bg-red-50/30' : 'border-border-color hover:border-primary hover:shadow-md'} overflow-hidden relative ${onOpenDrawer ? 'cursor-pointer' : ''}`}
      onClick={() => onOpenDrawer && onOpenDrawer(patient)}
    >
      <div className="p-3 pb-2">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-semibold text-text-dark text-sm flex items-center gap-1.5">
            {patient.name}
            {isOverdue && <span title="Waiting > 30 mins"><AlertTriangle size={14} className="text-red-500" /></span>}
          </h5>
          {patient.token && (
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded font-medium border border-blue-100 shrink-0 ml-2">
              {patient.token}
            </span>
          )}
        </div>
        
        {/* Warnings Row */}
        {(patient.missingForms || patient.paymentPending) && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {patient.missingForms && (
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                <FileWarning size={10} /> Forms
              </span>
            )}
            {patient.paymentPending && (
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                <CreditCard size={10} /> Pay
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center text-xs mb-1">
          <span className={`${isOverdue ? 'text-red-600 font-semibold' : 'text-text-gray font-medium'}`}>
            {patient.time} {patient.waitTime ? `(${patient.waitTime}m)` : ''}
          </span>
          <span className={`px-2 py-0.5 rounded-full capitalize font-semibold border ${
            patient.status === 'waiting' ? 'bg-amber-50 text-amber-700 border-amber-100' :
            patient.status === 'in-consultation' ? 'bg-green-50 text-green-700 border-green-100' :
            patient.status === 'waiting-reports' ? 'bg-purple-50 text-purple-700 border-purple-100' :
            patient.status === 'awaiting-payment' ? 'bg-red-50 text-red-700 border-red-100' :
            'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {patient.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Massive Profile Incomplete Banner */}
      {patient.profileStatus === 'incomplete' && onUpdateProfile && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onUpdateProfile(patient);
          }}
          className="w-full bg-red-50 hover:bg-red-100 border-t border-red-100 text-red-700 py-2.5 px-3 flex items-center justify-center gap-2 transition-colors cursor-pointer group mt-1"
        >
          <UserX size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Complete Profile Now</span>
        </button>
      )}
    </div>
  );
};
