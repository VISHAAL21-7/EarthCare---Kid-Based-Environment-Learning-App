import React from 'react';
import { AppState, View } from '../../types';
import { GOOGLE_FORM_URL } from '../../constants';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface UploadPhotoScreenProps {
  state: AppState;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

const UploadPhotoScreen: React.FC<UploadPhotoScreenProps> = ({ state, setView }) => {
  const handleOpenForm = () => {
    window.open(GOOGLE_FORM_URL, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="text-text-dark" variant="badge">
        <div className="text-8xl animate-bounce">🏅</div>
        <h2 className="text-4xl font-black my-4">Eco Hero Badge</h2>
        
        <div className="bg-white/50 p-4 rounded-2xl my-4 text-left">
            <p className="font-bold mb-2">Upload a photo of your eco-task to earn progress towards your next badge!</p>
            <p className="text-sm">Tasks: Sorting recycling, using a reusable bottle, and more!</p>
        </div>
        
        <Button onClick={handleOpenForm} variant="primary">
          Upload Photo
        </Button>

        <p className="mt-6 font-semibold bg-white/50 rounded-full px-4 py-2">
          Progress: {'⭐'.repeat(state.approvedPhotos)}{'✩'.repeat(5 - state.approvedPhotos)} ({state.approvedPhotos}/5)
        </p>
        
        <p className="mt-2 font-bold">Total Badges: {state.badgeCount} 🏆</p>

         <button onClick={() => setView('kid-home')} className="mt-6 text-text-dark/70 hover:underline block mx-auto">
            ← Back to Home
        </button>
      </Card>
    </div>
  );
};

export default UploadPhotoScreen;