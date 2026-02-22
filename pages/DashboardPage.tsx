// pages/DashboardPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { Link } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import CompanionMessage from '../components/CompanionMessage';
import SubstatLabel from '../components/SubstatLabel';
import DecayStatusWidget from '../components/DecayStatusWidget';
import DecayRecoveryWidget from '../components/DecayRecoveryWidget';
import SmartTaskSuggestionsWidget from '../components/SmartTaskSuggestionsWidget';
import AnalyticsDashboardWidget from '../components/AnalyticsDashboardWidget';
import { RANKS, ATTRIBUTE_RANKS, RANK_PERCENTILES } from '../constants';
import { Stat, StatName, SubStatName, Task, TaskType, AttributeRankName } from '../types';
import { ArrowRight, Activity, TrendingUp, Flame, Calendar, BarChart, Crosshair, Check, Zap, ListChecks, Shield, PenLine, Headphones, Binary, Cloud, Clock, FileText, ChevronRight, LayoutGrid, Globe, Languages, Plus } from 'lucide-react';
import { calculateScores } from '../services/scoringService';
import { generateTacticalSuggestions } from '../services/geminiService';
import { calculateDecayInfo } from '../services/decayService';

const DS_LEVEL_DATA = [
    { level: 1, hours: 0, label: 'Zero', activity: 'Superbeginner CI' },
    { level: 2, hours: 50, label: 'Beginner', activity: 'Beginner CI' },
    { level: 3, hours: 150, label: 'Intermediate', activity: 'Intermediate CI / Podcasts' },
    { level: 4, hours: 300, label: 'Intermediate+', activity: 'No Visuals / Basic Speaking' },
    { level: 5, hours: 600, label: 'Advanced', activity: 'Cartoons / Reading Kids Books' },
    { level: 6, hours: 1000, label: 'Expert', activity: 'Native TV / Social Friends' },
    { level: 7, hours: 1500, label: 'Master', activity: 'Novels / Movies / Technical' }
];

