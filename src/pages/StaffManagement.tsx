import { useState, useMemo } from 'react';
import { Users, Plus, Trash2, X, AlertTriangle, Check, Settings, CheckCircle, LayoutGrid, List, Search, Filter } from 'lucide-react';
import { doctorsData } from '../data/mockData';
import type { Doctor, Patient } from '../data/mockData';

// Staff Interface (Aligning with Prisma model)
interface StaffData {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  is_account_activated: boolean;
  is_disabled: boolean;
  roles: string[];
  department?: string; // Optional for non-doctors
  shift?: string;
  employeeId?: string;
  roleLevel?: string;
  joiningDate?: string;
  status?: string; // Kept temporarily for backward compatibility
  password?: string;
}

// Generate mock staff
const mockReceptionists: StaffData[] = [
  { id: 'r1', name: 'Riya Patel', username: 'riya.p', roles: ['Receptionist'], department: 'Front Desk', shift: 'Morning (8 AM - 4 PM)', status: 'active', is_account_activated: true, is_disabled: false, phone: '+91 98765 43210', email: 'riya.p@sarjan.com', employeeId: 'REC-001', roleLevel: 'Senior Receptionist', joiningDate: '2022-01-15' },
  { id: 'r2', name: 'Amit Kumar', username: 'amit.k', roles: ['Pharmacist'], department: 'Pharmacy', shift: 'Evening (4 PM - 12 AM)', status: 'active', is_account_activated: false, is_disabled: false, phone: '+91 98765 43211', email: 'amit.k@sarjan.com', employeeId: 'REC-002', roleLevel: 'Head Pharmacist', joiningDate: '2023-05-10' },
];

