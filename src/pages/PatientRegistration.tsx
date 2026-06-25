import React, { useState } from 'react';
import { Save, UserPlus, Camera, Scan, PhoneCall, UserCheck, Calendar, Search, X, Clock, FileText } from 'lucide-react';
import { CustomDatePicker } from '../components/common/CustomDatePicker';
import { existingPatientsDatabase, type ExistingPatient } from '../data/mockData';

export const PatientRegistration = () => {
  const [mode, setMode] = useState<'phone' | 'walk-in'>('walk-in');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ExistingPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<ExistingPatient | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    mobileNumber: '',
    whatsappNumber: '',
    isSameAsMobile: false,
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Phone mode specific
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: ''
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      const results = existingPatientsDatabase.filter(p => 
        p.phone.includes(query) || p.fullName.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectPatient = (patient: ExistingPatient) => {
    setSelectedPatient(patient);
    setSearchQuery('');
    setSearchResults([]);
    // Optionally prefill the formData with the patient's ID if needed for backend submission
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      mobileNumber: value,
      whatsappNumber: prev.isSameAsMobile ? value : prev.whatsappNumber
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      isSameAsMobile: checked,
      whatsappNumber: checked ? prev.mobileNumber : prev.whatsappNumber
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPatient) {
      alert(`New visit booked for existing patient: ${selectedPatient.fullName}`);
    } else {
      if (mode === 'phone') {
        alert("Quick Appointment Booked! Patient profile is marked as Incomplete.");
      } else {
        alert("New Patient Registered & Added to Queue Successfully!");
      }
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <UserPlus className="text-primary" /> Patient Onboarding
          </h1>
          <p className="text-text-gray mt-1 text-sm">Register new patients or book visits for returning patients.</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-white rounded-lg p-1 border border-border-color shadow-sm">
          <button 
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'phone' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            onClick={() => setMode('phone')}
          >
            <PhoneCall size={16} /> Phone Booking
          </button>
          <button 
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'walk-in' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            onClick={() => setMode('walk-in')}
          >
            <UserCheck size={16} /> Walk-in (Full)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Global Search Bar for Returning Patients */}
          {!selectedPatient && (
            <div className="bg-white rounded-xl border border-border-color shadow-sm p-6 relative">
              <label className="block text-sm font-bold text-text-dark mb-2 uppercase tracking-wider">Returning Patient Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search by Phone Number or Name..."
                  className="w-full pl-12 pr-4 py-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-gray-50/50"
                />
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-6 right-6 top-[100px] bg-white border border-border-color rounded-lg shadow-xl z-50 overflow-hidden">
                  {searchResults.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => selectPatient(p)}
                      className="w-full text-left px-4 py-3 hover:bg-hover-bg border-b border-border-color last:border-0 transition-colors flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-text-dark">{p.fullName}</p>
                        <p className="text-sm text-text-gray">📞 {p.phone}</p>
                      </div>
                      <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Select Patient</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Patient Identity Card */}
          {selectedPatient && (
            <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden border-t-4 border-t-primary animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-6 border-b border-border-color flex justify-between items-start bg-indigo-50/30">
                <div>
                  <h2 className="text-xl font-bold text-text-dark flex items-center gap-2">
                    {selectedPatient.fullName} 
                    <span className="text-xs font-bold uppercase bg-primary text-white px-2 py-0.5 rounded-full">Verified</span>
                  </h2>
                  <p className="text-text-gray mt-1 flex items-center gap-4 text-sm">
                    <span>📞 {selectedPatient.phone}</span>
                    <span>🎂 {selectedPatient.dob}</span>
                    <span className="capitalize">👤 {selectedPatient.gender}</span>
                  </p>
                  <p className="text-text-gray text-sm mt-1">🏠 {selectedPatient.address}</p>
                </div>
                <button 
                  onClick={clearSelectedPatient}
                  className="p-2 text-text-gray hover:text-danger hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 text-sm font-semibold"
                >
                  <X size={16} /> Clear / New Patient
                </button>
              </div>

              {/* Past Appointments History */}
              <div className="p-6 bg-white">
                <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-text-gray" /> Past Appointments History
                </h3>
                {selectedPatient.pastAppointments.length > 0 ? (
                  <div className="border border-border-color rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[600px]">
                      <thead className="bg-gray-50 border-b border-border-color text-text-gray">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Date</th>
                          <th className="px-4 py-2 font-semibold">Doctor</th>
                          <th className="px-4 py-2 font-semibold">Reason</th>
                          <th className="px-4 py-2 font-semibold">Diagnosis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-color">
                        {selectedPatient.pastAppointments.map((appt, i) => (
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
          )}

          <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              
              {/* Consultation / Queue Assignment */}
              <div className="p-6 border-b border-border-color bg-indigo-50/50">
                <h2 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" /> 
                  {mode === 'phone' ? 'Appointment Slot' : 'Direct to Queue'}
                </h2>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${mode === 'phone' ? 'lg:grid-cols-4' : ''}`}>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Doctor *</label>
                    <select 
                      name="doctorId" value={formData.doctorId} onChange={handleChange} required
                      className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                    >
                      <option value="" disabled>Select Doctor</option>
                      <option value="d1">Dr. Sarah Jenkins</option>
                      <option value="d2">Dr. Michael Chen</option>
                      <option value="d3">Dr. Emily Taylor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">Reason for Visit *</label>
                    <select 
                      name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} required
                      className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                    >
                      <option value="" disabled>Select Reason</option>
                      <option value="General Checkup">General Checkup</option>
                      <option value="2nd Opinion">2nd Opinion</option>
                      <option value="Tests / Reports">Tests / Reports</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {mode === 'phone' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Date *</label>
                        <CustomDatePicker 
                          selectedDate={formData.appointmentDate}
                          onChange={handleDateChange}
                          doctorId={formData.doctorId}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Time Slot *</label>
                        <select 
                          name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required
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
                    </>
                  )}
                </div>
              </div>

              {/* Only show demographic fields if NO existing patient is selected */}
              {!selectedPatient && (
                <>
                  {/* Section 1: Basic Info */}
                  <div className="p-6 border-b border-border-color">
                    <h2 className="text-lg font-semibold text-text-dark mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text-dark mb-1">Full Name *</label>
                        <input 
                          type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="e.g. John Doe"
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Date of Birth</label>
                        <input 
                          type="date" name="dob" value={formData.dob} onChange={handleChange}
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Gender</label>
                        <select 
                          name="gender" value={formData.gender} onChange={handleChange}
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Details */}
                  <div className="p-6 border-b border-border-color bg-transparent/50">
                    <h2 className="text-lg font-semibold text-text-dark mb-4">Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Mobile Number *</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-border-color bg-gray-50 text-text-gray sm:text-sm">
                            +91
                          </span>
                          <input 
                            type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleMobileChange} required placeholder="9876543210" pattern="[0-9]{10}"
                            className="flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-md border border-border-color focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                          />
                        </div>
                      </div>
                      
                      {/* WhatsApp logic specifically customized as requested */}
                      {mode === 'phone' ? (
                        <div>
                          <div className="flex justify-between items-end mb-1">
                            <label className="block text-sm font-medium text-text-dark">WhatsApp Number *</label>
                            <label className="flex items-center gap-2 text-sm text-text-gray cursor-pointer">
                              <input 
                                type="checkbox" checked={formData.isSameAsMobile} onChange={handleCheckboxChange}
                                className="rounded text-primary focus:ring-primary border-border-color"
                              />
                              Same as Mobile
                            </label>
                          </div>
                          <div className="flex">
                            <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-border-color bg-gray-50 text-text-gray sm:text-sm">
                              +91
                            </span>
                            <input 
                              type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required placeholder="9876543210" pattern="[0-9]{10}" disabled={formData.isSameAsMobile}
                              className={`flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-md border border-border-color focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark ${formData.isSameAsMobile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Section 3: Address (Walk-in only) */}
                  {mode === 'walk-in' && (
                    <div className="p-6 border-b border-border-color">
                      <h2 className="text-lg font-semibold text-text-dark mb-4">Address Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-text-dark mb-1">Street Address</label>
                          <textarea 
                            name="address" value={formData.address} onChange={handleChange} rows={2} placeholder="House No, Street, Landmark"
                            className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none text-text-dark"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-1">City</label>
                          <input 
                            type="text" name="city" value={formData.city} onChange={handleChange}
                            className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-1">State</label>
                          <select 
                            name="state" value={formData.state} onChange={handleChange}
                            className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                          >
                            <option value="" disabled>Select State</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-dark mb-1">Pin Code</label>
                          <input 
                            type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit code" pattern="[0-9]{6}"
                            className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Submit Button */}
              <div className="p-6 bg-gray-50 flex justify-end gap-4">
                <button 
                  type="button" 
                  className="px-6 py-2.5 rounded-md border border-border-color text-text-dark font-medium hover:bg-hover-bg transition-colors"
                  onClick={() => {
                    setFormData({
                      fullName: '', dob: '', gender: '', mobileNumber: '', whatsappNumber: '',
                      isSameAsMobile: false, address: '', city: '', state: '', pincode: '',
                      doctorId: '', appointmentDate: '', appointmentTime: '', reasonForVisit: ''
                    });
                    clearSelectedPatient();
                  }}
                >
                  Reset Form
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-white font-semibold shadow-sm hover:bg-primary-dark transition-colors"
                >
                  <Save size={18} /> {selectedPatient ? 'Book New Visit' : (mode === 'phone' ? 'Book & Create Profile' : 'Register & Add to Queue')}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Right Column: Quick Actions / Instructions */}
        <div className="space-y-6">
          <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-6">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Camera size={18} /> Quick Scan Capture
            </h3>
            <p className="text-sm text-blue-600 mb-4">
              Capture patient ID or previous documents instantly.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium text-sm">
                <Camera size={20} /> Take Photo
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium text-sm">
                <Scan size={20} /> Scan Doc
              </button>
            </div>
          </div>
          
          <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-6">
            <h3 className="font-bold text-amber-800 mb-2 text-sm uppercase tracking-wider">Required Documents</h3>
            <ul className="text-sm text-amber-700 space-y-2 list-disc list-inside">
              <li>Valid Government ID</li>
              <li>Past Medical Records (If any)</li>
              <li>Insurance Details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
