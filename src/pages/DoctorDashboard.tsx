import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  HeartPulse, 
  TrendingUp, 
  IndianRupee,
  History as HistoryIcon,
  User,
  Stethoscope,
  ClipboardList,
  FileText,
  CalendarDays,
  Plus,
  Trash2,
  Search,
  ChevronRight,
  ChevronLeft,
  Activity
} from 'lucide-react';
import { doctorsData, scheduledAppointments, type Patient, type ScheduledAppointment } from '../data/mockData';

interface DoctorDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// 9 Steps definition (Vitals removed as interactive step)
type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface StepConfig {
  id: StepId;
  label: string;
  icon: React.ReactNode;
}

// Fixed Lab Tests List as requested
const INVESTIGATION_CATALOG = [
  "CBC",
  "LFT",
  "RFT",
  "S. Vit B12",
  "S. Vit D3",
  "TSH",
  "Full T3-T4",
  "Lipid profile",
  "RBS",
  "HbA1c",
  "FBS",
  "PPBS"
];

const DIAGNOSIS_CATALOG = [
  "Acute Viral Fever",
  "Essential Hypertension",
  "Type 2 Diabetes Mellitus",
  "Gastroesophageal Reflux Disease (GERD)",
  "Upper Respiratory Tract Infection (URTI)",
  "Acute Bronchitis",
  "Migraine",
  "Osteoarthritis",
  "Allergic Rhinitis"
];

const MEDICINE_CATALOG = [
  "Paracetamol 500mg",
  "Paracetamol 650mg",
  "Amoxicillin 500mg",
  "Azithromycin 500mg",
  "Metformin 500mg",
  "Pantoprazole 40mg",
  "Cetirizine 10mg",
  "Aspirin 75mg",
  "Atorvastatin 20mg",
  "Amlodipine 5mg",
  "Losartan 50mg",
  "Ibuprofen 400mg"
];

interface SymptomItem {
  name: string;
  duration: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

interface HistoryItem {
  name: string;
  type: 'Self' | 'Family';
  notes?: string;
}

interface OngoingMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface PrescribedMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ activeTab, setActiveTab }) => {
  // Simulate Dr. Sarah Jenkins (id: 'd1')
  const doctorId = 'd1';
  const doctor = doctorsData.find(d => d.id === doctorId) || doctorsData[0];

  // Queue state
  const [consultingPatient, setConsultingPatient] = useState<Patient | null>(
    doctor.advanceQueue.find(p => p.status === 'in-consultation') || 
    doctor.walkInQueue.find(p => p.status === 'in-consultation') || 
    null
  );

  const [waitingQueue] = useState<Patient[]>([
    ...doctor.advanceQueue.filter(p => p.status === 'waiting'),
    ...doctor.walkInQueue.filter(p => p.status === 'waiting')
  ]);

  const [completedPatients, setCompletedPatients] = useState<Patient[]>([
    ...doctor.advanceQueue.filter(p => p.status === 'completed'),
    ...doctor.walkInQueue.filter(p => p.status === 'completed')
  ]);

  // Receptionist Integration State
  const [isAvailable, setIsAvailable] = useState(false);

  // Consultation Wizard Active Step
  const [activeStep, setActiveStep] = useState<StepId>(1);

  // --- WIZARD FORM STATE ---

  // Step 1: Symptoms
  const [symptomsList, setSymptomsList] = useState<SymptomItem[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [symptomsNotes, setSymptomsNotes] = useState('');

  // Step 2: Past / Family History
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [customHistory, setCustomHistory] = useState('');

  // Step 3: Personal History
  const [diet, setDiet] = useState('Veg');
  const [sleep, setSleep] = useState('Good');
  const [lifestyle, setLifestyle] = useState('Active');
  const [bowel, setBowel] = useState('Normal');
  const [appetite, setAppetite] = useState('Normal');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');

  // Step 4: Ongoing Medication History (with default "No Record")
  const [ongoingMedications, setOngoingMedications] = useState<OngoingMedication[]>([]);
  const [newOngoingName, setNewOngoingName] = useState('');
  const [newOngoingDosage, setNewOngoingDosage] = useState('');
  const [newOngoingFreq, setNewOngoingFreq] = useState('1-0-1');
  const [newOngoingType, setNewOngoingType] = useState('TAB');

  // Step 5: Physical Examination Redesign
  // * Side-by-Side Vertical Blocks: Recreated the Physical Examination interface as two structured vertical columns side-by-side on desktop displays (Cardiovascular System on the left, Respiratory System on the right).
  // * Selectable Pill Options: Replaced the freeform notes textareas with interactive pill buttons (capsules) representing clinical findings parameters (Heart Sounds, Murmurs, Rhythm/Rate, Air Entry, Added Sounds, Chest Expansion), ensuring quick one-click charting.
  // * Default Normal Selection: Set all parameters to default to standard normal clinical findings (e.g. S1 S2 normal heard, no murmurs, regular rhythm, clear air entry, symmetrical chest expansion) by default.
  // * Removed Set Normal & Not Examined: Removed the redundant "Set Normal" button helpers (since normal findings are already selected by default) and removed the "Not Examined" options from all parameter map choices.
  // * Dynamic State Synchronization: Implemented useEffect synchronization hooks that automatically compile the selected pill properties into standard text findings, populating the underlying cvsExam and rsExam string states.
  const [cvsExam, setCvsExam] = useState('Heart Sounds: Normal (S1 S2), Murmurs: No Murmurs, Rhythm: Regular Rhythm');
  const [rsExam, setRsExam] = useState('Air Entry: Bilateral Normal, Added Sounds: None (Clear), Chest Expansion: Symmetrical');
  const [cvsHeartSounds, setCvsHeartSounds] = useState('Normal (S1 S2)');
  const [cvsMurmurs, setCvsMurmurs] = useState('No Murmurs');
  const [cvsRhythm, setCvsRhythm] = useState('Regular Rhythm');
  const [rsAirEntry, setRsAirEntry] = useState('Bilateral Normal');
  const [rsAddedSounds, setRsAddedSounds] = useState('None (Clear)');
  const [rsExpansion, setRsExpansion] = useState('Symmetrical');

  // Step 6: Diagnosis
  const [diagnosisList, setDiagnosisList] = useState<string[]>([]);
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [diagnosisNotes, setDiagnosisNotes] = useState('');

  // Step 7: Investigation
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [customTest, setCustomTest] = useState('');

  // Step 8: Prescription
  const [prescribedMeds, setPrescribedMeds] = useState<PrescribedMedication[]>([]);
  const [newMedType, setNewMedType] = useState('TAB');
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedDuration, setNewMedDuration] = useState('');
  const [newMedInstructions, setNewMedInstructions] = useState('After Food');
  const [prescriptionAdvice, setPrescriptionAdvice] = useState('');

  // Step 9: Follow Up
  const [followUpDays, setFollowUpDays] = useState<number>(5);
  const [referral, setReferral] = useState('');

  // Schedule agenda state
  const todayStr = new Date().toISOString().split('T')[0];
  const doctorAppointments = scheduledAppointments.filter(
    (appt: ScheduledAppointment) => appt.doctorId === doctorId && appt.date === todayStr
  );

  // Load patient details into form state when a new patient is loaded
  useEffect(() => {
    if (consultingPatient) {
      setActiveStep(1);
      // Reset wizard fields
      setSymptomsList([]);
      setCustomSymptom('');
      setSymptomsNotes('');
      setHistoryList([]);
      setCustomHistory('');
      setDiet('Veg');
      setSleep('Good');
      setLifestyle('Active');
      setBowel('Normal');
      setAppetite('Normal');
      setAllergies([]);
      setCustomAllergy('');
      setOngoingMedications([]);
      setNewOngoingName('');
      setNewOngoingDosage('');
      setNewOngoingFreq('1-0-1');
      setNewOngoingType('TAB');
      setCvsExam('Heart Sounds: Normal (S1 S2), Murmurs: No Murmurs, Rhythm: Regular Rhythm');
      setRsExam('Air Entry: Bilateral Normal, Added Sounds: None (Clear), Chest Expansion: Symmetrical');
      setCvsHeartSounds('Normal (S1 S2)');
      setCvsMurmurs('No Murmurs');
      setCvsRhythm('Regular Rhythm');
      setRsAirEntry('Bilateral Normal');
      setRsAddedSounds('None (Clear)');
      setRsExpansion('Symmetrical');
      setDiagnosisList([]);
      setCustomDiagnosis('');
      setDiagnosisNotes('');
      setSelectedTests([]);
      setCustomTest('');
      setPrescribedMeds([]);
      setNewMedType('TAB');
      setNewMedName('');
      setNewMedDosage('');
      setNewMedFreq('');
      setNewMedDuration('');
      setNewMedInstructions('After Food');
      setPrescriptionAdvice('');
      setFollowUpDays(5);
      setReferral('');
    }
  }, [consultingPatient]);

