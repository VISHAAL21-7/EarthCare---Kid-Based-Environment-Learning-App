import React from 'react';
import { AppState, EarthState, View } from '../../types';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface DevAdminDashboardProps {
  state: AppState;
  onApprovePhoto: () => void;
  onSetEarthState: (state: EarthState) => void;
  onResetShields: () => void;
  onResetPhotos: () => void;
  onAwardBadge: () => void;
  onClearData: () => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const DevAdminDashboard: React.FC<DevAdminDashboardProps> = ({
  state,
  onApprovePhoto,
  onSetEarthState,
  onResetShields,
  onResetPhotos,
  onAwardBadge,
  onClearData,
  setView
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full text-left">
        <h2 className="text-2xl font-bold mb-4 text-center">🔧 Developer Admin Panel</h2>
        
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
          <h3 className="font-bold mb-2">CURRENT KID STATUS:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Name: {state.kidName}</li>
            <li>Earth State: {state.earthState}</li>
            <li>Shields Left: {state.shieldsRemaining}/2</li>
            <li>Approved Photos: {state.approvedPhotos}/5</li>
            <li>Badges Earned: {state.badgeCount}</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mb-4">
          <h3 className="font-bold mb-2">PHOTO REVIEW:</h3>
          <p className="text-sm mb-2">Check Google Sheet manually, then if valid, click below.</p>
          <Button onClick={onApprovePhoto} variant="secondary">✅ Approve Photo +1</Button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          <h3 className="font-bold mb-2">DEMO/TEST TOOLS:</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => onSetEarthState("Healthy")} variant="ghost">Set: Healthy</Button>
            <Button onClick={() => onSetEarthState("Damaged")} variant="ghost">Set: Damaged</Button>
            <Button onClick={() => onSetEarthState("Critical")} variant="ghost">Set: Critical</Button>
            <Button onClick={onResetShields} variant="warning">Reset Shields</Button>
            <Button onClick={onResetPhotos} variant="warning">Reset Photos</Button>
            <Button onClick={onAwardBadge} variant="primary">Award Badge</Button>
            <Button onClick={onClearData} variant="danger" className="col-span-2">🗑️ Clear All Data</Button>
          </div>
        </div>

        <button onClick={() => setView('kid-home')} className="mt-6 text-gray-600 dark:text-gray-400 hover:underline block mx-auto">
          ← Exit Dev Mode
        </button>
      </Card>
    </div>
  );
};

export default DevAdminDashboard;
