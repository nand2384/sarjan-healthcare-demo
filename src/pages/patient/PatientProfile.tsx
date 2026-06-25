import { useState } from 'react';
import { User, Shield, Phone, Mail, MapPin, AlertCircle, CheckCircle2, Save } from 'lucide-react';

export const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    dob: '1992-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    email: 'john.doe@example.com',
    address: '123 Health Avenue, Medical District, City - 400001',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+91 98765 43211'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Mock save logic
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <User className="text-primary" /> My Profile
          </h1>
          <p className="text-text-gray mt-1 text-sm font-medium">
            Manage your personal information and contact details.
          </p>
        </div>
        
        {isEditing ? (
          <button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all hover:shadow-md flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save Changes
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white hover:bg-gray-50 text-text-dark border border-border-color px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column: Profile Card & Completeness */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className="bg-white rounded-2xl shadow-soft border border-border-color p-6 text-center">
            <div className="w-24 h-24 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4 border-4 border-white shadow-sm">
              {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-text-dark">{formData.firstName} {formData.lastName}</h2>
            <p className="text-text-gray text-sm font-medium mt-1">UHID-9002341</p>
            
            <div className="mt-6 flex justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                <CheckCircle2 size={14} /> Active Account
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-border-color p-6">
            <h3 className="font-bold text-text-dark flex items-center gap-2 mb-4">
              <Shield size={18} className="text-primary" /> Profile Completeness
            </h3>
            <div className="mb-2 flex justify-between items-center text-sm">
              <span className="font-bold text-text-gray">85% Complete</span>
              <span className="font-bold text-green-600">Good</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-text-light mt-3 flex items-start gap-1.5">
              <AlertCircle size={14} className="text-amber-500 shrink-0" />
              Add your Emergency Contact to reach 100%.
            </p>
          </div>

        </div>

        {/* Right Column: Forms */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden">
            <div className="px-6 py-4 border-b border-border-color bg-gray-50/50">
              <h3 className="font-bold text-text-dark">Basic Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-text-gray mb-2">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-gray mb-2">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-gray mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-gray mb-2">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-gray mb-2">Blood Group</label>
                <select 
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden">
            <div className="px-6 py-4 border-b border-border-color bg-gray-50/50">
              <h3 className="font-bold text-text-dark">Contact Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-text-gray mb-2 flex items-center gap-1.5"><Phone size={14} /> Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-gray mb-2 flex items-center gap-1.5"><Mail size={14} /> Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-text-gray mb-2 flex items-center gap-1.5"><MapPin size={14} /> Residential Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={2}
                  className="w-full px-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm font-medium text-text-dark disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
