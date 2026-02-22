import React, { useRef, useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Card from '../components/ui/Card';
import { Download, Upload, ShieldAlert, Trash2, HelpCircle, Bell, BellOff, BellRing, LogOut, Target, Droplets, Footprints } from 'lucide-react';
import { GameState } from '../types';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const { exportState, importState, gameState, setNotificationPermission, deleteAccount, logout, setWaterGoal, setStepGoal } = useGameState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [waterGoalInput, setWaterGoalInput] = useState(gameState?.waterGoal || 2000);
  const [stepGoalInput, setStepGoalInput] = useState(gameState?.stepGoal || 10000);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('File could not be read.');
        const newState = JSON.parse(text) as GameState;
        // Directly call importState; confirmation is handled by the context
        importState(newState);
      } catch (error) {
        alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };
  
  const handleNotificationRequest = async () => {
    if (!('Notification' in window)) {
        alert('This browser does not support desktop notifications.');
        return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  if (!gameState) return null;

  return (
    <div>
      <h1 className="text-4xl font-bold font-orbitron text-center mb-2">System Settings</h1>
      <p className="text-center hud-text-accent mb-6">Profile: {gameState.userName}</p>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-2">Account Actions</h2>
        <p className="text-gray-400 mb-4">
          Log out to return to the profile selection screen. This will not delete any data.
        </p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-2 flex items-center gap-2">
          <Target size={24} />
          Daily Goals
        </h2>
        <p className="text-gray-400 mb-6">
          Customize your daily water intake and step count goals. Rewards are granted when you reach these targets.
        </p>
        
        {/* Water Goal */}
        <div className="mb-6 p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="text-cyan-400" size={20} />
            <h3 className="font-bold text-cyan-300">Water Intake Goal</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Current Goal:</span>
              <span className="text-cyan-400 font-black font-mono">{gameState.waterGoal}ml</span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="250"
              value={waterGoalInput}
              onChange={(e) => setWaterGoalInput(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600 font-mono">
              <span>1000ml</span>
              <span className="text-cyan-400 font-black">{waterGoalInput}ml ({(waterGoalInput / 250).toFixed(1)} cups)</span>
              <span>5000ml</span>
            </div>
            {waterGoalInput !== gameState.waterGoal && (
              <button
                onClick={() => setWaterGoal(waterGoalInput)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Save Water Goal
              </button>
            )}
          </div>
        </div>

        {/* Step Goal */}
        <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Footprints className="text-orange-400" size={20} />
            <h3 className="font-bold text-orange-300">Daily Step Goal</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Current Goal:</span>
              <span className="text-orange-400 font-black font-mono">{gameState.stepGoal.toLocaleString()} steps</span>
            </div>
            <input
              type="range"
              min="5000"
              max="25000"
              step="1000"
              value={stepGoalInput}
              onChange={(e) => setStepGoalInput(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
            />
            <div className="flex justify-between text-[10px] text-gray-600 font-mono">
              <span>5k</span>
              <span className="text-orange-400 font-black">{stepGoalInput.toLocaleString()} steps (~{Math.round(stepGoalInput / 1300)} km)</span>
              <span>25k</span>
            </div>
            {stepGoalInput !== gameState.stepGoal && (
              <button
                onClick={() => setStepGoal(stepGoalInput)}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Save Step Goal
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <p className="text-[11px] text-purple-200">
            <strong>Rewards:</strong> Reaching your water goal grants +5 XP and +2 Regeneration. Reaching your step goal grants +5 XP and +2 Endurance.
          </p>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-2">System Codex</h2>
        <p className="text-gray-400 mb-4">
          Access the central chronicle for detailed information on system mechanics, world lore, and more.
        </p>
        <Link
          to="/guide"
          className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <HelpCircle className="w-5 h-5" />
          Open Guide
        </Link>
      </Card>
      
      <Card className="mb-6">
        <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-2">Notifications</h2>
        <p className="text-gray-400 mb-4">
            Enable browser notifications to receive reminders for tasks scheduled in your Planner.
        </p>
        {gameState.notificationPermission === 'granted' ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-semibold p-3 bg-green-900/30 rounded-md border border-green-500/30">
                <BellRing size={20} />
                <span>Notifications are enabled.</span>
            </div>
        ) : gameState.notificationPermission === 'denied' ? (
             <div className="flex items-center justify-center gap-2 text-red-400 font-semibold p-3 bg-red-900/30 rounded-md border border-red-500/30">
                <BellOff size={20} />
                <span>Notifications are disabled by your browser.</span>
            </div>
        ) : (
            <button
              onClick={handleNotificationRequest}
              className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
              Enable Notifications
            </button>
        )}
      </Card>

      <Card className="mb-6">
        <h2 className="text-2xl font-bold font-orbitron hud-text-accent mb-4">Manual Backup</h2>
        <p className="text-gray-400 mb-4">
          Export a local backup file of your progress. This can be useful for manual restoration or migration.
        </p>
        <button
          onClick={exportState}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Download className="w-5 h-5" />
          Export Progress File
        </button>
      </Card>

      <Card className="mb-6 !border-amber-500/50">
        <h2 className="text-2xl font-bold font-orbitron text-amber-300 mb-4">Manual Restore</h2>
        <div className="flex items-start gap-3 bg-amber-900/30 p-3 rounded-lg mb-4 border border-amber-500/30">
            <ShieldAlert className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
            <div>
                <h3 className="font-bold text-amber-300">Warning: Overwrite Data</h3>
                <p className="text-amber-300/80 text-sm">
                Importing a file will completely replace your current progress. This action cannot be undone.
                </p>
            </div>
        </div>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Upload className="w-5 h-5" />
          Import Progress File
        </button>
      </Card>
      
      <Card className="!border-red-500/50">
        <h2 className="text-2xl font-bold font-orbitron text-red-400 mb-4">Danger Zone</h2>
         <div className="flex items-start gap-3 bg-red-900/30 p-3 rounded-lg mb-4 border border-red-500/30">
            <ShieldAlert className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
                <h3 className="font-bold text-red-300">Delete All Data</h3>
                <p className="text-red-300/80 text-sm">
                This will permanently delete all saved progress from this device. This action is irreversible.
                </p>
            </div>
        </div>
        <button
          onClick={deleteAccount}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <Trash2 className="w-5 h-5" />
          Delete All Data
        </button>
      </Card>

      <div className="text-center text-gray-600 text-xs mt-8">
        Project Genesis: v1.0
      </div>
    </div>
  );
};

export default SettingsPage;