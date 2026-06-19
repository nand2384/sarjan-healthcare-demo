import { forwardRef } from 'react';

export interface Vitals {
  height?: string;
  weight?: string;
  bp?: string;
  pulse?: string;
  temp?: string;
  spo2?: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ConsultationReportData {
  reportId: string;
  date: string;
  time: string;
  patientName: string;
  patientId: string;
  patientAgeGender: string;
  doctorName: string;
  doctorSpecialty: string;
  vitals: Vitals;
  symptoms: string[];
  diagnosis: string;
  prescriptions: PrescriptionItem[];
  labTests: string[];
  notes: string;
  followUp: string;
}

interface Props {
  data: ConsultationReportData | null;
}

export const ConsultationReportPrintTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  if (!data) return null;

  return (
    <div ref={ref} className="bg-white p-8 max-w-3xl mx-auto text-black font-sans print:max-w-none print:w-full print:p-10 print:m-0">
      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}
      </style>

      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-gray-800 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-blue-900 mb-1">Sarjan Healthcare</h1>
          <p className="text-sm text-gray-600">123 Health Avenue, Medical District, City - 400001</p>
          <p className="text-sm text-gray-600">Phone: +91 98765 43210</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-800">Consultation Report</h2>
          <p className="text-sm font-bold text-gray-500 mt-2">ID: {data.reportId}</p>
          <p className="text-sm text-gray-500">{data.date} • {data.time}</p>
        </div>
      </div>

      {/* Patient & Doctor Info Box */}
      <div className="flex justify-between border-2 border-gray-800 p-4 mb-8 rounded-lg">
        <div className="w-1/2 border-r border-gray-300 pr-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Patient Details</p>
          <h3 className="text-lg font-bold">{data.patientName}</h3>
          <p className="text-sm text-gray-600">ID: {data.patientId}</p>
          <p className="text-sm text-gray-600">{data.patientAgeGender}</p>
        </div>
        <div className="w-1/2 pl-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Consulting Doctor</p>
          <h3 className="text-lg font-bold">{data.doctorName}</h3>
          <p className="text-sm text-gray-600">{data.doctorSpecialty}</p>
        </div>
      </div>

      {/* Vitals */}
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Vitals Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          {data.vitals.height && <div className="bg-gray-50 p-2 rounded border border-gray-100"><span className="text-xs text-gray-500 block">Height</span><span className="font-bold">{data.vitals.height}</span></div>}
          {data.vitals.weight && <div className="bg-gray-50 p-2 rounded border border-gray-100"><span className="text-xs text-gray-500 block">Weight</span><span className="font-bold">{data.vitals.weight}</span></div>}
          {data.vitals.bp && <div className="bg-gray-50 p-2 rounded border border-gray-100"><span className="text-xs text-gray-500 block">Blood Pressure</span><span className="font-bold">{data.vitals.bp}</span></div>}
          {data.vitals.pulse && <div className="bg-gray-50 p-2 rounded border border-gray-100"><span className="text-xs text-gray-500 block">Pulse</span><span className="font-bold">{data.vitals.pulse}</span></div>}
          {data.vitals.temp && <div className="bg-gray-50 p-2 rounded border border-gray-100"><span className="text-xs text-gray-500 block">Temperature</span><span className="font-bold">{data.vitals.temp}</span></div>}
          {data.vitals.spo2 && <div className="bg-gray-50 p-2 rounded border border-gray-100"><span className="text-xs text-gray-500 block">SpO2</span><span className="font-bold">{data.vitals.spo2}</span></div>}
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="mb-8 space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-2">Presenting Symptoms</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {data.symptoms.map((sym, i) => <li key={i}>{sym}</li>)}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-2">Diagnosis</h3>
          <p className="text-sm font-bold text-blue-900 bg-blue-50 p-3 rounded">{data.diagnosis}</p>
        </div>
      </div>

      {/* Prescriptions */}
      {data.prescriptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">Prescribed Medicines</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-left">
                <th className="py-2 px-3 font-bold">Medicine Name</th>
                <th className="py-2 px-3 font-bold">Dosage</th>
                <th className="py-2 px-3 font-bold">Frequency</th>
                <th className="py-2 px-3 font-bold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.prescriptions.map((rx, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 px-3 font-bold">{rx.medicine}</td>
                  <td className="py-3 px-3">{rx.dosage}</td>
                  <td className="py-3 px-3">{rx.frequency}</td>
                  <td className="py-3 px-3">{rx.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lab Tests */}
      {data.labTests.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-2">Recommended Lab Tests</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {data.labTests.map((test, i) => <li key={i}>{test}</li>)}
          </ul>
        </div>
      )}

      {/* Additional Notes & Follow up */}
      <div className="mb-12">
        <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-2 mb-2">Doctor's Advice & Notes</h3>
        <p className="text-sm text-gray-800 whitespace-pre-wrap italic">{data.notes}</p>
        
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-sm">
          <span className="font-bold text-gray-800">Follow-up Recommendation: </span>
          {data.followUp}
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="flex justify-between items-end pt-8 border-t border-gray-200">
        <p className="text-xs text-gray-500">End of Report.</p>
        <div className="text-center">
          <div className="w-48 border-b-2 border-gray-400 mb-2"></div>
          <p className="font-bold text-sm">{data.doctorName}</p>
          <p className="text-xs text-gray-500">Signature</p>
        </div>
      </div>
    </div>
  );
});

ConsultationReportPrintTemplate.displayName = 'ConsultationReportPrintTemplate';