const NeuralLinguisticSync: React.FC<{ totalHours: number }> = ({ totalHours }) => {
    const { updateDailyMetrics, addToast } = useGameState();
    const [logInput, setLogInput] = useState('');

    const currentLevel = useMemo(() => {
        return [...DS_LEVEL_DATA].reverse().find(l => totalHours >= l.hours) || DS_LEVEL_DATA[0];
    }, [totalHours]);

    const nextLevel = useMemo(() => {
        return DS_LEVEL_DATA[DS_LEVEL_DATA.findIndex(l => l.level === currentLevel.level) + 1] || null;
    }, [currentLevel]);

    const progress = nextLevel 
        ? ((totalHours - currentLevel.hours) / (nextLevel.hours - currentLevel.hours)) * 100 
        : 100;

    const handleQuickLog = () => {
        const hours = parseFloat(logInput);
        if (isNaN(hours) || hours <= 0) return;
        updateDailyMetrics({ immersionHours: hours });
        addToast(`Logged ${hours}h immersion. Frequency synced.`, 'success');
        setLogInput('');
    };

    return (
        <Card className="!bg-black/95 border-cyan-500/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 pointer-events-none">
                <Globe size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3 md:gap-4 mb-4 md:mb-5">
                    <div>
                        <span className="text-[8.5px] md:text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] md:tracking-[0.4em] flex items-center gap-2">
                            <Languages size={11} className="md:w-3 md:h-3" /> Neural_Linguistic_Sync
                        </span>
                        <h3 className="text-xl md:text-2xl font-black font-orbitron text-white mt-1 md:mt-2 uppercase tracking-tighter">
                            DS_LVL_{currentLevel.level}
                        </h3>
                    </div>
                    <div className="text-right text-sm sm:text-right">
                        <span className="text-[7.5px] md:text-[8px] text-gray-600 font-black uppercase tracking-widest">Total_Hours</span>
                        <p className="text-base md:text-lg font-black font-mono text-cyan-400">{totalHours.toFixed(1)}h</p>
                    </div>
                </div>

                <div className="flex-grow space-y-3 md:space-y-4">
                    <div className="bg-cyan-950/20 border border-cyan-900/30 p-2.5 md:p-3 rounded-sm">
                        <p className="text-[8px] md:text-[9px] text-cyan-300 font-black uppercase tracking-widest mb-1">Current_Phase</p>
                        <p className="text-[10px] md:text-xs font-bold text-gray-200 uppercase font-mono">{currentLevel.label} // {currentLevel.activity}</p>
                    </div>

                    {/* Quick Log Input */}
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                             <input 
                                type="number" 
                                value={logInput}
                                onChange={(e) => setLogInput(e.target.value)}
                                placeholder="Log Hours..."
                                className="w-full bg-black/60 border border-gray-800 p-2 text-xs text-cyan-400 font-mono focus:border-cyan-500 outline-none rounded-sm placeholder:text-gray-700"
                             />
                             <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-gray-700 font-black uppercase pointer-events-none">Hrs</span>
                        </div>
                        <button 
                            onClick={handleQuickLog}
                            className="bg-cyan-600 hover:bg-cyan-500 text-black p-2 px-2.5 md:px-3 rounded-sm transition-all flex items-center gap-1 active:scale-95 flex-shrink-0"
                        >
                            <Plus size={14} className="md:w-4 md:h-4" /> <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest hidden sm:inline">Sync</span>
                        </button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[7.5px] md:text-[8px] font-black text-gray-600 uppercase tracking-widest">
                            <span>Synapse_Growth</span>
                            {nextLevel && <span>T-Minus {(nextLevel.hours - totalHours).toFixed(1)}h</span>}
                        </div>
                        <div className="w-full h-1 md:h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                            <div 
                                className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_#22d3ee]" 
                                style={{ width: `${progress}%` }} 
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 md:mt-6 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
                    <span className="text-[7px] md:text-[7.5px] text-gray-700 font-mono">_ALG: DREAMING_SPANISH_V1</span>
                    <Link to="/paths" className="text-[7.5px] md:text-[8px] font-black text-cyan-500 hover:underline uppercase tracking-widest flex items-center gap-1">
                        Optimize_Vector <ChevronRight size={8} />
                    </Link>
                </div>
            </div>
        </Card>
    );
};

const NeuralPulseHeatmap: React.FC<{ history: any[] }> = ({ history }) => {
    const last28Days = useMemo(() => {
        const days = [];
        for (let i = 27; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const hasData = history.some(h => h.date.startsWith(dateStr));
            days.push({ date: dateStr, active: hasData });
        }
        return days;
    }, [history]);

    return (
        <div className="bg-black/60 border border-gray-800 p-3 md:p-4 rounded-sm">
            <div className="flex justify-between items-center mb-3 md:mb-4">
                <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] md:tracking-[0.4em] flex items-center gap-2">
                    <LayoutGrid size={11} className="md:w-3 md:h-3 text-cyan-500" /> Neural_Pulse_Registry
                </span>
                <span className="text-[7.5px] md:text-[8px] text-gray-600 font-mono">_LAST_28_CYCLES</span>
            </div>
            <div className="grid grid-cols-7 md:grid-cols-14 gap-1 md:gap-1.5">
                {last28Days.map((day, i) => (
                    <div 
                        key={i} 
                        className={`aspect-square w-full rounded-[1px] border ${
                            day.active 
                            ? 'bg-cyan-500/40 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.2)]' 
                            : 'bg-gray-900/50 border-gray-800'
                        }`}
                        title={day.date}
                    />
                ))}
            </div>
        </div>
    );
};

