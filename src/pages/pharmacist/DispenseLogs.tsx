import { useState, useRef, useEffect } from 'react';
import { Search, Filter, Download, Pill, Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { ReceiptPrintTemplate } from '../../components/print/ReceiptPrintTemplate';

interface DispenseLog {
  id: string;
  date: string;
  time: string;
  rxId: string;
  patientName: string;
  doctorName: string;
  items: Array<{ name: string, qty: number }>;
  totalAmount: number;
  status: string;
}

const mockLogs: DispenseLog[] = [
  { id: 'LOG-1001', date: '2026-06-19', time: '10:45 AM', rxId: 'RX-1001', patientName: 'Alice Smith', doctorName: 'Dr. John Doe', items: [{ name: 'Amoxicillin 500mg', qty: 2 }], totalAmount: 240, status: 'Completed' },
  { id: 'LOG-1002', date: '2026-06-19', time: '10:30 AM', rxId: 'RX-0998', patientName: 'Mark Johnson', doctorName: 'Dr. Sarah Smith', items: [{ name: 'Paracetamol 650mg', qty: 1 }], totalAmount: 45, status: 'Completed' },
  { id: 'LOG-1003', date: '2026-06-19', time: '10:15 AM', rxId: 'RX-0997', patientName: 'Sarah Connor', doctorName: 'Dr. John Doe', items: [{ name: 'Atorvastatin 10mg', qty: 2 }, { name: 'Metoprolol 25mg', qty: 1 }], totalAmount: 600, status: 'Completed' },
  { id: 'LOG-1004', date: '2026-06-19', time: '09:50 AM', rxId: 'RX-0995', patientName: 'James Bond', doctorName: 'Dr. Emily Chen', items: [{ name: 'Omeprazole 20mg', qty: 3 }], totalAmount: 285, status: 'Completed' },
  { id: 'LOG-1005', date: '2026-06-18', time: '04:20 PM', rxId: 'RX-0990', patientName: 'Michael Scott', doctorName: 'Dr. Sarah Smith', items: [{ name: 'Cetirizine 10mg', qty: 1 }], totalAmount: 35, status: 'Completed' },
  { id: 'LOG-1006', date: '2026-06-18', time: '02:15 PM', rxId: 'RX-0985', patientName: 'Pam Beesly', doctorName: 'Dr. Emily Chen', items: [{ name: 'Azithromycin 500mg', qty: 1 }], totalAmount: 150, status: 'Cancelled' },
];

export const DispenseLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('Today');
  const [selectedLogForPrint, setSelectedLogForPrint] = useState<DispenseLog | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Dispense_Receipt_${selectedLogForPrint?.id}`,
    onAfterPrint: () => setSelectedLogForPrint(null)
  });

  // Trigger print once state is set and ref is updated
  useEffect(() => {
    if (selectedLogForPrint && receiptRef.current) {
      handlePrint();
    }
  }, [selectedLogForPrint, handlePrint]);

  const filteredLogs = mockLogs.filter(log => {
    const searchMatch = log.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        log.rxId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simple mock logic for date filtering
    let dateMatch = true;
    if (dateFilter === 'Today') {
      dateMatch = log.date === '2026-06-19';
    } else if (dateFilter === 'Yesterday') {
      dateMatch = log.date === '2026-06-18';
    }
    
    return searchMatch && dateMatch;
  });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <Pill className="text-primary" /> Dispense Logs
          </h2>
          <p className="text-text-gray mt-1">Review all completed and cancelled dispensations.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-border-color text-text-dark px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft interactive-card overflow-hidden border-none">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-color flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={18} />
            <input 
              type="text" 
              placeholder="Search Rx ID or Patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-border-color rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white border border-border-color rounded-xl px-3 py-2 w-full sm:w-auto">
              <CalendarIcon size={16} className="text-text-gray" />
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-sm font-medium text-text-dark focus:outline-none w-full cursor-pointer"
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
            <button className="p-2 bg-white border border-border-color rounded-xl text-text-gray hover:text-primary transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-border-color text-xs font-bold text-text-gray uppercase tracking-wider">
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Prescription</th>
                <th className="py-4 px-6">Items Dispensed</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border-color/50 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-dark">{log.date}</span>
                        <span className="text-xs font-medium text-text-gray">{log.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary">{log.rxId}</span>
                        <span className="text-xs font-medium text-text-dark">{log.patientName}</span>
                        <span className="text-[10px] text-text-light">By {log.doctorName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        {log.items.map((item, i) => (
                          <div key={i} className="text-xs font-medium text-text-gray">
                            {item.qty}x <span className="text-text-dark">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-text-dark">
                      ₹{log.totalAmount}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border ${
                        log.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => setSelectedLogForPrint(log)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex items-center gap-1 text-xs font-bold"
                      >
                        <FileText size={16} /> Print
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-gray">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Pill size={32} className="text-border-color" />
                      <p>No dispense logs found for the selected criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Print Component */}
      {selectedLogForPrint && (
        <div className="hidden">
          <ReceiptPrintTemplate
            ref={receiptRef}
            data={{
              receiptNo: selectedLogForPrint.id,
              date: `${selectedLogForPrint.date} ${selectedLogForPrint.time}`,
              patientName: selectedLogForPrint.patientName,
              cashierName: 'Pharmacist',
              type: 'Pharmacy',
              paymentMethod: 'Cash',
              totalAmount: selectedLogForPrint.totalAmount,
              items: selectedLogForPrint.items.map(item => ({
                description: item.name,
                quantity: item.qty,
                amount: item.qty * (selectedLogForPrint.totalAmount / selectedLogForPrint.items.reduce((acc, i) => acc + i.qty, 0)) // Mocked price calculation
              }))
            }}
          />
        </div>
      )}
    </div>
  );
};
