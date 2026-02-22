// pages/PathsPage.tsx
import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';
import { Task, TaskType, Path, StatName, ProficiencyLevel } from '../types';
import { CheckCircle2, Circle, Settings, Shield, Layers, Plus, Check, Trophy, Cpu, Search, ChevronRight, Binary, Zap, Activity, HardDrive, TrendingUp, Edit2, Trash2, GripVertical, StickyNote, Pause, PenLine } from 'lucide-react';
import CompanionMessage from '../components/CompanionMessage';
import { ICON_MAP, calculateXpForNextLevel } from '../constants';
import PathEditModal from '../components/PathEditModal';
import TaskEditModal from '../components/TaskEditModal';
import { useNavigate } from 'react-router-dom';
import { PILLAR_LIBRARY } from '../data/pillarLibrary';
import { PRESET_PROTOCOLS } from '../data/presetProtocols';
import { TIERED_PROTOCOL_TASKS } from '../data/presetProtocolTasks';

const getProficiencyStyle = (prof?: ProficiencyLevel) => {
    switch (prof) {
        case ProficiencyLevel.NovicePlus: return 'text-emerald-400 border-emerald-500/30';
        case ProficiencyLevel.Intermediate: return 'text-green-400 border-green-500/30';
        case ProficiencyLevel.IntermediatePlus: return 'text-teal-400 border-teal-500/30';
        case ProficiencyLevel.Advanced: return 'text-blue-400 border-blue-500/30';
        case ProficiencyLevel.AdvancedPlus: return 'text-indigo-400 border-indigo-500/30';
        case ProficiencyLevel.Master: return 'text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
        case ProficiencyLevel.MasterPlus: return 'text-yellow-300 border-yellow-400/40 shadow-[0_0_20px_rgba(253,224,71,0.4)]';
        default: return 'text-gray-500 border-gray-800'; // Novice
    }
};

