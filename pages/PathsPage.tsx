
// pages/PathsPage.tsx
import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { Task, TaskType, Path, StatName, ProficiencyLevel } from '../types';
import { CheckCircle2, Circle, Settings, Shield, Layers, Plus, Check, Trophy, Cpu, Search, ChevronRight, Binary, Zap, Activity, HardDrive } from 'lucide-react';
import CompanionMessage from '../components/CompanionMessage';
import { ICON_MAP, calculateXpForNextLevel } from '../constants';
import PathEditModal from '../components/PathEditModal';
import { useNavigate } from 'react-router-dom';
import { PILLAR_LIBRARY } from '../data/pillarLibrary';
import { PRESET_PROTOCOLS } from '../data/presetProtocols';
import { TIERED_PROTOCOL_TASKS } from '../data/presetProtocolTasks';

const getProficiencyStyle = (prof?: ProficiencyLevel) => {
    switch (prof) {
        case ProficiencyLevel.Intermediate: return 'text-green-400 border-green-500/30';
        case ProficiencyLevel.Advanced: return 'text-blue-400 border-blue-500/30';
        case ProficiencyLevel.Master: return 'text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
        default: return 'text-gray-500 border-gray-800';
    }
};

const TaskItem: React.FC<{ task: Task; onComplete: () => void; isNonNegotiable?: boolean; isLast?: boolean }> = ({ task, onComplete, isNonNegotiable, isLast }) => {
    const isWeekly = task.type === TaskType.Weekly;
    
    return (
        <div className="relative pl-12 mb-4 group">
            {/* Logic Trace Line */}
            {!isLast && <div className="logic-trace-vertical" />}
            
            {/* Node Input Pin */}
            <div className="absolute left-[24px] top-[24px] w-2 h-2 rounded-full border border-gray-700 bg-black z-10" />

            <div
                onClick={!task.isCompleted ? onComplete : undefined}
                className={`relative flex items-center justify-between p-4 transition-all duration-300 border border-gray-800/40 rounded-sm bg-black/40 overflow-hidden ${
                    task.isCompleted ? 'opacity-30 grayscale' : 
                    isWeekly ? 'hover:border-amber-500/50 cursor-pointer' :
                    'hover:border-cyan-500/50 cursor-pointer'
                }`}
            >
                {/* Hardware Grid Texture */}
                <div className="absolute inset-0 blueprint-bg opacity-10 pointer-events-none" />

                <div className="flex items-center gap-5 min-w-0 z-10">
                    <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                        <div className={`absolute inset-0 rounded-sm border border-gray-800 rotate-45 transition-transform duration-500 ${!task.isCompleted ? 'group-hover:rotate-[135deg] group-hover:border-cyan-500/50' : ''}`} />
                        <Circle className={`absolute w-4 h-4 ${isWeekly ? 'text-amber-600' : isNonNegotiable ? 'text-purple-500' : 'text-gray-700'} transition-all ${task.isCompleted ? 'opacity-0' : 'opacity-100'}`} />
                        <CheckCircle2 className={`absolute w-6 h-6 text-green-500 transition-all ${task.isCompleted ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`} />
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-3">
                            <span className={`text-[8px] font-black font-mono border px-1.5 py-0.5 rounded-sm tracking-tighter ${isWeekly ? 'text-amber-400 border-amber-500/30' : 'text-cyan-400 border-cyan-500/30'}`}>
                                0x{Math.floor(Math.random()*1000).toString(16).toUpperCase()}
                            </span>
                            <p className={`truncate text-sm font-black uppercase font-orbitron tracking-wide ${task.isCompleted ? 'text-gray-700' : 'text-white'}`}>
                                {task.description}
                            </p>
                        </div>
                        <div className="flex gap-4 mt-1.5 opacity-50">
                            <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <Activity size={8} /> SIGNAL: {task.isCompleted ? 'IDLE' : 'BROADCASTING'}
                            </span>
                            <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={8} /> STAT_VEC: {task.statBoost.subStat.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-right ml-4 flex-shrink-0 z-10">
                    <div className="text-[8px] font-black text-white/20 font-mono tracking-tighter uppercase mb-0.5">PWR_DRAW</div>
                    <span className={`font-black text-sm font-orbitron ${isWeekly ? 'text-amber-400' : 'text-cyan-400'}`}>+{task.xp}v</span>
                </div>
            </div>
        </div>
    );
};

const PathsPage: React.FC = () => {
    const { gameState, isLoading, setSelectedPathId, addPath, addToast, completeTask } = useGameState();
    const [editingPath, setEditingPath] = useState<Path | null>(null);
    const [activeTab, setActiveTab] = useState<'non-negotiables' | 'growth-protocols'>('non-negotiables');
    const [selectedPillarIds, setSelectedPillarIds] = useState<Set<number>>(new Set());
    const [isCommissioningPillar, setIsCommissioningPillar] = useState(false);
    
    const [isCommissioningSpecial, setIsCommissioningSpecial] = useState(false);
    const [selectedSpecialId, setSelectedSpecialId] = useState<string | null>(null);
    const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel>(ProficiencyLevel.Novice);
    const [protocolSearch, setProtocolSearch] = useState('');

    const navigate = useNavigate();

    const filteredPresets = useMemo(() => {
        return PRESET_PROTOCOLS.filter(p => 
            p.name.toLowerCase().includes(protocolSearch.toLowerCase()) ||
            p.description.toLowerCase().includes(protocolSearch.toLowerCase())
        );
    }, [protocolSearch]);

    if (isLoading || !gameState) return <Loader text="Decrypting Protocol Schematics..." />;

    const getPillarTier = (count: number) => {
        if (count < 5) return { label: 'Fragile Baseline', color: 'text-green-500' };
        if (count < 8) return { label: 'Stable Matrix', color: 'text-blue-500' };
        return { label: 'Hardened Architecture', color: 'text-purple-500' };
    };

    const handleSelectPillar = (idx: number) => {
        setSelectedPillarIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(idx)) newSet.delete(idx);
            else if (newSet.size < 10) newSet.add(idx);
            else addToast("Identity Overload. Hard limit reached.", "error");
            return newSet;
        });
    };

    const handleCommissionPillar = () => {
        if (selectedPillarIds.size < 3) return addToast("Select at least 3 for a baseline.", "error");
        const tasks: Task[] = Array.from(selectedPillarIds).map((idx, i) => ({
            ...PILLAR_LIBRARY[idx as number],
            id: `pillar-${Date.now()}-${i}`,
            isCompleted: false
        }));
        addPath({
            id: `path-pillar-${Date.now()}`,
            name: "The Pillar (Bedrock)",
            description: "Non-negotiable identity stable-loops.",
            icon: 'Shield',
            tier: 1, level: 1, xp: 0, xpToNextLevel: calculateXpForNextLevel(1), tasks
        });
        setIsCommissioningPillar(false);
        addToast("Identity secured.", "success");
    };

    const handleCommissionSpecial = () => {
        const spec = PRESET_PROTOCOLS.find(p => p.id === selectedSpecialId);
        if (!spec || !spec.specializationId) return;

        const tasksData = TIERED_PROTOCOL_TASKS[spec.specializationId]?.[selectedProficiency];
        if (!tasksData) return addToast("Calibration failed for this level.", "error");

        const initialLevel = selectedProficiency === ProficiencyLevel.Novice ? 1 : 
                           selectedProficiency === ProficiencyLevel.Intermediate ? 6 : 
                           selectedProficiency === ProficiencyLevel.Advanced ? 11 : 16;

        const tasks: Task[] = tasksData.map((t, i) => ({
            ...t,
            id: `special-${Date.now()}-${i}`,
            isCompleted: false
        }));

        addPath({
            id: `path-special-${Date.now()}`,
            name: spec.name,
            description: spec.description,
            icon: spec.icon,
            tier: 1,
            level: initialLevel,
            xp: 0,
            xpToNextLevel: calculateXpForNextLevel(initialLevel),
            tasks,
            specializationId: spec.specializationId,
            proficiency: selectedProficiency
        });

        setIsCommissioningSpecial(false);
        setSelectedSpecialId(null);
        addToast(`${spec.name} initialized at ${selectedProficiency} tier.`, "success");
    };

    const nonNegotiablePaths = gameState.paths.filter(p => p.tasks.some(t => t.isNonNegotiable));
    const growthPaths = gameState.paths.filter(p => !p.tasks.some(t => t.isNonNegotiable));

    return (
        <div className="relative min-h-screen blueprint-bg">
            <div className="absolute inset-0 blueprint-dot pointer-events-none opacity-40" />
            
            <div className="relative z-10 p-4 md:p-10 space-y-16">
                <CompanionMessage />
                
                <div className="flex justify-center">
                    <div className="inline-flex bg-black/90 border border-gray-800 p-1.5 rounded-sm shadow-2xl backdrop-blur-2xl">
                        <button 
                            onClick={() => { setActiveTab('non-negotiables'); setIsCommissioningSpecial(false); }} 
                            className={`flex items-center gap-3 px-10 py-4 font-orbitron font-black text-[11px] tracking-[0.4em] transition-all uppercase ${activeTab === 'non-negotiables' ? 'text-purple-400 bg-purple-900/10 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)] border border-purple-500/20' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            <Shield size={14} /> _BEDROCK_ARCHITECTURE
                        </button>
                        <button 
                            onClick={() => { setActiveTab('growth-protocols'); setIsCommissioningPillar(false); }} 
                            className={`flex items-center gap-3 px-10 py-4 font-orbitron font-black text-[11px] tracking-[0.4em] transition-all uppercase ${activeTab === 'growth-protocols' ? 'text-cyan-400 bg-cyan-900/10 shadow-[inset_0_0_20px_rgba(34,211,238,0.15)] border border-cyan-500/20' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            <Zap size={14} /> _EVOLUTION_VECTORS
                        </button>
                    </div>
                </div>

                {activeTab === 'non-negotiables' ? (
                    <div className="space-y-16 animate-in fade-in duration-1000">
                        {!isCommissioningPillar && nonNegotiablePaths.length === 0 ? (
                            <div className="text-center py-24 border-2 border-dashed border-purple-900/10 bg-black/40 rounded-sm">
                                <HardDrive size={64} className="mx-auto text-purple-900/40 mb-6 animate-pulse" />
                                <h3 className="text-purple-400 font-black font-orbitron uppercase tracking-[0.6em] text-sm mb-10">System_Baseline: NO_DATA_LOCATED</h3>
                                <button onClick={() => setIsCommissioningPillar(true)} className="btn-primary px-16 py-5 text-xs font-black tracking-[0.4em]">INIT_COMMISSION_SEQUENCE</button>
                            </div>
                        ) : isCommissioningPillar ? (
                            <div className="space-y-12 pb-32">
                                <div className="text-center space-y-2">
                                    <h2 className="text-5xl font-black font-orbitron text-white uppercase tracking-tighter chromatic-text">Module Selection</h2>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] italic">"NON-NEGOTIABLES DEFINE IDENTITY STABILITY, NOT PRODUCTIVITY."</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {PILLAR_LIBRARY.map((opt, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => handleSelectPillar(i)} 
                                            className={`p-6 border rounded-sm cursor-pointer transition-all duration-300 relative group ${selectedPillarIds.has(i) ? 'bg-purple-900/10 border-purple-500' : 'bg-black/60 border-gray-800/40 hover:border-gray-500'}`}
                                        >
                                            <div className="absolute top-2 left-2 text-[6px] text-gray-800 font-black font-mono">0x{i.toString(16).padStart(3, '0')}</div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[8px] font-black uppercase text-purple-500 bg-purple-950/40 px-2 py-0.5 rounded-sm tracking-widest">{opt.category}</span>
                                                    <p className="text-sm font-bold text-gray-100 mt-3 uppercase tracking-tight leading-tight">{opt.description}</p>
                                                </div>
                                                {selectedPillarIds.has(i) && <div className="p-1 bg-purple-500 rounded-full text-black shadow-[0_0_15px_#a855f7]"><Check size={12} strokeWidth={4} /></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[100]">
                                    <div className="bg-black/95 border border-purple-500/40 p-6 rounded-sm flex justify-between items-center gap-12 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-3xl">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">ARCHITECTURE_LOAD: {selectedPillarIds.size} NODES</span>
                                            <span className={`text-xs font-black uppercase tracking-[0.3em] ${getPillarTier(selectedPillarIds.size).color}`}>{getPillarTier(selectedPillarIds.size).label}</span>
                                        </div>
                                        <div className="flex gap-6">
                                            <button onClick={() => setIsCommissioningPillar(false)} className="px-8 py-2 text-[10px] font-black uppercase text-gray-600 hover:text-white transition-colors tracking-widest">_ABORT</button>
                                            <button onClick={handleCommissionPillar} disabled={selectedPillarIds.size < 3} className="btn-primary px-12 py-4 text-[11px] font-black">SEAL_ARCH_V5</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            nonNegotiablePaths.map(path => (
                                <div key={path.id} className="space-y-10">
                                    <div className="flex items-center justify-between border-b border-purple-900/20 pb-6">
                                        <div className="flex items-center gap-8">
                                            <div className="p-4 bg-purple-600/5 border border-purple-500/30 rounded-sm">
                                                <Shield className="text-purple-400" size={28} />
                                            </div>
                                            <div>
                                                <h3 className="font-orbitron font-black text-white uppercase tracking-[0.5em] text-2xl">{path.name}</h3>
                                                <div className="flex items-center gap-6 mt-2 opacity-50">
                                                    <span className={`text-[10px] font-black uppercase ${getPillarTier(path.tasks.length).color} tracking-[0.2em]`}>_SYS_HEALTH: {getPillarTier(path.tasks.length).label}</span>
                                                    <span className="text-[9px] text-gray-500 font-mono">NODES_INSTALLED: 0x{path.tasks.length.toString(16)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => { setSelectedPathId(path.id); setEditingPath(path); }} className="p-3 text-gray-700 hover:text-white transition-all bg-gray-900/30 border border-gray-800 rounded-sm"><Settings size={20}/></button>
                                    </div>
                                    <div className="flex flex-col">
                                        {path.tasks.map((t, idx) => <TaskItem key={t.id} task={t} isNonNegotiable={true} onComplete={() => completeTask(path.id, t.id)} isLast={idx === path.tasks.length - 1} />)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="space-y-16 animate-in fade-in duration-1000">
                        {isCommissioningSpecial ? (
                            <div className="space-y-12 pb-32">
                                <div className="text-center space-y-2">
                                    <h2 className="text-5xl font-black font-orbitron text-white uppercase tracking-tighter chromatic-text">Vector Selection</h2>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] italic">"COMPREHENSIVE HOBBY-SPECIFIC PROTOCOLS FOR ULTIMATE PROFICIENCY."</p>
                                </div>

                                <div className="max-w-2xl mx-auto flex items-center bg-black border border-gray-800 rounded-sm p-5 group focus-within:border-cyan-500 transition-all shadow-2xl">
                                    <Search className="text-gray-800 group-focus-within:text-cyan-500 mr-6" size={28} />
                                    <input 
                                        type="text" 
                                        placeholder="QUERY 50+ SPECIALIZED GROWTH VECTORS..."
                                        value={protocolSearch}
                                        onChange={(e) => setProtocolSearch(e.target.value)}
                                        className="bg-transparent w-full text-white font-mono text-sm outline-none tracking-[0.2em] placeholder:text-gray-800"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
                                    {filteredPresets.map(spec => (
                                        <div 
                                            key={spec.id} 
                                            onClick={() => setSelectedSpecialId(spec.id)}
                                            className={`p-8 border rounded-sm cursor-pointer transition-all duration-300 flex items-start gap-6 relative overflow-hidden group ${selectedSpecialId === spec.id ? 'bg-cyan-600/10 border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.2)]' : 'bg-black/80 border-gray-800 hover:border-gray-500'}`}
                                        >
                                            <div className="p-4 bg-gray-950 border border-gray-800 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                {React.createElement(ICON_MAP[spec.icon] || Cpu, { className: "text-cyan-500 w-7 h-7" })}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-orbitron font-black text-white uppercase tracking-[0.2em] text-sm truncate">{spec.name}</h3>
                                                <p className="text-[10px] text-gray-600 mt-3 leading-relaxed uppercase font-mono tracking-tighter opacity-80">{spec.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {selectedSpecialId && (
                                    <div className="bg-black/90 border border-cyan-900/40 p-10 rounded-sm space-y-10 animate-in slide-in-from-bottom-12 shadow-2xl">
                                        <div className="flex items-center gap-6">
                                            <Trophy className="text-amber-500" size={32} />
                                            <h4 className="font-orbitron font-black text-gray-400 uppercase tracking-[0.4em] text-sm">Calibration Target: <span className="text-white bg-cyan-950/40 px-3 py-1 border border-cyan-500/20">{PRESET_PROTOCOLS.find(p=>p.id===selectedSpecialId)?.name}</span></h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            {Object.values(ProficiencyLevel).map(prof => (
                                                <button 
                                                    key={prof} 
                                                    onClick={() => setSelectedProficiency(prof)}
                                                    className={`py-5 px-4 border font-black font-orbitron text-[11px] uppercase tracking-[0.3em] transition-all rounded-sm ${selectedProficiency === prof ? 'bg-cyan-600 text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'bg-gray-950 text-gray-600 border-gray-800 hover:text-white'}`}
                                                >
                                                    {prof}_MOD
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[100]">
                                    <div className="bg-black border border-cyan-500/40 p-6 rounded-sm flex justify-end items-center gap-8 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-3xl">
                                        <button onClick={() => setIsCommissioningSpecial(false)} className="px-10 py-2 text-[10px] font-black uppercase text-gray-700 hover:text-white transition-colors tracking-widest">_ABORT_UPLINK</button>
                                        <button onClick={handleCommissionSpecial} disabled={!selectedSpecialId} className="btn-primary bg-cyan-600 shadow-[0_0_40px_rgba(34,211,238,0.4)] px-16 py-5 text-[12px] font-black">INITIATE_VEC_SYNC</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {growthPaths.map(path => (
                                    <div key={path.id} className="bg-black/40 border border-gray-800 p-10 rounded-sm relative overflow-hidden group hover:border-cyan-500/20 transition-all shadow-2xl">
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity pointer-events-none rotate-6">
                                            {React.createElement(ICON_MAP[path.icon] || Layers, { size: 240 })}
                                        </div>
                                        
                                        <div className="flex justify-between items-start mb-12 relative z-10">
                                            <div className="flex gap-8">
                                                <div className="p-5 bg-cyan-600/5 border border-cyan-500/30 rounded-sm">
                                                    {React.createElement(ICON_MAP[path.icon] || Layers, { size: 36, className: "text-cyan-500" })}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-6">
                                                        <h3 className="text-3xl font-orbitron font-black text-white uppercase tracking-[0.3em]">{path.name}</h3>
                                                        {path.proficiency && (
                                                            <span className={`px-4 py-1.5 border text-[10px] font-black uppercase tracking-[0.2em] ${getProficiencyStyle(path.proficiency)}`}>
                                                                {path.proficiency}_VEC
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-gray-500 uppercase font-mono mt-3 tracking-[0.2em] max-w-2xl italic leading-relaxed opacity-60">" {path.description} "</p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <div className="text-3xl font-black text-cyan-400 font-orbitron drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">LVL_{path.level.toString().padStart(2, '0')}</div>
                                                <div className="flex flex-col items-end mt-3">
                                                    <div className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">V_CHARGE: {path.xp} / {path.xpToNextLevel}</div>
                                                    <div className="w-48 h-1.5 bg-gray-950 mt-2 overflow-hidden rounded-full border border-gray-900 shadow-inner">
                                                        <div className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_#22d3ee]" style={{ width: `${(path.xp / path.xpToNextLevel) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col relative z-10">
                                            {path.tasks.map((t, idx) => <TaskItem key={t.id} task={t} onComplete={() => completeTask(path.id, t.id)} isLast={idx === path.tasks.length - 1} />)}
                                        </div>

                                        <div className="mt-12 flex justify-end relative z-10 border-t border-gray-900/50 pt-6">
                                            <button onClick={() => { setSelectedPathId(path.id); setEditingPath(path); }} className="flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase text-gray-600 hover:text-cyan-400 transition-all bg-gray-950/40 border border-gray-800 hover:border-cyan-500/30 tracking-widest"><Settings size={16}/> MODULE_CONFIG</button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <button 
                                        onClick={() => setIsCommissioningSpecial(true)} 
                                        className="group relative h-56 bg-black/60 border-2 border-dashed border-cyan-900/20 rounded-sm hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center text-center space-y-6 overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute inset-0 blueprint-bg opacity-[0.03] group-hover:opacity-[0.1] transition-opacity" />
                                        <div className="p-6 bg-cyan-600 text-black rounded-sm group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.3)] relative z-10"><Plus size={40} /></div>
                                        <div className="relative z-10">
                                            <h4 className="font-orbitron font-black text-white text-xl uppercase tracking-[0.4em]">Hardware Module</h4>
                                            <p className="text-[11px] text-gray-700 mt-3 uppercase font-mono font-bold tracking-[0.2em]">_INSTALL TACTICAL SPECIALIZATION</p>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => navigate('/order')} 
                                        className="group relative h-56 bg-black/60 border-2 border-dashed border-purple-900/20 rounded-sm hover:border-purple-500/50 transition-all flex flex-col items-center justify-center text-center space-y-6 overflow-hidden shadow-2xl"
                                    >
                                        <div className="absolute inset-0 blueprint-bg opacity-[0.03] group-hover:opacity-[0.1] transition-opacity" />
                                        <div className="p-6 bg-purple-600 text-white rounded-sm group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.3)] relative z-10"><Cpu size={40} /></div>
                                        <div className="relative z-10">
                                            <h4 className="font-orbitron font-black text-white text-xl uppercase tracking-[0.4em]">Hybrid Firmware</h4>
                                            <p className="text-[11px] text-gray-700 mt-3 uppercase font-mono font-bold tracking-[0.2em]">_CENTRAL_CORE_INTERFACE</p>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
                {editingPath && <PathEditModal path={editingPath} onClose={() => setEditingPath(null)} />}
            </div>
        </div>
    );
};

export default PathsPage;
