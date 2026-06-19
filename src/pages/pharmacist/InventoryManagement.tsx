import { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, AlertTriangle, PackageSearch, ArrowUpDown } from 'lucide-react';

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  price: number;
}

const mockInventory: MedicineItem[] = [
  { id: 'MED-001', name: 'Amoxicillin 500mg', category: 'Antibiotics', stock: 15, unit: 'Strips', reorderLevel: 20, expiryDate: '2027-05-12', price: 120 },
  { id: 'MED-002', name: 'Paracetamol 650mg', category: 'Analgesics', stock: 145, unit: 'Strips', reorderLevel: 50, expiryDate: '2028-01-20', price: 45 },
  { id: 'MED-003', name: 'Atorvastatin 10mg', category: 'Statins', stock: 32, unit: 'Strips', reorderLevel: 15, expiryDate: '2026-11-05', price: 210 },
  { id: 'MED-004', name: 'Metoprolol 25mg', category: 'Beta Blockers', stock: 5, unit: 'Strips', reorderLevel: 10, expiryDate: '2026-08-14', price: 180 },
  { id: 'MED-005', name: 'Omeprazole 20mg', category: 'Antacids', stock: 89, unit: 'Strips', reorderLevel: 30, expiryDate: '2027-09-30', price: 95 },
  { id: 'MED-006', name: 'Cetirizine 10mg', category: 'Antihistamines', stock: 210, unit: 'Strips', reorderLevel: 40, expiryDate: '2028-03-15', price: 35 },
  { id: 'MED-007', name: 'Azithromycin 500mg', category: 'Antibiotics', stock: 45, unit: 'Strips', reorderLevel: 20, expiryDate: '2027-02-28', price: 150 },
];

export const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Antibiotics', 'Analgesics', 'Statins', 'Beta Blockers', 'Antacids', 'Antihistamines'];

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number, reorder: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-600 border-red-200' };
    if (stock <= reorder) return { label: 'Low Stock', color: 'bg-orange-50 text-orange-600 border-orange-200' };
    return { label: 'In Stock', color: 'bg-green-50 text-green-700 border-green-200' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <PackageSearch className="text-primary" /> Inventory Management
          </h2>
          <p className="text-text-gray mt-1">Track and manage your pharmacy medicines and supplies.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus size={18} /> Add Medicine
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-color flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-border-color rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-white border border-border-color rounded-xl px-3 py-2 w-full sm:w-auto">
              <Filter size={16} className="text-text-gray" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent text-sm font-medium text-text-dark focus:outline-none w-full cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-border-color text-xs font-bold text-text-light uppercase tracking-wider">
                <th className="py-4 px-6">ID & Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-text-dark transition-colors">
                    Stock Level <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const status = getStockStatus(item.stock, item.reorderLevel);
                  return (
                    <tr key={item.id} className="border-b border-border-color/50 hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-text-dark">{item.name}</span>
                          <span className="text-xs font-medium text-text-gray">{item.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-gray-100 text-text-gray text-xs font-bold rounded-lg border border-gray-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-dark">{item.stock}</span>
                          <span className="text-xs text-text-gray">{item.unit}</span>
                          {item.stock <= item.reorderLevel && (
                            <AlertTriangle size={14} className="text-orange-500" />
                          )}
                        </div>
                        <div className="text-[10px] text-text-light mt-0.5">Min: {item.reorderLevel}</div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-text-dark">
                        ₹{item.price}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-text-gray">
                        {item.expiryDate}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-2 text-text-gray hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-gray">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PackageSearch size={32} className="text-border-color" />
                      <p>No medicines found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
