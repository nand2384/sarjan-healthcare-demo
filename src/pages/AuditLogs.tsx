import { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter,
  Download,
  Activity,
  User,
  Settings,
  PlusCircle,
  Edit2,
  Trash2,
  LogIn
} from 'lucide-react';
import { auditLogsData } from '../data/mockData';

export const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [actionFilter, setActionFilter] = useState('All Actions');

  // Filter logs based on search and dropdowns
  const filteredLogs = auditLogsData.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || log.role === roleFilter;
    const matchesAction = actionFilter === 'All Actions' || log.action === actionFilter;
    return matchesSearch && matchesRole && matchesAction;
  });

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'CREATE': return <PlusCircle size={14} />;
      case 'UPDATE': return <Edit2 size={14} />;
      case 'DELETE': return <Trash2 size={14} />;
      case 'LOGIN': return <LogIn size={14} />;
      case 'SYSTEM': return <Settings size={14} />;
      default: return <Activity size={14} />;
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch(action) {
      case 'CREATE': return 'badge-success';
      case 'UPDATE': return 'badge-warning';
      case 'DELETE': return 'badge-danger';
      case 'LOGIN': return 'badge-neutral';
      case 'SYSTEM': return 'bg-purple-50 text-purple-700 border-purple-100/50';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent relative">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <ShieldAlert className="text-primary" /> System Audit Logs
          </h1>
          <p className="text-text-gray mt-1 text-base">
            Immutable chronological record of system events and security activities.
          </p>
        </div>
        
        <button className="btn-primary px-4 py-2 flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft interactive-card flex flex-col h-[calc(100vh-200px)] border-none">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-border-color bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 rounded-t-2xl">
          <div className="relative flex-1 sm:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
            <input 
              type="text" 
              placeholder="Search user, action, or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium !pl-10 py-2 text-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-premium !pl-9 py-2 pr-8 text-sm cursor-pointer appearance-none"
              >
                <option value="All Roles">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Doctor">Doctor</option>
                <option value="System">System</option>
              </select>
            </div>
            
            <div className="relative">
              <Activity size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-gray" />
              <select 
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="input-premium !pl-9 py-2 pr-8 text-sm cursor-pointer appearance-none"
              >
                <option value="All Actions">All Actions</option>
                <option value="CREATE">Creates</option>
                <option value="UPDATE">Updates</option>
                <option value="DELETE">Deletions</option>
                <option value="LOGIN">Logins</option>
                <option value="SYSTEM">System Events</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr>
                <th className="table-header-cell rounded-tl-xl w-48">Timestamp</th>
                <th className="table-header-cell w-56">User & Role</th>
                <th className="table-header-cell w-36">Action</th>
                <th className="table-header-cell">Details</th>
                <th className="table-header-cell text-right rounded-tr-xl">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color text-sm text-text-dark">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const date = new Date(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="table-row-cell whitespace-nowrap">
                        <div className="font-semibold text-text-dark">
                          {date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-[11px] text-text-light font-bold tracking-widest mt-0.5">
                          {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>
                      <td className="table-row-cell">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            log.role === 'System' ? 'bg-purple-100 text-purple-700' : 'bg-primary/10 text-primary'
                          }`}>
                            {log.role === 'System' ? <Settings size={14} /> : <User size={14} />}
                          </div>
                          <div>
                            <div className="font-bold text-text-dark">{log.user}</div>
                            <div className="text-[11px] text-text-light font-bold tracking-wider uppercase mt-0.5">{log.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-row-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getActionBadgeClass(log.action)}`}>
                          {getActionIcon(log.action)} {log.action}
                        </span>
                      </td>
                      <td className="table-row-cell">
                        <div className="text-text-dark">{log.description}</div>
                        <div className="text-[11px] text-text-light mt-0.5"><span className="font-semibold">Module:</span> {log.module}</div>
                      </td>
                      <td className="table-row-cell text-right">
                        <span className="font-mono text-xs text-text-gray bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          {log.ipAddress || 'Internal'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-gray">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <ShieldAlert size={48} className="text-gray-300" />
                      <p className="font-medium text-lg">No logs found</p>
                      <p className="text-sm">Try adjusting your filters or search query.</p>
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
