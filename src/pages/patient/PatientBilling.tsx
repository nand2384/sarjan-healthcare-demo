import { useState, useRef } from 'react';
import { CreditCard, Download, Calendar, Search, Filter, Receipt } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { ReceiptPrintTemplate } from '../../components/print/ReceiptPrintTemplate';

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending';
  type: 'Consultation' | 'Pharmacy' | 'Lab Test';
  items: Array<{ description: string, quantity?: number, price: number, amount: number }>;
  cashierName: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'RCPT-8551',
    date: '19 Jun 2026',
    description: 'Consultation & Lab Tests',
    amount: 2000,
    status: 'Paid',
    type: 'Consultation',
    cashierName: 'Receptionist Admin',
    items: [
      { description: 'Consultation Fee', price: 500, amount: 500 },
      { description: 'Treadmill Test (TPT)', price: 1500, amount: 1500 }
    ]
  },
  {
    id: 'PHM-2294',
    date: '10 May 2026',
    description: 'Pharmacy Bill - Rx 1024',
    amount: 450,
    status: 'Paid',
    type: 'Pharmacy',
    cashierName: 'Pharmacist Admin',
    items: [
      { description: 'Paracetamol 500mg', quantity: 2, price: 50, amount: 100 },
      { description: 'Cetirizine 10mg', quantity: 1, price: 350, amount: 350 }
    ]
  },
  {
    id: 'RCPT-8220',
    date: '15 Feb 2026',
    description: 'Consultation',
    amount: 500,
    status: 'Paid',
    type: 'Consultation',
    cashierName: 'Receptionist Admin',
    items: [
      { description: 'Consultation Fee', price: 500, amount: 500 }
    ]
  }
];

export const PatientBilling = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt_${selectedInvoice?.id}`,
  });

  const filteredInvoices = mockInvoices.filter(inv => 
    inv.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-text-dark flex items-center gap-2">
            <CreditCard className="text-primary" /> Billing & Invoices
          </h1>
          <p className="text-text-gray mt-1 text-sm font-medium">
            View your payment history and download past receipts.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-soft border border-border-color overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar */}
        <div className="border-b border-border-color flex flex-col sm:flex-row items-center justify-between gap-4 p-4 md:px-6 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-text-gray" />
            <span className="text-sm font-bold text-text-dark">All Transactions</span>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
            <input 
              type="text" 
              placeholder="Search receipt number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-border-color rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-border-color">
                <th className="py-4 px-6 text-xs font-extrabold text-text-light uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-extrabold text-text-light uppercase tracking-wider">Invoice ID</th>
                <th className="py-4 px-6 text-xs font-extrabold text-text-light uppercase tracking-wider">Description</th>
                <th className="py-4 px-6 text-xs font-extrabold text-text-light uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-extrabold text-text-light uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-extrabold text-text-light uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="flex items-center gap-2 text-sm font-bold text-text-dark">
                      <Calendar size={14} className="text-text-gray" /> {inv.date}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-text-gray">{inv.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Receipt size={16} />
                      </div>
                      <span className="text-sm font-bold text-text-dark">{inv.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-sm font-extrabold text-text-dark">₹{inv.amount.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold ${
                      inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <button 
                      onClick={() => {
                        setSelectedInvoice(inv);
                        setTimeout(() => handlePrint(), 100);
                      }}
                      className="px-4 py-2 bg-white border border-border-color hover:bg-gray-50 text-text-dark rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2"
                    >
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Receipt size={24} className="text-text-light" />
                    </div>
                    <h3 className="text-lg font-bold text-text-dark mb-1">No Invoices Found</h3>
                    <p className="text-text-gray text-sm">You have no billing records matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Print Component */}
      <div className="hidden">
        <ReceiptPrintTemplate
          ref={receiptRef}
          data={selectedInvoice ? {
            receiptNo: selectedInvoice.id,
            date: selectedInvoice.date,
            patientName: 'John Doe',
            items: selectedInvoice.items,
            totalAmount: selectedInvoice.amount,
            paymentMethod: 'Cash',
            cashierName: selectedInvoice.cashierName,
            type: selectedInvoice.type
          } : null}
        />
      </div>

    </div>
  );
};
