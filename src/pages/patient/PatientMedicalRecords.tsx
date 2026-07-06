import { useState, useRef } from 'react';
import { FileText, Download, Calendar, Activity, Pill, HeartPulse, X } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { ConsultationReportPrintTemplate } from '../../components/print/ConsultationReportPrintTemplate';

interface MedicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  doctorName: string;
  specialty: string;
  doctorNotes: string;
  symptoms: string;
  vitals: { bp: string, hr: string, temp: string, weight: string, height: string, pulse: string, spo2: string };
  investigations: string;
  prescription: string;
  followUp: string;
}

const mockRecordsByProfile: Record<string, MedicalRecord[]> = {
  p1: [
    {
      id: 'emr-101',
      date: '10 May 2026',
      diagnosis: 'Acute Viral Fever',
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'General Medicine',
      doctorNotes: 'Patient complained of high grade fever and body ache. Throat clear. No history of travel.',
      symptoms: 'Fever (102F) for 2 days, Body ache, Mild cough',
      vitals: { bp: '120/80', hr: '88', temp: '102.4 F', weight: '68 kg', height: '175 cm', pulse: '88', spo2: '98%' },
      investigations: 'CBC, Dengue NS1 Antigen (advised)',
      prescription: 'Paracetamol 500mg (1-1-1) for 3 days\nCetirizine 10mg (0-0-1) for 3 days',
      followUp: '15 May 2026'
    },
    {
      id: 'emr-102',
      date: '15 Feb 2026',
      diagnosis: 'Upper Respiratory Tract Infection',
      doctorName: 'Dr. Emily Chen',
      specialty: 'Pulmonology',
      doctorNotes: 'Dry cough and sore throat. No fever. Throat appears red and inflamed.',
      symptoms: 'Dry cough for 4 days, Sore throat, Difficulty swallowing',
      vitals: { bp: '118/76', hr: '74', temp: '98.6 F', weight: '68 kg', height: '175 cm', pulse: '74', spo2: '99%' },
      investigations: 'None required',
      prescription: 'Amoxicillin 500mg (1-0-1) for 5 days\nCough Syrup (10ml 1-1-1) for 5 days',
      followUp: 'Return if symptoms persist after 5 days'
    }
  ],
  p2: [
    {
      id: 'emr-201',
      date: '22 May 2026',
      diagnosis: 'Hypertension Follow-up',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      doctorNotes: 'BP slightly elevated. Continue low sodium diet and regular walking exercise.',
      symptoms: 'High BP readings, occasional mild headache',
      vitals: { bp: '140/90', hr: '80', temp: '98.4 F', weight: '62 kg', height: '162 cm', pulse: '80', spo2: '98%' },
      investigations: 'Lipid Profile, Renal Function Test',
      prescription: 'Amlodipine 5mg (0-0-1) for 30 days',
      followUp: '22 Jun 2026'
    },
    {
      id: 'emr-202',
      date: '12 Jan 2026',
      diagnosis: 'Osteoarthritis Consult',
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'Orthopedics',
      doctorNotes: 'Knee pain on walking and morning stiffness. Advised physiotherapy sessions.',
      symptoms: 'Bilateral knee pain, morning stiffness',
      vitals: { bp: '130/80', hr: '72', temp: '98.6 F', weight: '63 kg', height: '162 cm', pulse: '72', spo2: '97%' },
      investigations: 'Knee X-Ray (Bilateral)',
      prescription: 'Calcium D3 (1-0-0) for 30 days\nGlucosamine (1-0-1) for 30 days',
      followUp: 'Return in 1 month'
    }
  ],
  p3: [
    {
      id: 'emr-301',
      date: '02 Jun 2026',
      diagnosis: 'Pediatric Immunization',
      doctorName: 'Dr. Sarah Jenkins',
      specialty: 'Pediatrics',
      doctorNotes: 'Scheduled vaccination visit. Normal developmental milestones. Immunization chart up to date.',
      symptoms: 'Routine immunization check',
      vitals: { bp: '95/60', hr: '95', temp: '98.6 F', weight: '25 kg', height: '115 cm', pulse: '95', spo2: '99%' },
      investigations: 'Developmental review',
      prescription: 'Vitamin C drops (0-1-0) for 15 days',
      followUp: 'Next vaccine due in 6 months'
    },
    {
      id: 'emr-302',
      date: '05 Mar 2026',
      diagnosis: 'Tonsillitis Consult',
      doctorName: 'Dr. Emily Chen',
      specialty: 'ENT Specialist',
      doctorNotes: 'Red tonsils with mild throat inflammation. Fever of 100.2F. Recommend soft food diet.',
      symptoms: 'Sore throat, difficulty swallowing, fever',
      vitals: { bp: '98/62', hr: '90', temp: '100.2 F', weight: '24 kg', height: '114 cm', pulse: '90', spo2: '98%' },
      investigations: 'Throat Swab Test',
      prescription: 'Erythromycin Syrup (5ml 1-0-1) for 5 days',
      followUp: 'Return if fever persists for 3 days'
    }
  ]
};

