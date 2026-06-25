import { useState } from 'react';
import { Search, Clock, User, Stethoscope, CheckCircle2, Pill, Printer, ClipboardList, History } from 'lucide-react';
import { pharmacyQueue, type PrescriptionOrder } from '../data/mockData';
import { Panel, Group } from 'react-resizable-panels';
import { ResizeHandle } from '../components/common/ResizeHandle';

export const PrescriptionsQueue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PrescriptionOrder | null>(null);
  const [queue, setQueue] = useState<PrescriptionOrder[]>(pharmacyQueue);

  const pendingOrders = queue.filter(q => q.status === 'pending');
  const filteredOrders = pendingOrders.filter(order => 
    order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDispense = (id: string) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'dispensed' } : q));
    if (selectedOrder?.id === id) {
      setSelectedOrder(null);
    }
    alert('Medicines marked as dispensed successfully!');
  };

  return (
    <div className="p-6 md:p-8 h-[calc(100vh-76px)]">
      <Group orientation="horizontal" className="h-full w-full bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden flex">
      {/* Left Column: Queue Cards */}
      <Panel defaultSize={320} minSize={260} maxSize={500} className="flex flex-col bg-white">
        <div className="p-4 border-b border-border-color shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-text-dark">Queue</h2>
              <p className="text-xs text-text-gray mt-0.5">Pending: {pendingOrders.length}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-border-color rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-text-gray bg-gray-50 rounded-xl border border-dashed border-border-color mx-2">
              No pending orders.
            </div>
          ) : (
            filteredOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedOrder?.id === order.id 
                    ? 'border-primary bg-primary/5 shadow-soft ring-1 ring-primary/20' 
                    : 'border-border-color/50 bg-gray-50/50 hover:border-primary/30 hover:bg-white hover:shadow-soft'
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Wait
                    </div>
                    <span className="text-[10px] font-bold text-text-gray">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-1 text-text-gray text-xs font-medium">
                    <Clock size={10} /> {order.time}
                  </div>
                </div>
                
                <h3 className="font-bold text-text-dark text-sm mb-0.5 truncate">
                  {order.patientName}
                </h3>
                
                <p className="text-xs text-text-gray flex items-center gap-1.5 truncate">
                  <Stethoscope size={12} /> {order.doctorName}
                </p>
              </div>
            ))
          )}
        </div>
      </Panel>

      <ResizeHandle className="hidden md:flex" />

      {/* Right Column: Prescription Details */}
      <Panel className="flex flex-col bg-gray-50/30">
        {selectedOrder ? (
          <div className="p-6 md:p-8 h-full flex flex-col overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
              <div>
                <h2 className="text-2xl font-bold text-text-dark flex items-center gap-2">
                  Prescription Details
                </h2>
                <p className="text-text-gray mt-1 flex items-center gap-2 font-medium">
                  Rx ID: <span className="text-text-dark font-bold">{selectedOrder.id}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-border-color bg-white text-text-dark rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                  <Printer size={16} /> Print
                </button>
                <button 
                  onClick={() => handleDispense(selectedOrder.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shadow-soft hover:shadow-lg"
                >
                  <CheckCircle2 size={16} /> Mark as Dispensed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 shrink-0">
              <div className="bg-white p-5 rounded-2xl shadow-soft interactive-card border-none">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Patient Info</p>
                <p className="font-bold text-text-dark text-lg flex items-center gap-2">
                  <User size={16} className="text-primary" /> {selectedOrder.patientName}
                </p>
                <p className="text-xs text-text-gray mt-1.5 font-medium">Patient ID: {selectedOrder.patientId}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-soft interactive-card border-none">
                <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">Doctor Info</p>
                <p className="font-bold text-text-dark text-lg flex items-center gap-2">
                  <Stethoscope size={16} className="text-primary" /> {selectedOrder.doctorName}
                </p>
                <p className="text-xs text-text-gray mt-1.5 font-medium">Date: {selectedOrder.date} at {selectedOrder.time}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft interactive-card border-none flex flex-col overflow-hidden mb-6 shrink-0">
              <div className="bg-gray-50/50 border-b border-border-color p-4 flex items-center gap-2 shrink-0">
                <Pill size={16} className="text-primary" />
                <h3 className="font-bold text-text-dark">Current Prescribed Medicines ({selectedOrder.medicines.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-border-color text-[10px] font-bold text-text-gray uppercase tracking-wider">
                      <th className="py-3 px-4">Medicine & Dosage</th>
                      <th className="py-3 px-4">Frequency</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.medicines.map((med, index) => (
                      <tr key={index} className="border-b border-border-color/50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-text-dark text-sm">
                          {med.name} <span className="text-text-gray font-medium text-xs ml-1">{med.dosage}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 text-xs font-bold tracking-wide">
                            {med.frequency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-gray font-medium text-sm">{med.duration}</td>
                        <td className="py-3 px-4 text-text-gray text-xs">{med.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Past Prescriptions */}
            {selectedOrder.pastPrescriptions && selectedOrder.pastPrescriptions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft interactive-card border-none flex flex-col overflow-hidden shrink-0">
                <div className="bg-gray-50/50 border-b border-border-color p-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <History size={16} className="text-primary" />
                    <h3 className="font-bold text-text-dark">Past Prescriptions History</h3>
                  </div>
                  <span className="text-xs font-bold text-text-gray bg-gray-200 px-2 py-0.5 rounded-full">
                    {selectedOrder.pastPrescriptions.length} Records
                  </span>
                </div>
                
                <div className="flex flex-col">
                  {selectedOrder.pastPrescriptions.map((pastRx, idx) => (
                    <div key={pastRx.id} className={`p-4 ${idx !== selectedOrder.pastPrescriptions!.length - 1 ? 'border-b border-border-color' : ''}`}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-text-dark text-sm">{pastRx.date}</span>
                          <span className="text-xs font-medium text-text-gray bg-gray-100 px-2 py-0.5 rounded-md">ID: {pastRx.id}</span>
                        </div>
                        <span className="text-xs text-text-gray flex items-center gap-1"><Stethoscope size={12}/> {pastRx.doctorName}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {pastRx.medicines.map((med, mIdx) => (
                          <div key={mIdx} className="bg-gray-50 border border-border-color/50 rounded-lg p-2.5 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-sm text-text-dark">
                                {med.name} <span className="text-text-gray font-medium text-xs ml-1">{med.dosage}</span>
                              </p>
                              <p className="text-xs text-text-gray mt-0.5">{med.instructions}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-text-gray mt-0.5 uppercase tracking-wider font-bold bg-white px-2 py-0.5 rounded border border-border-color">
                                {med.frequency} • {med.duration}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary shrink-0">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-2">No Prescription Selected</h3>
            <p className="text-text-gray text-sm max-w-sm">
              Select a patient from the queue on the left to view their prescription details and dispense medicines.
            </p>
          </div>
        )}
      </Panel>
      </Group>
    </div>
  );
};
