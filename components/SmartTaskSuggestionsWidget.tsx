// components/SmartTaskSuggestionsWidget.tsx
import React, { useMemo } from 'react';
import { Lightbulb, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import Card from './ui/Card';
import { rankTasksBySmartness, getQuickWinTasks, getStreakSaverTasks, analyzeUserPatterns, type SmartTaskSuggestion } from '../services/smartTaskService';
import { Task, Stat } from '../types';

interface SmartTaskSuggestionsWidgetProps {
    tasks: Task[];
    stats: Stat[];
    statHistory: any[];
    currentStreak: number;
    onTaskSelect?: (task: Task) => void;
}

const SmartTaskSuggestionsWidget: React.FC<SmartTaskSuggestionsWidgetProps> = ({
    tasks,
    stats,
    statHistory,
    currentStreak,
    onTaskSelect
}) => {
    const suggestions = useMemo(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const pattern = analyzeUserPatterns(statHistory, currentHour);

        // Get different types of suggestions
        const smart = rankTasksBySmartness(tasks, stats, statHistory, pattern, currentHour).slice(0, 3);
        const quickWins = getQuickWinTasks(tasks, 5).slice(0, 2);
        const streakSavers = getStreakSaverTasks(tasks, currentStreak <= 2 ? currentStreak : 999);

        // Prioritize streak savers, then smart suggestions, then quick wins
        return [
            ...streakSavers,
            ...smart.filter(s => !streakSavers.some(ss => ss.task.id === s.task.id)),
            ...quickWins.filter(qw => !streakSavers.some(ss => ss.task.id === qw.task.id))
        ].slice(0, 5);
    }, [tasks, stats, statHistory, currentStreak]);

    if (suggestions.length === 0) {
        return (
            <Card className="!border-purple-500/40 !bg-black/80">
                <div className="text-center py-4">
                    <Lightbulb className="mx-auto mb-2 text-gray-600" size={24} />
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        All tasks completed! Great work!
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="!border-cyan-500/40 !bg-black/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none rotate-12">
                <Lightbulb size={80} />
            </div>

            <div className="relative z-10 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-900/30">
                    <Lightbulb className="text-cyan-400" size={18} />
                    <h3 className="text-sm md:text-base font-black text-cyan-300 uppercase tracking-tight">
                        Smart Suggestions
                    </h3>
                    <span className="ml-auto text-[9px] font-mono text-cyan-500">
                        Based on your patterns
                    </span>
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                    {suggestions.map((suggestion, idx) => (
                        <SuggestionCard
                            key={suggestion.task.id}
                            suggestion={suggestion}
                            index={idx}
                            onSelect={() => onTaskSelect?.(suggestion.task)}
                        />
                    ))}
                </div>

                {/* Footer Info */}
                <div className="pt-2 border-t border-gray-700/30 text-[8px] text-gray-500 text-center">
                    💡 Suggestions update based on your activity patterns
                </div>
            </div>
        </Card>
    );
};

const SuggestionCard: React.FC<{
    suggestion: SmartTaskSuggestion;
    index: number;
    onSelect: () => void;
}> = ({ suggestion, index, onSelect }) => {
    const priorityColors = {
        high: 'border-emerald-500/50 bg-emerald-950/30',
        medium: 'border-cyan-500/50 bg-cyan-950/20',
        low: 'border-gray-500/30 bg-gray-950/20'
    };

    const priorityIcons = {
        high: <AlertCircle size={14} className="text-emerald-400" />,
        medium: <TrendingUp size={14} className="text-cyan-400" />,
        low: <Lightbulb size={14} className="text-gray-400" />
    };

    return (
        <button
            onClick={onSelect}
            className={`w-full text-left p-2.5 rounded-md border transition-all active:scale-95 hover:shadow-lg ${priorityColors[suggestion.priority]}`}
        >
            <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {priorityIcons[suggestion.priority]}
                    <div className="min-w-0 flex-1">
                        <p className="text-[11px] md:text-[12px] font-black text-white uppercase tracking-tight truncate">
                            {suggestion.task.description}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-2">
                            {suggestion.reason}
                        </p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="inline-block bg-black/40 px-2 py-1 rounded-sm">
                        <p className="text-[9px] font-mono font-black text-yellow-300">
                            +{suggestion.estimatedValue}v
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-black/40 rounded-full overflow-hidden border border-gray-700/50">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                            style={{ width: `${suggestion.confidence}%` }}
                        />
                    </div>
                    <span className="text-[8px] font-mono text-gray-400">{suggestion.confidence}%</span>
                </div>
            </div>
        </button>
    );
};

export default SmartTaskSuggestionsWidget;