export const PatientMedicalRecords = ({ profile }: { profile: any }) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const recordsList = mockRecordsByProfile[profile.id] || mockRecordsByProfile.p1;

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Medical_Record_${selectedRecord?.id}`,
  });

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <FileText className="text-primary" /> Medical Records
          </h1>
          <p className="text-text-gray mt-1 text-sm font-medium">
            View your clinical history, diagnoses, and past prescriptions.
          </p>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden p-6 md:p-10 relative">
        <div className="space-y-12">
          {recordsList.map((record, index) => (
            <div key={record.id} className="relative flex items-start gap-6 group">
              
              {/* Timeline Line connecting to the next item */}
              {index < recordsList.length - 1 && (
                <div className="absolute left-6 md:left-8 top-[52px] md:top-[68px] bottom-[-52px] w-0.5 bg-border-color z-0 -translate-x-[1px]"></div>
              )}

              {/* Timeline Dot */}
              <div className="flex flex-col items-center shrink-0 mt-1 z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#E7F3F1] text-primary border-4 border-white shadow-sm flex items-center justify-center font-bold text-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  {recordsList.length - index}
                </div>
              </div>

              {/* Record Card */}
              <div className="flex-1 bg-white rounded-2xl border border-border-color p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-dark">{record.diagnosis}</h3>
                    <div className="flex items-center gap-3 text-sm text-text-gray mt-1 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={14} className="text-primary" /> {record.date}</span>
                      <span>•</span>
                      <span>{record.doctorName} ({record.specialty})</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => setSelectedRecord(record)}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-bold transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedRecord(record);
                        setTimeout(() => handlePrint(), 100);
                      }}
                      className="p-2 bg-gray-100 hover:bg-gray-200 text-text-dark rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-border-color/50 text-sm text-text-dark leading-relaxed">
                  <strong>Notes:</strong> {record.doctorNotes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border-color bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text-dark text-lg">Consultation Details</h3>
                  <p className="text-sm font-semibold text-primary">{selectedRecord.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-gray-200 rounded-lg text-text-gray transition-colors">
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
                    <p className="text-sm font-bold text-text-dark">{selectedRecord.vitals.bp}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border-color"></div>
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" />
                  <div>
                    <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Temp</p>
                    <p className="text-sm font-bold text-text-dark">{selectedRecord.vitals.temp}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-border-color"></div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-[10px] font-bold text-text-gray uppercase tracking-wider">Weight</p>
                    <p className="text-sm font-bold text-text-dark">{selectedRecord.vitals.weight}</p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-text-light uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Activity size={14} /> Clinical Information
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-border-color shadow-sm">
                      <p className="text-xs font-bold text-text-gray mb-1">Presenting Symptoms</p>
                      <p className="text-sm text-text-dark font-medium">{selectedRecord.symptoms}</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 shadow-sm">
                      <p className="text-xs font-bold text-primary mb-1">Primary Diagnosis</p>
                      <p className="text-sm text-text-dark font-bold">{selectedRecord.diagnosis}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-light uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Pill size={14} /> Prescriptions
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-border-color shadow-sm h-[calc(100%-28px)]">
                    <ul className="space-y-3">
                      {selectedRecord.prescription.split('\n').map((med, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-dark font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                          {med}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Lab Tests */}
              <div>
                <h4 className="text-xs font-bold text-text-light uppercase tracking-wider mb-3">Lab Investigations Advised</h4>
                <div className="bg-gray-50 px-4 py-3 rounded-lg border border-border-color text-sm text-text-dark font-mono">
                  {selectedRecord.investigations}
                </div>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-border-color bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 border border-border-color hover:bg-gray-200 rounded-lg text-sm font-bold text-text-dark transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => handlePrint()}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>

            {/* Hidden Print Template */}
            <div className="hidden">
              <ConsultationReportPrintTemplate
                ref={reportRef}
                data={{
                  reportId: selectedRecord.id,
                  date: selectedRecord.date,
                  time: 'N/A', // Mock time
                  patientName: profile?.name || 'John Doe',
                  patientId: profile?.uhid || 'PT-10023',
                  patientAgeGender: profile ? `${profile.gender} • DOB: ${profile.dob}` : `34 Yrs • Male`,
                  doctorName: selectedRecord.doctorName,
                  doctorSpecialty: selectedRecord.specialty,
                  vitals: selectedRecord.vitals,
                  symptoms: [selectedRecord.symptoms],
                  diagnosis: selectedRecord.diagnosis,
                  prescriptions: selectedRecord.prescription.split('\n').map(rx => ({
                    medicine: rx,
                    dosage: 'As prescribed',
                    frequency: 'Daily',
                    duration: '5 Days'
                  })),
                  labTests: [selectedRecord.investigations],
                  notes: selectedRecord.doctorNotes,
                  followUp: selectedRecord.followUp
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