const TaskItem: React.FC<{ 
    task: Task; 
    onComplete: () => void; 
    onIncrement?: () => void; 
    onEdit?: () => void;
    isNonNegotiable?: boolean; 
    isLast?: boolean;
    isDraggable?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
}> = ({ task, onComplete, onIncrement, onEdit, isNonNegotiable, isLast, isDraggable, onDragStart, onDragOver, onDrop }) => {
    const isWeekly = task.type === TaskType.Weekly;
    const hasCounter = isWeekly && task.targetCount && task.targetCount > 1;
    const currentCount = task.currentCount || 0;
    const targetCount = task.targetCount || 1;
    const progress = hasCounter ? `${currentCount}/${targetCount}` : null;
    const [showNotes, setShowNotes] = useState(false);
    const [celebrating, setCelebrating] = useState(false);
    
    // Skip rendering snoozed tasks
    if (task.isSnoozed) return null;

    const handleComplete = () => {
        onComplete();
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 600);
    };
    
    return (
        <div 
            className="relative pl-0 md:pl-8 mb-4 md:mb-3 group"
            draggable={isDraggable && !task.isCompleted}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {/* Logic Trace Line - Desktop Only */}
            {!isLast && <div className="logic-trace-vertical hidden md:block" />}
            
            {/* Node Input Pin - Desktop Only */}
            <div className="absolute left-2 md:left-[20px] top-[20px] w-2 h-2 rounded-full border border-gray-700 bg-black z-10 hidden md:block" />

            <div
                className={`relative transition-all duration-300 border-l-4 md:border-l-0 md:border rounded-lg md:rounded-sm overflow-hidden backdrop-blur-sm ${
                    task.isCompleted 
                        ? 'opacity-60 grayscale border-gray-600 bg-gray-700/10' 
                        : task.type === TaskType.Weekly 
                            ? 'border-amber-500/70 bg-gradient-to-r from-amber-900/25 to-transparent hover:border-amber-300 hover:from-amber-800/40 shadow-[0_0_20px_rgba(251,191,36,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                            : 'border-purple-500/70 bg-gradient-to-r from-purple-900/25 to-transparent hover:border-purple-300 hover:from-purple-800/40 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                } ${celebrating ? 'animate-pulse scale-105' : ''}`}
            >
                {/* Decorative glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${task.type === TaskType.Weekly ? 'bg-amber-500/5' : 'bg-purple-500/5'}`} />

                <div className="p-3.5 md:p-4 z-10 relative flex items-start gap-3 md:gap-4">
                    {/* Checkbox - Larger on mobile for better UX */}
                    <button
                        onClick={!task.isCompleted && !hasCounter ? handleComplete : undefined}
                        className="relative w-7 h-7 md:w-8 md:h-8 flex-shrink-0 flex items-center justify-center mt-1"
                        disabled={Boolean(task.isCompleted || hasCounter)}
                    >
                        <div className={`absolute inset-0 rounded-sm border-2 transition-all duration-300 ${!task.isCompleted ? `border-${isWeekly ? 'amber' : 'purple'}-400 group-hover:border-${isWeekly ? 'amber' : 'purple'}-300` : 'border-green-500'}`} />
                        <Circle className={`absolute w-3 h-3 md:w-4 md:h-4 ${isWeekly ? 'text-amber-400' : isNonNegotiable ? 'text-purple-400' : 'text-purple-400'} transition-all ${task.isCompleted ? 'opacity-0' : 'opacity-100'}`} />
                        <CheckCircle2 className={`absolute w-6 h-6 md:w-6 md:h-6 text-green-400 transition-all drop-shadow-lg ${task.isCompleted ? 'opacity-100 scale-110' : 'opacity-0 scale-50'}`} />
                    </button>
                    
                    {/* Task Content + mobile-friendly edit / delete actions */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className={`text-[8px] md:text-[8.5px] font-black font-mono border px-2 py-0.5 rounded tracking-widest ${
                                task.type === TaskType.Weekly ? 'text-amber-200 border-amber-500/60 bg-amber-950/30' : 'text-purple-200 border-purple-500/60 bg-purple-950/30'
                            }`}>
                                {task.type === TaskType.Weekly ? 'WEEKLY' : 'DAILY'}
                            </span>
                            {onEdit && (
                                <button
                                    type="button"
                                    onClick={onEdit}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-900/80 border border-gray-700/80 text-[9px] font-mono text-gray-300 active:scale-95"
                                >
                                    <PenLine className="w-3 h-3" /> Edit
                                </button>
                            )}
                        </div>
                        <p className={`text-[13px] md:text-[13px] font-bold uppercase tracking-wider leading-snug ${task.isCompleted ? 'text-gray-500' : 'text-white'}`}>
                            {task.description}
                        </p>
                        {hasCounter && (
                            <div className="text-[11px] md:text-[11px] font-mono font-bold text-purple-300 mt-3 flex items-center gap-2">
                                <span className="inline-block w-5 h-5 border border-purple-500/50 rounded-sm text-center text-[8px] leading-[18px] font-bold">{currentCount}</span>
                                <span className="text-gray-500">/</span>
                                <span>{targetCount}</span>
                            </div>
                        )}
                    </div>

                    {/* Optional drag handle remains, only on desktop */}
                    {isDraggable && !task.isCompleted && (
                        <div className="cursor-move touch-none opacity-30 hover:opacity-100 transition-opacity hidden md:block">
                            <GripVertical className="w-4 h-4 text-gray-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PathsPage: React.FC = () => {
    const { 
        gameState, isLoading, setSelectedPathId, addPath, addToast, completeTask, incrementWeeklyTask,
        editTask, reorderTasks, snoozeTask, unsnoozeTask, deleteTaskFromPath
    } = useGameState();
    const [editingPath, setEditingPath] = useState<Path | null>(null);
    const [editingTask, setEditingTask] = useState<{ task: Task; pathId: string } | null>(null);
    const [draggedTask, setDraggedTask] = useState<{ taskId: string; pathId: string } | null>(null);
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
                           selectedProficiency === ProficiencyLevel.NovicePlus ? 3 :
                           selectedProficiency === ProficiencyLevel.Intermediate ? 6 : 
                           selectedProficiency === ProficiencyLevel.IntermediatePlus ? 9 :
                           selectedProficiency === ProficiencyLevel.Advanced ? 12 : 
                           selectedProficiency === ProficiencyLevel.AdvancedPlus ? 15 :
                           selectedProficiency === ProficiencyLevel.Master ? 18 : 21; // MasterPlus

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

    // Drag and drop handlers
    const handleDragStart = (pathId: string, taskId: string) => (e: React.DragEvent) => {
        setDraggedTask({ taskId, pathId });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (pathId: string, targetTaskId: string) => (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedTask || draggedTask.pathId !== pathId) return;

        const path = gameState.paths.find(p => p.id === pathId);
        if (!path) return;

        const taskIds = path.tasks.map(t => t.id);
        const draggedIndex = taskIds.indexOf(draggedTask.taskId);
        const targetIndex = taskIds.indexOf(targetTaskId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Reorder
        const newTaskIds = [...taskIds];
        newTaskIds.splice(draggedIndex, 1);
        newTaskIds.splice(targetIndex, 0, draggedTask.taskId);

        reorderTasks(pathId, newTaskIds);
        setDraggedTask(null);
    };

    return (
        <div className="relative min-h-screen bg-[#050509] text-white">
            <div className="absolute inset-0 blueprint-dot pointer-events-none opacity-30" />
            
            {/* Task Edit Modal */}
            {editingTask && (
                <TaskEditModal
                    task={editingTask.task}
                    pathId={editingTask.pathId}
                    onClose={() => setEditingTask(null)}
                    onSave={(updates) => editTask(editingTask.pathId, editingTask.task.id, updates)}
                    onDelete={() => deleteTaskFromPath(editingTask.pathId, editingTask.task.id)}
                    onSnooze={(until) => snoozeTask(editingTask.pathId, editingTask.task.id, until)}
                    onUnsnooze={() => unsnoozeTask(editingTask.pathId, editingTask.task.id)}
                />
            )}
            
            <div className="relative z-10 p-3 md:p-10 space-y-6 md:space-y-16">
                <Card className="!bg-black/92 border-purple-500/40 shadow-[0_0_22px_rgba(168,85,247,0.25)]">
                    <CompanionMessage />
                </Card>
                
                <div className="flex justify-center">
                    <div className="inline-flex bg-black/90 border border-gray-800 p-1 md:p-1.5 rounded-sm shadow-2xl backdrop-blur-2xl gap-1">
                        <button 
                            onClick={() => { setActiveTab('non-negotiables'); setIsCommissioningSpecial(false); }} 
                            className={`flex items-center gap-2 px-4 md:px-10 py-2 md:py-4 font-orbitron font-black text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] transition-all uppercase ${activeTab === 'non-negotiables' ? 'text-purple-400 bg-purple-900/10 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)] border border-purple-500/20' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            <Shield size={12} className="md:w-3.5 md:h-3.5" /> <span className="hidden md:inline">_BEDROCK_ARCHITECTURE</span><span className="md:hidden">BEDROCK</span>
                        </button>
                        <button 
                            onClick={() => { setActiveTab('growth-protocols'); setIsCommissioningPillar(false); }} 
                            className={`flex items-center gap-2 px-4 md:px-10 py-2 md:py-4 font-orbitron font-black text-[9px] md:text-[11px] tracking-[0.3em] md:tracking-[0.4em] transition-all uppercase ${activeTab === 'growth-protocols' ? 'text-cyan-400 bg-cyan-900/10 shadow-[inset_0_0_20px_rgba(34,211,238,0.15)] border border-cyan-500/20' : 'text-gray-600 hover:text-gray-400'}`}
                        >
                            <Zap size={12} className="md:w-3.5 md:h-3.5" /> <span className="hidden md:inline">_EVOLUTION_VECTORS</span><span className="md:hidden">EVOLUTION</span>
                        </button>
                    </div>
                </div>

                {activeTab === 'non-negotiables' ? (
                    <div className="space-y-12 md:space-y-16 animate-in fade-in duration-1000">
                        {!isCommissioningPillar && nonNegotiablePaths.length === 0 ? (
                            <div className="text-center py-16 md:py-24 border-2 border-dashed border-purple-500/30 bg-gray-900/60 rounded-sm">
                                <HardDrive size={48} className="md:w-16 md:h-16 mx-auto text-purple-400/60 mb-5 md:mb-6 animate-pulse" />
                                <h3 className="text-purple-300 font-black font-orbitron uppercase tracking-[0.4em] md:tracking-[0.6em] text-xs md:text-sm mb-8 md:mb-10">System_Baseline: NO_DATA_LOCATED</h3>
                                <button onClick={() => setIsCommissioningPillar(true)} className="btn-primary px-10 md:px-16 py-3 md:py-5 text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.4em]">INIT_COMMISSION_SEQUENCE</button>
                            </div>
                        ) : isCommissioningPillar ? (
                            <div className="space-y-12 pb-32">
                                <div className="text-center space-y-2">
                                    <h2 className="text-4xl md:text-5xl font-black font-orbitron text-white uppercase tracking-tighter chromatic-text">Module Selection</h2>
                                    <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-[0.5em] italic">"NON-NEGOTIABLES DEFINE IDENTITY STABILITY, NOT PRODUCTIVITY."</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {PILLAR_LIBRARY.map((opt, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => handleSelectPillar(i)} 
                                            className={`p-5 md:p-6 border rounded-sm cursor-pointer transition-all duration-300 relative group ${selectedPillarIds.has(i) ? 'bg-purple-900/30 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)]' : 'bg-gray-700/50 border-gray-600 hover:border-purple-500/60 hover:bg-gray-700/70'}`}
                                        >
                                            <div className="absolute top-2 left-2 text-[7px] text-gray-600 font-black font-mono">0x{i.toString(16).padStart(3, '0')}</div>
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <span className="text-[8px] md:text-[9px] font-black uppercase text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-sm tracking-widest border border-purple-500/30">{opt.category}</span>
                                                    <p className="text-[11px] md:text-sm font-bold text-gray-100 mt-3 uppercase tracking-tight leading-tight">{opt.description}</p>
                                                </div>
                                                {selectedPillarIds.has(i) && <div className="p-1 bg-purple-500 rounded-full text-black shadow-[0_0_15px_#a855f7] flex-shrink-0"><Check size={14} strokeWidth={4} /></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[100]">
                                    <div className="bg-gray-700/80 border border-purple-500/50 p-5 md:p-6 rounded-sm flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-12 shadow-[0_0_100px_rgba(0,0,0,1)] backdrop-blur-3xl">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-widest">ARCHITECTURE_LOAD: {selectedPillarIds.size} NODES</span>
                                            <span className={`text-xs md:text-sm font-black uppercase tracking-[0.3em] mt-1 ${getPillarTier(selectedPillarIds.size).color}`}>{getPillarTier(selectedPillarIds.size).label}</span>
                                        </div>
                                        <div className="flex gap-4 md:gap-6 w-full md:w-auto">
                                            <button onClick={() => setIsCommissioningPillar(false)} className="flex-1 md:flex-none px-6 md:px-8 py-2 md:py-3 text-[9px] md:text-[10px] font-black uppercase text-gray-600 hover:text-white transition-colors tracking-widest">_ABORT</button>
                                            <button onClick={handleCommissionPillar} disabled={selectedPillarIds.size < 3} className="flex-1 md:flex-none btn-primary px-8 md:px-12 py-3 md:py-4 text-[10px] md:text-[11px] font-black">SEAL_ARCH_V5</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            nonNegotiablePaths.map(path => (
                                <div key={path.id} className="space-y-8 md:space-y-10">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-purple-900/30 pb-5 md:pb-6 gap-4">
                                        <div className="flex items-start gap-4 md:gap-8 flex-1">
                                            <div className="p-3 md:p-4 bg-purple-600/20 border border-purple-500/40 rounded-sm flex-shrink-0">
                                                <Shield className="text-purple-400" size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-orbitron font-black text-white uppercase tracking-widest text-lg md:text-2xl">{path.name}</h3>
                                                <div className="flex items-center gap-4 md:gap-6 mt-2 md:mt-3 flex-wrap opacity-70">
                                                    <span className={`text-[8.5px] md:text-[10px] font-black uppercase ${getPillarTier(path.tasks.length).color} tracking-[0.2em]`}>_SYS_HEALTH: {getPillarTier(path.tasks.length).label}</span>
                                                    <span className="text-[8px] md:text-[9px] text-gray-500 font-mono">NODES_INSTALLED: 0x{path.tasks.length.toString(16)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <button onClick={() => { setSelectedPathId(path.id); setEditingPath(path); }} className="px-3 py-1.5 rounded-full bg-gray-900/90 border border-gray-700/80 text-[9px] font-mono text-gray-200 active:scale-95">
                                                Rename
                                            </button>
                                            <button onClick={() => deleteTaskFromPath(path.id, path.tasks[0].id)} className="w-9 h-9 rounded-full bg-red-600/90 text-white flex items-center justify-center active:scale-95">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        {path.tasks
                                            .sort((a, b) => (a.order || 0) - (b.order || 0))
                                            .map((t, idx) => (
                                                <TaskItem 
                                                    key={t.id} 
                                                    task={t} 
                                                    isNonNegotiable={true} 
                                                    onComplete={() => completeTask(path.id, t.id)} 
                                                    onIncrement={() => incrementWeeklyTask(path.id, t.id)} 
                                                    onEdit={() => setEditingTask({ task: t, pathId: path.id })}
                                                    isDraggable={true}
                                                    onDragStart={handleDragStart(path.id, t.id)}
                                                    onDragOver={handleDragOver}
                                                    onDrop={handleDrop(path.id, t.id)}
                                                    isLast={idx === path.tasks.length - 1} 
                                                />
                                            ))
                                        }
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
                                            className={`p-8 border rounded-sm cursor-pointer transition-all duration-300 flex items-start gap-6 relative overflow-hidden group ${selectedSpecialId === spec.id ? 'bg-cyan-600/10 border-cyan-500 shadow-[0_0_40px_rgba(34,211,238,0.2)]' : 'bg-gray-700 border-gray-600 hover:border-cyan-500/50'}`}
                                        >
                                            <div className="p-4 bg-gray-800 border border-gray-700 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                {React.createElement(ICON_MAP[spec.icon] || Cpu, { className: "text-cyan-400 w-7 h-7" })}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-orbitron font-black text-white uppercase tracking-[0.2em] text-sm truncate">{spec.name}</h3>
                                                <p className="text-[11px] text-gray-400 mt-3 leading-relaxed uppercase font-mono tracking-tighter">{spec.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {selectedSpecialId && (
                                    <div className="bg-gray-800 border border-cyan-900/40 p-10 rounded-sm space-y-10 animate-in slide-in-from-bottom-12 shadow-2xl">
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
                                    <div key={path.id} className="bg-gradient-to-b from-[#1a1a25] to-[#0f0f14] border border-purple-500/40 p-4 md:p-10 rounded-lg md:rounded-sm relative overflow-hidden group hover:border-purple-300/60 transition-all shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:shadow-[0_0_60px_rgba(168,85,247,0.25)]">
                                        {/* Decorative background icon */}
                                        <div className="absolute top-0 right-0 p-4 md:p-8 opacity-[0.03] md:opacity-[0.05] group-hover:opacity-[0.1] transition-opacity pointer-events-none rotate-6">
                                            {React.createElement(ICON_MAP[path.icon] || Layers, { size: 200 })}
                                        </div>
                                        
                                        {/* Protocol Header */}
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6 mb-6 md:mb-12 relative z-10">
                                            {/* Left side: Icon + Info */}
                                            <div className="flex gap-3 md:gap-8 min-w-0 flex-1">
                                                <div className="p-2.5 md:p-5 bg-purple-600/25 border border-purple-500/60 rounded-lg flex-shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                                                    {React.createElement(ICON_MAP[path.icon] || Layers, { size: 24, className: "md:w-9 md:h-9 text-purple-300" })}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                                        <h3 className="text-lg md:text-3xl font-orbitron font-black text-white uppercase tracking-wider leading-tight">{path.name}</h3>
                                                        {path.proficiency && (
                                                            <span className={`px-2 md:px-4 py-1 md:py-1.5 border text-[7px] md:text-[10px] font-black uppercase tracking-widest ${getProficiencyStyle(path.proficiency)}`}>
                                                                {path.proficiency}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[9.5px] md:text-[11px] text-gray-300 uppercase font-mono mt-2 md:mt-3 tracking-wide max-w-2xl leading-relaxed opacity-90">{path.description}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Right side: Level + Progress */}
                                            <div className="text-right flex flex-col items-end flex-shrink-0">
                                                <div className="text-xl md:text-3xl font-black text-purple-300 font-orbitron drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">LVL_{path.level.toString().padStart(2, '0')}</div>
                                                <div className="flex flex-col items-end mt-2 md:mt-3">
                                                    <div className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-tighter">CHARGE: {path.xp}/{path.xpToNextLevel}</div>
                                                    <div className="w-28 md:w-48 h-1.5 md:h-2 bg-purple-950/60 mt-2 overflow-hidden rounded-full border border-purple-900/50 shadow-inner">
                                                        <div className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{ width: `${(path.xp / path.xpToNextLevel) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tasks List */}
                                        <div className="flex flex-col relative z-10 space-y-2 md:space-y-2.5">
                                            {path.tasks
                                                .filter(t => !t.isNonNegotiable)
                                                .sort((a, b) => (a.order || 0) - (b.order || 0))
                                                .map((t) => {
                                                    const isWeekly = t.type === TaskType.Weekly;
                                                    const hasCounter = isWeekly && t.targetCount && t.targetCount > 1;
                                                    const currentCount = t.currentCount || 0;
                                                    const targetCount = t.targetCount || 1;

                                                    return (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => (!t.isCompleted && !hasCounter) ? completeTask(path.id, t.id) : undefined}
                                                            className={`group w-full flex items-center justify-between rounded-sm border px-3 py-2.5 md:px-4 md:py-3 text-left transition-all active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                                                                t.isCompleted
                                                                    ? 'bg-emerald-900/10 border-emerald-700/40 opacity-40 grayscale'
                                                                    : isWeekly
                                                                        ? 'bg-amber-950/20 border-amber-800/70 hover:border-amber-400 hover:bg-amber-900/40'
                                                                        : 'bg-black/70 border-gray-800 hover:border-purple-400/80 hover:bg-purple-950/40'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                                                                <div
                                                                    className={`w-8 md:w-9 text-center text-[8px] font-mono font-black border rounded-[2px] px-1 py-0.5 ${
                                                                        isWeekly
                                                                            ? 'text-amber-300 border-amber-500/70 bg-amber-950/70'
                                                                            : 'text-purple-300 border-purple-500/70 bg-purple-950/70'
                                                                    }`}
                                                                >
                                                                    {isWeekly ? (hasCounter ? `${currentCount}/${targetCount}` : 'WEEK') : 'DAY'}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className={`text-[11px] md:text-[12px] font-black uppercase tracking-tight leading-snug truncate ${
                                                                        t.isCompleted ? 'text-gray-600 line-through' : 'text-gray-100'
                                                                    }`}>
                                                                        {t.description}
                                                                    </p>
                                                                    <p className="mt-0.5 text-[8px] md:text-[8.5px] text-gray-500 font-black uppercase tracking-[0.22em] truncate">
                                                                        {path.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2.5 md:gap-3 flex-shrink-0">
                                                                <span className={`text-[9px] md:text-[10px] font-mono font-semibold ${
                                                                    isWeekly ? 'text-amber-200' : 'text-purple-200'
                                                                }`}>
                                                                    +{t.xp}v
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingTask({ task: t, pathId: path.id });
                                                                    }}
                                                                    className="w-6 h-6 md:w-7 md:h-7 rounded-[2px] border border-gray-700/80 bg-black/80 flex items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-200 transition-all"
                                                                >
                                                                    <Edit2 size={13} />
                                                                </button>
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                            {path.tasks.filter(t => !t.isNonNegotiable).length === 0 && (
                                                <div className="mt-3 rounded-sm border border-dashed border-gray-700/70 bg-black/50 px-3 py-3 text-center text-[9px] text-gray-500 flex items-center justify-center gap-2">
                                                    <Binary size={14} className="text-gray-700" />
                                                    No active protocol tasks configured. Use edit to commission habits.
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer controls */}
                                        <div className="mt-4 md:mt-6 flex items-center justify-between relative z-10">
                                            <button
                                                type="button"
                                                onClick={() => { setSelectedPathId(path.id); setEditingPath(path); }}
                                                className="inline-flex items-center gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.28em] text-gray-400 hover:text-purple-200"
                                            >
                                                <Settings size={13} className="text-gray-600" />
                                                Edit_Protocol
                                            </button>
                                            <div className="flex items-center gap-2 text-[8px] md:text-[8.5px] text-gray-500 font-mono uppercase tracking-[0.22em]">
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-[2px] bg-purple-400" /> Daily
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-[2px] bg-amber-400" /> Weekly
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
