import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { useNavigate } from 'react-router-dom';
import { Task, SideMission, StatName, SubStatName, Path, Achievement } from '../types';
import { X, Target, Play, Check, AlertCircle, Zap, Leaf } from 'lucide-react';
import Loader from '../components/ui/Loader';
import { checkFocusAchievement } from '../services/achievementService';

type SelectableTask = {
  id: string;
  pathId?: string;
  description: string;
  source: 'Path' | 'Side Mission';
};

const FocusPage = () => {
  const { gameState, isLoading, completeTask, completeSideMission, applyStatBoost, addToast, dispatch } = useGameState();
  const navigate = useNavigate();

  const [sessionState, setSessionState] = useState<'setup' | 'active' | 'complete'>('setup');
  const [selectedTask, setSelectedTask] = useState<SelectableTask | null>(null);
  const [duration, setDuration] = useState(25 * 60); // Default 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  
  // Focus Forest tracking
  const [growthProgress, setGrowthProgress] = useState(0); // 0-100%
  const [focusInterruptions, setFocusInterruptions] = useState(0);
  const [focusStreak, setFocusStreak] = useState(true);
  const [focusSessionStats, setFocusSessionStats] = useState({ startTime: 0, totalTypingTime: 0 });
  const appVisibilityRef = useRef<boolean>(true);
  const lastActivityRef = useRef<number>(Date.now());
  const streakWarningShownRef = useRef<boolean>(false);

  const availableTasks = useMemo<SelectableTask[]>(() => {
    if (!gameState) return [];
    const pathTasks: SelectableTask[] = gameState.paths.flatMap((path: Path) =>
      path.tasks
        .filter((task: Task) => !task.isCompleted)
        .map((task: Task) => ({
          id: task.id,
          pathId: path.id,
          description: task.description,
          source: 'Path',
        }))
    );
    const sideMissions: SelectableTask[] = gameState.sideMissions
      .filter((quest: SideMission) => quest.status === 'Active')
      .map((quest: SideMission) => ({
      id: quest.id,
      description: quest.title,
      source: 'Side Mission',
    }));
    return [...pathTasks, ...sideMissions];
  }, [gameState]);
  
   // Detect app backgrounding/visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      appVisibilityRef.current = isVisible;        if (!isVisible && sessionState === 'active') {
        setFocusInterruptions(prev => prev + 1);
        setFocusStreak(false);
        if (!streakWarningShownRef.current) {
          addToast('⚠️ Interruption detected! Focus streak broken. 🌱', 'error');
          streakWarningShownRef.current = true;
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [sessionState, addToast]);

  // Main session timer and tree growth
  useEffect(() => {
    if (sessionState === 'active') {
      if (timeLeft <= 0) {
        setSessionState('complete');
        
        // Calculate bonuses
        const baseReward = 10;
        const interruptionPenalty = focusInterruptions * 2;
        const streakBonus = focusStreak ? 5 : 0;
        const finalReward = Math.max(5, baseReward + streakBonus - interruptionPenalty);
        
        // Apply rewards
        applyStatBoost(StatName.Psyche, SubStatName.Focus, finalReward);
        const rewardMessage = focusStreak 
          ? `+${finalReward} Psyche (Focus) - Perfect Focus! 🌳` 
          : `+${finalReward} Psyche (Focus) - ${focusInterruptions} interruptions detected`;
        addToast(rewardMessage, focusStreak ? 'special' : 'success');
        
        if (selectedTask) {
          if (selectedTask.source === 'Path' && selectedTask.pathId) {
            completeTask(selectedTask.pathId, selectedTask.id);
          } else if (selectedTask.source === 'Side Mission') {
            completeSideMission(selectedTask.id);
          }
        }
        
        // Check for achievement
        if (gameState) {
            const achievement = checkFocusAchievement(gameState);
            if (achievement) {
                dispatch({ type: 'UNLOCK_ACHIEVEMENT_TIER', payload: { achievementId: 'common-11', tier: 1 } });
                addToast(`Achievement: ${achievement.name}`, 'success');
            }
        }

        return;
      }
      
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        // Continuous tree growth (grows over time)
        setGrowthProgress(prev => Math.min(100, prev + (100 / duration)));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionState, timeLeft, selectedTask, duration, focusInterruptions, focusStreak, applyStatBoost, completeTask, completeSideMission, addToast, gameState, dispatch]);

  if (isLoading || !gameState) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <Loader text="Initializing Focus Protocol..." />
      </div>
    );
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTreeStage = (growth: number) => {
    if (growth < 15) return { name: 'SEED', emoji: '🌱', height: 'h-12', color: 'text-amber-700' };
    if (growth < 35) return { name: 'SPROUT', emoji: '🌿', height: 'h-16', color: 'text-green-600' };
    if (growth < 55) return { name: 'SAPLING', emoji: '🌲', height: 'h-20', color: 'text-green-500' };
    if (growth < 80) return { name: 'TREE', emoji: '🌳', height: 'h-24', color: 'text-green-400' };
    return { name: 'ANCIENT GROVE', emoji: '🌲🌳🌲', height: 'h-28', color: 'text-emerald-300' };
  };

  const treeStage = getTreeStage(growthProgress);

  const handleStartSession = () => {
    if (selectedTask) {
      setTimeLeft(duration);
      setGrowthProgress(0);
      setFocusInterruptions(0);
      setFocusStreak(true);
      streakWarningShownRef.current = false;
      setSessionState('active');
    }
  };
  
  const handleTerminate = () => {
      if (window.confirm('Terminate the session early? No rewards will be granted.')) {
        setSessionState('setup');
      }
  };

  const renderSetup = () => (
    <div className="w-full max-w-2xl mx-auto p-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-glow mb-2">Focus Mode</h1>
            <p className="hud-text-accent">Initiate a Deep Dive session.</p>
        </div>

        <div className="bg-[var(--color-bg-medium)] p-6 rounded-lg border border-[var(--color-border)]">
            <div className="mb-6">
                <label className="block text-lg font-bold text-gray-300 mb-2">1. Select Objective</label>
                <select 
                    onChange={e => {
                        const [id, pathIdStr] = e.target.value.split('::');
                        const task = availableTasks.find(t => t.id === id && (t.pathId || '') === (pathIdStr || ''));
                        setSelectedTask(task || null);
                    }}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                >
                    <option value="">-- Choose a task to focus on --</option>
                    {availableTasks.map(task => (
                        <option key={`${task.id}::${task.pathId || ''}`} value={`${task.id}::${task.pathId || ''}`}>{`[${task.source}] ${task.description}`}</option>
                    ))}
                </select>
            </div>
             <div className="mb-8">
                <label className="block text-lg font-bold text-gray-300 mb-2">2. Set Duration</label>
                <div className="flex gap-2">
                    {[25, 50, 90].map(min => (
                        <button key={min} onClick={() => setDuration(min * 60)} className={`flex-1 py-3 font-bold rounded-md transition-colors ${duration === min*60 ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                            {min} min
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={handleStartSession} disabled={!selectedTask} className="w-full flex items-center justify-center gap-3 text-xl font-orbitron bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed">
                <Play /> Initiate Deep Dive
            </button>
        </div>
        <button onClick={() => navigate(-1)} className="mt-8 text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto">
            <X /> Exit Focus Mode
        </button>
    </div>
  );
  
  const renderActive = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
        {/* Tree Growth Visualization */}
        <div className="flex flex-col items-center gap-2 mb-4">
            <div className={`text-7xl md:text-8xl transition-all duration-300 ${treeStage.height} flex items-end justify-center`}>
                {treeStage.emoji}
            </div>
            <div className="text-xl font-orbitron text-emerald-400">
                {treeStage.name}
            </div>
            {/* Progress bar */}
            <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden border border-green-500/30">
                <div 
                    className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-300"
                    style={{ width: `${growthProgress}%` }}
                />
            </div>
            <div className="text-sm text-gray-400">{Math.round(growthProgress)}%</div>
        </div>

        <p className="text-2xl hud-text-accent font-orbitron">DEEP DIVE IN PROGRESS</p>
        
        <div className="text-8xl md:text-9xl font-black font-orbitron my-4" style={{ textShadow: '0 0 25px var(--color-accent-glow)' }}>
            {formatTime(timeLeft)}
        </div>
        
        <div className="max-w-xl p-4 bg-gray-900 rounded-lg border border-gray-700">
            <p className="text-lg font-bold text-gray-400 mb-2 flex items-center justify-center gap-2"><Target /> Current Objective</p>
            <p className="text-2xl text-white">{selectedTask?.description}</p>
        </div>

        {/* Focus Metrics */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-6">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Focus Status</div>
                <div className={`text-lg font-bold ${focusStreak ? 'text-green-400' : 'text-red-400'}`}>
                    {focusStreak ? '✓ Uninterrupted' : '✗ Interrupted'}
                </div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                <div className="text-sm text-gray-400">Interruptions</div>
                <div className="text-lg font-bold text-red-400">{focusInterruptions}</div>
            </div>
        </div>

        {focusInterruptions > 0 && (
            <div className="flex items-center gap-2 text-red-300 text-sm bg-red-900/20 border border-red-500/30 rounded px-4 py-2">
                <AlertCircle size={16} /> Tab switches detected! Stay focused to maximize rewards.
            </div>
        )}
        
        <button onClick={handleTerminate} className="mt-8 flex items-center gap-2 bg-red-600/50 hover:bg-red-600 text-red-200 font-bold py-2 px-6 rounded-md transition-colors">
            <X /> Terminate Session
        </button>
    </div>
  );
  
  const renderComplete = () => {
    const baseReward = 10;
    const interruptionPenalty = focusInterruptions * 2;
    const streakBonus = focusStreak ? 5 : 0;
    const finalReward = Math.max(5, baseReward + streakBonus - interruptionPenalty);
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-6">
        <Check className="w-24 h-24 text-green-400 bg-green-500/10 rounded-full p-4 border-4 border-green-500/30 mb-4"/>
        <h1 className="text-4xl font-bold font-orbitron text-green-300">HARVEST COMPLETE</h1>
        
        <div className="text-6xl">{treeStage.emoji}</div>
        <p className="text-xl text-gray-300">Your {treeStage.name.toLowerCase()} has grown!</p>

        {/* Reward Breakdown */}
        <div className="w-full max-w-lg bg-gray-900/40 border border-gray-700 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                <span className="text-gray-400">Base Reward</span>
                <span className="text-white font-bold">+{baseReward}</span>
            </div>
            
            {streakBonus > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-700 text-green-400">
                    <span>Focus Streak Bonus</span>
                    <span className="font-bold">+{streakBonus}</span>
                </div>
            )}
            
            {interruptionPenalty > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-700 text-red-400">
                    <span>Interruption Penalty ({focusInterruptions}x)</span>
                    <span className="font-bold">-{interruptionPenalty}</span>
                </div>
            )}
            
            <div className="flex justify-between items-center pt-2 text-2xl font-bold">
                <span className="text-gray-300">Total Psyche (Focus)</span>
                <span className="text-purple-300">+{finalReward}</span>
            </div>
        </div>

        {/* Stats Summary */}
        <div className="w-full max-w-lg grid grid-cols-3 gap-3 text-sm">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                <div className="text-gray-400 text-xs">Duration</div>
                <div className="text-blue-300 font-bold">{Math.floor(duration / 60)}m</div>
            </div>
            <div className={`border rounded p-3 ${focusStreak ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className="text-gray-400 text-xs">Focus Streak</div>
                <div className={`font-bold ${focusStreak ? 'text-green-300' : 'text-red-300'}`}>
                    {focusStreak ? '✓ Perfect' : '✗ Broken'}
                </div>
            </div>
            <div className="bg-amber-900/20 border border-amber-500/30 rounded p-3">
                <div className="text-gray-400 text-xs">Growth Stage</div>
                <div className="text-amber-300 font-bold">{treeStage.name}</div>
            </div>
        </div>

        <button onClick={() => navigate(-1)} className="mt-8 flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg transition-colors">
           Return to Interface
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="animated-background"></div>
      {sessionState === 'setup' && renderSetup()}
      {sessionState === 'active' && renderActive()}
      {sessionState === 'complete' && renderComplete()}
    </div>
  );
};

export default FocusPage;