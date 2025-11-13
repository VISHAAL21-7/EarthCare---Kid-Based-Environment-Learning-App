
import React, { useState } from 'react';
import { View } from '../../types';
import { DEV_PASSCODE } from '../../constants';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface DevUnlockScreenProps {
  onUnlock: () => void;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const DevUnlockScreen: React.FC<DevUnlockScreenProps> = ({ onUnlock, setView }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === DEV_PASSCODE) {
      onUnlock();
    } else {
      setError('Invalid passcode');
      setPasscode('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card>
        <h2 className="text-2xl font-bold mb-4">🔒 Dev Mode Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="passcode" className="block text-lg">Enter Passcode:</label>
          <input
            id="passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-3 py-2 text-gray-800 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit">Unlock</Button>
        </form>
        <button onClick={() => setView('kid-home')} className="mt-6 text-gray-600 dark:text-gray-400 hover:underline">
          ← Back to Kid Mode
        </button>
      </Card>
    </div>
  );
};

export default DevUnlockScreen;
