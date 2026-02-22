// components/HATIProgressBar.tsx
import React from 'react';
import { TrendingUp, Target, Zap } from 'lucide-react';
import { AttributeRankName } from '../types';
import { RANK_PERCENTILES } from '../constants';

interface HATIProgressBarProps {
    currentHATI: number;
    currentRank: AttributeRankName;
    nextRank?: AttributeRankName | null;
    variant?: 'compact' | 'detailed';
    showLabel?: boolean;
}

const rankColors: Record<AttributeRankName, { bg: string; border: string; glow: string; text: string }> = {
    'E': { bg: 'bg-gray-700/20', border: 'border-gray-600', glow: 'rgba(107,114,128,0.3)', text: 'text-gray-400' },
    'D': { bg: 'bg-green-700/20', border: 'border-green-600', glow: 'rgba(34,197,94,0.3)', text: 'text-green-400' },
    'C': { bg: 'bg-blue-700/20', border: 'border-blue-600', glow: 'rgba(59,130,246,0.3)', text: 'text-blue-400' },
    'B': { bg: 'bg-purple-700/20', border: 'border-purple-600', glow: 'rgba(168,85,247,0.3)', text: 'text-purple-400' },
    'A': { bg: 'bg-indigo-700/20', border: 'border-indigo-600', glow: 'rgba(99,102,241,0.3)', text: 'text-indigo-400' },
    'S': { bg: 'bg-amber-700/20', border: 'border-amber-600', glow: 'rgba(245,158,11,0.3)', text: 'text-amber-400' },
    'SS': { bg: 'bg-red-700/20', border: 'border-red-600', glow: 'rgba(239,68,68,0.3)', text: 'text-red-400' },
    'SS+': { bg: 'bg-cyan-700/20', border: 'border-cyan-600', glow: 'rgba(34,211,238,0.3)', text: 'text-cyan-400' }
};

export const HATIProgressBar: React.FC<HATIProgressBarProps> = ({
    currentHATI,
    currentRank,
    nextRank,
    variant = 'detailed',
    showLabel = true
}) => {
    const currentRankInfo = RANK_PERCENTILES[currentRank];
    const nextRankInfo = nextRank ? RANK_PERCENTILES[nextRank] : { min: 100 };
    
    const range = nextRankInfo.min - currentRankInfo.min;
    const progress = range > 0 ? ((currentHATI - currentRankInfo.min) / range) * 100 : 100;
    const progressClamped = Math.min(Math.max(progress, 0), 100);
    
    const colors = rankColors[currentRank];
    const nextColors = nextRank ? rankColors[nextRank] : colors;
    
    if (variant === 'compact') {
        return (
            <div className="space-y-1.5">
                {showLabel && (
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Target size={10} className={colors.text} />
                            HATI Progression
                        </span>
                        <span className={`text-[10px] font-black font-mono ${colors.text}`}>
                            {currentHATI.toFixed(1)}% → {nextRankInfo.min.toFixed(0)}%
                        </span>
                    </div>
                )}
                <div className="relative h-2 bg-black/60 border border-gray-800/60 rounded-sm overflow-hidden">
                    <div
                        className={`absolute inset-y-0 left-0 ${colors.bg} ${colors.border} border-r transition-all duration-700 ease-out`}
                        style={{
                            width: `${progressClamped}%`,
                            boxShadow: `0 0 12px ${colors.glow}`
                        }}
                    />
                    {/* Pulse effect at the end of progress bar */}
                    <div
                        className={`absolute inset-y-0 w-1 ${nextColors.bg} animate-pulse`}
                        style={{
                            left: `${progressClamped}%`,
                            boxShadow: `0 0 8px ${nextColors.glow}`
                        }}
                    />
                </div>
            </div>
        );
    }
    
    // Detailed variant
    return (
        <div className="space-y-3">
            {showLabel && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className={colors.text} />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                            HATI Index
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-wider">Current</p>
                            <p className={`text-lg font-black font-orbitron ${colors.text}`}>
                                {currentHATI.toFixed(1)}%
                            </p>
                        </div>
                        <TrendingUp size={12} className="text-gray-700" />
                        <div className="text-left">
                            <p className="text-[8px] font-black text-gray-600 uppercase tracking-wider">Target</p>
                            <p className={`text-lg font-black font-orbitron ${nextColors.text}`}>
                                {nextRankInfo.min.toFixed(0)}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="relative">
                {/* Background track */}
                <div className="h-4 bg-black/80 border border-gray-800/60 rounded-sm overflow-hidden relative">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 blueprint-dot opacity-10 pointer-events-none" />
                    
                    {/* Progress fill */}
                    <div
                        className={`absolute inset-y-0 left-0 ${colors.bg} border-r ${colors.border} transition-all duration-700 ease-out relative overflow-hidden`}
                        style={{
                            width: `${progressClamped}%`,
                            boxShadow: `0 0 16px ${colors.glow}, inset 0 0 12px ${colors.glow}`
                        }}
                    >
                        {/* Animated scan line */}
                        <div
                            className="absolute inset-y-0 w-px bg-white/40 animate-pulse"
                            style={{ left: '50%' }}
                        />
                    </div>
                    
                    {/* Pulse marker at progress end */}
                    <div
                        className={`absolute inset-y-0 w-1 ${nextColors.bg}`}
                        style={{
                            left: `${progressClamped}%`,
                            boxShadow: `0 0 12px ${nextColors.glow}`,
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}
                    />
                </div>
                
                {/* Rank markers */}
                <div className="flex justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} ${colors.border} border`} />
                        <span className={`text-[9px] font-black font-mono ${colors.text}`}>
                            {currentRank}-Rank
                        </span>
                    </div>
                    {nextRank && (
                        <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-black font-mono ${nextColors.text}`}>
                                {nextRank}-Rank
                            </span>
                            <div className={`w-1.5 h-1.5 rounded-full ${nextColors.bg} ${nextColors.border} border animate-pulse`} />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Progress percentage */}
            <div className="text-center">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-wider mb-0.5">
                    Rank Progression
                </p>
                <p className={`text-sm font-black font-mono ${colors.text}`}>
                    {progressClamped.toFixed(1)}% Complete
                </p>
            </div>
        </div>
    );
};

export default HATIProgressBar;
