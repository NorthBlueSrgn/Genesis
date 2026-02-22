// components/DecayRecoveryWidget.tsx
import React, { useState, useMemo } from 'react';
import { AlertTriangle, Zap, CheckCircle, Clock, Award } from 'lucide-react';
import Card from './ui/Card';
import { getRecoveryOpportunities, getRecoveryMessage, calculateRecoveryBonus, type RecoveryTask } from '../services/recoveryService';
import { Stat } from '../types';

interface DecayRecoveryWidgetProps {
    decayInfo: any;
    stats: Stat[];
    onRecoveryTaskComplete?: (task: RecoveryTask, bonusXP: number) => void;
}

const DecayRecoveryWidget: React.FC<DecayRecoveryWidgetProps> = ({ decayInfo, stats, onRecoveryTaskComplete }) => {
    const [selectedTask, setSelectedTask] = useState<RecoveryTask | null>(null);
    const [tasksCompleted, setTasksCompleted] = useState(0);

    const recovery = useMemo(() => {
        if (!decayInfo?.affectedStats || decayInfo.affectedStats.length === 0) return null;
        
        const minutesLeft = Math.ceil((decayInfo.decayStartsAt - new Date().getTime()) / 60000);
        return getRecoveryOpportunities(
            Math.max(0, minutesLeft),
            decayInfo.affectedStats,
            0
        );
    }, [decayInfo]);

    if (!recovery || recovery.availableTasks.length === 0) return null;

    const recoveryMessage = getRecoveryMessage(recovery.urgency, decayInfo.affectedStats);
    const bonusXP = calculateRecoveryBonus(tasksCompleted, 0, recovery.urgency);

    const handleTaskComplete = (task: RecoveryTask) => {
        const bonus = calculateRecoveryBonus(tasksCompleted + 1, task.duration, recovery.urgency);
        setTasksCompleted(prev => prev + 1);
        onRecoveryTaskComplete?.(task, bonus);
        setSelectedTask(null);
    };

    const urgencyColors = {
        critical: 'border-red-500/60 bg-red-950/20',
        medium: 'border-yellow-500/60 bg-yellow-950/20',
        low: 'border-blue-500/60 bg-blue-950/20'
    };

    const urgencyBadgeColors = {
        critical: 'bg-red-500 text-white',
        medium: 'bg-yellow-500 text-black',
        low: 'bg-blue-500 text-white'
    };

    return (
        <Card className={`!border-2 relative overflow-hidden ${urgencyColors[recovery.urgency]}`}>
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                <Zap size={80} />
            </div>

            <div className="relative z-10 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                        <AlertTriangle className={`flex-shrink-0 mt-0.5 ${
                            recovery.urgency === 'critical' ? 'text-red-400' :
                            recovery.urgency === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                        }`} size={20} />
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm md:text-base font-black text-white uppercase tracking-tight">
                                Recovery Available
                            </h3>
                            <p className="text-[11px] md:text-[12px] text-gray-300 mt-1">
                                {recoveryMessage}
                            </p>
                        </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap flex-shrink-0 ${urgencyBadgeColors[recovery.urgency]}`}>
                        {recovery.urgency}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-black/40 border border-gray-700/50 p-2 rounded-sm text-center">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-wider mb-0.5">Window</p>
                        <p className="text-sm md:text-base font-black text-cyan-300">{recovery.recoveryWindow}m</p>
                    </div>
                    <div className="bg-black/40 border border-gray-700/50 p-2 rounded-sm text-center">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-wider mb-0.5">Tasks</p>
                        <p className="text-sm md:text-base font-black text-purple-300">{recovery.availableTasks.length}</p>
                    </div>
                    <div className="bg-black/40 border border-gray-700/50 p-2 rounded-sm text-center">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-wider mb-0.5">Max XP</p>
                        <p className="text-sm md:text-base font-black text-emerald-300">{recovery.totalRecoveryPotential}</p>
                    </div>
                </div>

                {/* Task Selection */}
                <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Quick Recovery Tasks</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {recovery.availableTasks.slice(0, 6).map(task => (
                            <button
                                key={task.id}
                                onClick={() => handleTaskComplete(task)}
                                className={`relative group p-2.5 rounded-md border text-left transition-all active:scale-95 ${
                                    selectedTask?.id === task.id
                                        ? 'bg-cyan-600/30 border-cyan-400'
                                        : 'bg-black/60 border-gray-700 hover:border-cyan-400'
                                }`}
                            >
                                <p className="text-[10px] font-black text-white group-hover:text-cyan-300 transition-colors uppercase leading-tight">
                                    {task.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <Clock size={12} className="text-gray-500" />
                                    <span className="text-[8px] text-gray-400">{task.duration}m</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Award size={12} className="text-yellow-500" />
                                    <span className="text-[9px] font-mono text-yellow-300">{task.xpReward}xp</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bonus Indicator */}
                {tasksCompleted > 0 && (
                    <div className="bg-emerald-900/20 border border-emerald-500/40 p-2 rounded-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-400" />
                            <span className="text-[11px] text-emerald-200 font-black">Recovery Progress</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400">+{bonusXP}% Bonus</p>
                            <p className="text-sm font-black text-emerald-300">{tasksCompleted} completed</p>
                        </div>
                    </div>
                )}

                {/* Info */}
                <p className="text-[9px] text-gray-500 text-center py-1 border-t border-gray-700/30">
                    ⚡ Complete tasks now to recover before decay strikes
                </p>
            </div>
        </Card>
    );
};

export default DecayRecoveryWidget;
