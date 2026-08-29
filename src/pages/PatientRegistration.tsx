import React, { useState } from 'react';
import { Save, UserPlus, Camera, Scan, PhoneCall, UserCheck, Calendar, FileText } from 'lucide-react';
import { CustomDatePicker } from '../components/common/CustomDatePicker';

export const PatientRegistration = () => {
  const [mode, setMode] = useState<'walk-in' | 'call'>('walk-in');

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
    if (mode === 'call') {
      alert("Patient Profile Created & Appointment Booked!");
    } else {
      alert("New Patient Registered & Added to Queue Successfully!");
    }
    // Reset form
    setFormData({
      fullName: '', dob: '', gender: '', mobileNumber: '', whatsappNumber: '',
      isSameAsMobile: false, address: '', city: '', state: '', pincode: '',
      doctorId: '', appointmentDate: '', appointmentTime: '', reasonForVisit: ''
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <UserPlus className="text-primary" /> Register Patient
          </h1>
          <p className="text-text-gray mt-1 text-sm">Register new patients into the system.</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-white rounded-lg p-1 border border-border-color shadow-sm">
          <button 
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${mode === 'walk-in' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            onClick={() => setMode('walk-in')}
          >
            <UserCheck size={16} /> Walk-in (Full)
          </button>
          <button 
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${mode === 'call' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark'}`}
            onClick={() => setMode('call')}
          >
            <PhoneCall size={16} /> Call Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              
              {/* Consultation / Queue Assignment */}
              <div className="p-6 border-b border-border-color bg-indigo-50/50">
                <h2 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" /> 
                  {mode === 'call' ? 'Appointment Slot' : 'Queue Assignment'}
                </h2>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${mode === 'call' ? 'lg:grid-cols-4' : ''}`}>
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
                  {mode === 'call' && (
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

              {/* Section 1: Basic Info */}
              <div className="p-6 border-b border-border-color bg-gray-50/30">
                <h2 className="text-md font-bold text-text-dark mb-4 uppercase tracking-wider text-sm">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-dark mb-1">First Name & Last Name *</label>
                    <input 
                      type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="e.g. John Doe"
                      className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                    />
                  </div>
                  {mode === 'walk-in' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Date of Birth</label>
                        <input 
                          type="date" name="dob" value={formData.dob} onChange={handleChange} required
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Gender</label>
                        <select 
                          name="gender" value={formData.gender} onChange={handleChange} required
                          className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark bg-white"
                        >
                          <option value="" disabled>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section 2: Contact Details */}
              <div className="p-6 border-b border-border-color">
                <h2 className="text-md font-bold text-text-dark mb-4 uppercase tracking-wider text-sm">Contact Details</h2>
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
                  
                  {mode === 'walk-in' && (
                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <label className="block text-sm font-medium text-text-dark">WhatsApp Number (Optional)</label>
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
                          type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="9876543210" pattern="[0-9]{10}" disabled={formData.isSameAsMobile}
                          className={`flex-1 min-w-0 block w-full px-4 py-2.5 rounded-none rounded-r-md border border-border-color focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark ${formData.isSameAsMobile ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                  )}

                  {mode === 'walk-in' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-dark mb-1">Email Address (Optional)</label>
                      <input 
                        type="email" placeholder="e.g. patient@example.com"
                        className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Address (Walk-in only) */}
              {mode === 'walk-in' && (
                <div className="p-6 border-b border-border-color bg-gray-50/30">
                  <h2 className="text-md font-bold text-text-dark mb-4 uppercase tracking-wider text-sm">Address Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-text-dark mb-1">Street Address</label>
                      <textarea 
                        name="address" value={formData.address} onChange={handleChange} rows={2} placeholder="House No, Street, Landmark" required
                        className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none text-text-dark"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">City</label>
                      <input 
                        type="text" name="city" value={formData.city} onChange={handleChange} required
                        className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">State</label>
                      <select 
                        name="state" value={formData.state} onChange={handleChange} required
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
                        type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit code" pattern="[0-9]{6}" required
                        className="w-full border border-border-color rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-text-dark"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="p-6 bg-white flex justify-end gap-4">
                <button 
                  type="submit" 
                  className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-md bg-primary text-white font-bold shadow-sm hover:bg-primary-dark transition-colors text-sm cursor-pointer"
                >
                  <Save size={16} /> 
                  {mode === 'call' ? 'Save & Book Appointment' : 'Complete Registration'}
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
            <p className="text-sm text-blue-600 mb-4 font-medium">
              Capture documents during patient registration.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium text-sm cursor-pointer">
                <Camera size={20} /> Take Photo
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium text-sm cursor-pointer">
                <Scan size={20} /> Scan Document
              </button>
            </div>
          </div>
          
          <div className="bg-amber-50/50 rounded-xl border border-amber-100 p-6">
            <h3 className="font-bold text-amber-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText size={16} /> Required Documents
            </h3>
            <ul className="text-sm text-amber-800 space-y-3">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Valid Government ID</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Past Medical Records (If any)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Insurance Details</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
