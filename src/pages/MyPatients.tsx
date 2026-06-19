import { useState, useRef } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  Stethoscope,
  Pill,
  Calendar,
  Activity,
  HeartPulse,
  Download,
  AlertCircle,
  X,
  ClipboardList
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { ConsultationReportPrintTemplate } from '../components/print/ConsultationReportPrintTemplate';
import { doctorsData, type Patient } from '../data/mockData';

// Generate mock EMR history for the patients
const generateMockEMR = (_patientId: string) => {
  return [
    {
      id: 'emr-1',
      date: '10 May 2026',
      diagnosis: 'Acute Viral Fever',
      prescription: 'Paracetamol 500mg (1-1-1) for 3 days\nCetirizine 10mg (0-0-1) for 3 days',
      doctorNotes: 'Patient complained of high grade fever and body ache. Throat clear. No history of travel.',
      symptoms: 'Fever (102F) for 2 days, Body ache, Mild cough',
      vitals: { bp: '120/80', hr: '88', temp: '102.4 F', weight: '68 kg' },
      investigations: 'CBC, Dengue NS1 Antigen (advised)',
      followUp: '15 May 2026'
    },
    {
      id: 'emr-2',
      date: '15 Feb 2026',
      diagnosis: 'Upper Respiratory Tract Infection',
      prescription: 'Amoxicillin 500mg (1-0-1) for 5 days\nCough Syrup (10ml 1-1-1) for 5 days',
      doctorNotes: 'Dry cough and sore throat. No fever. Throat appears red and inflamed.',
      symptoms: 'Dry cough for 4 days, Sore throat, Difficulty swallowing',
      vitals: { bp: '118/76', hr: '74', temp: '98.6 F', weight: '68 kg' },
      investigations: 'None required',
      followUp: 'Return if symptoms persist after 5 days'
    }
  ];
};

