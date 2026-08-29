import React, { useState } from 'react';
import { Search, Calendar, UserPlus, X, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { existingPatientsDatabase, type ExistingPatient } from '../data/mockData';
import { CustomDatePicker } from '../components/common/CustomDatePicker';

export const BookAppointment = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExistingPatient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState<ExistingPatient | null>(null);
  const [viewPatientModalData, setViewPatientModalData] = useState<ExistingPatient | null>(null);

  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: ''
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setHasSearched(true);
      const results = existingPatientsDatabase.filter(p => 
        p.phone.includes(query) || p.fullName.toLowerCase().includes(query.toLowerCase()) || p.id.includes(query)
      );
      setSearchResults(results);
    } else {
      setHasSearched(false);
      setSearchResults([]);
    }
  };

  const handleCreateAppointment = (patient: ExistingPatient) => {
    setSelectedPatientForBooking(patient);
  };

  const handleViewPatient = (patient: ExistingPatient) => {
    setViewPatientModalData(patient);
  };

  const closeModal = () => {
    setViewPatientModalData(null);
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: string) => {
    setBookingForm(prev => ({ ...prev, appointmentDate: date }));
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Appointment successfully booked for ${selectedPatientForBooking?.fullName}!`);
    // Reset view
    setSelectedPatientForBooking(null);
    setBookingForm({ doctorId: '', appointmentDate: '', appointmentTime: '', reasonForVisit: '' });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent relative h-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
          <Calendar className="text-primary" /> Book Appointment
        </h1>
        <p className="text-text-gray mt-1 text-sm">Search for an existing patient to schedule an appointment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Default Search State */}
          {!selectedPatientForBooking && (
            <>
              {/* Search Bar */}
              <div className="bg-white rounded-xl border border-border-color shadow-sm p-6 relative">
                <label className="block text-sm font-bold text-text-dark mb-2 uppercase tracking-wider">Patient Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray" size={20} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by Patient Name, Phone Number, or UHID..."
                    className="w-full pl-12 pr-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-sm font-bold text-text-gray uppercase tracking-wider ml-1">Search Results ({searchResults.length})</h3>
                  
                  {searchResults.map(patient => (
                    <div key={patient.id} className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center p-5 border-l-4 border-l-primary gap-4">
                      
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-text-dark mb-2">{patient.fullName}</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm text-text-gray">
                          <p><span className="font-semibold text-text-dark">UHID:</span> SH000{patient.id.substring(1)}</p>
                          <p><span className="font-semibold text-text-dark">Phone:</span> {patient.phone}</p>
                          <p><span className="font-semibold text-text-dark">Age:</span> {new Date().getFullYear() - parseInt(patient.dob.substring(0, 4)) || 36}</p>
                          <p className="capitalize"><span className="font-semibold text-text-dark">Gender:</span> {patient.gender}</p>
                          <p className="col-span-2 lg:col-span-4 mt-1"><span className="font-semibold text-text-dark">Last Visit:</span> {patient.pastAppointments[0]?.date || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                        <button 
                          onClick={() => handleCreateAppointment(patient)}
                          className="w-full md:w-auto px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm flex justify-center items-center gap-2 cursor-pointer"
                        >
                          <Calendar size={16} /> Create Appointment
                        </button>
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="w-full md:w-auto px-5 py-2 border border-border-color text-text-dark text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 cursor-pointer"
                        >
                          <UserPlus size={16} /> View Patient
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {hasSearched && searchResults.length === 0 && (
                <div className="mt-4 p-6 bg-amber-50 border border-amber-100 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in">
                  <p className="text-amber-800 font-bold mb-1">No patients found</p>
                  <p className="text-amber-700 text-sm mb-4">Please verify the phone number or name.</p>
                  <button className="px-6 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors cursor-pointer">
                    Go to Patient Registration
                  </button>
                </div>
              )}
            </>
          )}

          {/* Booking Form State */}
          {selectedPatientForBooking && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border-color shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-text-dark flex items-center gap-2">
                    Booking Appointment
                  </h2>
                  <p className="text-sm text-text-gray font-medium">For: <span className="text-primary font-bold">{selectedPatientForBooking.fullName}</span> (UHID: SH000{selectedPatientForBooking.id.substring(1)})</p>
                </div>
                <button 
                  onClick={() => setSelectedPatientForBooking(null)}
                  className="text-text-gray hover:text-danger flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-lg border border-transparent hover:border-danger/20 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <X size={16} /> Cancel
                </button>
              </div>

              <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
                <form onSubmit={handleConfirmBooking}>
                  <div className="p-6 border-b border-border-color bg-indigo-50/30">
                    <h3 className="text-md font-bold text-text-dark mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
                      <Clock size={16} className="text-indigo-600" /> Schedule Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-1">Reason for Visit *</label>
                        <select 
                          name="reasonForVisit" value={bookingForm.reasonForVisit} onChange={handleBookingChange} required
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                        >
                          <option value="" disabled>Select Reason</option>
                          <option value="General Checkup">General Checkup</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Consultation">Consultation</option>
                          <option value="Tests / Reports">Tests / Reports</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Doctor *</label>
                        <select 
                          name="doctorId" value={bookingForm.doctorId} onChange={handleBookingChange} required
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                        >
                          <option value="" disabled>Select Doctor</option>
                          <option value="d1">Dr. Sarah Jenkins</option>
                          <option value="d2">Dr. Michael Chen</option>
                          <option value="d3">Dr. Emily Taylor</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Time Slot *</label>
                        <select 
                          name="appointmentTime" value={bookingForm.appointmentTime} onChange={handleBookingChange} required
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                        >
                          <option value="" disabled>Select Time Slot</option>
                          <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                          <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                          <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                          <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                          <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-1">Date *</label>
                        <CustomDatePicker 
                          selectedDate={bookingForm.appointmentDate}
                          onChange={handleDateChange}
                          doctorId={bookingForm.doctorId}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white flex justify-end">
                    <button 
                      type="submit" 
                      className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-md bg-primary text-white font-bold shadow-sm hover:bg-primary-dark transition-colors text-sm cursor-pointer"
                    >
                      <CheckCircle2 size={18} /> Confirm Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Instructions */}
        <div className="space-y-6">
           <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 p-6">
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
              <Calendar size={18} /> Booking Guidelines
            </h3>
            <ul className="text-sm text-indigo-700 space-y-3 list-disc list-inside">
              <li>Always verify the patient's identity using their UHID or phone number.</li>
              <li>Confirm the preferred doctor before booking.</li>
              <li>Inform the patient to arrive 15 minutes prior to their time slot.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* Patient View Modal */}
      {viewPatientModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-border-color flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-text-dark">Patient Profile</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-text-gray hover:text-text-dark">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-text-dark mb-1">{viewPatientModalData.fullName}</h3>
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    UHID: SH000{viewPatientModalData.id.substring(1)}
                  </span>
                  <p className="text-text-gray text-sm flex gap-4">
                    <span>📱 {viewPatientModalData.phone}</span>
                    <span className="capitalize">👤 {viewPatientModalData.gender}</span>
                    <span>🎂 {viewPatientModalData.dob}</span>
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider border-b border-border-color pb-2 mb-4">Contact & Address</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-gray mb-1">Address</p>
                    <p className="font-medium text-text-dark">{viewPatientModalData.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider border-b border-border-color pb-2 mb-4 flex items-center gap-2">
                  <Clock size={16} /> Past Appointments
                </h4>
                {viewPatientModalData.pastAppointments.length > 0 ? (
                  <div className="border border-border-color rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-border-color text-text-gray">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Date</th>
                          <th className="px-4 py-2 font-semibold">Doctor</th>
                          <th className="px-4 py-2 font-semibold">Reason</th>
                          <th className="px-4 py-2 font-semibold">Diagnosis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {viewPatientModalData.pastAppointments.map((appt, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-text-dark">{appt.date}</td>
                            <td className="px-4 py-3 text-text-dark">{appt.doctorName}</td>
                            <td className="px-4 py-3 text-text-gray">{appt.reasonForVisit}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                <FileText size={12} /> {appt.diagnosis || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-text-gray italic">No past appointments found.</p>
                )}
              </div>

            </div>

            <div className="p-5 border-t border-border-color bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-5 py-2 rounded-lg border border-border-color font-bold text-text-dark hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  closeModal();
                  handleCreateAppointment(viewPatientModalData);
                }}
                className="px-5 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Calendar size={16} /> Book Appointment
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