  // Synchronize CVS selectable options to cvsExam string
  useEffect(() => {
    setCvsExam(`Heart Sounds: ${cvsHeartSounds}, Murmurs: ${cvsMurmurs}, Rhythm: ${cvsRhythm}`);
  }, [cvsHeartSounds, cvsMurmurs, cvsRhythm]);

  // Synchronize RS selectable options to rsExam string
  useEffect(() => {
    setRsExam(`Air Entry: ${rsAirEntry}, Added Sounds: ${rsAddedSounds}, Chest Expansion: ${rsExpansion}`);
  }, [rsAirEntry, rsAddedSounds, rsExpansion]);



  const handleCompleteConsultation = () => {
    if (!consultingPatient) return;
    
    // Check for empty key fields and remind doctor at the end
    const emptyFields: string[] = [];
    if (symptomsList.length === 0 && !symptomsNotes.trim()) {
      emptyFields.push("Symptoms & Complaints");
    }
    if (!cvsExam.trim() || !rsExam.trim()) {
      emptyFields.push("Physical Examination (CVS/RS)");
    }
    if (diagnosisList.length === 0 && !diagnosisNotes.trim()) {
      emptyFields.push("Clinical Diagnosis");
    }
    if (prescribedMeds.length === 0 && !prescriptionAdvice.trim()) {
      emptyFields.push("Prescription / Advice");
    }

    if (emptyFields.length > 0) {
      const confirmMsg = `The following fields have been left empty:\n` + 
                         emptyFields.map(f => `• ${f}`).join('\n') + 
                         `\n\nDo you want to complete the consultation without filling them?`;
      if (!window.confirm(confirmMsg)) {
        return;
      }
    }
    
    const updatedPatient: Patient = {
      ...consultingPatient,
      status: 'awaiting-payment',
      paymentPending: true
    };
    
    setCompletedPatients(prev => [...prev, updatedPatient]);
    alert(`Consultation complete for ${consultingPatient.name}! Prescribed ${prescribedMeds.length} medications. Refer to Checkout billing.`);
    
    // Do not load next patient automatically. 
    // Go to Dashboard so the doctor can manually click "I'm ready" when they are prepared.
    setConsultingPatient(null);
    setIsAvailable(false);
    setActiveTab('Dashboard');
    setActiveStep(1);
  };

  const stepsConfig: StepConfig[] = [
    { id: 1, label: 'Symptoms', icon: <AlertCircle size={18} /> },
    { id: 2, label: 'Personal History', icon: <User size={18} /> },
    { id: 3, label: 'Past/Family History', icon: <HistoryIcon size={18} /> },
    { id: 4, label: 'Medication History', icon: <FileText size={18} /> },
    { id: 5, label: 'Examination', icon: <Stethoscope size={18} /> },
    { id: 6, label: 'Diagnosis', icon: <CheckCircle size={18} /> },
    { id: 7, label: 'Investigation', icon: <ClipboardList size={18} /> },
    { id: 8, label: 'Prescription', icon: <FileText size={18} /> },
    { id: 9, label: 'Follow Up', icon: <CalendarDays size={18} /> },
  ];

