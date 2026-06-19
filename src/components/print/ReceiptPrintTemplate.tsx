import { forwardRef } from 'react';

export interface ReceiptItem {
  description: string;
  quantity?: number;
  price?: number;
  amount: number;
}

export interface ReceiptData {
  receiptNo: string;
  date: string;
  patientName: string;
  items: ReceiptItem[];
  totalAmount: number;
  paymentMethod: string;
  cashierName: string;
  type: 'Consultation' | 'Pharmacy' | 'Lab Test';
}

interface Props {
  data: ReceiptData | null;
}

export const ReceiptPrintTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  if (!data) return null;

  return (
    <div ref={ref} className="bg-white p-8 max-w-3xl mx-auto text-black font-sans print:max-w-none print:w-full print:p-10 print:m-0">
      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}
      </style>
      
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest mb-1">Sarjan Healthcare</h1>
        <p className="text-sm text-gray-600">123 Health Avenue, Medical District, City - 400001</p>
        <p className="text-sm text-gray-600">Phone: +91 98765 43210 | Email: contact@sarjanhealth.com</p>
        <h2 className="text-xl font-bold mt-4 uppercase tracking-widest bg-gray-100 py-2">{data.type} Receipt</h2>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
        <div>
          <p><span className="font-bold text-gray-500 w-24 inline-block">Receipt No:</span> <span className="font-bold">{data.receiptNo}</span></p>
          <p><span className="font-bold text-gray-500 w-24 inline-block">Date & Time:</span> {data.date}</p>
        </div>
        <div>
          <p><span className="font-bold text-gray-500 w-24 inline-block">Patient Name:</span> <span className="font-bold">{data.patientName}</span></p>
          <p><span className="font-bold text-gray-500 w-24 inline-block">Cashier:</span> {data.cashierName}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-800 text-left text-sm uppercase tracking-wider">
            <th className="py-3 px-2">Description</th>
            {data.items.some(i => i.quantity) && <th className="py-3 px-2 text-center">Qty</th>}
            {data.items.some(i => i.price) && <th className="py-3 px-2 text-right">Price</th>}
            <th className="py-3 px-2 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 px-2 font-medium">{item.description}</td>
              {data.items.some(i => i.quantity) && (
                <td className="py-4 px-2 text-center">{item.quantity || '-'}</td>
              )}
              {data.items.some(i => i.price) && (
                <td className="py-4 px-2 text-right">{item.price ? `₹${item.price.toFixed(2)}` : '-'}</td>
              )}
              <td className="py-4 px-2 text-right font-bold">₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="flex justify-end mb-12">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
            <span className="font-bold text-gray-500">Subtotal</span>
            <span>₹{data.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 border-b-2 border-gray-800 text-lg font-bold">
            <span>Total Paid</span>
            <span>₹{data.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-xs text-gray-500">
            <span className="font-bold uppercase tracking-wider">Payment Mode:</span>
            <span className="uppercase">{data.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-gray-200 pt-8">
        <p className="text-sm font-bold text-gray-800 mb-1">Thank you for trusting Sarjan Healthcare.</p>
        <p className="text-xs text-gray-500">This is a computer-generated receipt and does not require a physical signature.</p>
      </div>
    </div>
  );
});

ReceiptPrintTemplate.displayName = 'ReceiptPrintTemplate';
