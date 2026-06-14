import React from 'react';
import { globalActionQueue } from '../../data/mockData';
import { UserPlus, CreditCard, FileWarning, Clock } from 'lucide-react';

export const GlobalActionQueue = React.memo(function GlobalActionQueue() {
  return (
    <div className="bg-white rounded-xl border border-border-color shadow-sm h-[calc(100vh-250px)] overflow-hidden flex flex-col">
      <div className="bg-bg-base border-b border-border-color px-6 py-4">
        <h3 className="text-lg font-semibold text-text-dark">Global Action Queue</h3>
        <p className="text-sm text-text-gray">Pending tasks & unassigned patients</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {globalActionQueue.length > 0 ? (
          globalActionQueue.map(action => (
            <div key={action.id} className="border border-border-color rounded-lg p-4 hover:border-primary transition-colors bg-white">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-text-dark text-sm">{action.patientName}</h4>
                <span className="text-xs text-text-gray">{action.timeAdded}</span>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  {action.actionType === 'triage' && (
                    <span className="flex items-center gap-1 text-xs font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      <UserPlus size={12} /> Needs Triage
                    </span>
                  )}
                  {action.actionType === 'payment' && (
                    <span className="flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded">
                      <CreditCard size={12} /> Pending Payment
                    </span>
                  )}
                  {action.actionType === 'forms' && (
                    <span className="flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                      <FileWarning size={12} /> Missing Forms
                    </span>
                  )}
                </div>

                {action.waitTime && (
                  <span className={`flex items-center gap-1 text-xs font-medium ${action.waitTime > 10 ? 'text-red-600' : 'text-amber-600'}`}>
                    <Clock size={12} /> {action.waitTime}m
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-light text-sm italic">
            No pending actions
          </div>
        )}
      </div>
    </div>
  );
});
