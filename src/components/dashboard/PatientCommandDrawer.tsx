import React, { useState, useEffect } from 'react';
import { type Patient, type PatientStatus, type Vitals, TESTS_CATALOG, CONSULTATION_FEE } from '../../data/mockData';
import { X, Play, HeartPulse, UserMinus, Clock, Receipt, Printer, Save, ClipboardList, CheckSquare, AlertTriangle } from 'lucide-react';

interface PatientCommandDrawerProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (patientId: string, newStatus: PatientStatus) => void;
  onUpdatePatient: (patientId: string, updates: Partial<Patient>) => void;
  isDoctorBusy?: boolean;
}

type DrawerView = 'actions' | 'vitals' | 'billing' | 'tests';

export const PatientCommandDrawer: React.FC<PatientCommandDrawerProps> = ({ 
  patient, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  onUpdatePatient,
  isDoctorBusy = false
}) => {
  const [activeView, setActiveView] = useState<DrawerView>('actions');
  const [showConfirmWalkout, setShowConfirmWalkout] = useState(false);

  // Vitals State
  const [vitalsData, setVitalsData] = useState<Vitals>({
    height: '',
    weight: '',
    temp: '',
    pulse: '',
    respiratoryRate: '',
    spo2: ''
  });

  // Billing State
  const [includeConsultation, setIncludeConsultation] = useState(true);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'UPI'>('Cash');

  // Reset states when drawer opens/closes or patient changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveView('actions');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowConfirmWalkout(false);
    if (patient?.vitals) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVitalsData(patient.vitals);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVitalsData({ height: '', weight: '', temp: '', pulse: '', respiratoryRate: '', spo2: '' });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIncludeConsultation(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedTests([]);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPaymentMode('Cash');
  }, [isOpen, patient]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !patient) return null;

  const handleSaveVitals = () => {
    onUpdatePatient(patient.id, { vitals: vitalsData });
    setActiveView('actions');
  };

  const calculateTotalBill = () => {
    let total = 0;
    if (includeConsultation) total += CONSULTATION_FEE;
    selectedTests.forEach(testId => {
      const test = TESTS_CATALOG.find(t => t.id === testId);
      if (test) total += test.price;
    });
    return total;
  };

  const handleCompleteBilling = () => {
    onUpdatePatient(patient.id, { paymentPending: false });
    onUpdateStatus(patient.id, 'completed');
    alert(`Receipt generated for ₹${calculateTotalBill()} via ${paymentMode}`);
    onClose();
  };

  // BMI Calculation
  let bmiValue = '';
  if (vitalsData.height && vitalsData.weight) {
    const heightInMeters = parseFloat(vitalsData.height) / 100;
    const weightInKg = parseFloat(vitalsData.weight);
    if (heightInMeters > 0 && weightInKg > 0) {
      bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
  }

  const renderActionsView = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-border-color">
          <p className="text-xs text-text-gray font-semibold uppercase tracking-wider mb-1">Queue Type</p>
          <p className="font-medium text-text-dark capitalize">{patient.type} {patient.token ? `(${patient.token})` : ''}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-border-color">
          <p className="text-xs text-text-gray font-semibold uppercase tracking-wider mb-1">Wait Time</p>
          <p className="font-medium text-text-dark flex items-center gap-1.5">
            <Clock size={14} className={patient.waitTime && patient.waitTime > 30 ? "text-red-500" : "text-text-gray"} /> 
            {patient.waitTime ? `${patient.waitTime} mins` : 'Just arrived'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 border-b border-border-color pb-2">Status Actions</h3>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setActiveView('vitals')}
            disabled={patient.status === 'completed' || patient.status === 'walked-out'}
            className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <div className="bg-purple-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <HeartPulse size={20} className="text-purple-700" />
            </div>
            <div className="text-left">
              <p>Record Vitals</p>
              <p className="text-xs font-medium text-purple-700/80">
                {patient.vitals?.pulse ? 'Update recorded vitals' : 'Recommended before consultation'}
              </p>
            </div>
            {patient.vitals?.pulse && (
              <div className="absolute top-4 right-4 text-xs font-bold bg-white text-purple-600 px-2 py-1 rounded-md shadow-sm">
                Recorded ✓
              </div>
            )}
          </button>

          {patient.status === 'in-consultation' ? (
            <button 
              onClick={() => {
                onUpdateStatus(patient.id, 'awaiting-payment');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl font-semibold transition-all group"
            >
              <div className="bg-purple-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Receipt size={20} className="text-purple-700" />
              </div>
              <div className="text-left flex-1">
                <p>Consultation Complete</p>
                <p className="text-xs font-medium text-purple-700/80">Mark done & send to billing</p>
              </div>
            </button>
          ) : (
            <button 
              onClick={() => {
                onUpdateStatus(patient.id, 'in-consultation');
                onClose();
              }}
              disabled={isDoctorBusy || patient.status === 'completed' || patient.status === 'walked-out'}
              className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 text-green-800 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="bg-green-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Play size={20} className="text-green-700" />
              </div>
              <div className="text-left flex-1">
                <p>Send to Consultation</p>
                <p className="text-xs font-medium text-green-700/80">
                  {isDoctorBusy ? 'Doctor is currently busy' : 'Doctor is ready for patient'}
                </p>
              </div>
              {!patient.vitals?.pulse && patient.status !== 'completed' && (
                <div className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded shrink-0">No Vitals</div>
              )}
            </button>
          )}

          <button 
            onClick={() => setActiveView('tests')}
            disabled={patient.status === 'completed' || patient.status === 'walked-out'}
            className="w-full flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
          >
            <div className="bg-indigo-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <ClipboardList size={20} className="text-indigo-700" />
            </div>
            <div className="text-left flex-1">
              <p>Send for Tests</p>
              <p className="text-xs font-medium text-indigo-700/80">Select lab tests for patient</p>
            </div>
          </button>

          <div className="my-2 border-t border-dashed border-border-color"></div>

          {patient.status !== 'waiting' && (
            <button 
              onClick={() => setActiveView('billing')}
              disabled={patient.status === 'completed' || patient.status === 'walked-out'}
              className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="bg-blue-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <Receipt size={20} className="text-blue-700" />
              </div>
              <div className="text-left">
                <p>Checkout & Billing</p>
                <p className="text-xs font-medium text-blue-700/80">Generate receipt & finish appointment</p>
              </div>
            </button>
          )}

          <button 
            onClick={() => setShowConfirmWalkout(true)}
            disabled={patient.status === 'completed' || patient.status === 'walked-out'}
            className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
          >
            <div className="bg-gray-200 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <UserMinus size={20} className="text-gray-600" />
            </div>
            <div className="text-left">
              <p>Mark as Walked-Out</p>
              <p className="text-xs font-medium text-gray-500">Patient left before seeing doctor</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );

  const renderVitalsModal = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-bg-base shrink-0">
          <h3 className="text-xl font-bold text-text-dark flex items-center gap-3">
            <HeartPulse size={24} className="text-purple-600" /> Record Vitals for {patient.name}
          </h3>
          <button onClick={() => setActiveView('actions')} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Height (cm)</label>
              <input 
                type="number" 
                placeholder="e.g. 170" 
                value={vitalsData.height}
                onChange={e => setVitalsData({...vitalsData, height: e.target.value})}
                className="w-full border border-border-color rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-text-dark" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Weight (kg)</label>
              <input 
                type="number" 
                placeholder="e.g. 68" 
                value={vitalsData.weight}
                onChange={e => setVitalsData({...vitalsData, weight: e.target.value})}
                className="w-full border border-border-color rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-text-dark" 
              />
            </div>
          </div>
          
          {bmiValue && (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-purple-800">Calculated BMI</span>
              <span className="text-lg font-bold text-purple-900">{bmiValue}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Temperature (°F)</label>
              <input 
                type="number" 
                placeholder="e.g. 98.6" 
                value={vitalsData.temp}
                onChange={e => setVitalsData({...vitalsData, temp: e.target.value})}
                className="w-full border border-border-color rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-text-dark" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Pulse (BPM)</label>
              <input 
                type="number" 
                placeholder="e.g. 72" 
                value={vitalsData.pulse}
                onChange={e => setVitalsData({...vitalsData, pulse: e.target.value})}
                className="w-full border border-border-color rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-text-dark" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Respiratory Rate</label>
              <input 
                type="number" 
                placeholder="e.g. 16" 
                value={vitalsData.respiratoryRate}
                onChange={e => setVitalsData({...vitalsData, respiratoryRate: e.target.value})}
                className="w-full border border-border-color rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-text-dark" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">SpO<sub>2</sub> (%)</label>
              <input 
                type="number" 
                placeholder="e.g. 99" 
                value={vitalsData.spo2}
                onChange={e => setVitalsData({...vitalsData, spo2: e.target.value})}
                className="w-full border border-border-color rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-text-dark" 
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-bg-base border-t border-border-color flex justify-end gap-3">
          <button 
            onClick={() => setActiveView('actions')}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-text-dark border border-border-color hover:bg-hover-bg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveVitals}
            className="px-6 py-2.5 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors shadow-sm"
          >
            <Save size={18} /> Save Vitals
          </button>
        </div>
      </div>
    </div>
  );

  const renderBillingModal = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-bg-base shrink-0">
          <h3 className="text-xl font-bold text-text-dark flex items-center gap-3">
            <Receipt size={24} className="text-blue-600" /> Checkout & Billing
          </h3>
          <button onClick={() => setActiveView('actions')} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3">Services Rendered</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 border border-border-color rounded-lg bg-gray-50 cursor-pointer hover:border-primary transition-colors">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={includeConsultation}
                    onChange={e => setIncludeConsultation(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="font-medium text-text-dark">Consultation Fee</span>
                </div>
                <span className="font-bold text-text-dark">₹{CONSULTATION_FEE}</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3">Lab Tests</h4>
            <div className="space-y-2">
              {TESTS_CATALOG.map(test => (
                <label key={test.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTests.includes(test.id) ? 'border-primary bg-primary/5' : 'border-border-color hover:border-gray-400'
                }`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedTests.includes(test.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedTests([...selectedTests, test.id]);
                        else setSelectedTests(selectedTests.filter(id => id !== test.id));
                      }}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    />
                    <span className="font-medium text-text-dark">{test.name}</span>
                  </div>
                  <span className="font-bold text-text-dark">₹{test.price}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3">Payment Mode</h4>
            <div className="flex gap-2">
              {(['Cash', 'Card', 'UPI'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                    paymentMode === mode ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-text-gray hover:bg-gray-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-bg-base border-t border-border-color shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-text-gray">Total Amount:</span>
            <span className="text-2xl font-black text-text-dark">₹{calculateTotalBill()}</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveView('actions')}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-text-dark border border-border-color hover:bg-hover-bg transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleCompleteBilling}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-sm"
            >
              <Printer size={18} /> Generate Receipt & Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestsModal = () => (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-bg-base shrink-0">
          <h3 className="text-xl font-bold text-text-dark flex items-center gap-3">
            <ClipboardList size={24} className="text-indigo-600" /> Select Tests for {patient.name}
          </h3>
          <button onClick={() => setActiveView('actions')} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-sm text-text-gray mb-4">Select the tests the patient needs to perform. They will be moved to the waiting-reports queue.</p>
          
          <div className="space-y-3">
            {TESTS_CATALOG.map(test => {
              const isSelected = selectedTests.includes(test.id);
              return (
                <div 
                  key={test.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTests(selectedTests.filter(id => id !== test.id));
                    } else {
                      setSelectedTests([...selectedTests, test.id]);
                    }
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-border-color hover:border-indigo-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${
                    isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckSquare size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-text-dark'}`}>{test.name}</p>
                    <p className="text-sm text-text-gray font-medium">₹{test.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-5 bg-bg-base border-t border-border-color flex justify-end gap-3 shrink-0">
          <button 
            onClick={() => setActiveView('actions')} 
            className="px-5 py-2 text-sm font-bold text-text-dark border border-border-color rounded-lg hover:bg-hover-bg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onUpdateStatus(patient.id, 'waiting-reports');
              onClose();
            }}
            disabled={selectedTests.length === 0}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={16} /> Send to Lab
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Global Backdrop with z-[100] to cover everything including z-50 Header */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Render Modals if Active */}
      {activeView === 'vitals' && renderVitalsModal()}
      {activeView === 'billing' && renderBillingModal()}
      {activeView === 'tests' && renderTestsModal()}

      {/* Custom Confirm Modal */}
      {showConfirmWalkout && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Mark Walked-Out?</h3>
              <p className="text-sm text-text-gray mb-6">
                Are you sure you want to mark <span className="font-bold text-text-dark">{patient.name}</span> as walked-out? This will remove them from the active queue and cannot be easily undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmWalkout(false)}
                  className="flex-1 py-2.5 px-4 font-bold text-text-dark bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onUpdateStatus(patient.id, 'walked-out');
                    setShowConfirmWalkout(false);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Slide-over Panel only for Actions */}
      {activeView === 'actions' && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300 border-l border-border-color">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-bg-base shrink-0">
            <div>
              <h2 className="text-xl font-bold text-text-dark truncate max-w-[280px]">{patient.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full capitalize text-xs font-semibold border ${
                  patient.status === 'waiting' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  patient.status === 'in-consultation' ? 'bg-green-50 text-green-700 border-green-100' :
                  patient.status === 'waiting-reports' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                  patient.status === 'awaiting-payment' ? 'bg-red-50 text-red-700 border-red-100' :
                  patient.status === 'walked-out' ? 'bg-gray-100 text-gray-500 border-gray-200 line-through' :
                  'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {patient.status.replace('-', ' ')}
                </span>
                <span className="text-text-gray text-xs font-medium border-l border-border-color pl-2">
                  ID: {patient.id}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-hover-bg rounded-md text-text-gray hover:text-text-dark transition-colors shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 relative">
            {renderActionsView()}
          </div>
        </div>
      )}
    </>
  );
};
