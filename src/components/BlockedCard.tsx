import React from 'react';
import { Location } from '../types';

interface BlockedCardProps {
  blockedLocation: Location;
  selectedAlternative?: Location;
  onShowAlternatives: () => void;
}

const BlockedCard: React.FC<BlockedCardProps> = ({
  blockedLocation,
  selectedAlternative,
  onShowAlternatives
}) => {
  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Drive to {blockedLocation.name}
            </h3>
            <p className="text-sm text-gray-500">Location currently blocked</p>
          </div>
        </div>
        <span className="status-badge status-blocked">Blocked</span>
      </div>
      
      {selectedAlternative ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-900 mb-2">Selected Alternative</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium text-blue-900">{selectedAlternative.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Revenue Impact:</span>
              <span className="ml-2 font-medium text-green-600">{selectedAlternative.revenueImpact}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 status-badge status-active">Active</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">
            This location is currently blocked due to construction. Please select an alternative location to continue operations.
          </p>
        </div>
      )}
      
      <button
        onClick={onShowAlternatives}
        className="btn-danger w-full"
        aria-label="View alternative locations"
      >
        {selectedAlternative ? 'Change Location' : 'See Alternatives'}
      </button>
    </div>
  );
};

export default BlockedCard;