const ResetCountdown: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const resetTime = new Date();
            resetTime.setHours(4, 0, 0, 0);
            if (now.getHours() >= 4) resetTime.setDate(resetTime.getDate() + 1);
            
            const diff = resetTime.getTime() - now.getTime();
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 bg-black/60 border border-purple-500/20 px-3 py-1.5 rounded-sm">
            <Clock size={12} className="text-purple-400" />
            <span className="text-[10px] font-mono font-black text-purple-200 tracking-[0.2em]">{timeLeft}</span>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { gameState, isLoading, completeTask, incrementWeeklyTask, addToast } = useGameState();
    const [tacticalAdvice, setTacticalAdvice] = useState<{ title: string; suggestions: string[] } | null>(null);
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 4);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (gameState && !tacticalAdvice && !loadingAdvice) {
            const cacheKey = `genesis_tactical_advice_${gameState.userName}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    setTacticalAdvice(JSON.parse(cached));
                } catch (e) {
                    console.warn('[DashboardPage] Failed to parse cached tactical advice:', e);
                }
            } else {
                setLoadingAdvice(true);
                generateTacticalSuggestions(gameState.stats ?? [], gameState.archetypeTitle || 'Average')
                    .then(advice => {
                        setTacticalAdvice(advice);
                        localStorage.setItem(cacheKey, JSON.stringify(advice));
                    })
                    .catch(e => console.error('[DashboardPage] Failed to generate tactical advice:', e))
                    .finally(() => setLoadingAdvice(false));
            }
        }
    }, [gameState]);

    // useMemo must be called unconditionally before any early returns (Rules of Hooks).
    const lastActivityDate = (gameState?.statHistory?.length ?? 0) > 0
        ? (gameState?.statHistory?.[gameState.statHistory.length - 1]?.date ?? null)
        : null;
    const decayInfo = useMemo(
        () => calculateDecayInfo(lastActivityDate, gameState?.stats ?? []),
        [lastActivityDate, gameState?.stats]
    );

    if (isLoading || !gameState) return <Loader text="Loading dashboard" />;

    const { rank, stats, currentStreak, statHistory, paths, totalImmersionHours } = gameState;
    const safeStats = stats ?? [];
    const { apexThreatIndex } = calculateScores(safeStats);
    const currentRankInfo = RANK_PERCENTILES[rank?.name] ?? { min: 0 };
    const nextRank = RANKS[RANKS.findIndex(r => r.name === rank?.name) + 1] || null;
    const nextRankInfo = nextRank ? (RANK_PERCENTILES[nextRank.name] ?? { min: 100 }) : { min: 100 };

    const range = nextRankInfo.min - currentRankInfo.min;
    const progress = range > 0 ? ((apexThreatIndex - currentRankInfo.min) / range) * 100 : 100;

    const growthHabits = (paths ?? []).flatMap(p =>
        (p.tasks ?? [])
            .filter(t => !t.isNonNegotiable)
            .map(t => ({ ...t, pathId: p.id, pathName: p.name }))
    );

    return (
        <div className="relative min-h-screen bg-[#050509] text-white">
            {/* Fixed, compact dashboard header optimised for mobile */}
            <header
                className={`fixed top-0 left-0 right-0 z-40 bg-black/92 backdrop-blur-xl border-b border-purple-500/35 px-3 md:px-8 pt-2.5 md:pt-4 pb-2 md:pb-3 transition-shadow ${
                    isScrolled ? 'shadow-[0_6px_24px_rgba(0,0,0,0.9)]' : ''
                }`}
            >
                <div className="flex items-center justify-between gap-3 md:gap-6">
                    <div className="flex items-center gap-2.5 md:gap-4 min-w-0">
                        <div className="p-2 md:p-2.5 bg-purple-600/10 rounded-lg border border-purple-500/50 flex-shrink-0">
                            <Cloud size={18} className="md:w-6 md:h-6 text-purple-200" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8.5px] md:text-[10px] font-semibold text-gray-300 uppercase tracking-[0.26em] md:tracking-[0.32em]">
                                Genesis Protocol
                            </p>
                            <p className="text-[10px] md:text-xs font-semibold text-purple-200 flex items-center gap-1.5 md:gap-2 mt-0.5">
                                Dashboard
                                <span className="flex items-center gap-1 text-[8px] md:text-[9px] text-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
                                    Live
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
                        <ResetCountdown />
                        {gameState.calibrationAnalysis && (
                            <Link
                                to="/rank"
                                className="hidden sm:flex items-center gap-1.5 bg-gray-900/95 border border-gray-700/80 hover:border-purple-400 px-2.5 md:px-3.5 py-1.5 rounded-md text-[8px] md:text-[9px] font-semibold text-gray-200 uppercase tracking-[0.18em] md:tracking-[0.22em]"
                            >
                                <FileText size={11} className="md:w-4 md:h-4 text-gray-400" />
                                Overview
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main scrollable body with safe top + bottom padding so nothing hides behind header/footer */}
            <main className="relative z-0 pt-[80px] md:pt-[96px] pb-28 md:pb-20 px-3 md:px-8">
                <div className="absolute inset-0 blueprint-dot pointer-events-none opacity-15" />
                <div className="relative z-10 space-y-3 md:space-y-6">
                    {/* DECAY STATUS WIDGET - HIGH PRIORITY */}
                    <DecayStatusWidget decayInfo={decayInfo} />

                    {/* DECAY RECOVERY WIDGET - If decay is imminent or active */}
                    {(decayInfo?.isDecayImminent || decayInfo?.isDecayActive) && (
                        <DecayRecoveryWidget 
                            decayInfo={decayInfo} 
                            stats={safeStats}
                            onRecoveryTaskComplete={(task, bonusXP) => {
                                addToast(`Recovery task "${task.title}" completed! +${bonusXP}% bonus`, 'success');
                            }}
                        />
                    )}

                    {/* CENTRAL anchor */}
                    <Card className="!bg-black/92 border-purple-500/40 shadow-[0_0_22px_rgba(168,85,247,0.25)]">
                        <CompanionMessage />
                    </Card>

                    {/* Top stats row + DS widget */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 md:gap-8">
                        <div className="lg:col-span-2 space-y-3.5 md:space-y-8">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-4">
                                {/* Stat cards – brighter, higher contrast, tuned to thumb reach */}
                                <Card className="text-center !border-purple-500/70 !bg-black/80 !p-3 md:!p-5 shadow-[0_0_20px_rgba(168,85,247,0.25)] rounded-md">
                                    <Activity className="mx-auto mb-1.5 text-purple-300" size={18} />
                                    <p className="text-lg md:text-2xl font-black font-orbitron text-purple-100">{apexThreatIndex.toFixed(1)}%</p>
                                    <p className="text-[7px] md:text-[9px] text-gray-400 font-bold uppercase tracking-[0.28em] md:tracking-[0.35em] mt-0.5">
                                        Apex Index
                                    </p>
                                </Card>
                                <Card className="text-center !border-purple-500/70 !bg-black/80 !p-3 md:!p-5 shadow-[0_0_20px_rgba(168,85,247,0.25)] rounded-md">
                                    <TrendingUp className="mx-auto mb-1.5 text-purple-300" size={18} />
                                    <p className="text-lg md:text-2xl font-black font-orbitron text-purple-100">
                                        {safeStats.reduce((s, a) => s + a.value, 0).toLocaleString()}
                                    </p>
                                    <p className="text-[7px] md:text-[9px] text-gray-400 font-bold uppercase tracking-[0.28em] md:tracking-[0.35em] mt-0.5">
                                        Total Volts
                                    </p>
                                </Card>
                                <Card className="text-center !border-purple-500/70 !bg-black/80 !p-3 md:!p-5 shadow-[0_0_20px_rgba(168,85,247,0.25)] rounded-md">
                                    <Flame className="mx-auto mb-1.5 text-purple-300" size={18} />
                                    <p className="text-lg md:text-2xl font-black font-orbitron text-purple-100">{currentStreak}</p>
                                    <p className="text-[7px] md:text-[9px] text-gray-400 font-bold uppercase tracking-[0.28em] md:tracking-[0.35em] mt-0.5">
                                        Active Days
                                    </p>
                                </Card>
                                <Card className="text-center !border-purple-500/70 !bg-black/80 !p-3 md:!p-5 shadow-[0_0_20px_rgba(168,85,247,0.25)] rounded-md">
                                    <Calendar className="mx-auto mb-1.5 text-purple-300" size={18} />
                                    <p className="text-lg md:text-2xl font-black font-orbitron text-purple-100">
                                        {new Set((statHistory ?? []).map(h => h.date.split('T')[0])).size}
                                    </p>
                                    <p className="text-[7px] md:text-[9px] text-gray-400 font-bold uppercase tracking-[0.28em] md:tracking-[0.35em] mt-0.5">
                                        Logged Days
                                    </p>
                                </Card>
                            </div>

                            <NeuralLinguisticSync totalHours={totalImmersionHours} />

                            <NeuralPulseHeatmap history={statHistory} />

                            {/* SMART SUGGESTIONS WIDGET */}
                            <SmartTaskSuggestionsWidget
                                tasks={growthHabits}
                                stats={safeStats}
                                statHistory={statHistory ?? []}
                                currentStreak={currentStreak ?? 0}
                                onTaskSelect={(task) => {
                                    completeTask(growthHabits.find(h => h.id === task.id)?.pathId || '', task.id);
                                }}
                            />

                            {/* Growth ledger – mobile friendly */}
                            <Card className="!bg-black/92 border-cyan-500/30 relative overflow-hidden rounded-md">
                                <div className="absolute inset-0 blueprint-bg opacity-10 pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3.5 md:mb-6 border-b border-cyan-900/40 pb-3">
                                        <h2 className="text-sm md:text-lg font-black font-orbitron text-cyan-300 tracking-[0.28em] md:tracking-[0.35em] uppercase flex items-center gap-2 md:gap-3">
                                            <ListChecks className="text-cyan-400" /> Growth Ledger
                                        </h2>
                                        <div className="flex flex-wrap gap-2.5 text-[7.5px] md:text-[9px] font-black text-gray-500 uppercase">
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-cyan-500 rounded-[1px] shadow-[0_0_8px_#22d3ee]" /> Daily
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 bg-amber-500 rounded-[1px] shadow-[0_0_8px_#fbbf24]" /> Weekly
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 max-h-[320px] md:max-h-[420px] overflow-y-auto pr-1.5 md:pr-3 custom-scrollbar">
                                        {growthHabits.length > 0 ? (
                                            growthHabits.map((habit) => {
                                                const isWeekly = habit.type === TaskType.Weekly;
                                                const targetCount = habit.targetCount || (isWeekly ? 2 : 1);
                                                const currentCount = typeof habit.currentCount === 'number' ? habit.currentCount : 0;
                                                const hasCounter = isWeekly && targetCount > 1;

                                                return (
                                                    <div
                                                        key={habit.id}
                                                        className={`group w-full rounded-md border transition-all duration-300 ${
                                                            habit.isCompleted
                                                                ? 'bg-emerald-900/10 border-emerald-700/40 opacity-50 grayscale'
                                                                : isWeekly
                                                                    ? 'bg-amber-900/15 border-amber-800/60 hover:border-amber-400 hover:bg-amber-900/30'
                                                                    : 'bg-black/75 border-gray-800 hover:border-cyan-400 hover:bg-cyan-900/30'
                                                        }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => (!habit.isCompleted && !hasCounter) ? completeTask(habit.pathId, habit.id) : undefined}
                                                            className="w-full flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.99]"
                                                        >
                                                            <div className="flex items-center gap-2.5 md:gap-3 min-w-0 flex-1">
                                                                <div
                                                                    className={`w-9 md:w-10 text-center text-[7.5px] md:text-[8px] font-mono font-black border rounded-[2px] px-1 py-0.5 flex-shrink-0 ${
                                                                        isWeekly
                                                                            ? 'text-amber-300 border-amber-500/70 bg-amber-950/70'
                                                                            : 'text-cyan-300 border-cyan-500/70 bg-cyan-950/70'
                                                                    }`}
                                                                >
                                                                    {isWeekly ? (hasCounter ? `${currentCount}/${targetCount}` : 'WEEK') : 'DAY'}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p
                                                                        className={`text-[10px] md:text-[12px] font-black uppercase tracking-tight leading-snug truncate ${
                                                                            habit.isCompleted ? 'text-gray-600 line-through' : 'text-gray-100'
                                                                        }`}
                                                                    >
                                                                        {habit.description}
                                                                    </p>
                                                                    <p className="mt-0.5 text-[7px] md:text-[8.5px] text-gray-500 font-black uppercase tracking-[0.22em] truncate">
                                                                        {habit.pathName}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 ml-2">
                                                                <span className={`text-[8px] md:text-[10px] font-mono font-semibold whitespace-nowrap ${
                                                                    isWeekly ? 'text-amber-200' : 'text-cyan-200'
                                                                }`}>
                                                                    +{habit.xp}v
                                                                </span>
                                                                <div
                                                                    className={`w-6 h-6 md:w-7 md:h-7 rounded-[2px] border flex items-center justify-center transition-all flex-shrink-0 ${
                                                                        habit.isCompleted
                                                                            ? 'bg-emerald-400 border-emerald-300 text-black shadow-[0_0_18px_rgba(52,211,153,0.9)]'
                                                                            : 'bg-black border-gray-700 group-hover:border-cyan-400 group-hover:shadow-[0_0_14px_rgba(34,211,238,0.4)]'
                                                                    }`}
                                                                >
                                                                    {habit.isCompleted && <Check size={14} strokeWidth={3} />}
                                                                </div>
                                                            </div>
                                                        </button>
                                                        {hasCounter && !habit.isCompleted && (
                                                            <div className="px-3 py-2 md:px-4 border-t border-amber-800/40 flex items-center justify-between bg-amber-950/20">
                                                                <span className="text-[7px] md:text-[8px] text-amber-200 font-mono font-black uppercase">Weekly Counter</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        incrementWeeklyTask(habit.pathId, habit.id);
                                                                    }}
                                                                    className="inline-flex items-center justify-center rounded-sm border border-amber-400/70 bg-amber-600 hover:bg-amber-500 px-3 py-1 text-[9px] md:text-[10px] font-mono font-black text-white transition-colors active:scale-95"
                                                                >
                                                                    +1 ({currentCount}/{targetCount})
                                                                </button>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Substat Label - Shows which substat this task affects and progression */}
                                                        {habit.statBoost && (() => {
                                                            const relevantStat = safeStats.find(s => s.name === habit.statBoost.stat);
                                                            const substatInfo = relevantStat?.subStats.find(ss => ss.name === habit.statBoost.subStat);
                                                            return (
                                                                <div className="px-3 py-2.5 md:px-4 md:py-3 border-t border-gray-700/30 bg-black/30">
                                                                    <SubstatLabel
                                                                        substat={habit.statBoost.subStat}
                                                                        taskType={habit.type}
                                                                        currentValue={substatInfo?.value || 0}
                                                                        currentRank={substatInfo?.rank as AttributeRankName || 'E' as AttributeRankName}
                                                                        tasks={growthHabits}
                                                                        compact={true}
                                                                    />
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="py-14 md:py-16 text-center border border-dashed border-gray-800/70 opacity-70 rounded-md">
                                                <Binary size={36} className="mx-auto mb-3 text-gray-600" />
                                                <p className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.6em] text-gray-600">
                                                    Scanning_For_Input
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right column – rank + tactical analysis */}
                        <div className="space-y-4 md:space-y-8 lg:pl-1">
                            <Card className="!border-purple-500/70 relative overflow-hidden !bg-black/95 shadow-[0_0_24px_rgba(168,85,247,0.35)] rounded-md">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/25 blur-[70px] -mr-16 -mt-16" />
                                <div className="relative z-10 mb-4 md:mb-5 flex items-end justify-between gap-4">
                                    <div>
                                        <p className="text-[8px] md:text-[10px] text-purple-200/80 font-black uppercase tracking-[0.38em] md:tracking-[0.45em] mb-1.5">
                                            Rank
                                        </p>
                                        <h2 className="text-2xl md:text-4xl font-black font-orbitron text-white leading-tight">
                                            {rank.name}
                                        </h2>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] md:text-[10px] text-purple-200/80 font-black uppercase tracking-[0.32em]">
                                            Performance Index
                                        </p>
                                        <p className="text-xl md:text-3xl font-black font-orbitron text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
                                            {apexThreatIndex.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-2.5 md:mb-3 h-3 md:h-4 w-full rounded-[2px] border border-gray-800 bg-gray-950/80 p-0.5 shadow-inner">
                                    <div
                                        className="relative h-full rounded-[1px] bg-gradient-to-r from-purple-500 via-fuchsia-400 to-cyan-300 shadow-[0_0_18px_rgba(168,85,247,0.7)] transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                                    </div>
                                </div>
                                <div className="relative z-10 flex justify-between text-[7.5px] md:text-[9px] text-gray-400 font-mono font-black uppercase">
                                    <span className="flex items-center gap-1">
                                        <ChevronRight size={9} /> {currentRankInfo.min}% BASE
                                    </span>
                                    <span className="text-purple-300">
                                        Upgrade {progress.toFixed(0)}%
                                    </span>
                                    <span className="flex items-center gap-1">
                                        NEXT {nextRankInfo.min}% <ChevronRight size={9} />
                                    </span>
                                </div>
                            </Card>

                            <Card className="!border-cyan-500/50 !bg-black/95 relative overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.3)] rounded-md">
                                <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-[0.04] rotate-45">
                                    <Crosshair size={110} />
                                </div>
                                <div className="relative z-10 mb-3.5 md:mb-4 flex items-center gap-2 md:gap-3 border-b border-cyan-900/40 pb-3">
                                    <Crosshair className="text-cyan-400" size={18} />
                                    <h2 className="text-[9px] md:text-xs font-black font-orbitron text-cyan-200 uppercase tracking-[0.32em] md:tracking-[0.35em]">
                                        {tacticalAdvice?.title || 'Tactical Analysis'}
                                    </h2>
                                </div>
                                {loadingAdvice ? (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                                        <span className="text-[8px] md:text-[10px] text-cyan-400 font-mono uppercase tracking-[0.3em]">
                                            Decoding_Central_Packet...
                                        </span>
                                    </div>
                                ) : tacticalAdvice ? (
                                    <ul className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1.5 md:pr-2 custom-scrollbar">
                                        {tacticalAdvice.suggestions.map((suggestion, idx) => (
                                            <li
                                                key={idx}
                                                className="group flex items-start gap-2.5 text-[9px] md:text-[11px] text-gray-300 bg-gray-900/60 p-3 md:p-3.5 rounded-md border border-cyan-900/40 font-mono tracking-tight transition-all hover:bg-cyan-900/25 hover:border-cyan-400/60"
                                            >
                                                <ChevronRight className="mt-0.5 h-3 w-3 flex-shrink-0 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                                                <span className="uppercase leading-relaxed">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-6 text-center text-[8px] md:text-[9px] text-gray-500 font-mono uppercase tracking-[0.3em]">
                                        CENTRAL awaiting data. Log a few days of activity to unlock pattern analysis.
                                    </div>
                                )}
                            </Card>

                            {/* ANALYTICS DASHBOARD WIDGET */}
                            <AnalyticsDashboardWidget
                                stats={safeStats}
                                statHistory={statHistory ?? []}
                                currentStreak={currentStreak ?? 0}
                                totalXP={safeStats.reduce((sum, s) => sum + s.value, 0)}
                                rank={rank}
                            />
                        </div>
                    </div>

                    {/* Schematic footer inside safe scroll area */}
                    <div className="mt-6 md:mt-8 flex justify-center gap-8 md:gap-10 text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em] md:tracking-[0.7em] text-gray-700 font-orbitron">
                        <span>FILE_GP_55</span>
                        <span>_SIGNAL_HARDENED</span>
                        <span>UPLINK_OMEGA</span>
                    </div>
                </div>

                <style>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `}</style>
            </main>
        </div>
    );
};

export default DashboardPage;
