import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, X, AlertTriangle, Check, XCircle, Settings, CheckCircle, LayoutGrid, List } from 'lucide-react';
import { doctorsData } from '../data/mockData';
import type { Doctor, Patient } from '../data/mockData';

// Receptionist Interface
interface Receptionist {
  id: string;
  name: string;
  shift: string;
  status: string;
  phone: string;
  email: string;
  employeeId: string;
  roleLevel: string;
  joiningDate: string;
  password?: string;
}

// Generate mock receptionists
const mockReceptionists: Receptionist[] = [
  { id: 'r1', name: 'Riya Patel', shift: 'Morning (8 AM - 4 PM)', status: 'active', phone: '+91 98765 43210', email: 'riya.p@sarjan.com', employeeId: 'REC-001', roleLevel: 'Senior Receptionist', joiningDate: '2022-01-15' },
  { id: 'r2', name: 'Amit Kumar', shift: 'Evening (4 PM - 12 AM)', status: 'active', phone: '+91 98765 43211', email: 'amit.k@sarjan.com', employeeId: 'REC-002', roleLevel: 'Junior Receptionist', joiningDate: '2023-05-10' },
];

export const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'receptionists'>('doctors');
  const [layoutMode, setLayoutMode] = useState<'table' | 'cards'>('table');

  // Doctors State
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [newDoctorForm, setNewDoctorForm] = useState({ 
    name: '', specialty: '', newCaseFee: 500, oldCaseFee: 300, 
    email: '', password: '', phone: '', joiningDate: '', 
    licenseNumber: '', education: '', experience: 0, consultationDays: '' 
  });
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // Manage Account Modal State (Deep Editing)
  const [manageDocId, setManageDocId] = useState<string | null>(null);
  const [manageDocForm, setManageDocForm] = useState<any>({});
  
  const [manageRecpId, setManageRecpId] = useState<string | null>(null);
  const [manageRecpForm, setManageRecpForm] = useState<any>({});

  // Inline Editing - Doctor (Core Fields Only, Fees moved to Pricing)
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [docEditForm, setDocEditForm] = useState({ name: '', specialty: '' });

  // Receptionists State
  const [receptionists, setReceptionists] = useState<Receptionist[]>(mockReceptionists);
  const [isReceptionistModalOpen, setIsReceptionistModalOpen] = useState(false);
  const [newReceptionistForm, setNewReceptionistForm] = useState({ 
    name: '', shift: 'Morning (8 AM - 4 PM)', phone: '', status: 'active',
    email: '', password: '', employeeId: '', roleLevel: 'Receptionist', joiningDate: ''
  });
  const [deletingRecpId, setDeletingRecpId] = useState<string | null>(null);

  // Inline Editing - Receptionist (Core Fields Only)
  const [editingRecpId, setEditingRecpId] = useState<string | null>(null);
  const [recpEditForm, setRecpEditForm] = useState({ name: '', shift: 'Morning (8 AM - 4 PM)', phone: '', status: 'active' });

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });

  const triggerToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Helper to calculate automated doctor status
  const getDoctorStatus = (doc: any) => {
    if (doc.status === 'away') return 'away';
    const hasConsultingPatient = [...(doc.advanceQueue || []), ...(doc.walkInQueue || [])]
      .some((p: Patient) => p.status === 'in-consultation');
    return hasConsultingPatient ? 'busy' : 'available';
  };

  // === DOCTOR ACTIONS ===
  const openAddDoctor = () => {
    setNewDoctorForm({ 
      name: '', specialty: '', newCaseFee: 500, oldCaseFee: 300, 
      email: '', password: '', phone: '', joiningDate: '', 
      licenseNumber: '', education: '', experience: 0, consultationDays: '' 
    });
    setIsDoctorModalOpen(true);
  };

  const addDoctor = () => {
    if (!newDoctorForm.name || !newDoctorForm.specialty) return;
    const newDoc: Doctor = {
      id: `d${Date.now()}`,
      name: newDoctorForm.name,
      specialty: newDoctorForm.specialty,
      newCaseFee: Number(newDoctorForm.newCaseFee),
      oldCaseFee: Number(newDoctorForm.oldCaseFee),
      status: 'available',
      email: newDoctorForm.email,
      password: newDoctorForm.password,
      phone: newDoctorForm.phone,
      joiningDate: newDoctorForm.joiningDate,
      licenseNumber: newDoctorForm.licenseNumber,
      education: newDoctorForm.education,
      experience: Number(newDoctorForm.experience),
      consultationDays: newDoctorForm.consultationDays,
      advanceQueue: [],
      walkInQueue: []
    };
    setDoctors([...doctors, newDoc]);
    setIsDoctorModalOpen(false);
    triggerToast('Doctor Added', 'New doctor profile has been successfully created.');
  };

  const startEditDoctor = (doc: Doctor) => {
    setEditingDocId(doc.id);
    setDocEditForm({ name: doc.name, specialty: doc.specialty });
  };

  const saveEditDoctor = () => {
    if (!docEditForm.name || !docEditForm.specialty) return;
    setDoctors(doctors.map(d => d.id === editingDocId ? { ...d, name: docEditForm.name, specialty: docEditForm.specialty } : d));
    setEditingDocId(null);
    triggerToast('Profile Updated', 'Doctor details have been successfully updated.');
  };

  const openManageDoc = (doc: Doctor) => {
    setManageDocId(doc.id);
    setManageDocForm({ ...doc });
  };

  const saveManageDoc = () => {
    setDoctors(doctors.map(d => d.id === manageDocId ? { ...d, ...manageDocForm, newCaseFee: Number(manageDocForm.newCaseFee), oldCaseFee: Number(manageDocForm.oldCaseFee), experience: Number(manageDocForm.experience) } : d));
    setManageDocId(null);
    triggerToast('Account Managed', 'Deep profile edits have been saved.');
  };

  const deleteDoctor = () => {
    if (deletingDocId) {
      setDoctors(doctors.filter(d => d.id !== deletingDocId));
      setDeletingDocId(null);
    }
  };

  // === RECEPTIONIST ACTIONS ===
  const openAddReceptionist = () => {
    setNewReceptionistForm({ 
      name: '', shift: 'Morning (8 AM - 4 PM)', phone: '', status: 'active',
      email: '', password: '', employeeId: '', roleLevel: 'Receptionist', joiningDate: ''
    });
    setIsReceptionistModalOpen(true);
  };

  const addReceptionist = () => {
    if (!newReceptionistForm.name) return;
    setReceptionists([...receptionists, { id: `r${Date.now()}`, ...newReceptionistForm }]);
    setIsReceptionistModalOpen(false);
    triggerToast('Staff Added', 'New staff profile has been successfully created.');
  };

  const startEditReceptionist = (recp: Receptionist) => {
    setEditingRecpId(recp.id);
    setRecpEditForm({ name: recp.name, shift: recp.shift, phone: recp.phone, status: recp.status });
  };

  const saveEditReceptionist = () => {
    if (!recpEditForm.name) return;
    setReceptionists(receptionists.map(r => r.id === editingRecpId ? { ...r, ...recpEditForm } : r));
    setEditingRecpId(null);
    triggerToast('Profile Updated', 'Staff details have been successfully updated.');
  };

  const openManageRecp = (recp: Receptionist) => {
    setManageRecpId(recp.id);
    setManageRecpForm({ ...recp });
  };

  const saveManageRecp = () => {
    setReceptionists(receptionists.map(r => r.id === manageRecpId ? { ...r, ...manageRecpForm } : r));
    setManageRecpId(null);
    triggerToast('Account Managed', 'Deep profile edits have been saved.');
  };

  const deleteReceptionist = () => {
    if (deletingRecpId) {
      setReceptionists(receptionists.filter(r => r.id !== deletingRecpId));
      setDeletingRecpId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-transparent relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-4 right-8 z-[100] bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="text-green-600" size={20} />
          <div>
            <p className="font-bold">{toastMessage.title}</p>
            <p className="text-xs text-green-700">{toastMessage.desc}</p>
          </div>
        </div>
      )}

      <div className="mb-2 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <Users className="text-primary" /> Staff & Doctor Management
          </h1>
          <p className="text-text-gray mt-1 text-base">Manage doctor profiles, schedules, and clinic staff accounts.</p>
        </div>
        <button 
          onClick={() => activeTab === 'doctors' ? openAddDoctor() : openAddReceptionist()}
          className="flex items-center gap-2 px-5 py-2.5 btn-primary"
        >
          <Plus size={18} /> Add New {activeTab === 'doctors' ? 'Doctor' : 'Staff'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Left Side: Tabs */}
        <div className="flex bg-white rounded-lg p-1 border border-border-color shadow-sm w-max">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'doctors' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveTab('receptionists')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors cursor-pointer ${
              activeTab === 'receptionists' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
            }`}
          >
            Receptionists
          </button>
        </div>

        {/* Right Side: Layout toggle */}
        <div className="flex bg-white rounded-lg p-1 border border-border-color shadow-sm w-max items-center">
          <button
            onClick={() => setLayoutMode('table')}
            className={`p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
              layoutMode === 'table' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
            }`}
            title="Table View"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setLayoutMode('cards')}
            className={`p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
              layoutMode === 'cards' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
            }`}
            title="Cards View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {activeTab === 'doctors' ? (
        layoutMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-soft interactive-card overflow-hidden overflow-x-auto border-none">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th className="table-header-cell w-1/4">Doctor Name</th>
                  <th className="table-header-cell w-1/4">Specialty</th>
                  <th className="table-header-cell">Contact</th>
                  <th className="table-header-cell w-32">Live Status</th>
                  <th className="table-header-cell text-right w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color text-sm text-text-dark">
                {doctors.map(doc => {
                  const isEditing = editingDocId === doc.id;
                  const currentStatus = getDoctorStatus(doc);
                  
                  return (
                    <tr key={doc.id} className={`${isEditing ? 'bg-blue-50/30' : 'hover:bg-hover-bg transition-colors group'}`}>
                      <td className="table-row-cell font-bold">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={docEditForm.name} 
                            onChange={(e) => setDocEditForm({...docEditForm, name: e.target.value})}
                            className="w-full border border-border-color rounded px-2 py-1 text-sm font-bold"
                            autoFocus
                          />
                        ) : (
                          <span className="text-text-dark">{doc.name}</span>
                        )}
                      </td>
                      <td className="table-row-cell">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={docEditForm.specialty} 
                            onChange={(e) => setDocEditForm({...docEditForm, specialty: e.target.value})}
                            className="w-full border border-border-color rounded px-2 py-1 text-sm"
                          />
                        ) : (
                          <span className="text-[11px] font-bold text-text-light uppercase tracking-wider">{doc.specialty}</span>
                        )}
                      </td>
                      <td className="table-row-cell text-xs">
                        <div className="font-medium text-text-dark">{doc.email || 'No email set'}</div>
                        <div className="text-text-light">{doc.phone || 'No phone set'}</div>
                      </td>
                      <td className="table-row-cell">
                        {/* Status is fully automated and not editable inline */}
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          currentStatus === 'available' ? 'bg-green-100 text-green-700' :
                          currentStatus === 'busy' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`} title="Automatically derived from patient queue">
                          {currentStatus}
                        </span>
                      </td>
                      <td className="table-row-cell text-right">
                        {isEditing ? (
                          <div className="flex justify-end items-center">
                            <button onClick={saveEditDoctor} disabled={!docEditForm.name} className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors mr-1">
                              <Check size={18} />
                            </button>
                            <button onClick={() => setEditingDocId(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors">
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button onClick={() => startEditDoctor(doc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Inline Edit (Core)">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => openManageDoc(doc)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mr-1" title="Manage Full Account Details">
                              <Settings size={16} />
                            </button>
                            <button onClick={() => setDeletingDocId(doc.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Doctor">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {doctors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-gray italic">No doctors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doc => {
              const isEditing = editingDocId === doc.id;
              const currentStatus = getDoctorStatus(doc);
              const initials = doc.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div 
                  key={doc.id}
                  className={`bg-white rounded-2xl border p-5 shadow-soft interactive-card flex flex-col justify-between transition-all ${
                    isEditing ? 'border-primary/50 ring-2 ring-primary/5' : 'border-border-color'
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar & Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-sm border border-primary/5">
                          {initials}
                        </div>
                        <div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                value={docEditForm.name} 
                                onChange={(e) => setDocEditForm({...docEditForm, name: e.target.value})}
                                className="border border-border-color rounded px-2 py-1 text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Name"
                              />
                              <input 
                                type="text" 
                                value={docEditForm.specialty} 
                                onChange={(e) => setDocEditForm({...docEditForm, specialty: e.target.value})}
                                className="border border-border-color rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Specialty"
                              />
                            </div>
                          ) : (
                            <>
                              <h4 className="font-bold text-text-dark text-base">{doc.name}</h4>
                              <p className="text-xs text-text-gray mt-0.5 font-medium">{doc.education || 'MBBS, MD'}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        currentStatus === 'available' ? 'bg-green-100 text-green-700 border-green-200/50' : 
                        currentStatus === 'busy' ? 'bg-red-100 text-red-700 border-red-200/50' : 
                        'bg-gray-100 text-gray-500 border-gray-200/50'
                      }`} title="Automatically derived from patient queue">
                        {currentStatus}
                      </span>
                    </div>

                    {/* Middle Details */}
                    {!isEditing && (
                      <div className="space-y-2.5 my-4 pt-3 border-t border-border-color/60 text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Specialty</span>
                          <span className="bg-primary/5 text-primary-dark font-bold px-2 py-0.5 rounded border border-primary/10 text-[10px] uppercase">{doc.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Contact</span>
                          <span className="text-text-dark font-medium truncate max-w-[180px]" title={doc.email}>{doc.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Phone</span>
                          <span className="text-text-dark font-medium">{doc.phone || 'N/A'}</span>
                        </div>
                        {doc.licenseNumber && (
                          <div className="flex justify-between">
                            <span className="text-text-gray font-semibold">License</span>
                            <span className="text-text-dark font-mono font-medium">{doc.licenseNumber}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Experience</span>
                          <span className="text-text-dark font-medium">{doc.experience ? `${doc.experience} Years` : 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-border-color/60 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                      Joined: {doc.joiningDate || 'N/A'}
                    </span>
                    
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={saveEditDoctor} disabled={!docEditForm.name || !docEditForm.specialty} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer" title="Save">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingDocId(null)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Cancel">
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEditDoctor(doc)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Inline Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => openManageDoc(doc)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Manage Account Details">
                          <Settings size={15} />
                        </button>
                        <button onClick={() => setDeletingDocId(doc.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Remove Doctor">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {doctors.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl p-8 border border-border-color shadow-soft text-center text-text-gray italic">
                No doctors found.
              </div>
            )}
          </div>
        )
      ) : (
        layoutMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-soft interactive-card overflow-hidden overflow-x-auto border-none">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th className="table-header-cell w-1/4">Staff Name</th>
                  <th className="table-header-cell w-1/4">Assigned Shift</th>
                  <th className="table-header-cell w-1/5">Contact</th>
                  <th className="table-header-cell w-1/6">Account Status</th>
                  <th className="table-header-cell text-right w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color text-sm text-text-dark">
                {receptionists.map(recp => {
                  const isEditing = editingRecpId === recp.id;
                  
                  return (
                    <tr key={recp.id} className={`${isEditing ? 'bg-blue-50/30' : 'hover:bg-hover-bg transition-colors group'}`}>
                      <td className="table-row-cell font-bold">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={recpEditForm.name} 
                            onChange={(e) => setRecpEditForm({...recpEditForm, name: e.target.value})}
                            className="w-full border border-border-color rounded px-2 py-1 text-sm font-bold"
                            autoFocus
                          />
                        ) : (
                          <div>
                            {recp.name}
                            <div className="text-xs text-text-gray font-normal">{recp.employeeId} - {recp.roleLevel}</div>
                          </div>
                        )}
                      </td>
                      <td className="table-row-cell text-text-gray font-medium">
                        {isEditing ? (
                          <select 
                            value={recpEditForm.shift} 
                            onChange={(e) => setRecpEditForm({...recpEditForm, shift: e.target.value})}
                            className="w-full border border-border-color rounded px-1 py-1 text-sm bg-white"
                          >
                            <option value="Morning (8 AM - 4 PM)">Morning</option>
                            <option value="Evening (4 PM - 12 AM)">Evening</option>
                            <option value="Night (12 AM - 8 AM)">Night</option>
                          </select>
                        ) : (
                          recp.shift
                        )}
                      </td>
                      <td className="table-row-cell font-medium text-xs">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={recpEditForm.phone} 
                            onChange={(e) => setRecpEditForm({...recpEditForm, phone: e.target.value})}
                            className="w-full border border-border-color rounded px-2 py-1 text-sm"
                          />
                        ) : (
                          <>
                            <div>{recp.phone}</div>
                            <div className="text-text-gray">{recp.email}</div>
                          </>
                        )}
                      </td>
                      <td className="table-row-cell">
                        {isEditing ? (
                          <select 
                            value={recpEditForm.status} 
                            onChange={(e) => setRecpEditForm({...recpEditForm, status: e.target.value})}
                            className="w-full border border-border-color rounded px-1 py-1 text-sm bg-white"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            recp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {recp.status}
                          </span>
                        )}
                      </td>
                      <td className="table-row-cell text-right">
                        {isEditing ? (
                          <div className="flex justify-end items-center">
                            <button onClick={saveEditReceptionist} disabled={!recpEditForm.name} className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors mr-1">
                              <Check size={18} />
                            </button>
                            <button onClick={() => setEditingRecpId(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors">
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button onClick={() => startEditReceptionist(recp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Inline Edit (Core)">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => openManageRecp(recp)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mr-1" title="Manage Full Account Details">
                              <Settings size={16} />
                            </button>
                            <button onClick={() => setDeletingRecpId(recp.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Staff">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {receptionists.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-gray italic">No staff found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receptionists.map(recp => {
              const isEditing = editingRecpId === recp.id;
              const initials = recp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div 
                  key={recp.id}
                  className={`bg-white rounded-2xl border p-5 shadow-soft interactive-card flex flex-col justify-between transition-all ${
                    isEditing ? 'border-primary/50 ring-2 ring-primary/5' : 'border-border-color'
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar & Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg shadow-sm border border-purple-100/50">
                          {initials}
                        </div>
                        <div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                value={recpEditForm.name} 
                                onChange={(e) => setRecpEditForm({...recpEditForm, name: e.target.value})}
                                className="border border-border-color rounded px-2 py-1 text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Name"
                              />
                              <select 
                                value={recpEditForm.shift} 
                                onChange={(e) => setRecpEditForm({...recpEditForm, shift: e.target.value})}
                                className="border border-border-color rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                              >
                                <option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</option>
                                <option value="Evening (4 PM - 12 AM)">Evening (4 PM - 12 AM)</option>
                                <option value="Night (12 AM - 8 AM)">Night (12 AM - 8 AM)</option>
                              </select>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-bold text-text-dark text-base">{recp.name}</h4>
                              <p className="text-xs text-text-gray mt-0.5 font-medium">{recp.roleLevel || 'Receptionist'}</p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {isEditing ? (
                        <select 
                          value={recpEditForm.status} 
                          onChange={(e) => setRecpEditForm({...recpEditForm, status: e.target.value})}
                          className="border border-border-color rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          recp.status === 'active' 
                            ? 'bg-green-100 text-green-700 border-green-200/50' 
                            : 'bg-gray-100 text-gray-500 border-gray-200/50'
                        }`}>
                          {recp.status}
                        </span>
                      )}
                    </div>

                    {/* Middle Details */}
                    {!isEditing && (
                      <div className="space-y-2.5 my-4 pt-3 border-t border-border-color/60 text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Employee ID</span>
                          <span className="text-text-dark font-mono font-medium">{recp.employeeId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Assigned Shift</span>
                          <span className="text-text-dark font-medium">{recp.shift}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Contact Email</span>
                          <span className="text-text-dark font-medium truncate max-w-[180px]" title={recp.email}>{recp.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-gray font-semibold">Phone</span>
                          <span className="text-text-dark font-medium">{recp.phone || 'N/A'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-border-color/60 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">
                      Joined: {recp.joiningDate || 'N/A'}
                    </span>
                    
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={saveEditReceptionist} disabled={!recpEditForm.name} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer" title="Save">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingRecpId(null)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" title="Cancel">
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEditReceptionist(recp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Inline Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => openManageRecp(recp)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" title="Manage Account Details">
                          <Settings size={15} />
                        </button>
                        <button onClick={() => setDeletingRecpId(recp.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Remove Staff">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {receptionists.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl p-8 border border-border-color shadow-soft text-center text-text-gray italic">
                No staff found.
              </div>
            )}
          </div>
        )
      )}

      {/* ================= ADD NEW MODALS (Full Grid Layout) ================= */}

      {/* ADD DOCTOR MODAL */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-transparent">
              <h3 className="text-xl font-bold text-text-dark">Add New Doctor Account</h3>
              <button onClick={() => setIsDoctorModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Details */}
                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Core Profile</h4>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Doctor Name *</label>
                    <input type="text" value={newDoctorForm.name} onChange={e => setNewDoctorForm({...newDoctorForm, name: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Specialty *</label>
                    <input type="text" value={newDoctorForm.specialty} onChange={e => setNewDoctorForm({...newDoctorForm, specialty: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">New Case Fee (₹)</label>
                      <input type="number" value={newDoctorForm.newCaseFee} onChange={e => setNewDoctorForm({...newDoctorForm, newCaseFee: Number(e.target.value)})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Old Case Fee (₹)</label>
                      <input type="number" value={newDoctorForm.oldCaseFee} onChange={e => setNewDoctorForm({...newDoctorForm, oldCaseFee: Number(e.target.value)})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Consultation Days</label>
                    <input type="text" placeholder="e.g. Mon-Fri" value={newDoctorForm.consultationDays} onChange={e => setNewDoctorForm({...newDoctorForm, consultationDays: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                </div>

                {/* Professional & Auth */}
                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Professional & Account</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Registration No. (Optional)</label>
                      <input type="text" placeholder="e.g. MCI-12345" value={newDoctorForm.licenseNumber} onChange={e => setNewDoctorForm({...newDoctorForm, licenseNumber: e.target.value})} className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Experience (Yrs)</label>
                      <input type="number" value={newDoctorForm.experience} onChange={e => setNewDoctorForm({...newDoctorForm, experience: Number(e.target.value)})} className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Education</label>
                    <input type="text" placeholder="e.g. MBBS, MD" value={newDoctorForm.education} onChange={e => setNewDoctorForm({...newDoctorForm, education: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Login Email</label>
                    <input type="email" value={newDoctorForm.email} onChange={e => setNewDoctorForm({...newDoctorForm, email: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Phone</label>
                      <input type="text" value={newDoctorForm.phone} onChange={e => setNewDoctorForm({...newDoctorForm, phone: e.target.value})} className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Initial Password</label>
                      <input type="password" value={newDoctorForm.password} onChange={e => setNewDoctorForm({...newDoctorForm, password: e.target.value})} className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-border-color flex justify-end gap-3">
              <button onClick={() => setIsDoctorModalOpen(false)} className="px-4 py-2 font-bold text-text-dark bg-white border border-border-color hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addDoctor} disabled={!newDoctorForm.name || !newDoctorForm.specialty} className="px-6 py-2 font-bold text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">Create Doctor Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RECEPTIONIST MODAL */}
      {isReceptionistModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-transparent">
              <h3 className="text-xl font-bold text-text-dark">Add New Staff Account</h3>
              <button onClick={() => setIsReceptionistModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Employment Details</h4>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Staff Name *</label>
                    <input type="text" value={newReceptionistForm.name} onChange={e => setNewReceptionistForm({...newReceptionistForm, name: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Role Level</label>
                    <input type="text" placeholder="e.g. Sr. Receptionist" value={newReceptionistForm.roleLevel} onChange={e => setNewReceptionistForm({...newReceptionistForm, roleLevel: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Assigned Shift</label>
                    <select value={newReceptionistForm.shift} onChange={e => setNewReceptionistForm({...newReceptionistForm, shift: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 text-text-dark">
                      <option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</option>
                      <option value="Evening (4 PM - 12 AM)">Evening (4 PM - 12 AM)</option>
                      <option value="Night (12 AM - 8 AM)">Night (12 AM - 8 AM)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Contact & Account</h4>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Login Email</label>
                    <input type="email" value={newReceptionistForm.email} onChange={e => setNewReceptionistForm({...newReceptionistForm, email: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Phone Number</label>
                    <input type="text" value={newReceptionistForm.phone} onChange={e => setNewReceptionistForm({...newReceptionistForm, phone: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Initial Password</label>
                    <input type="password" value={newReceptionistForm.password} onChange={e => setNewReceptionistForm({...newReceptionistForm, password: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Initial Status</label>
                    <select value={newReceptionistForm.status} onChange={e => setNewReceptionistForm({...newReceptionistForm, status: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 text-text-dark">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive / Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-border-color flex justify-end gap-3">
              <button onClick={() => setIsReceptionistModalOpen(false)} className="px-4 py-2 font-bold text-text-dark bg-white border border-border-color hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={addReceptionist} disabled={!newReceptionistForm.name} className="px-6 py-2 font-bold text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">Create Staff Account</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MANAGE ACCOUNT MODALS (Deep Editing) ================= */}

      {/* MANAGE DOCTOR MODAL */}
      {manageDocId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-transparent">
              <h3 className="text-xl font-bold text-text-dark">Manage Account: {manageDocForm.name}</h3>
              <button onClick={() => setManageDocId(null)} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Same layout as add doctor basically */}
                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Core Profile</h4>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Doctor Name</label>
                    <input type="text" placeholder="e.g. Dr. Sarah Jenkins" value={manageDocForm.name} onChange={e => setManageDocForm({...manageDocForm, name: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Specialty</label>
                    <input type="text" placeholder="e.g. General Physician" value={manageDocForm.specialty} onChange={e => setManageDocForm({...manageDocForm, specialty: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">New Case Fee (₹)</label>
                      <input type="number" placeholder="e.g. 500" value={manageDocForm.newCaseFee || 0} onChange={e => setManageDocForm({...manageDocForm, newCaseFee: Number(e.target.value)})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Old Case Fee (₹)</label>
                      <input type="number" placeholder="e.g. 300" value={manageDocForm.oldCaseFee || 0} onChange={e => setManageDocForm({...manageDocForm, oldCaseFee: Number(e.target.value)})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Consultation Days</label>
                    <input type="text" placeholder="e.g. Mon-Fri" value={manageDocForm.consultationDays || ''} onChange={e => setManageDocForm({...manageDocForm, consultationDays: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Professional & Account</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Registration No.</label>
                      <input type="text" placeholder="e.g. MCI-12345" value={manageDocForm.licenseNumber || ''} onChange={e => setManageDocForm({...manageDocForm, licenseNumber: e.target.value})} className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Experience (Yrs)</label>
                      <input type="number" placeholder="e.g. 5" value={manageDocForm.experience || 0} onChange={e => setManageDocForm({...manageDocForm, experience: Number(e.target.value)})} className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Education</label>
                    <input type="text" placeholder="e.g. MBBS, MD" value={manageDocForm.education || ''} onChange={e => setManageDocForm({...manageDocForm, education: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Login Email</label>
                    <input type="email" placeholder="e.g. doctor@clinic.com" value={manageDocForm.email || ''} onChange={e => setManageDocForm({...manageDocForm, email: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Phone</label>
                    <input type="text" placeholder="e.g. +91 98765 43210" value={manageDocForm.phone || ''} onChange={e => setManageDocForm({...manageDocForm, phone: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Update Password</label>
                    <input type="password" placeholder="Leave blank to keep current" value={manageDocForm.password || ''} onChange={e => setManageDocForm({...manageDocForm, password: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-border-color flex justify-end gap-3">
              <button onClick={() => setManageDocId(null)} className="px-4 py-2 font-bold text-text-dark bg-white border border-border-color hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={saveManageDoc} disabled={!manageDocForm.name} className="px-6 py-2 font-bold text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE RECEPTIONIST MODAL */}
      {manageRecpId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-transparent">
              <h3 className="text-xl font-bold text-text-dark">Manage Staff: {manageRecpForm.name}</h3>
              <button onClick={() => setManageRecpId(null)} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Employment Details</h4>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Staff Name</label>
                    <input type="text" placeholder="e.g. Amit Kumar" value={manageRecpForm.name} onChange={e => setManageRecpForm({...manageRecpForm, name: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Role Level</label>
                    <input type="text" placeholder="e.g. Senior Staff" value={manageRecpForm.roleLevel || ''} onChange={e => setManageRecpForm({...manageRecpForm, roleLevel: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Assigned Shift</label>
                    <select value={manageRecpForm.shift} onChange={e => setManageRecpForm({...manageRecpForm, shift: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 text-text-dark">
                      <option value="Morning (8 AM - 4 PM)">Morning (8 AM - 4 PM)</option>
                      <option value="Evening (4 PM - 12 AM)">Evening (4 PM - 12 AM)</option>
                      <option value="Night (12 AM - 8 AM)">Night (12 AM - 8 AM)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Contact & Account</h4>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Login Email</label>
                    <input type="email" placeholder="e.g. staff@clinic.com" value={manageRecpForm.email || ''} onChange={e => setManageRecpForm({...manageRecpForm, email: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Phone Number</label>
                    <input type="text" placeholder="e.g. +91 98765 43210" value={manageRecpForm.phone || ''} onChange={e => setManageRecpForm({...manageRecpForm, phone: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Update Password</label>
                    <input type="password" placeholder="Leave blank to keep current" value={manageRecpForm.password || ''} onChange={e => setManageRecpForm({...manageRecpForm, password: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-dark mb-1">Account Status</label>
                    <select value={manageRecpForm.status} onChange={e => setManageRecpForm({...manageRecpForm, status: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 text-text-dark">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive / Suspended</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-border-color flex justify-end gap-3">
              <button onClick={() => setManageRecpId(null)} className="px-4 py-2 font-bold text-text-dark bg-white border border-border-color hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={saveManageRecp} disabled={!manageRecpForm.name} className="px-6 py-2 font-bold text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </div>
      )}


      {/* DELETE CONFIRMATIONS */}
      {deletingDocId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Remove Doctor?</h3>
              <p className="text-sm text-text-gray mb-6">Are you sure you want to remove <span className="font-bold">{doctors.find(d => d.id === deletingDocId)?.name}</span>? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingDocId(null)} className="flex-1 py-2.5 font-bold text-text-dark bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={deleteDoctor} className="flex-1 py-2.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingRecpId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Remove Staff?</h3>
              <p className="text-sm text-text-gray mb-6">Are you sure you want to remove <span className="font-bold">{receptionists.find(r => r.id === deletingRecpId)?.name}</span>?</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingRecpId(null)} className="flex-1 py-2.5 font-bold text-text-dark bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={deleteReceptionist} className="flex-1 py-2.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
