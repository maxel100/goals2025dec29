import React from 'react';
import { ListChecks } from 'lucide-react';

export function NotesAppMockup() {
  return (
    <div className="bg-[#FFFFE0] rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Notes App Header */}
      <div className="bg-[#F4F4D0] border-b border-gray-200 p-3 flex items-center gap-2">
        <ListChecks className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">Notes</span>
      </div>

      {/* Notes Content */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">2024 Goals:</div>
          <div className="pl-4 space-y-1 text-gray-600 text-sm">
            <div>- save $50k</div>
            <div>- monthly massage</div>
            <div className="text-gray-400">- meditate daily (gave up)</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">Progress:</div>
          <div className="pl-4 space-y-1 text-gray-600 text-sm">
            <div>- saved $35k so far</div>
            <div>- got massage in Jan, Feb, Mar</div>
          </div>
        </div>

        {/* Faded bottom to imply more content */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FFFFE0] to-transparent" />
      </div>
    </div>
  );
}