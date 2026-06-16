import { useState } from 'react';
import { Bell, Megaphone, Trash2, Send } from 'lucide-react';
import { globalAlerts } from '../data/mockData';

export const GlobalAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(globalAlerts);
  const [newAlert, setNewAlert] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'warning' | 'danger'>('info');

  const handlePublish = () => {
    if (!newAlert.trim()) return;
    
    const newAnnouncement = {
      id: Date.now(),
      type: alertType,
      message: newAlert
    };
    
    setAnnouncements([newAnnouncement, ...announcements]);
    setNewAlert('');
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-transparent">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-dark flex items-center gap-2">
            <Megaphone className="text-primary" /> Global Announcements
          </h1>
          <p className="text-text-gray mt-1">Broadcast urgent messages and alerts directly to the receptionist dashboard.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Create New Announcement */}
        <div className="bg-white rounded-xl border border-border-color shadow-sm overflow-hidden flex flex-col h-max">
          <div className="p-6 border-b border-border-color bg-gray-50/50">
            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
              <Bell size={20} className="text-primary" /> Create New Broadcast
            </h3>
          </div>
          
          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Message Content</label>
              <textarea 
                rows={4}
                value={newAlert}
                onChange={(e) => setNewAlert(e.target.value)}
                placeholder="E.g., Dr. Sarah is running 30 mins late..."
                className="w-full border border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 text-text-dark resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-dark mb-2">Alert Priority Level</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setAlertType('info')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                    alertType === 'info' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-border-color text-text-gray hover:bg-gray-50'
                  }`}
                >
                  General Info
                </button>
                <button
                  onClick={() => setAlertType('warning')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                    alertType === 'warning' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-border-color text-text-gray hover:bg-gray-50'
                  }`}
                >
                  Warning
                </button>
                <button
                  onClick={() => setAlertType('danger')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                    alertType === 'danger' ? 'border-red-500 bg-red-50 text-red-700' : 'border-border-color text-text-gray hover:bg-gray-50'
                  }`}
                >
                  Urgent
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50/50 border-t border-border-color mt-auto shrink-0 flex justify-end">
            <button 
              onClick={handlePublish}
              disabled={!newAlert.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Send size={18} /> Publish Broadcast
            </button>
          </div>
        </div>

        {/* Right Column: Active Announcements */}
        <div>
          <h3 className="text-lg font-bold text-text-dark mb-4">Active Broadcasts</h3>
          
          <div className="flex flex-col gap-3">
            {announcements.map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition-all ${
                alert.type === 'danger' ? 'bg-red-50/50 border-red-200' :
                alert.type === 'warning' ? 'bg-amber-50/50 border-amber-200' :
                'bg-blue-50/50 border-blue-200'
              }`}>
                <div className="flex gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-full ${
                    alert.type === 'danger' ? 'bg-red-100 text-red-600' :
                    alert.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {alert.type === 'danger' ? <Megaphone size={16} /> : <Bell size={16} />}
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      alert.type === 'danger' ? 'bg-red-100 text-red-700' :
                      alert.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.type}
                    </span>
                    <p className="text-text-dark font-medium mt-1.5">{alert.message}</p>
                    <p className="text-xs text-text-gray mt-2">Published: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(alert.id)}
                  className="p-2 text-text-light hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            
            {announcements.length === 0 && (
              <div className="bg-white border border-border-color border-dashed rounded-xl p-8 text-center">
                <Bell size={32} className="text-text-light mx-auto mb-3" />
                <p className="text-text-gray font-medium">No active broadcasts running.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
