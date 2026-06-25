import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, AlertTriangle, Check, XCircle, Settings, CheckCircle, Stethoscope } from 'lucide-react';
import { TESTS_CATALOG, doctorsData } from '../data/mockData';
import type { Doctor } from '../data/mockData';

export const PricingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [testsCatalog, setTestsCatalog] = useState(TESTS_CATALOG);
  
  // Modals State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testForm, setTestForm] = useState({ id: '', name: '', price: '' });
  
  // Inline Editing - Tests
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [editTestForm, setEditTestForm] = useState({ name: '', price: '' });
  
  // Delete Confirm State - Tests
  const [deletingTestId, setDeletingTestId] = useState<string | null>(null);

  // Doctors State for Fees
  const [doctors, setDoctors] = useState<Doctor[]>(doctorsData);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editDocForm, setEditDocForm] = useState({ newCaseFee: 0, oldCaseFee: 0 });

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });

  const filteredTests = testsCatalog.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    test.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setTestForm({ id: '', name: '', price: '' });
    setIsTestModalOpen(true);
  };

  const startEditTest = (test: {id: string, name: string, price: number}) => {
    setEditingTestId(test.id);
    setEditTestForm({ name: test.name, price: test.price.toString() });
  };

  const saveEditTest = () => {
    if (!editTestForm.name || !editTestForm.price) return;
    setTestsCatalog(testsCatalog.map(t => 
      t.id === editingTestId ? { ...t, name: editTestForm.name, price: Number(editTestForm.price) } : t
    ));
    setEditingTestId(null);
    setToastMessage({ title: 'Test Updated', desc: 'The lab test price has been successfully updated.' });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveTest = () => {
    if (!testForm.id || !testForm.name || !testForm.price) return;

    const newTest = {
      id: testForm.id.toUpperCase(),
      name: testForm.name,
      price: Number(testForm.price)
    };

    setTestsCatalog([...testsCatalog, newTest]);
    setIsTestModalOpen(false);
    setToastMessage({ title: 'Test Added', desc: 'New lab test has been added to the catalog.' });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = () => {
    if (deletingTestId) {
      setTestsCatalog(testsCatalog.filter(t => t.id !== deletingTestId));
      setDeletingTestId(null);
      setToastMessage({ title: 'Test Removed', desc: 'The lab test has been removed from the catalog.' });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Doctor Fee Actions
  const startEditDoctor = (doc: Doctor) => {
    setEditingDocId(doc.id);
    setEditDocForm({ newCaseFee: doc.newCaseFee, oldCaseFee: doc.oldCaseFee });
  };

  const saveEditDoctor = () => {
    setDoctors(doctors.map(d => 
      d.id === editingDocId 
        ? { ...d, newCaseFee: Number(editDocForm.newCaseFee), oldCaseFee: Number(editDocForm.oldCaseFee) } 
        : d
    ));
    setEditingDocId(null);
    setToastMessage({ title: 'Fees Updated Successfully', desc: 'The new consultation fees are now active.' });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
            <Settings className="text-primary" /> Pricing & Lab Catalog
          </h1>
          <p className="text-text-gray mt-1 text-base">Manage consultation fees and the comprehensive lab test catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Doctor Consultation Fees */}
        <div>
          <div className="bg-white rounded-2xl shadow-soft interactive-card flex flex-col h-[600px]">
            <div className="p-6 border-b border-border-color bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 rounded-t-2xl">
              <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <Stethoscope size={20} className="text-primary" /> Doctor Consultation Fees
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header-cell rounded-tl-xl w-1/3">Doctor Profile</th>
                    <th className="table-header-cell text-center w-28">New Case</th>
                    <th className="table-header-cell text-center w-28">Old Case</th>
                    <th className="table-header-cell text-right w-20 rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color text-sm text-text-dark">
                  {doctors.map(doc => {
                    const isEditing = editingDocId === doc.id;
                    
                    return (
                      <tr key={doc.id} className={`${isEditing ? 'bg-indigo-50/30' : 'hover:bg-hover-bg transition-colors group'}`}>
                        <td className="table-row-cell pr-2">
                          <div className="font-bold text-text-dark">{doc.name}</div>
                          <div className="text-[11px] text-text-light font-bold tracking-wider uppercase mt-0.5">{doc.specialty}</div>
                        </td>
                        
                        <td className="table-row-cell text-center font-bold text-primary">
                          {isEditing ? (
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-gray text-sm">₹</span>
                              <input 
                                type="number" 
                                value={editDocForm.newCaseFee} 
                                onChange={(e) => setEditDocForm({...editDocForm, newCaseFee: Number(e.target.value)})}
                                className="w-24 border border-border-color rounded pl-6 pr-2 py-1 text-sm bg-white"
                              />
                            </div>
                          ) : (
                            `₹${doc.newCaseFee}`
                          )}
                        </td>
                        
                        <td className="table-row-cell text-center font-bold text-text-gray">
                          {isEditing ? (
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-gray text-sm">₹</span>
                              <input 
                                type="number" 
                                value={editDocForm.oldCaseFee} 
                                onChange={(e) => setEditDocForm({...editDocForm, oldCaseFee: Number(e.target.value)})}
                                className="w-24 border border-border-color rounded pl-6 pr-2 py-1 text-sm bg-white"
                              />
                            </div>
                          ) : (
                            `₹${doc.oldCaseFee}`
                          )}
                        </td>

                        <td className="table-row-cell text-right pl-2">
                          {isEditing ? (
                            <div className="flex justify-end items-center">
                              <button onClick={saveEditDoctor} className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors mr-1">
                                <Check size={18} />
                              </button>
                              <button onClick={() => setEditingDocId(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors">
                                <XCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button onClick={() => startEditDoctor(doc)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Consultation Fees">
                                <Edit2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Lab Tests Catalog */}
        <div>
          <div className="bg-white rounded-2xl shadow-soft interactive-card flex flex-col h-[600px]">
            <div className="p-6 border-b border-border-color bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 rounded-t-2xl">
              <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
                <Settings size={20} className="text-primary" /> Lab Tests Catalog
              </h3>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
                  <input 
                    type="text" 
                    placeholder="Search tests..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button 
                  onClick={openAddModal}
                  className="flex items-center justify-center gap-1 px-3 py-2 btn-primary text-sm whitespace-nowrap"
                >
                  <Plus size={16} /> Add Test
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="table-header-cell rounded-tl-xl w-1/3">Test Name</th>
                    <th className="table-header-cell">Code</th>
                    <th className="table-header-cell w-28">Price (₹)</th>
                    <th className="table-header-cell text-right w-20 rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color text-sm text-text-dark">
                  {filteredTests.map(test => {
                    const isEditing = editingTestId === test.id;
                    
                    return (
                      <tr key={test.id} className={`${isEditing ? 'bg-blue-50/30' : 'hover:bg-hover-bg transition-colors group'}`}>
                        <td className="table-row-cell font-bold">
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={editTestForm.name} 
                              onChange={(e) => setEditTestForm({...editTestForm, name: e.target.value})}
                              className="w-full border border-border-color rounded px-2 py-1 text-sm font-bold bg-white"
                              autoFocus
                            />
                          ) : (
                            test.name
                          )}
                        </td>
                        <td className="table-row-cell text-[11px] text-text-light font-bold tracking-wider uppercase">{test.id}</td>
                        <td className="table-row-cell font-bold text-primary">
                          {isEditing ? (
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-gray text-sm">₹</span>
                              <input 
                                type="number" 
                                value={editTestForm.price} 
                                onChange={(e) => setEditTestForm({...editTestForm, price: e.target.value})}
                                className="w-24 border border-border-color rounded pl-6 pr-2 py-1 text-sm bg-white"
                              />
                            </div>
                          ) : (
                            `₹${test.price}`
                          )}
                        </td>
                        <td className="table-row-cell text-right pl-2">
                          {isEditing ? (
                            <div className="flex justify-end items-center">
                              <button onClick={saveEditTest} disabled={!editTestForm.name || !editTestForm.price} className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors mr-1">
                                <Check size={18} />
                              </button>
                              <button onClick={() => setEditingTestId(null)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md transition-colors">
                                <XCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button onClick={() => startEditTest(test)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1" title="Edit Test Price">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => setDeletingTestId(test.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove Test">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTests.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-text-gray italic">No lab tests found matching "{searchTerm}".</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border-color flex justify-between items-center bg-transparent">
              <h3 className="text-xl font-bold text-text-dark">Add New Lab Test</h3>
              <button onClick={() => setIsTestModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-md text-text-gray transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1">Test Code (ID) *</label>
                <input 
                  type="text" 
                  placeholder="e.g. CBC-01" 
                  value={testForm.id} 
                  onChange={e => setTestForm({...testForm, id: e.target.value})} 
                  className="w-full border border-border-color rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 text-text-dark uppercase" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1">Test Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Complete Blood Count" 
                  value={testForm.name} 
                  onChange={e => setTestForm({...testForm, name: e.target.value})} 
                  className="w-full border border-border-color rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 text-text-dark" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-dark mb-1">Price (₹) *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 450" 
                  value={testForm.price} 
                  onChange={e => setTestForm({...testForm, price: e.target.value})} 
                  className="w-full border border-border-color rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 text-text-dark" 
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-border-color flex justify-end gap-3">
              <button onClick={() => setIsTestModalOpen(false)} className="px-4 py-2 font-bold text-text-dark bg-white border border-border-color hover:bg-gray-50 rounded-lg">Cancel</button>
              <button 
                onClick={handleSaveTest} 
                disabled={!testForm.id || !testForm.name || !testForm.price} 
                className="px-6 py-2 font-bold text-white bg-primary hover:bg-primary-dark rounded-lg disabled:opacity-50"
              >
                Add to Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Test Confirmation */}
      {deletingTestId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-dark mb-2">Remove Test?</h3>
              <p className="text-sm text-text-gray mb-6">
                Are you sure you want to remove <span className="font-bold">{testsCatalog.find(t => t.id === deletingTestId)?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingTestId(null)} className="flex-1 py-2.5 font-bold text-text-dark bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