export const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedEMR, setSelectedEMR] = useState<any | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Consultation_Report_${selectedEMR?.id || 'Doc'}`,
  });

  // We grab Dr. Jenkins' patients (completed + waiting for this demo)
  const doctorId = 'd1';
  const doctor = doctorsData.find(d => d.id === doctorId);
  const allPatients = doctor ? [
    ...doctor.advanceQueue,
    ...doctor.walkInQueue
  ] : [];

  // Filter out duplicates (just in case) and simulate a larger DB
  const uniquePatients = Array.from(new Map(allPatients.map(item => [item.id, item])).values());

  const filteredPatients = uniquePatients.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(searchLower);
    const idMatch = p.id.toLowerCase().includes(searchLower);
    const phoneMatch = p.phone?.toLowerCase().includes(searchLower);
    return nameMatch || idMatch || phoneMatch;
  });

  if (selectedPatient) {
    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Navigation */}
        <button 
          onClick={() => setSelectedPatient(null)} 
          className="mb-6 text-text-gray hover:text-primary flex items-center gap-1.5 font-bold text-sm transition-colors"
        >
          <ChevronLeft size={16} /> Back to Directory
        </button>

        {/* Enterprise Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6 md:p-8 mb-6 flex flex-col md:flex-row justify-between md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex items-start gap-5 relative z-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl shrink-0 border-2 border-primary/20">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-text-dark">{selectedPatient.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-gray font-medium">
                <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md text-text-dark font-mono">
                  UHID-{selectedPatient.id.replace('p', '90')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" /> {selectedPatient.phone || '+91 9XXXX XXXXX'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" /> 34 Yrs, Male
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 relative z-10 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-sm transition-colors">
              <Stethoscope size={16} /> Start Consultation
            </button>
            <button className="flex items-center justify-center p-2.5 border border-border-color hover:bg-gray-50 rounded-xl text-text-dark transition-colors" title="Download Full EMR">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* EMR Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Clinical Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Vitals Snapshot */}
            <div className="bg-white rounded-2xl shadow-sm border border-border-color p-5">
              <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
                <HeartPulse size={16} className="text-red-500" /> Latest Vitals
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-border-color text-center">
                  <p className="text-[10px] uppercase font-bold text-text-gray mb-1">Blood Pressure</p>
                  <p className="font-bold text-text-dark">120/80</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-border-color text-center">
                  <p className="text-[10px] uppercase font-bold text-text-gray mb-1">Heart Rate</p>
                  <p className="font-bold text-text-dark">72 bpm</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-border-color text-center">
                  <p className="text-[10px] uppercase font-bold text-text-gray mb-1">Weight</p>
                  <p className="font-bold text-text-dark">68 kg</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-border-color text-center">
                  <p className="text-[10px] uppercase font-bold text-text-gray mb-1">SpO2</p>
                  <p className="font-bold text-text-dark">98%</p>
                </div>
              </div>
            </div>

            {/* Medical History Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-border-color p-5">
              <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
                <Activity size={16} className="text-primary" /> Medical Background
              </h3>
              
              <div className="mb-4">
                <p className="text-xs font-bold text-text-gray mb-2">Known Allergies</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <AlertCircle size={12} /> Penicillin
                  </span>
                  <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <AlertCircle size={12} /> Dust
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-text-gray mb-2">Chronic Conditions</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded text-xs font-bold">
                    Type 2 Diabetes
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-extrabold text-text-dark flex items-center gap-2">
              <Clock className="text-primary" /> Consultation History
            </h2>

            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border-color before:to-transparent">
              {generateMockEMR(selectedPatient.id).map((emr, idx) => (
                <div 
                  key={idx} 
                  className="relative flex items-center gap-6 group is-active cursor-pointer"
                  onClick={() => setSelectedEMR(emr)}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary/10 text-primary shadow shrink-0 z-10 transition-transform group-hover:scale-110">
                    <FileText size={16} />
                  </div>
                  
                  <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-border-color hover:shadow-md hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-text-dark text-sm">{emr.diagnosis}</h4>
                        <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded inline-block mt-1">
                          {emr.date}
                        </span>
                      </div>
                      <button className="text-text-light hover:text-primary transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-text-dark border border-border-color/50">
                        <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Stethoscope size={12} /> Clinical Notes
                        </p>
                        <p className="line-clamp-2">{emr.doctorNotes}</p>
                      </div>
                      
                      <div className="bg-primary/5 rounded-lg p-3 text-sm text-primary-dark border border-primary/10">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Pill size={12} /> Prescription
                        </p>
                        <p className="font-medium truncate">{emr.prescription.split('\n').join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* EMR Detail Modal */}
        {selectedEMR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border-color bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-text-dark text-lg">Consultation Report</h3>
                    <p className="text-sm font-semibold text-primary">{selectedEMR.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEMR(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg text-text-gray transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Vitals Bar */}
                <div className="flex flex-wrap items-center gap-4 bg-gray-50 rounded-xl p-4 border border-border-color">
                  <div className="flex items-center gap-2">
                    <HeartPulse size={16} className="text-red-500" />
                    <div>
                      <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">BP</p>
                      <p className="text-sm font-bold text-text-dark">{selectedEMR.vitals.bp}</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border-color"></div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Temp</p>
                      <p className="text-sm font-bold text-text-dark">{selectedEMR.vitals.temp}</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border-color"></div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">HR</p>
                      <p className="text-sm font-bold text-text-dark">{selectedEMR.vitals.hr} bpm</p>
                    </div>
                  </div>
                </div>

                {/* Symptoms & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertCircle size={14} /> Symptoms
                    </h4>
                    <p className="text-sm text-text-dark font-medium">{selectedEMR.symptoms}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-gray uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Stethoscope size={14} /> Clinical Findings
                    </h4>
                    <p className="text-sm text-text-dark font-medium">{selectedEMR.doctorNotes}</p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="bg-primary/5 rounded-xl border border-primary/20 p-5">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Final Diagnosis</h4>
                  <p className="text-lg font-bold text-primary-dark">{selectedEMR.diagnosis}</p>
                </div>

                {/* Prescriptions & Labs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-text-gray uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Pill size={14} /> Prescribed Medicines
                    </h4>
                    <div className="space-y-2">
                      {selectedEMR.prescription.split('\n').map((rx: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-border-color">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                          <p className="text-sm font-semibold text-text-dark">{rx}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-gray uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <ClipboardList size={14} /> Advised Investigations
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg border border-border-color">
                      <p className="text-sm font-medium text-text-dark">{selectedEMR.investigations}</p>
                    </div>
                    
                    <h4 className="text-xs font-bold text-text-gray uppercase tracking-wider mt-4 mb-2 flex items-center gap-1.5">
                      <Calendar size={14} /> Follow Up
                    </h4>
                    <p className="text-sm font-semibold text-text-dark">{selectedEMR.followUp}</p>
                  </div>
                </div>

              </div>
              
              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-border-color bg-gray-50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedEMR(null)}
                  className="px-5 py-2 border border-border-color hover:bg-gray-200 rounded-lg text-sm font-bold text-text-dark transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => handlePrint()}
                  className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  <Download size={16} /> Print EMR
                </button>
              </div>

              {/* Hidden Print Component (Must be rendered when modal is open) */}
              <div className="hidden">
                <ConsultationReportPrintTemplate
                  ref={reportRef}
                  data={{
                    reportId: selectedEMR.id,
                    date: selectedEMR.date,
                    time: '10:30 AM',
                    patientName: (selectedPatient as any).name,
                    patientId: (selectedPatient as any).id,
                    patientAgeGender: `34 Yrs • Male`,
                    doctorName: doctor?.name || 'Dr. Unknown',
                    doctorSpecialty: doctor?.specialty || 'General Medicine',
                    vitals: {
                      height: selectedEMR.vitals?.height,
                      weight: selectedEMR.vitals?.weight,
                      bp: selectedEMR.vitals?.bp,
                      pulse: selectedEMR.vitals?.pulse,
                      temp: selectedEMR.vitals?.temp,
                      spo2: selectedEMR.vitals?.spo2,
                    },
                    symptoms: selectedEMR.symptoms ? [selectedEMR.symptoms] : [],
                    diagnosis: selectedEMR.diagnosis || 'Diagnosis Pending',
                    prescriptions: selectedEMR.prescription?.split('\n').map((rx: string) => {
                      return {
                        medicine: rx,
                        dosage: 'As prescribed',
                        frequency: 'Daily',
                        duration: '5 Days'
                      };
                    }) || [],
                    labTests: selectedEMR.investigations ? [selectedEMR.investigations] : [],
                    notes: selectedEMR.doctorNotes || 'No additional notes provided.',
                    followUp: selectedEMR.followUp || 'As needed'
                  }}
                />
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent relative flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <Users className="text-primary" /> My Patients Directory
          </h1>
          <p className="text-text-gray mt-1 text-sm">
            Search your historical consultations, access EMR, and view past prescriptions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft interactive-card flex flex-col flex-1 border-none min-h-[500px]">
        {/* Toolbar */}
        <div className="p-6 border-b border-border-color bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 rounded-t-2xl">
          <div className="relative flex-1 sm:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
            <input 
              type="text" 
              placeholder="Search by Patient Name, Phone, or UHID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium !pl-10 py-2.5 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border-color rounded-lg text-sm font-bold text-text-dark hover:bg-gray-50 transition-colors">
            <Filter size={16} /> Filter List
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Patient List */}
          <div className="flex-1 overflow-y-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="table-header-cell rounded-tl-xl w-32">UHID</th>
                  <th className="table-header-cell">Patient Info</th>
                  <th className="table-header-cell">Last Visit</th>
                  <th className="table-header-cell text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color text-sm text-text-dark">
                {filteredPatients.map(patient => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <td className="table-row-cell font-mono text-xs text-text-gray">
                      UHID-{patient.id.replace('p', '90')}
                    </td>
                    <td className="table-row-cell">
                      <div className="font-bold text-text-dark">{patient.name}</div>
                      <div className="text-xs text-text-gray flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {patient.phone || '+91 9XXXX XXXXX'}
                      </div>
                    </td>
                    <td className="table-row-cell">
                      <div className="font-medium">10 May 2026</div>
                      <div className="text-xs text-text-gray">Completed</div>
                    </td>
                    <td className="table-row-cell text-right pr-6">
                      <button className="text-primary font-bold text-xs hover:underline flex items-center gap-1 justify-end w-full">
                        View EMR <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-text-gray">
                      <Users size={40} className="mx-auto mb-3 opacity-20" />
                      <p className="font-medium text-lg">No patients found</p>
                      <p className="text-sm">Try adjusting your search criteria.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
