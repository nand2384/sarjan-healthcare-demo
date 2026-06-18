import { useState } from 'react';
import { Building2, Save, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';

export const ClinicProfile = () => {
  const [profile, setProfile] = useState({
    clinicName: 'Sarjan Healthcare',
    phone: '+91 98765 43210',
    emergencyPhone: '+91 98765 43211',
    email: 'contact@sarjanhealthcare.com',
    address: '123 Health Avenue, Medical District, City 400001',
    aboutUs: 'Providing state-of-the-art medical facilities with a patient-first approach since 2010.'
  });

  const [timings, setTimings] = useState([
    { day: 'Monday', hours: '08:00 AM - 10:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '08:00 AM - 10:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '08:00 AM - 10:00 PM', isOpen: true },
    { day: 'Thursday', hours: '08:00 AM - 10:00 PM', isOpen: true },
    { day: 'Friday', hours: '08:00 AM - 10:00 PM', isOpen: true },
    { day: 'Saturday', hours: '08:00 AM - 08:00 PM', isOpen: true },
    { day: 'Sunday', hours: 'Closed', isOpen: false }
  ]);

  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    // API call would go here
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const updateTiming = (index: number, field: string, value: any) => {
    setTimings(prevTimings => {
      const newTimings = [...prevTimings];
      newTimings[index] = { ...newTimings[index], [field]: value };
      return newTimings;
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 right-8 z-[100] bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <p className="font-bold">Settings Saved</p>
            <p className="text-xs text-green-700">Clinic profile and timings have been updated.</p>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <Building2 className="text-primary" /> Clinic Profile
          </h1>
          <p className="text-text-gray mt-1 text-base">Manage public-facing clinic information and operating hours.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Basic Info */}
        <div className="bg-white rounded-2xl shadow-soft interactive-card overflow-hidden flex flex-col border-none">
          <div className="p-6 border-b border-border-color bg-gray-50/50">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <Building2 size={20} className="text-primary" /> Basic Information
            </h3>
          </div>
          
          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1">Clinic Name</label>
              <input 
                type="text" 
                value={profile.clinicName}
                onChange={(e) => setProfile({...profile, clinicName: e.target.value})}
                className="w-full border border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1 flex items-center gap-1.5"><Phone size={14} className="text-text-light"/> Primary Phone</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full border border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1 flex items-center gap-1.5"><Phone size={14} className="text-danger"/> Emergency Phone</label>
                <input 
                  type="text" 
                  value={profile.emergencyPhone}
                  onChange={(e) => setProfile({...profile, emergencyPhone: e.target.value})}
                  className="w-full border border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1 flex items-center gap-1.5"><Mail size={14} className="text-text-light"/> Support Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full border border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1 flex items-center gap-1.5"><MapPin size={14} className="text-text-light"/> Address</label>
              <textarea 
                rows={2}
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                className="w-full border border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-dark mb-1 flex items-center gap-1.5">About Us Summary</label>
              <textarea 
                rows={3}
                value={profile.aboutUs}
                onChange={(e) => setProfile({...profile, aboutUs: e.target.value})}
                className="w-full border border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark resize-none"
              />
              <p className="text-xs text-text-light mt-1">This text appears in the website footer.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Operating Hours */}
        <div className="bg-white rounded-2xl shadow-soft interactive-card overflow-hidden flex flex-col h-max border-none">
          <div className="p-6 border-b border-border-color bg-gray-50/50">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Operating Hours
            </h3>
          </div>
          
          <div className="p-6 flex flex-col gap-0 divide-y divide-border-color">
            <div className="grid grid-cols-[100px_1fr_auto] gap-4 pb-3 mb-1 text-sm font-bold text-text-light uppercase tracking-wider">
              <span>Day</span>
              <span>Hours</span>
              <span className="text-center w-16">Status</span>
            </div>
            
            {timings.map((t, index) => (
              <div key={t.day} className={`grid grid-cols-[100px_1fr_auto] gap-4 py-3 items-center ${!t.isOpen ? 'opacity-60' : ''}`}>
                <span className="font-semibold text-text-dark">{t.day}</span>
                <input 
                  type="text" 
                  value={t.hours}
                  disabled={!t.isOpen}
                  onChange={(e) => updateTiming(index, 'hours', e.target.value)}
                  className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-text-dark font-medium"
                />
                <div className="w-16 flex justify-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={t.isOpen}
                      onChange={(e) => {
                        updateTiming(index, 'isOpen', e.target.checked);
                        if (!e.target.checked) updateTiming(index, 'hours', 'Closed');
                        else if (t.hours === 'Closed') updateTiming(index, 'hours', '08:00 AM - 10:00 PM');
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