  // Helper date calculator for follow up
  const getFollowUpDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + followUpDays);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Rendering step content dynamically
  const renderStepContent = () => {
    switch (activeStep) {
      case 1: // Symptoms
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Symptoms & Complaints</h3>
              <p className="text-sm text-text-gray mt-0.5">Select common symptoms or add custom complaints with duration and severity details.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              {/* Search custom symptom bar */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Search or Add Custom Symptoms</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={16} />
                    <input 
                      type="text" 
                      placeholder="Type a symptom (e.g. Sore throat, Nausea) and press Add..."
                      value={customSymptom}
                      onChange={e => setCustomSymptom(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && customSymptom.trim()) {
                          if (!symptomsList.some(s => s.name === customSymptom.trim())) {
                            setSymptomsList(prev => [...prev, { name: customSymptom.trim(), duration: '', severity: 'Mild' }]);
                          }
                          setCustomSymptom('');
                        }
                      }}
                      className="w-full border border-border-color rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (customSymptom.trim() && !symptomsList.some(s => s.name === customSymptom.trim())) {
                        setSymptomsList(prev => [...prev, { name: customSymptom.trim(), duration: '', severity: 'Mild' }]);
                        setCustomSymptom('');
                      }
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Tag selectors (Redesigned with Duration & Severity inputs for each symptom) */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-3">Selected Symptoms (with Duration & Severity)</p>
                <div className="flex flex-col gap-3">
                  {symptomsList.map(sym => (
                    <div 
                      key={sym.name} 
                      className="border border-border-color rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-pulse"></span>
                        <span className="font-bold text-text-dark text-sm md:text-base">{sym.name}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Duration Input */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-gray font-semibold">Duration:</span>
                          <input 
                            type="text" 
                            value={sym.duration}
                            onChange={e => {
                              const val = e.target.value;
                              setSymptomsList(prev => prev.map(s => s.name === sym.name ? { ...s, duration: val } : s));
                            }}
                            placeholder="e.g. 3 days"
                            className="border border-border-color rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-xs bg-white w-32"
                          />
                        </div>

                        {/* Severity Button Group */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-gray font-semibold">Severity:</span>
                          <div className="flex rounded-lg overflow-hidden border border-border-color">
                            {(['Mild', 'Moderate', 'Severe'] as const).map(sev => {
                              const isSelected = sym.severity === sev;
                              const sevColorClass = 
                                sev === 'Mild' ? (isSelected ? 'bg-green-600 text-white' : 'hover:bg-green-50 text-green-700 bg-white') :
                                sev === 'Moderate' ? (isSelected ? 'bg-amber-500 text-white' : 'hover:bg-amber-50 text-amber-700 bg-white') :
                                (isSelected ? 'bg-red-600 text-white' : 'hover:bg-red-50 text-red-700 bg-white');
                              return (
                                <button
                                  key={sev}
                                  type="button"
                                  onClick={() => {
                                    setSymptomsList(prev => prev.map(s => s.name === sym.name ? { ...s, severity: sev } : s));
                                  }}
                                  className={`px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${sevColorClass}`}
                                >
                                  {sev}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button 
                          type="button"
                          onClick={() => setSymptomsList(symptomsList.filter(s => s.name !== sym.name))}
                          className="text-text-gray hover:text-danger p-1.5 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove Symptom"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {symptomsList.length === 0 && (
                    <p className="text-sm text-text-gray italic p-2 bg-gray-50 border border-dashed border-border-color rounded-lg text-center">No symptoms selected yet. Use the search bar or quick recommendations to add.</p>
                  )}
                </div>
              </div>

              {/* Quick Recommendations Tags */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Quick Recommendations</p>
                <div className="flex flex-wrap gap-2">
                  {["Fever", "Cough", "Headache", "Body Ache", "Cold", "Weakness", "Vomiting", "Diarrhea", "Chest Pain", "Breathlessness"].map(rec => {
                    const active = symptomsList.some(s => s.name === rec);
                    return (
                      <button
                        key={rec}
                        onClick={() => {
                          if (active) {
                            setSymptomsList(symptomsList.filter(s => s.name !== rec));
                          } else {
                            setSymptomsList(prev => [...prev, { name: rec, duration: '', severity: 'Mild' }]);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          active 
                            ? 'bg-primary border-primary text-white font-bold' 
                            : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                        }`}
                      >
                        {rec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Notes */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1">History of Presenting Illness (HPI) Notes</label>
                <textarea 
                  rows={3}
                  value={symptomsNotes}
                  onChange={e => setSymptomsNotes(e.target.value)}
                  placeholder="e.g. Patient complaining of high grade fever since 3 days, accompanied by dry cough..."
                  className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-gray-50/20 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Past/Family History
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Past & Family History</h3>
              <p className="text-sm text-text-gray mt-0.5">Specify patient co-morbidities or hereditary risks.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              {/* Search or Add Custom History Conditions */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Search or Add Custom History Conditions</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={16} />
                    <input 
                      type="text" 
                      placeholder="Type a medical condition (e.g. Asthma, Tuberculosis) and press Add..."
                      value={customHistory}
                      onChange={e => setCustomHistory(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && customHistory.trim()) {
                          if (!historyList.some(h => h.name === customHistory.trim())) {
                            setHistoryList(prev => [...prev, { name: customHistory.trim(), type: 'Self', notes: '' }]);
                          }
                          setCustomHistory('');
                        }
                      }}
                      className="w-full border border-border-color rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (customHistory.trim() && !historyList.some(h => h.name === customHistory.trim())) {
                        setHistoryList(prev => [...prev, { name: customHistory.trim(), type: 'Self', notes: '' }]);
                        setCustomHistory('');
                      }
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Selected History Conditions list */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-3">Selected History Conditions</p>
                <div className="flex flex-col gap-3">
                  {historyList.map(hist => (
                    <div 
                      key={hist.name} 
                      className="border border-border-color rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-pulse"></span>
                        <span className="font-bold text-text-dark text-sm md:text-base">{hist.name}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Classification Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-gray font-semibold">Classification:</span>
                          <div className="flex rounded-lg overflow-hidden border border-border-color">
                            {(['Self', 'Family'] as const).map(t => {
                              const isSelected = hist.type === t;
                              const btnClass = isSelected 
                                ? 'bg-primary text-white font-bold' 
                                : 'hover:bg-primary/5 text-primary bg-white';
                              return (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => {
                                    setHistoryList(prev => prev.map(h => h.name === hist.name ? { ...h, type: t } : h));
                                  }}
                                  className={`px-3 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${btnClass}`}
                                >
                                  {t === 'Self' ? 'Patient (Self)' : 'Family Member'}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Relation Input */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-gray font-semibold">Relation:</span>
                          <input 
                            type="text" 
                            disabled={hist.type === 'Self'}
                            value={hist.type === 'Self' ? '' : (hist.notes || '')}
                            onChange={e => {
                              const val = e.target.value;
                              setHistoryList(prev => prev.map(h => h.name === hist.name ? { ...h, notes: val } : h));
                            }}
                            placeholder={hist.type === 'Self' ? 'N/A (Patient)' : 'e.g. Father, Mother'}
                            className={`border border-border-color rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-xs w-36 transition-all ${
                              hist.type === 'Self' 
                                ? 'bg-gray-50/70 text-text-gray/40 cursor-not-allowed border-dashed' 
                                : 'bg-white text-text-dark'
                            }`}
                          />
                        </div>

                        {/* Delete Button */}
                        <button 
                          type="button"
                          onClick={() => setHistoryList(historyList.filter(h => h.name !== hist.name))}
                          className="text-text-gray hover:text-danger p-1.5 hover:bg-red-50 rounded-lg transition-all"
                          title="Remove Condition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {historyList.length === 0 && (
                    <p className="text-sm text-text-gray italic p-2 bg-gray-50 border border-dashed border-border-color rounded-lg text-center">
                      No past or family history conditions added yet. Use the search bar or quick recommendations to add.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Recommendations Section */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Quick Recommendations</p>
                <div className="flex flex-wrap gap-2">
                  {["Diabetes", "Hypertension", "Cardiac Issues", "Thyroid", "Asthma", "Tuberculosis", "Cancer", "Stroke"].map(rec => {
                    const active = historyList.some(h => h.name === rec);
                    return (
                      <button
                        key={rec}
                        onClick={() => {
                          if (active) {
                            setHistoryList(historyList.filter(h => h.name !== rec));
                          } else {
                            setHistoryList(prev => [...prev, { name: rec, type: 'Self', notes: '' }]);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          active 
                            ? 'bg-primary border-primary text-white font-bold' 
                            : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                        }`}
                      >
                        {rec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Personal History
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Personal History & Habits</h3>
              <p className="text-sm text-text-gray mt-0.5">Lifestyle choices, habits, dietary history, and allergies.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">Diet Type</label>
                  <select 
                    value={diet} 
                    onChange={e => setDiet(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-white text-sm font-semibold"
                  >
                    <option value="Veg">Vegetarian</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                    <option value="Eggitarian">Eggitarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">Sleep Habits</label>
                  <select 
                    value={sleep} 
                    onChange={e => setSleep(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-white text-sm font-semibold"
                  >
                    <option value="Good">Good (7-8 hours)</option>
                    <option value="Fair">Fair / Irregular</option>
                    <option value="Poor">Poor / Insomnia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">Lifestyle Activity</label>
                  <select 
                    value={lifestyle} 
                    onChange={e => setLifestyle(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-white text-sm font-semibold"
                  >
                    <option value="Active">Active (Regular exercise)</option>
                    <option value="Sedentary">Sedentary (Sit desk job)</option>
                    <option value="Moderate">Moderate physical labor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">Bowel Habits</label>
                  <select 
                    value={bowel} 
                    onChange={e => setBowel(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-white text-sm font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Constipated">Constipated</option>
                    <option value="Irregular">Irregular</option>
                    <option value="Diarrheal">Diarrheal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-dark mb-1.5">Appetite</label>
                  <select 
                    value={appetite} 
                    onChange={e => setAppetite(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-white text-sm font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Increased">Increased</option>
                    <option value="Decreased">Decreased / Poor</option>
                    <option value="Variable">Variable</option>
                  </select>
                </div>
              </div>

              {/* Allergies and search bar */}
              <div className="border-t border-border-color pt-6">
                <label className="block text-sm font-semibold text-text-dark mb-2">Search or Add Allergies</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={16} />
                    <input 
                      type="text" 
                      placeholder="Type allergy (e.g. Penicillin, Peanuts, Pollen)..."
                      value={customAllergy}
                      onChange={e => setCustomAllergy(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && customAllergy.trim()) {
                          if (!allergies.includes(customAllergy.trim())) {
                            setAllergies(prev => [...prev, customAllergy.trim()]);
                          }
                          setCustomAllergy('');
                        }
                      }}
                      className="w-full border border-border-color rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
                        setAllergies(prev => [...prev, customAllergy.trim()]);
                        setCustomAllergy('');
                      }
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allergies.map(all => (
                    <span 
                      key={all} 
                      className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      ⚠️ {all}
                      <button onClick={() => setAllergies(allergies.filter(a => a !== all))} className="text-red-500 font-bold ml-1">×</button>
                    </span>
                  ))}
                  {allergies.length === 0 && (
                    <p className="text-xs text-text-gray italic">No drug or food allergies declared.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        );

      case 4: // Ongoing Medication History
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Ongoing Medication History</h3>
              <p className="text-sm text-text-gray mt-0.5">Record medicines the patient is currently consuming daily.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              
              {/* Form to add ongoing medications (Always Visible) */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-3">Add Ongoing Medication</p>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-border-color rounded-xl bg-gray-50/20">
                  <div>
                    <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Type</label>
                    <select
                      value={newOngoingType}
                      onChange={e => setNewOngoingType(e.target.value)}
                      className="w-full border border-border-color rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white font-bold"
                    >
                      <option value="TAB">TAB</option>
                      <option value="SYP">SYP</option>
                      <option value="CAP">CAP</option>
                      <option value="INJ">INJ</option>
                      <option value="OINT">OINT</option>
                      <option value="DROPS">DROPS</option>
                      <option value="POWDER">POWDER</option>
                      <option value="CREAM">CREAM</option>
                      <option value="LOTION">LOTION</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Drug Name</label>
                    <input 
                      type="text"
                      list="ongoing-medicine-list"
                      placeholder="e.g. Metformin 500mg"
                      value={newOngoingName}
                      onChange={e => setNewOngoingName(e.target.value)}
                      className="w-full border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white font-bold"
                    />
                    <datalist id="ongoing-medicine-list">
                      {MEDICINE_CATALOG.map(m => <option key={m} value={m} />)}
                    </datalist>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Dosage</label>
                    <input 
                      type="text"
                      placeholder="e.g. 1 Tablet"
                      value={newOngoingDosage}
                      onChange={e => setNewOngoingDosage(e.target.value)}
                      className="w-full border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white"
                    />
                  </div>

                  <div className="md:col-span-2 flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Frequency</label>
                      <select
                        value={newOngoingFreq}
                        onChange={e => setNewOngoingFreq(e.target.value)}
                        className="w-full border border-border-color rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white font-medium"
                      >
                        <option value="1-0-1">1-0-1 (Twice daily)</option>
                        <option value="1-1-1">1-1-1 (Thrice daily)</option>
                        <option value="1-0-0">1-0-0 (Morning)</option>
                        <option value="0-0-1">0-0-1 (Night)</option>
                        <option value="1-1-0">1-1-0 (Morning/Noon)</option>
                        <option value="0-1-1">0-1-1 (Noon/Night)</option>
                        <option value="1-0-1-1">1-0-1-1 (Four times)</option>
                        <option value="SOS">SOS (As needed)</option>
                      </select>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (newOngoingName.trim()) {
                          const newMed: OngoingMedication = {
                            id: `ongoing_${Date.now()}`,
                            name: `${newOngoingType} ${newOngoingName.trim()}`,
                            dosage: newOngoingDosage.trim() || '1 Tab',
                            frequency: newOngoingFreq
                          };
                          setOngoingMedications(prev => [...prev, newMed]);
                          setNewOngoingName('');
                          setNewOngoingDosage('');
                          setNewOngoingType('TAB');
                        }
                      }}
                      className="bg-primary hover:bg-primary-dark text-white px-5 rounded-lg font-bold shadow-sm transition-colors mb-px shrink-0 text-sm h-[38px] flex items-center justify-center cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Recorded Ongoing Medications List */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider">Recorded Medication List</p>
                {ongoingMedications.length > 0 ? (
                  <div className="border border-border-color rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-200">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-bg-base border-b border-border-color text-text-gray font-bold text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-2.5">Drug Name</th>
                          <th className="px-4 py-2.5">Dosage</th>
                          <th className="px-4 py-2.5">Frequency</th>
                          <th className="px-4 py-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color text-text-dark">
                        {ongoingMedications.map(med => (
                          <tr key={med.id} className="hover:bg-hover-bg/30 animate-in fade-in duration-150">
                            <td className="px-4 py-3 font-bold">{med.name}</td>
                            <td className="px-4 py-3 text-text-gray">{med.dosage}</td>
                            <td className="px-4 py-3 font-semibold text-primary">{med.frequency}</td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => setOngoingMedications(ongoingMedications.filter(m => m.id !== med.id))}
                                className="text-text-light hover:text-danger p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border-color rounded-xl p-8 text-center bg-gray-50/50 animate-in fade-in duration-200">
                    <span className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full text-text-light mb-3">
                      <CheckCircle size={28} />
                    </span>
                    <h4 className="font-bold text-text-dark text-base">No Medication Record</h4>
                    <p className="text-sm text-text-gray mt-1 max-w-sm mx-auto">
                      Patient has stated they are not consuming any regular medications currently.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        );

      case 5: // Examination (CVS and RS only)
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Physical Examination</h3>
              <p className="text-sm text-text-gray mt-0.5">Select clinical findings for cardiovascular and respiratory systems.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CVS Examination Block */}
                <div className="border border-border-color rounded-xl p-5 bg-gray-50/10 space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-border-color pb-3 mb-4">
                      <label className="text-sm font-bold text-text-dark uppercase tracking-wider flex items-center gap-1.5">
                        <Stethoscope size={18} className="text-primary" /> Cardiovascular (CVS)
                      </label>
                    </div>

                    <div className="space-y-5">
                      {/* Heart Sounds */}
                      <div>
                        <span className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Heart Sounds</span>
                        <div className="flex flex-wrap gap-2">
                          {['Normal (S1 S2)', 'Muffled', 'Abnormal'].map(opt => {
                            const active = cvsHeartSounds === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCvsHeartSounds(opt)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  active 
                                    ? 'bg-primary border-primary text-white font-bold shadow-sm' 
                                    : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Murmurs */}
                      <div>
                        <span className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Murmurs</span>
                        <div className="flex flex-wrap gap-2">
                          {['No Murmurs', 'Systolic Murmur', 'Diastolic Murmur'].map(opt => {
                            const active = cvsMurmurs === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCvsMurmurs(opt)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  active 
                                    ? 'bg-primary border-primary text-white font-bold shadow-sm' 
                                    : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Rhythm / Rate */}
                      <div>
                        <span className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Rhythm / Rate</span>
                        <div className="flex flex-wrap gap-2">
                          {['Regular Rhythm', 'Irregular Rhythm', 'Tachycardia', 'Bradycardia'].map(opt => {
                            const active = cvsRhythm === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setCvsRhythm(opt)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  active 
                                    ? 'bg-primary border-primary text-white font-bold shadow-sm' 
                                    : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary string footer */}
                  {cvsExam && (
                    <div className="mt-6 pt-4 border-t border-border-color text-xs text-text-gray italic">
                      <strong>CVS Record:</strong> {cvsExam}
                    </div>
                  )}
                </div>

                {/* RS Examination Block */}
                <div className="border border-border-color rounded-xl p-5 bg-gray-50/10 space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b border-border-color pb-3 mb-4">
                      <label className="text-sm font-bold text-text-dark uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse size={18} className="text-purple-600" /> Respiratory (RS)
                      </label>
                    </div>

                    <div className="space-y-5">
                      {/* Air Entry */}
                      <div>
                        <span className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Air Entry</span>
                        <div className="flex flex-wrap gap-2">
                          {['Bilateral Normal', 'Reduced Air Entry', 'Asymmetrical Air Entry'].map(opt => {
                            const active = rsAirEntry === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setRsAirEntry(opt)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  active 
                                    ? 'bg-primary border-primary text-white font-bold shadow-sm' 
                                    : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Added Sounds */}
                      <div>
                        <span className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Added Sounds</span>
                        <div className="flex flex-wrap gap-2">
                          {['None (Clear)', 'Crepitations present', 'Rhonchi / Wheeze present'].map(opt => {
                            const active = rsAddedSounds === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setRsAddedSounds(opt)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  active 
                                    ? 'bg-primary border-primary text-white font-bold shadow-sm' 
                                    : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chest Expansion */}
                      <div>
                        <span className="block text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Chest Expansion</span>
                        <div className="flex flex-wrap gap-2">
                          {['Symmetrical', 'Asymmetrical'].map(opt => {
                            const active = rsExpansion === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setRsExpansion(opt)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                  active 
                                    ? 'bg-primary border-primary text-white font-bold shadow-sm' 
                                    : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary string footer */}
                  {rsExam && (
                    <div className="mt-6 pt-4 border-t border-border-color text-xs text-text-gray italic">
                      <strong>RS Record:</strong> {rsExam}
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        );

      case 6: // Diagnosis
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Clinical Diagnosis</h3>
              <p className="text-sm text-text-gray mt-0.5">Select common diagnoses or input custom conditions.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              
              {/* Search Diagnosis custom tags */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Search or Add Diagnosis Tags</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={16} />
                    <input 
                      type="text" 
                      list="diagnosis-list"
                      placeholder="Type a diagnosis (e.g. Hypertension, Gastritis) and click Add..."
                      value={customDiagnosis}
                      onChange={e => setCustomDiagnosis(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && customDiagnosis.trim()) {
                          if (!diagnosisList.includes(customDiagnosis.trim())) {
                            setDiagnosisList(prev => [...prev, customDiagnosis.trim()]);
                          }
                          setCustomDiagnosis('');
                        }
                      }}
                      className="w-full border border-border-color rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm"
                    />
                    <datalist id="diagnosis-list">
                      {DIAGNOSIS_CATALOG.map(d => <option key={d} value={d} />)}
                    </datalist>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (customDiagnosis.trim() && !diagnosisList.includes(customDiagnosis.trim())) {
                        setDiagnosisList(prev => [...prev, customDiagnosis.trim()]);
                        setCustomDiagnosis('');
                      }
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Selected Diagnosis tag listing */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Active Diagnoses</p>
                <div className="flex flex-wrap gap-2">
                  {diagnosisList.map(diag => (
                    <span 
                      key={diag} 
                      className="bg-green-50 text-green-800 px-3.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 border border-green-200"
                    >
                      ✓ {diag}
                      <button 
                        onClick={() => setDiagnosisList(diagnosisList.filter(d => d !== diag))}
                        className="text-green-600 hover:text-danger font-black rounded-full"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {diagnosisList.length === 0 && (
                    <p className="text-sm text-text-gray italic">No diagnosis tags added yet.</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Quick Presets</p>
                <div className="flex flex-wrap gap-2">
                  {["Acute Viral Fever", "Essential Hypertension", "Type 2 Diabetes Mellitus", "Gastroesophageal Reflux Disease (GERD)", "Upper Respiratory Tract Infection (URTI)", "Acute Bronchitis"].map(rec => {
                    const active = diagnosisList.includes(rec);
                    return (
                      <button
                        key={rec}
                        onClick={() => {
                          if (active) {
                            setDiagnosisList(diagnosisList.filter(d => d !== rec));
                          } else {
                            setDiagnosisList(prev => [...prev, rec]);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          active 
                            ? 'bg-primary border-primary text-white font-bold' 
                            : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                        }`}
                      >
                        {rec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Diagnosis details notes */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1">Clinical Impression Notes</label>
                <textarea 
                  rows={3}
                  value={diagnosisNotes}
                  onChange={e => setDiagnosisNotes(e.target.value)}
                  placeholder="Record additional diagnosis notes, complications, staging info..."
                  className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-gray-50/20 text-sm resize-none"
                />
              </div>

            </div>
          </div>
        );

      case 7: // Investigation
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Order Investigations (Lab Tests)</h3>
              <p className="text-sm text-text-gray mt-0.5">Select laboratory tests recommended for the patient.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              {/* Search custom test bar */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-2">Search or Add Custom Lab Tests</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={16} />
                    <input 
                      type="text" 
                      list="investigation-list"
                      placeholder="Type a test (e.g. CBC, Chest X-Ray) and press Add..."
                      value={customTest}
                      onChange={e => setCustomTest(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && customTest.trim()) {
                          if (!selectedTests.includes(customTest.trim())) {
                            setSelectedTests(prev => [...prev, customTest.trim()]);
                          }
                          setCustomTest('');
                        }
                      }}
                      className="w-full border border-border-color rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm"
                    />
                    <datalist id="investigation-list">
                      {INVESTIGATION_CATALOG.map(t => <option key={t} value={t} />)}
                    </datalist>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      if (customTest.trim() && !selectedTests.includes(customTest.trim())) {
                        setSelectedTests(prev => [...prev, customTest.trim()]);
                        setCustomTest('');
                      }
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Tag selectors (Redesigned with card lists matching symptoms) */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-3">Selected Tests (Ordered)</p>
                <div className="flex flex-col gap-3">
                  {selectedTests.map(test => (
                    <div 
                      key={test} 
                      className="border border-border-color rounded-xl p-4 bg-gray-50/50 hover:bg-white transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/70 animate-pulse"></span>
                        <span className="font-bold text-text-dark text-sm md:text-base">{test}</span>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => setSelectedTests(selectedTests.filter(t => t !== test))}
                        className="text-text-gray hover:text-danger p-1.5 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                        title="Remove Test"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {selectedTests.length === 0 && (
                    <p className="text-sm text-text-gray italic p-2 bg-gray-50 border border-dashed border-border-color rounded-lg text-center">
                      No tests selected yet. Use the search bar or quick recommendations to add.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Recommendations Tags */}
              <div>
                <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2">Quick Recommendations</p>
                <div className="flex flex-wrap gap-2">
                  {INVESTIGATION_CATALOG.map(rec => {
                    const active = selectedTests.includes(rec);
                    return (
                      <button
                        key={rec}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setSelectedTests(selectedTests.filter(t => t !== rec));
                          } else {
                            setSelectedTests(prev => [...prev, rec]);
                          }
                        }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                          active 
                            ? 'bg-primary border-primary text-white font-bold' 
                            : 'bg-white border-border-color text-text-dark hover:border-primary/50'
                        }`}
                      >
                        {rec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 8: // Prescription
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
<h3 className="text-lg font-bold text-text-dark">Structured Prescription</h3>
              <p className="text-sm text-text-gray mt-0.5">Build the pharmacy drug list and add clinical instructions.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              {/* Add Drug Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4 p-4 border border-border-color rounded-xl bg-gray-50/20">
                <div>
                  <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Type</label>
                  <select
                    value={newMedType}
                    onChange={e => setNewMedType(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white font-bold"
                  >
                    <option value="TAB">TAB</option>
                    <option value="SYP">SYP</option>
                    <option value="CAP">CAP</option>
                    <option value="INJ">INJ</option>
                    <option value="OINT">OINT</option>
                    <option value="DROPS">DROPS</option>
                    <option value="POWDER">POWDER</option>
                    <option value="CREAM">CREAM</option>
                    <option value="LOTION">LOTION</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Drug Name</label>
                  <input 
                    type="text"
                    list="medicine-list"
                    placeholder="e.g. Paracetamol 650mg"
                    value={newMedName}
                    onChange={e => setNewMedName(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white font-bold"
                  />
                  <datalist id="medicine-list">
                    {MEDICINE_CATALOG.map(m => <option key={m} value={m} />)}
                  </datalist>
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Dosage</label>
                  <input 
                    type="text"
                    placeholder="e.g. 1 Tablet"
                    value={newMedDosage}
                    onChange={e => setNewMedDosage(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Frequency</label>
                  <select
                    value={newMedFreq}
                    onChange={e => setNewMedFreq(e.target.value)}
                    className="w-full border border-border-color rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white font-medium"
                  >
                    <option value="">Select</option>
                    <option value="1-0-1">1-0-1 (Twice daily)</option>
                    <option value="1-1-1">1-1-1 (Thrice daily)</option>
                    <option value="1-0-0">1-0-0 (Morning)</option>
                    <option value="0-0-1">0-0-1 (Night)</option>
                    <option value="1-1-0">1-1-0 (Morning/Noon)</option>
                    <option value="0-1-1">0-1-1 (Noon/Night)</option>
                    <option value="1-0-1-1">1-0-1-1 (Four times)</option>
                    <option value="SOS">SOS (As needed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Duration</label>
                  <input 
                    type="text"
                    value={newMedDuration}
                    onChange={e => setNewMedDuration(e.target.value)}
                    placeholder="e.g. 5 Days"
                    className="w-full border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white"
                  />
                </div>

                <div className="md:col-span-2 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-text-dark mb-1 uppercase">Instructions</label>
                    <select
                      value={newMedInstructions}
                      onChange={e => setNewMedInstructions(e.target.value)}
                      className="w-full border border-border-color rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark text-sm bg-white font-medium"
                    >
                      <option value="After Food">After Food</option>
                      <option value="Before Food">Before Food</option>
                      <option value="With Food">With Food</option>
                      <option value="Empty Stomach">Empty Stomach</option>
                    </select>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (newMedName.trim() && newMedDosage.trim() && newMedFreq.trim() && newMedDuration.trim()) {
                        const newRx: PrescribedMedication = {
                          id: `rx_${Date.now()}`,
                          name: `${newMedType} ${newMedName.trim()}`,
                          dosage: newMedDosage.trim(),
                          frequency: newMedFreq,
                          duration: newMedDuration.trim(),
                          instructions: newMedInstructions
                        };
                        setPrescribedMeds([...prescribedMeds, newRx]);
                        setNewMedName('');
                        setNewMedDosage('');
                        setNewMedFreq('');
                        setNewMedDuration('');
                      } else {
                        alert('Please fill out all prescription fields before adding.');
                      }
                    }}
                    className="bg-primary hover:bg-primary-dark text-white px-5 rounded-lg font-bold shadow-sm transition-colors mb-px shrink-0 text-sm h-[38px] flex items-center justify-center cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Prescription list */}
              {prescribedMeds.length > 0 ? (
                <div className="border border-border-color rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-bg-base border-b border-border-color text-text-gray font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Medicine Name</th>
                        <th className="px-4 py-3">Dosage</th>
                        <th className="px-4 py-3">Frequency</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Instructions</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color text-text-dark">
                      {prescribedMeds.map(rx => (
                        <tr key={rx.id} className="hover:bg-hover-bg/30">
                          <td className="px-4 py-3.5 font-bold text-text-dark">{rx.name}</td>
                          <td className="px-4 py-3.5 text-text-gray">{rx.dosage}</td>
                          <td className="px-4 py-3.5 font-bold text-primary">{rx.frequency}</td>
                          <td className="px-4 py-3.5 font-semibold">{rx.duration} Days</td>
                          <td className="px-4 py-3.5">
                            <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                              rx.instructions === 'After Food' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {rx.instructions}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button 
                              onClick={() => setPrescribedMeds(prescribedMeds.filter(m => m.id !== rx.id))}
                              className="text-text-light hover:text-danger p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-dashed border-border-color rounded-xl p-8 text-center text-text-light italic bg-gray-50/50">
                  No medicines added yet. Use the selector above to construct the prescription.
                </div>
              )}

              {/* Prescription Advice text box as requested */}
              <div className="border-t border-border-color pt-6">
                <label className="block text-sm font-semibold text-text-dark mb-1">Clinical Advice & Diet Instructions</label>
                <textarea 
                  rows={3}
                  value={prescriptionAdvice}
                  onChange={e => setPrescriptionAdvice(e.target.value)}
                  placeholder="e.g. Drink plenty of warm fluids. Avoid cold food and drinks. Rest for 2 days. Steam inhalation twice daily."
                  className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-gray-50/20 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 9: // Follow Up
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-bold text-text-dark">Follow Up Schedule & Referral</h3>
              <p className="text-sm text-text-gray mt-0.5">Schedule a re-visit or assign clinical referral.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm space-y-6">
              
              {/* Preset buttons for return duration as requested */}
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-3">Re-visit Interval presets</label>
                <div className="flex flex-wrap gap-2.5">
                  {[5, 10, 15, 30, 45, 60, 90].map(days => {
                    const label = days === 90 ? "3 Months" : `${days} Days`;
                    const active = followUpDays === days;
                    return (
                      <button 
                        key={days}
                        onClick={() => setFollowUpDays(days)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          active 
                            ? 'bg-primary border-primary text-white shadow-sm' 
                            : 'bg-white border-border-color text-text-dark hover:bg-hover-bg hover:border-primary/50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-bold text-primary-dark">Expected Return Date:</span>
                  <span className="text-base font-black text-primary flex items-center gap-1.5">
                    <CalendarDays size={18} /> {getFollowUpDate()}
                  </span>
                </div>
              </div>

              {/* Doctor Referral */}
              <div className="border-t border-border-color pt-6">
                <label className="block text-sm font-semibold text-text-dark mb-1.5">Refer to specialist (Internal Referral)</label>
                <select 
                  value={referral}
                  onChange={e => setReferral(e.target.value)}
                  className="w-full border border-border-color rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-dark bg-white text-sm font-semibold"
                >
                  <option value="">No Referral Needed</option>
                  <option value="Dr. Michael Chen (Cardiologist)">Dr. Michael Chen (Cardiologist)</option>
                  <option value="Dr. Emily Taylor (Pediatrician)">Dr. Emily Taylor (Pediatrician)</option>
                </select>
              </div>

              {/* Consultation Summary Review Card */}
              <div className="border-t border-border-color pt-6 bg-gray-50/50 p-4 rounded-xl border border-dashed border-border-color">
                <h4 className="font-bold text-text-dark text-sm mb-2 uppercase">Prescription Summary Review</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-text-gray font-medium">
                  <div>Diagnoses: <span className="font-semibold text-text-dark">{diagnosisList.join(', ') || 'N/A'}</span></div>
                  <div>Investigation tests: <span className="font-semibold text-text-dark">{selectedTests.join(', ') || 'None'}</span></div>
                  <div>Prescribed Drugs: <span className="font-semibold text-text-dark">{prescribedMeds.length} Items</span></div>
                </div>
              </div>

            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render Homepage Dashboard Tab
  const renderDashboard = () => {
    return (
      <div className="space-y-6 overflow-y-auto pr-1 h-[calc(100vh-140px)]">
        
        {/* Welcome Doctor Banner Card */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute"></span>
              <h2 className="text-xl font-bold text-text-dark ml-2">Good Morning, Dr. Sarah Jenkins</h2>
            </div>
            <p className="text-sm text-text-gray mt-1 font-medium">
              General Physician • Room 101 • Status: <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200/50 text-xs font-bold capitalize">available</span>
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('Consultation')}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <ClipboardList size={16} /> Open EMR Workspace
          </button>
        </div>

        {/* KPI Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-border-color shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-1">Today's Appointments</p>
              <h3 className="text-2xl font-bold text-text-dark">{doctorAppointments.length}</h3>
            </div>
            <div className="mt-4 text-[10px] text-text-gray font-semibold bg-gray-50 border border-border-color/50 px-2 py-1 rounded w-fit">
              Roster list count
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-border-color shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-1">Waiting in Queue</p>
              <h3 className="text-2xl font-bold text-text-dark">{waitingQueue.length}</h3>
            </div>
            <div className="mt-4 text-[10px] text-primary font-bold bg-primary/5 border border-primary/10 px-2 py-1 rounded w-fit">
              OPD desk queue
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-border-color shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-1">Consulted Today</p>
              <h3 className="text-2xl font-bold text-text-dark">{completedPatients.length}</h3>
            </div>
            <div className="mt-4 text-[10px] text-green-700 font-bold bg-green-50 border border-green-100 px-2 py-1 rounded w-fit">
              Completed EMR
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-border-color shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-text-gray uppercase tracking-wider mb-1">Avg Wait Time</p>
              <h3 className="text-2xl font-bold text-text-dark">12 mins</h3>
            </div>
            <div className="mt-4 text-[10px] text-indigo-700 font-bold bg-indigo-50 border border-indigo-100 px-2 py-1 rounded w-fit">
              Clinic benchmark
            </div>
          </div>
        </div>

        {/* 2-Column Workspace layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Live OPD Queue Desk */}
          <div className="bg-white rounded-xl border border-border-color shadow-sm flex flex-col overflow-hidden">
            <div className="bg-bg-base border-b border-border-color px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                <h4 className="font-bold text-text-dark text-base">Live OPD Queue Desk</h4>
              </div>
              <span className="bg-primary/10 text-primary text-sm font-bold px-2.5 py-0.5 rounded-full">
                {waitingQueue.length} Waiting
              </span>
            </div>
            
            <div className="p-5 space-y-5 flex-1">
              {/* Active Consultation Section */}
              <div>
                <h5 className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Active Consultation</h5>
                {consultingPatient ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h6 className="font-extrabold text-text-dark text-base">{consultingPatient.name}</h6>
                      <p className="text-xs text-text-gray mt-1">
                        Token: {consultingPatient.token || 'N/A'} • <span className="capitalize">{consultingPatient.type} queue</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('Consultation')}
                      className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <ClipboardList size={14} /> Resume EMR
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-border-color rounded-xl p-6 text-center bg-gray-50/50 flex flex-col items-center justify-center gap-3">
                    {isAvailable ? (
                      <>
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                          <CheckCircle size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-green-700 text-lg tracking-tight">You are Available</p>
                          <p className="text-xs text-text-gray mt-1">Waiting for the Receptionist to assign the next patient...</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mb-2">
                          <User size={24} />
                        </div>
                        <p className="text-sm text-text-gray font-medium mb-2">No patient currently in EMR session.</p>
                        <button 
                          onClick={() => {
                            setIsAvailable(true);
                            // Simulating a toast notification for now
                            alert("Receptionist Notified: You are now available for the next patient.");
                          }}
                          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle size={16} /> I'm Ready for Next Patient
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-border-color/60"></div>

              {/* Next in Line Section */}
              <div>
                <h5 className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Next in Line</h5>
                <div className="flex flex-col gap-2.5">
                  {waitingQueue.slice(0, 3).map((patient, index) => (
                    <div 
                      key={patient.id} 
                      className="border border-border-color rounded-lg p-3 bg-gray-50/50 flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-bold text-text-dark text-sm">{index + 1}. {patient.name}</h5>
                        <p className="text-xs text-text-gray mt-1">
                          <span className="capitalize">{patient.token ? `Token: ${patient.token}` : patient.type}</span> • {patient.waitTime}m wait
                        </p>
                      </div>
                      <span className="text-xs text-text-light font-medium bg-white border border-border-color px-2 py-1 rounded">
                        Waiting
                      </span>
                    </div>
                  ))}
                  {waitingQueue.length === 0 && (
                    <div className="text-center py-4 text-sm text-text-gray italic font-medium">
                      No patients waiting in queue.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Today's Bookings Agenda */}
          <div className="bg-white rounded-xl border border-border-color shadow-sm flex flex-col overflow-hidden">
            <div className="bg-bg-base border-b border-border-color px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-text-gray" size={18} />
                <h4 className="font-bold text-text-dark text-base">Today's Bookings & Schedule</h4>
              </div>
            </div>
            
            <div className="p-5 space-y-5 flex-1">
              <div>
                <h5 className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2.5">Upcoming Bookings Today</h5>
                <div className="flex flex-col gap-2.5">
                  {doctorAppointments.slice(0, 4).map((appt) => (
                    <div 
                      key={appt.id} 
                      className="border border-border-color rounded-lg p-3 bg-gray-50/50 hover:bg-white transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                            {appt.timeSlot}
                          </span>
                          {appt.status === 'arrived' ? (
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-100/50">Checked In</span>
                          ) : (
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-bold border border-amber-100/50">Scheduled</span>
                          )}
                        </div>
                        <h5 className="font-bold text-text-dark text-sm mt-2.5">{appt.patientName}</h5>
                        <p className="text-xs text-text-gray mt-1">{appt.reasonForVisit}</p>
                      </div>
                      {appt.status === 'arrived' && (
                        <span className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded font-bold border border-green-100/50">In Queue</span>
                      )}
                    </div>
                  ))}
                  {doctorAppointments.length === 0 && (
                    <div className="text-center py-8 text-sm text-text-gray italic font-medium">
                      No appointments rostered for today.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  };

  // Render Consultation Tab
  const renderConsultation = () => {
    return (
      <div className="h-[calc(100vh-140px)] w-full overflow-hidden relative">
        
        {/* Active Patient Wizard Stepper Workspace */}
        <div className="flex flex-col overflow-hidden h-full w-full">
          {consultingPatient ? (
            <div className="bg-white rounded-xl border border-border-color shadow-sm flex flex-col flex-1 overflow-hidden">
              
              {/* Patient Banner */}
              <div className="px-6 py-4 border-b border-border-color flex justify-between items-center bg-bg-base/30 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-text-dark">{consultingPatient.name}</h2>
                    <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase border border-primary/10">
                      {consultingPatient.type === 'advance' ? 'Appt' : 'Walk-in'}
                    </span>
                    {consultingPatient.token && (
                      <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold border border-blue-100">
                        {consultingPatient.token}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-gray mt-0.5">
                    Phone: {consultingPatient.phone || 'N/A'} • Active Consultation Wizard
                  </p>
                </div>
                
                <span className="text-xs font-bold bg-primary text-white px-2.5 py-1 rounded-full shadow-sm">
                  Step {activeStep} / 9
                </span>
              </div>

              {/* Read-only Receptionist Vitals Summary Bar */}
              {consultingPatient.vitals && (
                <div className="px-6 py-2.5 border-b border-border-color bg-purple-50/20 flex flex-wrap gap-4 items-center shrink-0 text-xs">
                  <span className="font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse size={14} className="text-purple-600 animate-pulse" /> Receptionist Vitals:
                  </span>
                  {consultingPatient.vitals.height && <span>Height: <strong className="text-text-dark">{consultingPatient.vitals.height} cm</strong></span>}
                  {consultingPatient.vitals.weight && <span>Weight: <strong className="text-text-dark">{consultingPatient.vitals.weight} kg</strong></span>}
                  {consultingPatient.vitals.height && consultingPatient.vitals.weight && (
                    <span>BMI: <strong className="text-text-dark">{(parseFloat(consultingPatient.vitals.weight) / ((parseFloat(consultingPatient.vitals.height) / 100) ** 2)).toFixed(1)}</strong></span>
                  )}
                  {consultingPatient.vitals.pulse && <span>Pulse: <strong className="text-text-dark">{consultingPatient.vitals.pulse} BPM</strong></span>}
                  {consultingPatient.vitals.respiratoryRate && <span>RR: <strong className="text-text-dark">{consultingPatient.vitals.respiratoryRate}</strong></span>}
                  {consultingPatient.vitals.spo2 && <span>SpO2: <strong className="text-text-dark">{consultingPatient.vitals.spo2}%</strong></span>}
                  {consultingPatient.vitals.temp && <span>Temp: <strong className="text-text-dark">{consultingPatient.vitals.temp} °F</strong></span>}
                </div>
              )}

              {/* Workspace Split: Sidebar Stepper vs Panel Content */}
              <div className="flex-1 flex overflow-hidden">
                {/* Stepper Navigation Column */}
                <div className="w-[220px] md:w-[260px] border-r border-border-color bg-gray-50/50 flex flex-col shrink-0 overflow-y-auto">
                  <div className="p-3">
                    <p className="text-xs font-bold text-text-gray uppercase tracking-wider px-3 mb-3">OPD Flow steps</p>
                    <div className="flex flex-col gap-1 mb-8">
                      {stepsConfig.map(step => {
                        const isActive = activeStep === step.id;
                        
                        return (
                          <button
                            key={step.id}
                            onClick={() => setActiveStep(step.id)}
                            className={`flex items-center px-3 py-3 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer w-full ${
                              isActive 
                                ? 'bg-primary text-white shadow-sm font-bold' 
                                : 'text-text-dark hover:bg-hover-bg hover:text-primary'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {step.icon}
                              <span className="truncate">{step.id}. {step.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Stepper active panel area */}
                <div className="flex-1 flex flex-col justify-between bg-white overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6">
                    {renderStepContent()}
                  </div>
                  
                  {/* Stepper Footer Controls */}
                  <div className="border-t border-border-color pl-6 pr-20 py-4 bg-white flex justify-between shrink-0">
                    <button
                      type="button"
                      disabled={activeStep === 1}
                      onClick={() => setActiveStep(prev => (Number(prev) - 1) as StepId)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-border-color rounded-lg text-xs font-bold text-text-dark hover:bg-hover-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    
                    {activeStep === 9 ? (
                      <button
                        type="button"
                        onClick={handleCompleteConsultation}
                        className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold shadow-md transition-colors cursor-pointer relative z-40"
                      >
                        <CheckCircle size={16} /> Complete & Generate Rx
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveStep(prev => (Number(prev) + 1) as StepId)}
                        className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer relative z-40"
                      >
                        Next Step <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Sidebar: Live EMR Summary */}
                {/* Right Sidebar: Live EMR Summary */}
                {/* Right Sidebar: Live EMR Summary */}
                <div className="w-[240px] md:w-[280px] border-l border-border-color bg-gray-50 flex flex-col shrink-0 overflow-y-auto">
                  <div className="p-4 space-y-4">
                    <p className="text-sm font-extrabold text-text-dark uppercase tracking-wider border-b border-border-color pb-3 flex items-center gap-2 sticky top-0 bg-gray-50 pt-2 z-10">
                      <Activity size={18} className="text-primary" /> Live Context
                    </p>
                    
                    {(symptomsList.length > 0 || symptomsNotes) && (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-red-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <AlertCircle size={14} /> Symptoms
                        </p>
                        {symptomsList.length > 0 && (
                          <ul className="text-sm font-medium text-red-900 space-y-1.5">
                            {symptomsList.map((s, i) => <li key={i} className="flex gap-1.5"><span className="text-red-500 mt-0.5">•</span> <span className="leading-tight">{s.name} {s.duration && <span className="text-red-700/70">({s.duration})</span>}</span></li>)}
                          </ul>
                        )}
                        {symptomsNotes && <p className="text-xs text-red-800 italic mt-2 leading-tight">"{symptomsNotes}"</p>}
                      </div>
                    )}

                    {(historyList.length > 0 || customHistory) && (
                      <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-purple-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <HistoryIcon size={14} /> Medical History
                        </p>
                        <ul className="text-sm font-medium text-purple-900 space-y-1.5">
                          {historyList.map((h, i) => <li key={i} className="flex gap-1.5"><span className="text-purple-500 mt-0.5">•</span> <span className="leading-tight">{h.type}: {h.name} {h.notes && <span className="text-purple-700/70">({h.notes})</span>}</span></li>)}
                        </ul>
                        {customHistory && <p className="text-xs text-purple-800 italic mt-2 leading-tight">"{customHistory}"</p>}
                      </div>
                    )}

                    {/* Personal History */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-blue-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <User size={14} /> Personal History
                        </p>
                        <div className="text-sm font-medium text-blue-900 space-y-1.5">
                          <p>Diet: <span className="text-blue-700">{diet}</span></p>
                          <p>Sleep: <span className="text-blue-700">{sleep}</span></p>
                          <p>Lifestyle: <span className="text-blue-700">{lifestyle}</span></p>
                        </div>
                        {(allergies.length > 0 || customAllergy) && (
                          <div className="mt-3 pt-2 border-t border-blue-200">
                            <p className="text-xs text-red-600 font-bold uppercase mb-1.5">Allergies</p>
                            <ul className="text-sm font-medium text-red-700 space-y-1">
                              {allergies.map((a, i) => <li key={i}>• {a}</li>)}
                              {customAllergy && <li>• {customAllergy}</li>}
                            </ul>
                          </div>
                        )}
                    </div>

                    {/* Ongoing Meds */}
                    {ongoingMedications.length > 0 && (
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-amber-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <TrendingUp size={14} /> Ongoing Meds
                        </p>
                        <ul className="text-sm font-medium text-amber-900 space-y-1.5">
                          {ongoingMedications.map((m, i) => <li key={i} className="flex gap-1.5"><span className="text-amber-500 mt-0.5">•</span> <span className="leading-tight">{m.name} <span className="text-amber-700">({m.dosage})</span></span></li>)}
                        </ul>
                      </div>
                    )}

                    {/* Examination */}
                    {(cvsExam || rsExam) && (
                      <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-teal-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <Stethoscope size={14} /> Examination
                        </p>
                        <div className="text-sm font-medium text-teal-900 space-y-1.5">
                          {cvsExam && <p><span className="font-bold text-teal-700">CVS:</span> {cvsExam}</p>}
                          {rsExam && <p><span className="font-bold text-teal-700">RS:</span> {rsExam}</p>}
                        </div>
                      </div>
                    )}
                    
                    {(diagnosisList.length > 0 || diagnosisNotes) && (
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-green-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <CheckCircle size={14} /> Diagnosis
                        </p>
                        {diagnosisList.length > 0 && (
                          <ul className="text-sm font-medium text-green-900 space-y-1.5">
                            {diagnosisList.map((d, i) => <li key={i} className="flex gap-1.5"><span className="text-green-500 mt-0.5">•</span> <span className="leading-tight">{d}</span></li>)}
                          </ul>
                        )}
                        {diagnosisNotes && <p className="text-xs text-green-800 italic mt-2 leading-tight">"{diagnosisNotes}"</p>}
                      </div>
                    )}
                    
                    {(selectedTests.length > 0 || customTest) && (
                      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-indigo-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <ClipboardList size={14} /> Investigations
                        </p>
                        {selectedTests.length > 0 && (
                          <ul className="text-sm font-medium text-indigo-900 space-y-1.5">
                            {selectedTests.map((t, i) => <li key={i} className="flex gap-1.5"><span className="text-indigo-500 mt-0.5">•</span> <span className="leading-tight">{t}</span></li>)}
                          </ul>
                        )}
                        {customTest && <p className="text-xs text-indigo-800 italic mt-2 leading-tight">"{customTest}"</p>}
                      </div>
                    )}

                    {/* Prescribed Meds */}
                    {(prescribedMeds.length > 0 || prescriptionAdvice) && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-emerald-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <FileText size={14} /> Rx Details
                        </p>
                        {prescribedMeds.length > 0 && (
                          <ul className="text-sm font-medium text-emerald-900 space-y-2.5">
                            {prescribedMeds.map((m, i) => (
                              <li key={i} className="leading-tight bg-white/60 p-2.5 rounded border border-emerald-100/50">
                                <span className="font-bold block mb-1">{m.name}</span>
                                <span className="text-[11px] text-emerald-700 font-semibold">{m.dosage} | {m.frequency} | {m.duration}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {prescriptionAdvice && <p className="text-xs text-emerald-800 italic mt-2 leading-tight">"{prescriptionAdvice}"</p>}
                      </div>
                    )}

                    {/* Follow up & Referral */}
                    {(followUpDays !== 5 || referral) && (
                      <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-fuchsia-700 font-bold uppercase mb-2 flex items-center gap-1.5">
                          <CalendarDays size={14} /> Planning
                        </p>
                        <div className="text-sm font-medium text-fuchsia-900 space-y-1.5">
                          {followUpDays !== 5 && <p>Follow-up in <span className="font-bold">{followUpDays} days</span></p>}
                          {referral && <p className="text-orange-800 font-bold bg-orange-100/80 p-2 rounded mt-2 border border-orange-200 text-xs">Refer: {referral}</p>}
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl border border-border-color shadow-sm p-12 text-center flex flex-col items-center justify-center flex-1">
              <ClipboardList size={48} className="text-text-light mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-text-dark">EMR Consultation Workspace</h3>
              <p className="text-sm text-text-gray mt-1 max-w-sm">
                No active patient is currently in consultation. Go to the Dashboard to call a patient from the Live OPD Queue.
              </p>
            </div>
          )}
        </div>

      </div>
    );
  };

  // Render Insights Tab
  const renderInsights = () => {
    return (
      <div className="space-y-6 overflow-y-auto pr-1 h-[calc(100vh-140px)]">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            <p className="text-sm font-bold text-text-gray uppercase tracking-wider mb-2">Patients Consulted</p>
            <h2 className="text-3xl font-bold text-text-dark">{completedPatients.length + (consultingPatient ? 1 : 0)}</h2>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded">
              <TrendingUp size={14} /> Today's total
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            <p className="text-sm font-bold text-text-gray uppercase tracking-wider mb-2">Avg Consult Time</p>
            <h2 className="text-3xl font-bold text-text-dark">12 mins</h2>
            <div className="mt-4 flex items-center gap-1 text-xs text-text-gray font-medium">
              Within targeted standard
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            <p className="text-sm font-bold text-text-gray uppercase tracking-wider mb-2">Consultation Income</p>
            <h2 className="text-3xl font-bold text-text-dark flex items-center gap-0.5">
              <IndianRupee size={24} /> {((completedPatients.length + (consultingPatient ? 1 : 0)) * 500).toLocaleString('en-IN')}
            </h2>
            <div className="mt-4 flex items-center gap-1 text-xs text-text-gray font-medium">
              ₹500 consultation rate
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border-color shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            <p className="text-sm font-bold text-text-gray uppercase tracking-wider mb-2">Patients Queued</p>
            <h2 className="text-3xl font-bold text-text-dark">{waitingQueue.length}</h2>
            <div className="mt-4 flex items-center gap-1 text-xs text-text-gray font-medium">
              Currently waiting in queue
            </div>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-xl border border-border-color shadow-sm p-6">
          <h3 className="font-bold text-text-dark text-lg mb-4">Patient Diagnosis Trends</h3>
          <p className="text-sm text-text-gray mb-6">Common clinical case distributions recorded during consultations today.</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-text-dark mb-1">
                <span>General Checkup / Fever</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-text-dark mb-1">
                <span>Hypertension Follow-up</span>
                <span>25%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-text-dark mb-1">
                <span>Acidity / Gastrointestinal</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-hidden bg-bg-base">
      
      {/* Dynamic Tab Render */}
      {activeTab === 'Dashboard' && renderDashboard()}
      {activeTab === 'Consultation' && renderConsultation()}
      {activeTab === 'Insights' && renderInsights()}

    </div>
  );
};
