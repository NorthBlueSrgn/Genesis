// components/AnalyticsDashboardWidget.tsx
import React, { useMemo } from 'react';
import { BarChart, TrendingUp, Target, AlertCircle, Calendar, Zap } from 'lucide-react';
import Card from './ui/Card';
import {
    calculateStatsTrends,
    calculateEfficiencyMetrics,
    calculatePredictiveInsights,
    analyzeWeakPoints,
    generateProgressSummary,
    type StatsTrend
} from '../services/analyticsService';
import { Stat } from '../types';

interface AnalyticsDashboardWidgetProps {
    stats: Stat[];
    statHistory: any[];
    currentStreak: number;
    totalXP: number;
    rank: any;
}

const AnalyticsDashboardWidget: React.FC<AnalyticsDashboardWidgetProps> = ({
    stats,
    statHistory,
    currentStreak,
    totalXP,
    rank
}) => {
    const trends = useMemo(() => calculateStatsTrends(stats, statHistory, 7), [stats, statHistory]);
    
    const efficiency = useMemo(() => {
        const daysLogged = new Set(statHistory.map((h: any) => h.date.split('T')[0])).size;
        const totalMinutes = statHistory.reduce((sum: number, h: any) => sum + (h.durationMinutes || 15), 0);
        const tasksCompleted = statHistory.filter((h: any) => h.tasksCompleted).reduce((sum: number, h: any) => sum + h.tasksCompleted, 0) || 50;
        
        return calculateEfficiencyMetrics(
            totalXP || 0,
            totalMinutes,
            tasksCompleted,
            100,
            currentStreak
        );
    }, [totalXP, statHistory, currentStreak]);

    const predictions = useMemo(() => {
        const currentScore = stats.reduce((sum, s) => sum + s.value, 0) / stats.length;
        return calculatePredictiveInsights(currentScore, currentScore + 50, statHistory, currentStreak);
    }, [stats, statHistory, currentStreak]);

    const weakPoints = useMemo(() => analyzeWeakPoints(stats), [stats]);

    const daysLogged = new Set(statHistory.map((h: any) => h.date.split('T')[0])).size;
    const progressSummary = useMemo(
        () => generateProgressSummary(stats, statHistory, currentStreak, daysLogged),
        [stats, statHistory, currentStreak, daysLogged]
    );

    return (
        <div className="space-y-3 md:space-y-4">
            {/* Main Analytics Card */}
            <Card className="!border-purple-500/40 !bg-black/90">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 pb-3 border-b border-purple-500/20">
                        <BarChart className="text-purple-400" size={18} />
                        <h3 className="text-sm md:text-base font-black text-purple-300 uppercase tracking-tight">
                            Advanced Analytics
                        </h3>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <MetricBox
                            label="XP/Min"
                            value={efficiency.xpPerMinute}
                            unit="⚡"
                            trend="up"
                        />
                        <MetricBox
                            label="Task Rate"
                            value={efficiency.taskCompletionRate}
                            unit="%"
                            trend={efficiency.taskCompletionRate > 70 ? 'up' : 'down'}
                        />
                        <MetricBox
                            label="Avg Task Value"
                            value={efficiency.averageTaskValue}
                            unit="xp"
                            trend="up"
                        />
                        <MetricBox
                            label="Streak Bonus"
                            value={efficiency.streakMultiplier}
                            unit="x"
                            trend={currentStreak > 0 ? 'up' : 'flat'}
                        />
                    </div>

                    {/* Trends */}
                    <div className="bg-black/40 border border-gray-700/30 p-3 rounded-md">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">
                            7-Day Trends
                        </p>
                        <div className="space-y-1">
                            {trends.slice(0, 4).map(trend => (
                                <TrendRow key={trend.statName} trend={trend} />
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Predictions Card */}
            <Card className="!border-cyan-500/40 !bg-black/90">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-cyan-500/20">
                        <Calendar className="text-cyan-400" size={18} />
                        <h3 className="text-sm font-black text-cyan-300 uppercase tracking-tight">
                            Predictions & ETA
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/40 border border-gray-700/30 p-2.5 rounded-md">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">
                                Next Rank In
                            </p>
                            <p className="text-lg md:text-xl font-black text-cyan-300 mt-1">
                                {predictions.daysToNextRank} days
                            </p>
                            <p className="text-[8px] text-gray-500 mt-1">
                                Est. {predictions.estimatedRankDate}
                            </p>
                        </div>
                        <div className="bg-black/40 border border-gray-700/30 p-2.5 rounded-md">
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-wider">
                                Confidence
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                        style={{ width: `${predictions.confidence}%` }}
                                    />
                                </div>
                                <span className="text-sm font-black text-cyan-300">
                                    {predictions.confidence}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Weak Points Card */}
            <Card className="!border-yellow-500/40 !bg-black/90">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-yellow-500/20">
                        <Target className="text-yellow-400" size={18} />
                        <h3 className="text-sm font-black text-yellow-300 uppercase tracking-tight">
                            Focus Areas
                        </h3>
                        <span className="ml-auto text-[9px] bg-yellow-500/20 px-2 py-1 rounded text-yellow-200 font-black">
                            +{weakPoints.improvementPotential} potential
                        </span>
                    </div>

                    <div className="space-y-1.5">
                        {weakPoints.weakestSubstats.slice(0, 4).map((substat, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-black/40 border border-gray-700/20 rounded-sm">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-white truncate">
                                        {substat.name}
                                    </p>
                                    <p className="text-[8px] text-gray-500 mt-0.5">
                                        Rank: {substat.rank}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <p className="text-sm font-mono font-black text-yellow-300">
                                        {substat.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Progress Summary */}
            <Card className="!border-emerald-500/40 !bg-black/90">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
                        <Zap className="text-emerald-400" size={18} />
                        <h3 className="text-sm font-black text-emerald-300 uppercase tracking-tight">
                            Progress Report
                        </h3>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-200 whitespace-pre-wrap font-mono">
                        {progressSummary}
                    </p>
                </div>
            </Card>
        </div>
    );
};

const MetricBox: React.FC<{
    label: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'flat';
}> = ({ label, value, unit, trend }) => {
    const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

    return (
        <div className="bg-black/40 border border-gray-700/30 p-2.5 rounded-md">
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">
                {label}
            </p>
            <div className="flex items-baseline justify-between">
                <p className="text-base md:text-lg font-black text-cyan-300">
                    {value}
                </p>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400">{unit}</span>
                    <span className={`text-xs font-black ${trendColor}`}>{trendIcon}</span>
                </div>
            </div>
        </div>
    );
};

const TrendRow: React.FC<{ trend: StatsTrend }> = ({ trend }) => {
    const trendColor =
        trend.trend === 'up' ? 'text-emerald-400' :
        trend.trend === 'down' ? 'text-red-400' :
        'text-gray-400';

    const trendIcon = trend.trend === 'up' ? '📈' : trend.trend === 'down' ? '📉' : '→';

    return (
        <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
                <span>{trendIcon}</span>
                <span className="text-gray-300 font-bold truncate">{trend.statName}</span>
            </div>
            <div className={`font-mono font-black ${trendColor}`}>
                {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
            </div>
        </div>
    );
};

export default AnalyticsDashboardWidget;
