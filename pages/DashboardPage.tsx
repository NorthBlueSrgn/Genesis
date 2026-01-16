
// pages/DashboardPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { Link } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import CompanionMessage from '../components/CompanionMessage';
import { RANKS, ATTRIBUTE_RANKS, RANK_PERCENTILES } from '../constants';
import { Stat, StatName, SubStatName, Task, TaskType } from '../types';
import { ArrowRight, Activity, TrendingUp, Flame, Calendar, BarChart, Crosshair, Check, Zap, ListChecks, Shield, PenLine, Headphones, Binary, Cloud, Clock, FileText, ChevronRight, LayoutGrid, Globe, Languages, Plus } from 'lucide-react';
import { calculateScores } from '../services/scoringService';
import { generateTacticalSuggestions } from '../services/geminiService';

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
        <Card className="!bg-black/95 border-cyan-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 pointer-events-none">
                <Globe size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] flex items-center gap-2">
                            <Languages size={12} /> Neural_Linguistic_Sync
                        </span>
                        <h3 className="text-2xl font-black font-orbitron text-white mt-1 uppercase tracking-tighter">
                            DS_LVL_{currentLevel.level}
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Total_Hours</span>
                        <p className="text-lg font-black font-mono text-cyan-400">{totalHours.toFixed(1)}h</p>
                    </div>
                </div>

                <div className="flex-grow space-y-4">
                    <div className="bg-cyan-950/20 border border-cyan-900/30 p-3 rounded-sm">
                        <p className="text-[9px] text-cyan-300 font-black uppercase tracking-widest mb-1">Current_Phase</p>
                        <p className="text-xs font-bold text-gray-200 uppercase font-mono">{currentLevel.label} // {currentLevel.activity}</p>
                    </div>

                    {/* Quick Log Input */}
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                             <input 
                                type="number" 
                                value={logInput}
                                onChange={(e) => setLogInput(e.target.value)}
                                placeholder="Log Hours..."
                                className="w-full bg-black/60 border border-gray-800 p-2 text-sm text-cyan-400 font-mono focus:border-cyan-500 outline-none rounded-sm placeholder:text-gray-700"
                             />
                             <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-700 font-black uppercase pointer-events-none">Hrs</span>
                        </div>
                        <button 
                            onClick={handleQuickLog}
                            className="bg-cyan-600 hover:bg-cyan-500 text-black p-2 px-3 rounded-sm transition-all flex items-center gap-1 active:scale-95"
                        >
                            <Plus size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Sync</span>
                        </button>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest">
                            <span>Synapse_Growth</span>
                            {nextLevel && <span>T-Minus {(nextLevel.hours - totalHours).toFixed(1)}h to LVL_{nextLevel.level}</span>}
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                            <div 
                                className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_#22d3ee]" 
                                style={{ width: `${progress}%` }} 
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
                    <span className="text-[7px] text-gray-700 font-mono">_ALG: DREAMING_SPANISH_V1</span>
                    <Link to="/paths" className="text-[8px] font-black text-cyan-500 hover:underline uppercase tracking-widest flex items-center gap-1">
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
        <div className="bg-black/60 border border-gray-800 p-4 rounded-sm">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-2">
                    <LayoutGrid size={12} className="text-cyan-500" /> Neural_Pulse_Registry
                </span>
                <span className="text-[8px] text-gray-600 font-mono">_LAST_28_CYCLES</span>
            </div>
            <div className="grid grid-cols-7 md:grid-cols-14 gap-1.5">
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
    const { gameState, isLoading, completeTask } = useGameState();
    const [tacticalAdvice, setTacticalAdvice] = useState<{ title: string; suggestions: string[] } | null>(null);
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    
    useEffect(() => {
        if (gameState && !tacticalAdvice && !loadingAdvice) {
            const cacheKey = `genesis_tactical_advice_${gameState.userName}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                setTacticalAdvice(JSON.parse(cached));
            } else {
                setLoadingAdvice(true);
                generateTacticalSuggestions(gameState.stats, gameState.archetypeTitle || 'Average')
                    .then(advice => {
                        setTacticalAdvice(advice);
                        localStorage.setItem(cacheKey, JSON.stringify(advice));
                    })
                    .finally(() => setLoadingAdvice(false));
            }
        }
    }, [gameState]);
    
    if (isLoading || !gameState) return <Loader text="Loading Dashboard Interface..." />;

    const { rank, stats, currentStreak, statHistory, dailyMetrics, paths, journal, totalImmersionHours } = gameState;
    const { apexThreatIndex } = calculateScores(stats);
    const currentRankInfo = RANK_PERCENTILES[rank.name];
    const nextRank = RANKS[RANKS.findIndex(r => r.name === rank.name) + 1] || null;
    const nextRankInfo = nextRank ? RANK_PERCENTILES[nextRank.name] : { min: 100 };

    let progress = 0;
    const range = nextRankInfo.min - currentRankInfo.min;
    if (range > 0) {
        progress = ((apexThreatIndex - currentRankInfo.min) / range) * 100;
    } else {
        progress = 100;
    }

    const growthHabits = paths.flatMap(p => p.tasks.filter(t => !t.isNonNegotiable).map(t => ({ ...t, pathId: p.id, pathName: p.name })));
    
    return (
        <div className="space-y-6 blueprint-bg min-h-screen p-4 md:p-8">
            <div className="absolute inset-0 blueprint-dot pointer-events-none opacity-20" />
            
            <CompanionMessage />
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6 bg-black/90 p-5 border border-gray-800 rounded-sm shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-purple-600/10 rounded-sm border border-purple-500/30 group">
                        <Cloud size={24} className="text-purple-400 animate-pulse group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">Central_Link_Status</p>
                        <p className="text-xs font-bold text-green-400 flex items-center gap-3 uppercase font-orbitron mt-1">
                            Operational_B256 <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                        </p>
                    </div>
                </div>
                <div className="flex gap-6 items-center">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-1.5">Cycle_Reset_Approaching</p>
                        <ResetCountdown />
                    </div>
                    {gameState.calibrationAnalysis && (
                        <Link to="/rank" className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 hover:border-purple-500/50 px-5 py-2.5 rounded-sm transition-all group shadow-lg">
                            <FileText size={16} className="text-gray-500 group-hover:text-purple-400" />
                            <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white tracking-[0.2em]">View Dossier</span>
                        </Link>
                    )}
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* TOP STATS & DS WIDGET */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="text-center !border-purple-500/20 !bg-black/60">
                                <Activity className="mx-auto mb-2 text-purple-400" size={20} />
                                <p className="text-2xl font-black font-orbitron text-purple-400">{apexThreatIndex.toFixed(1)}%</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">Apex_Index</p>
                            </Card>
                            <Card className="text-center !border-purple-500/20 !bg-black/60">
                                <TrendingUp className="mx-auto mb-2 text-purple-400" size={20} />
                                <p className="text-2xl font-black font-orbitron text-purple-400">{stats.reduce((s, a) => s + a.value, 0).toLocaleString()}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">Total_Volts</p>
                            </Card>
                            <Card className="text-center !border-purple-500/20 !bg-black/60">
                                <Flame className="mx-auto mb-2 text-purple-400" size={20} />
                                <p className="text-2xl font-black font-orbitron text-purple-400">{currentStreak}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">Active_Days</p>
                            </Card>
                            <Card className="text-center !border-purple-500/20 !bg-black/60">
                                <Calendar className="mx-auto mb-2 text-purple-400" size={20} />
                                <p className="text-2xl font-black font-orbitron text-purple-400">{new Set(statHistory.map(h => h.date.split('T')[0])).size}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1">Uptime_Log</p>
                            </Card>
                        </div>
                        <NeuralLinguisticSync totalHours={totalImmersionHours} />
                    </div>

                    <NeuralPulseHeatmap history={statHistory} />

                    <Card className="!bg-black/80 border-cyan-500/20 relative overflow-hidden">
                        <div className="absolute inset-0 blueprint-bg opacity-10" />
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-8 border-b border-cyan-900/30 pb-4">
                                <h2 className="text-xl font-black font-orbitron text-cyan-400 tracking-[0.3em] uppercase flex items-center gap-3">
                                    <ListChecks className="text-cyan-500" /> _BIO_GROWTH_LEDGER
                                </h2>
                                <div className="text-[9px] font-black text-gray-600 uppercase flex gap-6">
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-cyan-500 rounded-[1px] shadow-[0_0_8px_#22d3ee]" /> Daily_Sync</span>
                                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-[1px] shadow-[0_0_8px_#fbbf24]" /> Weekly_Phase</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                                {growthHabits.length > 0 ? growthHabits.map((habit) => (
                                    <div 
                                        key={habit.id} 
                                        onClick={() => !habit.isCompleted && completeTask(habit.pathId, habit.id)}
                                        className={`group relative flex items-center justify-between p-4 border rounded-sm transition-all duration-300 cursor-pointer ${
                                            habit.isCompleted ? 'bg-green-950/5 border-green-900/20 opacity-30 grayscale' : 
                                            habit.type === TaskType.Weekly ? 'bg-amber-900/5 border-amber-900/30 hover:border-amber-500/50 hover:bg-amber-900/10' : 
                                            'bg-gray-900/40 border-gray-800 hover:border-cyan-500/50 hover:bg-cyan-900/5'
                                        }`}
                                    >
                                        <div className="flex items-center gap-5 min-w-0">
                                            <div className={`text-[10px] font-black font-mono w-10 text-center flex-shrink-0 border p-1 rounded-sm ${habit.type === TaskType.Weekly ? 'text-amber-500 border-amber-900/50' : 'text-cyan-600 border-cyan-900/50'}`}>
                                                {habit.type === TaskType.Weekly ? 'WEEK' : 'DAY'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-[13px] font-black uppercase tracking-tight truncate ${habit.isCompleted ? 'text-gray-700' : 'text-gray-100'}`}>{habit.description}</p>
                                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1">{habit.pathName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-[11px] font-black font-mono text-cyan-500/60">SYNC: +{habit.xp}v</span>
                                            <div className={`w-6 h-6 rounded-[1px] border transition-all duration-500 flex items-center justify-center ${habit.isCompleted ? 'bg-green-500 border-green-400 text-black shadow-[0_0_15px_#4ade80]' : 'bg-black border-gray-800 group-hover:border-gray-500'}`}>
                                                {habit.isCompleted && <Check size={14} strokeWidth={4} />}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-20 text-center border border-dashed border-gray-800 opacity-20">
                                        <Binary size={48} className="mx-auto mb-4" />
                                        <p className="text-xs uppercase font-black tracking-[1em]">Scanning_For_Input</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* RANK PROGRESSION */}
                    <Card className="!border-purple-500/30 relative overflow-hidden !bg-black/95">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[80px] -mr-16 -mt-16" />
                        <div className="flex justify-between items-end mb-6 relative z-10">
                            <div>
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em] mb-2">Operational_Grade</p>
                                <h2 className="text-5xl font-black font-orbitron text-white chromatic-text">{rank.name}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Hati_Index</p>
                                <p className="text-3xl font-black font-orbitron text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">{apexThreatIndex.toFixed(1)}%</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-900 rounded-[1px] h-4 border border-gray-800 p-0.5 mb-4 shadow-inner relative">
                            <div className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-cyan-400 h-full rounded-[1px] transition-all duration-1000 shadow-[0_0_20px_rgba(168,85,247,0.5)]" style={{width: `${progress}%`}}>
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                        <div className="flex justify-between text-[9px] text-gray-500 font-mono font-black uppercase relative z-10">
                            <span className="flex items-center gap-1"><ChevronRight size={10} /> {currentRankInfo.min}% BASE</span>
                            <span className="text-purple-500 animate-flicker">UPGRADE_PROXIMITY: {progress.toFixed(0)}%</span>
                            <span className="flex items-center gap-1">NEXT {nextRankInfo.min}% <ChevronRight size={10} /></span>
                        </div>
                    </Card>

                    {/* TACTICAL ANALYSIS */}
                    <Card className="!border-cyan-500/30 !bg-black/95 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-45"><Crosshair size={120} /></div>
                        <div className="relative z-10 flex items-center gap-3 mb-6 border-b border-cyan-900/30 pb-3">
                            <Crosshair className="text-cyan-400" size={20} />
                            <h2 className="text-xs font-black font-orbitron text-cyan-300 uppercase tracking-[0.4em]">{tacticalAdvice?.title || "Tactical Analysis"}</h2>
                        </div>
                        {loadingAdvice ? (
                            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                                <span className="text-cyan-500 animate-pulse font-mono text-[10px] uppercase tracking-[0.3em]">Decoding_Central_Packet...</span>
                            </div>
                        ) : tacticalAdvice ? (
                            <ul className="space-y-3">
                                {tacticalAdvice.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="group flex items-start gap-3 text-[11px] text-gray-400 bg-gray-900/40 p-4 rounded-sm border border-cyan-900/20 font-mono tracking-tight transition-all hover:bg-cyan-900/10 hover:border-cyan-500/40">
                                        <ChevronRight className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                                        <span className="uppercase leading-relaxed">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </Card>
                </div>
            </div>

            {/* Schematic Style Footer */}
            <div className="relative z-10 mt-12 flex justify-center gap-16 text-[9px] font-black uppercase tracking-[0.8em] text-gray-800 font-orbitron">
                <span>FILE_GP_55</span>
                <span className="animate-flicker">_SIGNAL_HARDENED</span>
                <span>UPLINK_OMEGA</span>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default DashboardPage;
