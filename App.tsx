
import React, { useReducer, useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { checkAchievements } from './services/achievementService';
import { useToast, ToastProvider } from './components/ui/ToastProvider';
import { GameStateProvider, useGameState } from './contexts/GameStateContext';

// Pages
import DashboardPage from './pages/DashboardPage';
import PathsPage from './pages/PathsPage';
import StatsPage from './pages/StatsPage';
import LabyrinthPage from './pages/LabyrinthPage';
import RankPage from './pages/RankPage';
import AchievementsPage from './pages/AchievementsPage';
import OrderPage from './pages/OrderPage';
import MissionsPage from './pages/MissionsPage';
import PlannerPage from './pages/PlannerPage';
import SideMissionsPage from './pages/SideMissionsPage';
import FocusPage from './pages/FocusPage';
import JournalPage from './pages/JournalPage';
import ChapterBlackPage from './pages/ChapterBlackPage';
import SettingsPage from './pages/SettingsPage';
import GuidePage from './pages/GuidePage';
import { OnboardingPage } from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';

// Components
import Navigation from './components/Navigation';
import TutorialOverlay from './components/TutorialOverlay';
import SystemLog from './components/SystemLog';
import Loader from './components/ui/Loader';
import CommandPalette from './components/CommandPalette';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SplashSequence from './components/ui/SplashSequence';
import { Flame } from 'lucide-react';

const MantraHeader: React.FC = () => (
    <div className="w-full bg-black border-b border-purple-500/30 py-2 px-6 flex items-center justify-center gap-4 z-[40] backdrop-blur-md">
        <Flame size={14} className="text-purple-400 animate-pulse hidden sm:block" />
        <p className="text-[11px] md:text-sm text-center font-serif italic text-purple-300/80 tracking-wide drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]">
            "Do you not know that in a race all the runners run, but only one gets the prize? <span className="text-purple-400 font-bold">Run in such a way as to get the prize.</span>"
        </p>
        <span className="text-[9px] font-black font-orbitron text-purple-600/60 uppercase tracking-[0.2em] whitespace-nowrap">— 1 Corinthians 9:24</span>
    </div>
);

const AppRoutes: React.FC = () => {
    const { isLoggedIn, gameState } = useGameState();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    if (!isLoggedIn) return <LoginPage />;
    if (gameState && !gameState.hasOnboarded) return <OnboardingPage />;

    return (
        <div className="flex h-screen overflow-hidden bg-black text-white">
            <CommandPalette />
            <Navigation isMobileOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
            <div className="flex-1 flex flex-col md:ml-64 h-full overflow-hidden relative">
                <MantraHeader />
                <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-purple-500/30 z-20">
                    <span className="font-orbitron font-bold text-purple-400 uppercase tracking-widest">Genesis</span>
                    <button onClick={() => setIsMobileNavOpen(true)} className="p-2 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <TutorialOverlay />
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/paths" element={<PathsPage />} />
                        <Route path="/stats" element={<StatsPage />} />
                        <Route path="/labyrinth" element={<LabyrinthPage />} />
                        <Route path="/rank" element={<RankPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/order" element={<OrderPage />} />
                        <Route path="/missions" element={<MissionsPage />} />
                        <Route path="/planner" element={<PlannerPage />} />
                        <Route path="/side-missions" element={<SideMissionsPage />} />
                        <Route path="/focus" element={<FocusPage />} />
                        <Route path="/journal" element={<JournalPage />} />
                        <Route path="/chapter-black" element={<ChapterBlackPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/guide" element={<GuidePage />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </main>
                <SystemLog />
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
    const { gameState, dispatch, isLoading } = useGameState();
    const { addToast } = useToast();
    const [showSplash, setShowSplash] = useState(true);
    
    const processedAchievementIds = useRef<Set<string>>(new Set());
    const lastStateRef = useRef<any>(null);
    
    useEffect(() => {
        if (gameState) {
            const today = new Date().toISOString().split('T')[0];
            const lastActive = gameState.statHistory.length > 0 ? gameState.statHistory[gameState.statHistory.length - 1].date.split('T')[0] : null;
            if (lastActive && lastActive !== today) {
                dispatch({ type: 'DAILY_RESET' });
                addToast("Daily cycle reset. Systems recalibrating.", "info");
            }

            if (lastStateRef.current) {
                const newUnlocks = checkAchievements(lastStateRef.current, gameState);
                newUnlocks.forEach(({ achievementId, newTier }) => {
                    const uniqueKey = `${achievementId}-${newTier}`;
                    if (!processedAchievementIds.current.has(uniqueKey)) {
                        processedAchievementIds.current.add(uniqueKey);
                        dispatch({ type: 'UNLOCK_ACHIEVEMENT_TIER', payload: { achievementId, tier: newTier } });
                        // Only show 'special' toasts for higher tiers (3+); lower tiers are 'success'
                        const toastType = newTier >= 3 ? 'special' : 'success';
                        addToast(`Achievement: ${achievementId} (Tier ${newTier})`, toastType);
                    }
                });
            }
            lastStateRef.current = gameState;
        }
    }, [gameState, dispatch, addToast]); 

    if (showSplash) return <SplashSequence onComplete={() => setShowSplash(false)} />;
    if (isLoading) return <Loader text="Synchronizing System Status..." />;
    return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
          <ToastProvider>
              <GameStateWrapper />
          </ToastProvider>
      </Router>
    </ErrorBoundary>
  );
};

const GameStateWrapper: React.FC = () => {
    const { addToast } = useToast();
    return (
        <GameStateProvider notify={addToast}>
            <AppContent />
        </GameStateProvider>
    );
};

export default App;