export const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'receptionists'>('doctors');
  const [layoutMode, setLayoutMode] = useState<'table' | 'cards'>('cards');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortFilter, setSortFilter] = useState('Recently Added');
  const [roleFilter, setRoleFilter] = useState('All');

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
  
  // Receptionists State
  const [receptionists, setReceptionists] = useState<StaffData[]>(mockReceptionists);
  const [isReceptionistModalOpen, setIsReceptionistModalOpen] = useState(false);
  const [newReceptionistForm, setNewReceptionistForm] = useState({ 
    name: '', role: 'Receptionist', department: '', shift: 'Morning (8 AM - 4 PM)', phone: '', status: 'active',
    email: '', password: '', employeeId: '', roleLevel: 'Receptionist', joiningDate: ''
  });
  const [deletingRecpId, setDeletingRecpId] = useState<string | null>(null);

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
      username: newDoctorForm.name.toLowerCase().replace(/\s+/g, '.'),
      is_account_activated: false,
      is_disabled: false,
      roles: ['Doctor'],
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
      name: '', role: 'Receptionist', department: '', shift: 'Morning (8 AM - 4 PM)', phone: '', status: 'active',
      email: '', password: '', employeeId: '', roleLevel: 'Receptionist', joiningDate: ''
    });
    setIsReceptionistModalOpen(true);
  };

  const addReceptionist = () => {
    if (!newReceptionistForm.name) return;
    const newRecp: StaffData = {
      id: `r${Date.now()}`,
      ...newReceptionistForm,
      username: newReceptionistForm.name.toLowerCase().replace(/\s+/g, '.'),
      is_account_activated: false,
      is_disabled: false,
      roles: [newReceptionistForm.role]
    };
    setReceptionists([...receptionists, newRecp]);
    setIsReceptionistModalOpen(false);
    triggerToast('Staff Added', 'New staff profile has been successfully created.');
  };

  const openManageRecp = (recp: StaffData) => {
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

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (doc.phone && doc.phone.includes(searchQuery));
      const matchesStatus = statusFilter === 'All' ? true :
                            statusFilter === 'Active' ? getDoctorStatus(doc) !== 'away' :
                            getDoctorStatus(doc) === 'away';
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortFilter === 'Name') return a.name.localeCompare(b.name);
      if (sortFilter === 'Experience') return (b.experience || 0) - (a.experience || 0);
      return 0; // Recently Added default
    });
  }, [doctors, searchQuery, statusFilter, sortFilter]);

  // Filtered Staff
  const filteredStaff = useMemo(() => {
    return receptionists.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (staff.phone && staff.phone.includes(searchQuery)) ||
                            (staff.employeeId && staff.employeeId.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'All' ? true :
                            statusFilter === 'Active' ? staff.status === 'active' :
                            staff.status === 'inactive';
      
      const roleMatch = roleFilter === 'All' ? true :
                        (roleFilter === 'Receptionists' && staff.roles?.includes('Receptionist')) || 
                        (roleFilter === 'Pharmacists' && staff.roles?.includes('Pharmacist')) ||
                        (roleFilter === 'Lab Technicians' && staff.roles?.includes('Lab Technician')) ||
                        (roleFilter === 'Accountants' && staff.roles?.includes('Accountant')) ||
                        (roleFilter === 'Nurses' && staff.roles?.includes('Nurse')) ||
                        (roleFilter === 'Admins' && staff.roles?.includes('Admin'));

      return matchesSearch && matchesStatus && roleMatch;
    }).sort((a, b) => {
      if (sortFilter === 'Name') return a.name.localeCompare(b.name);
      return 0; // Recently Added default
    });
  }, [receptionists, searchQuery, statusFilter, sortFilter, roleFilter]);

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
          <p className="text-text-gray mt-1 text-base">Manage doctors and clinic staff from one place.</p>
        </div>
        <button 
          onClick={() => activeTab === 'doctors' ? openAddDoctor() : openAddReceptionist()}
          className="flex items-center gap-2 px-5 py-2.5 btn-primary cursor-pointer"
        >
          <Plus size={18} /> {activeTab === 'doctors' ? 'Add Doctor' : 'Add Staff'}
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
              Staff
            </button>
          </div>

          {/* Right Side: Layout toggle */}
          <div className="flex bg-white rounded-lg p-1 border border-border-color shadow-sm w-max items-center">
            <button
              onClick={() => setLayoutMode('cards')}
              className={`p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
                layoutMode === 'cards' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
              }`}
              title="Cards View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setLayoutMode('table')}
              className={`p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
                layoutMode === 'table' ? 'bg-primary text-white shadow-sm' : 'text-text-gray hover:text-text-dark hover:bg-gray-100'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-border-color">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" size={18} />
            <input 
              type="text"
              placeholder="Search by name, phone or employee ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border-color rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-text-gray" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-text-dark"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <select 
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="bg-gray-50 border border-border-color rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-text-dark"
            >
              <option value="Recently Added">Recently Added</option>
              <option value="Name">Sort by Name</option>
              <option value="Experience">Sort by Experience</option>
            </select>
          </div>
        </div>

        {/* Role Chips for Staff */}
        {activeTab === 'receptionists' && (
          <div className="flex flex-wrap gap-2">
            {['All', 'Receptionists', 'Pharmacists', 'Lab Technicians', 'Accountants', 'Nurses', 'Admins'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                  roleFilter === role 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-text-gray border-border-color hover:bg-gray-50 hover:text-text-dark'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'doctors' ? (
        layoutMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-soft interactive-card overflow-hidden overflow-x-auto border-none">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th className="table-header-cell w-1/4">User Profile</th>
                  <th className="table-header-cell w-1/6">Username</th>
                  <th className="table-header-cell w-1/6">Contact</th>
                  <th className="table-header-cell w-32">Account Status</th>
                  <th className="table-header-cell w-32">Access</th>
                  <th className="table-header-cell text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color text-sm text-text-dark">
                {filteredDoctors.map(doc => {
                  return (
                    <tr key={doc.id} className="hover:bg-hover-bg transition-colors group">
                      <td className="table-row-cell font-bold">
                        <span className="text-text-dark">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shadow-sm border border-primary/5">
                              {doc.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              {doc.name}
                              {doc.roles && doc.roles.length > 0 && <div className="text-[10px] text-text-gray font-normal">{doc.roles.join(', ')}</div>}
                            </div>
                          </div>
                        </span>
                      </td>
                      <td className="table-row-cell font-medium text-text-dark">
                        @{doc.username}
                      </td>
                      <td className="table-row-cell text-xs">
                        <div className="font-medium text-text-dark">{doc.email || 'No email set'}</div>
                        <div className="text-text-light">{doc.phone || 'No phone set'}</div>
                      </td>
                      <td className="table-row-cell">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          doc.is_account_activated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.is_account_activated ? 'Activated' : 'Pending'}
                        </span>
                      </td>
                      <td className="table-row-cell">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          doc.is_disabled ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {doc.is_disabled ? 'Disabled' : 'Enabled'}
                        </span>
                      </td>
                      <td className="table-row-cell text-right">
                        <button onClick={() => openManageDoc(doc)} className="px-3 py-1.5 bg-gray-50 hover:bg-primary/10 text-primary border border-border-color rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer">
                          <Settings size={14} /> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredDoctors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-gray italic">No doctors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doc => {
              const initials = doc.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div 
                  key={doc.id}
                  className="bg-white rounded-2xl border p-5 shadow-soft interactive-card flex flex-col justify-between transition-all border-border-color"
                >
                  <div>
                    {/* Top Row: Avatar & Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-sm border border-primary/5">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-text-dark text-base">{doc.name}</h4>
                          <p className="text-xs text-text-gray mt-0.5 font-medium">@{doc.username}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-text-gray font-semibold">Status:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            doc.is_account_activated ? 'bg-green-100 text-green-700 border-green-200/50' : 
                            'bg-yellow-100 text-yellow-700 border-yellow-200/50'
                          }`}>
                            {doc.is_account_activated ? 'Activated' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-text-gray font-semibold">Access:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            doc.is_disabled ? 'bg-red-100 text-red-700 border-red-200/50' : 
                            'bg-blue-100 text-blue-700 border-blue-200/50'
                          }`}>
                            {doc.is_disabled ? 'Disabled' : 'Enabled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Details */}
                    <div className="space-y-2.5 my-4 pt-3 border-t border-border-color/60 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-gray font-semibold">Roles</span>
                        <span className="text-text-dark font-medium">{doc.roles?.join(', ') || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-gray font-semibold">Contact</span>
                        <span className="text-text-dark font-medium truncate max-w-[180px]" title={doc.email}>{doc.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-gray font-semibold">Phone</span>
                        <span className="text-text-dark font-medium">{doc.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-border-color/60 flex justify-end">
                    <button onClick={() => openManageDoc(doc)} className="px-4 py-2 bg-gray-50 hover:bg-primary/10 text-primary border border-border-color rounded-lg transition-colors text-sm font-bold flex items-center gap-2 cursor-pointer w-full justify-center">
                      <Settings size={16} /> Manage Profile
                    </button>
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
                  <th className="table-header-cell w-1/4">User Profile</th>
                  <th className="table-header-cell w-1/6">Username</th>
                  <th className="table-header-cell w-1/6">Contact</th>
                  <th className="table-header-cell w-32">Account Status</th>
                  <th className="table-header-cell w-32">Access</th>
                  <th className="table-header-cell text-right w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color text-sm text-text-dark">
                {filteredStaff.map(recp => {
                  return (
                    <tr key={recp.id} className="hover:bg-hover-bg transition-colors group">
                      <td className="table-row-cell font-bold">
                        <span className="text-text-dark">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shadow-sm border border-purple-100/50">
                              {recp.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              {recp.name}
                              {recp.roles && recp.roles.length > 0 && <div className="text-[10px] text-text-gray font-normal">{recp.roles.join(', ')}</div>}
                            </div>
                          </div>
                        </span>
                      </td>
                      <td className="table-row-cell font-medium text-text-dark">
                        @{recp.username}
                      </td>
                      <td className="table-row-cell text-xs">
                        <div className="font-medium text-text-dark">{recp.email || 'No email set'}</div>
                        <div className="text-text-light">{recp.phone || 'No phone set'}</div>
                      </td>
                      <td className="table-row-cell">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          recp.is_account_activated ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {recp.is_account_activated ? 'Activated' : 'Pending'}
                        </span>
                      </td>
                      <td className="table-row-cell">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                          recp.is_disabled ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {recp.is_disabled ? 'Disabled' : 'Enabled'}
                        </span>
                      </td>
                      <td className="table-row-cell text-right">
                        <button onClick={() => openManageRecp(recp as any)} className="px-3 py-1.5 bg-gray-50 hover:bg-purple-100 text-purple-700 border border-border-color rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ml-auto cursor-pointer">
                          <Settings size={14} /> Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-gray italic">No staff found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map(recp => {
              const initials = recp.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

              return (
                <div 
                  key={recp.id}
                  className="bg-white rounded-2xl border p-5 shadow-soft interactive-card flex flex-col justify-between transition-all border-border-color"
                >
                  <div>
                    {/* Top Row: Avatar & Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg shadow-sm border border-purple-100/50">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-text-dark text-base">{recp.name}</h4>
                          <p className="text-xs text-text-gray mt-0.5 font-medium">@{recp.username}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-text-gray font-semibold">Status:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            recp.is_account_activated ? 'bg-green-100 text-green-700 border-green-200/50' : 
                            'bg-yellow-100 text-yellow-700 border-yellow-200/50'
                          }`}>
                            {recp.is_account_activated ? 'Activated' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-text-gray font-semibold">Access:</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            recp.is_disabled ? 'bg-red-100 text-red-700 border-red-200/50' : 
                            'bg-blue-100 text-blue-700 border-blue-200/50'
                          }`}>
                            {recp.is_disabled ? 'Disabled' : 'Enabled'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Details */}
                    <div className="space-y-2.5 my-4 pt-3 border-t border-border-color/60 text-xs">
                      <div className="flex justify-between">
                        <span className="text-text-gray font-semibold">Roles</span>
                        <span className="text-text-dark font-medium">{recp.roles?.join(', ') || 'None'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-gray font-semibold">Contact</span>
                        <span className="text-text-dark font-medium truncate max-w-[180px]" title={recp.email}>{recp.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-gray font-semibold">Phone</span>
                        <span className="text-text-dark font-medium">{recp.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-border-color/60 flex justify-end">
                    <button onClick={() => openManageRecp(recp as any)} className="px-4 py-2 bg-gray-50 hover:bg-purple-100 text-purple-700 border border-border-color rounded-lg transition-colors text-sm font-bold flex items-center gap-2 cursor-pointer w-full justify-center">
                      <Settings size={16} /> Manage Profile
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredStaff.length === 0 && (
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Role</label>
                      <select value={newReceptionistForm.role} onChange={e => setNewReceptionistForm({...newReceptionistForm, role: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-primary/20 text-text-dark">
                        <option value="Receptionist">Receptionist</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="Lab Technician">Lab Technician</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-dark mb-1">Department</label>
                      <input type="text" placeholder="e.g. Front Desk" value={newReceptionistForm.department} onChange={e => setNewReceptionistForm({...newReceptionistForm, department: e.target.value})} className="w-full border border-border-color rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                    </div>
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

      {/* UNIFIED MANAGE ACCOUNT MODAL */}
      {(manageDocId || manageRecpId) && (() => {
        const isDoctor = !!manageDocId;
        const formState = isDoctor ? manageDocForm : manageRecpForm;
        const setFormState = isDoctor ? setManageDocForm : setManageRecpForm;
        const close = () => { setManageDocId(null); setManageRecpId(null); };
        const save = () => { isDoctor ? saveManageDoc() : saveManageRecp(); };
        const remove = () => { 
          if(isDoctor) { setDeletingDocId(formState.id); setManageDocId(null); }
          else { setDeletingRecpId(formState.id); setManageRecpId(null); }
        };

        const toggleDisable = () => {
          setFormState({...formState, is_disabled: !formState.is_disabled});
        };

        const availableRoles = ['Doctor', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Admin', 'Nurse'];

        const toggleRole = (role: string) => {
          const roles = formState.roles || [];
          if (roles.includes(role)) {
            setFormState({...formState, roles: roles.filter((r: string) => r !== role)});
          } else {
            setFormState({...formState, roles: [...roles, role]});
          }
        };

        return (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-transparent">
                <h3 className="text-xl font-bold text-text-dark flex items-center gap-2">
                  <Settings className="text-primary" size={24} /> 
                  Manage Profile: {formState.name}
                </h3>
                <button onClick={close} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* LEFT COLUMN - Profile Overview & Actions */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-border-color p-5 text-center shadow-sm">
                      <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl mx-auto mb-4 border border-primary/10">
                        {formState.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="font-bold text-lg text-text-dark">{formState.name}</h4>
                      <p className="text-sm text-text-gray font-medium">@{formState.username}</p>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                          formState.is_account_activated ? 'bg-green-100 text-green-700 border-green-200/50' : 'bg-yellow-100 text-yellow-700 border-yellow-200/50'
                        }`}>
                          {formState.is_account_activated ? 'Account Activated' : 'Activation Pending'}
                        </span>
                        
                        <div className="mt-4 border-t border-border-color/60 pt-4 flex flex-col gap-2">
                           <button onClick={toggleDisable} className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                              formState.is_disabled ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                           }`}>
                             {formState.is_disabled ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                             {formState.is_disabled ? 'Enable Account' : 'Disable Account'}
                           </button>
                           
                           <button onClick={remove} className="w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
                             <Trash2 size={16} /> Delete Account
                           </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-border-color p-5 shadow-sm">
                       <h4 className="font-bold text-text-dark mb-4 border-b border-border-color pb-2">Assigned Roles</h4>
                       <div className="space-y-3">
                         {availableRoles.map(role => {
                           const isChecked = formState.roles?.includes(role);
                           return (
                             <label key={role} className="flex items-center gap-3 cursor-pointer group">
                               <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-primary border-primary' : 'border-gray-300 group-hover:border-primary'}`}>
                                 {isChecked && <Check size={14} className="text-white" />}
                               </div>
                               <span className="text-sm font-medium text-text-dark">{role}</span>
                               <input type="checkbox" className="hidden" checked={isChecked || false} onChange={() => toggleRole(role)} />
                             </label>
                           );
                         })}
                       </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN - Editable Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-border-color p-6 shadow-sm space-y-6">
                       <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Personal Information</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Full Name</label>
                            <input type="text" value={formState.name || ''} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Username</label>
                            <input type="text" value={formState.username || ''} onChange={e => setFormState({...formState, username: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Email Address</label>
                            <input type="email" value={formState.email || ''} onChange={e => setFormState({...formState, email: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Mobile Number</label>
                            <input type="text" value={formState.phone || ''} onChange={e => setFormState({...formState, phone: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                       </div>
                    </div>
                    
                    {isDoctor && (
                    <div className="bg-white rounded-xl border border-border-color p-6 shadow-sm space-y-6">
                       <h4 className="font-bold text-text-dark border-b border-border-color pb-2">Doctor Profile</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Specialization</label>
                            <input type="text" value={formState.specialty || ''} onChange={e => setFormState({...formState, specialty: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Registration Number</label>
                            <input type="text" value={formState.licenseNumber || ''} onChange={e => setFormState({...formState, licenseNumber: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Experience (Years)</label>
                            <input type="number" value={formState.experience || 0} onChange={e => setFormState({...formState, experience: Number(e.target.value)})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-text-dark mb-1.5">Education</label>
                            <input type="text" value={formState.education || ''} onChange={e => setFormState({...formState, education: e.target.value})} className="w-full border border-border-color rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-text-dark" />
                          </div>
                       </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-white border-t border-border-color flex justify-end gap-3 shrink-0">
                <button onClick={close} className="px-5 py-2.5 font-bold text-text-dark bg-white border border-border-color hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">Cancel</button>
                <button onClick={save} disabled={!formState.name} className="px-6 py-2.5 font-bold text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                   <Check size={18} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      })()}


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
