import React from 'react';
import { Landmark, ArrowLeft } from 'lucide-react';

const ComingSoon = ({ tabName, onGoBack }) => {
  return (
    <div className="coming-soon-container">
      <div className="icon-button mb-6 mx-auto w-16 h-16 bg-blue-50 text-blue-500 border-blue-100">
        <Landmark size={32} />
      </div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">{tabName} Module</h1>
      <p className="text-sm text-gray-400 max-w-sm mb-8">
        This screen is ready to bind to database endpoints. In this Hackathon prototype, all operational controls (Registration, Dispatch, Complete, Maintenance Shop entry, and CSV Exports) are fully functional directly on the primary Dashboard.
      </p>
      <button onClick={onGoBack} className="role-trigger justify-center gap-2 mx-auto py-3 px-6">
        <ArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};

export default ComingSoon;
