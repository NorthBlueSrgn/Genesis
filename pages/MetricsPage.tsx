import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Loader from '../components/ui/Loader';
import DossierHeader from '../components/ui/DossierHeader';
import BenchmarkLogger from '../components/BenchmarkLogger';
import { TrendingUp, Zap } from 'lucide-react';
import { BENCHMARK_TIERS } from '../services/benchmarkService';

const MetricsPage: React.FC = () => {
    const { gameState, isLoading } = useGameState();
    const [selectedCategory, setSelectedCategory] = useState<'strength' | 'endurance' | 'speed' | 'mental'>('strength');

    if (isLoading || !gameState) {
        return <Loader text="Loading Metrics Dashboard..." />;
    }

    const categories = {
        strength: {
            label: 'Strength (Physical)',
            metrics: ['benchPress', 'squat', 'deadlift'] as const,
            stat: 'Physical',
            subStats: ['Strength', 'Strength', 'Strength']
        },
        endurance: {
            label: 'Endurance (Physical)',
            metrics: ['fiveKRun'] as const,
            stat: 'Physical',
            subStats: ['Endurance']
        },
        speed: {
            label: 'Speed (Physical)',
            metrics: ['fortyYardDash'] as const,
            stat: 'Physical',
            subStats: ['Speed']
        },
        mental: {
            label: 'Mental & Strategy',
            metrics: ['chessRating', 'streakDays'] as const,
            stat: 'Intelligence',
            subStats: ['Strategy', 'Willpower']
        }
    };

    const currentCategory = categories[selectedCategory];

    // Get current values (defaults if not set)
    const getMetricValue = (metric: string): number => {
        const key = `metric_${metric}`;
        return gameState.benchmarks[key] || 0;
    };

    const recentProgressions = gameState.statProgressionHistory?.slice(-5) || [];

    return (
        <div>
            <DossierHeader title="METRICS DASHBOARD" />

            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {Object.entries(categories).map(([key, cat]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key as any)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                            selectedCategory === key
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentCategory.metrics.map((metric, idx) => (
                    <BenchmarkLogger
                        key={metric}
                        metric={metric as keyof typeof BENCHMARK_TIERS}
                        stat={currentCategory.stat}
                        subStat={currentCategory.subStats[idx]}
                        unit={metric === 'fiveKRun' || metric === 'fortyYardDash' ? 'm' : 'lbs'}
                        currentValue={getMetricValue(metric)}
                    />
                ))}
            </div>

            {/* Recent Progression History */}
            {recentProgressions.length > 0 && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-purple-400" />
                        Recent Benchmarks
                    </h2>
                    <div className="space-y-2">
                        {recentProgressions.reverse().map((prog) => (
                            <div key={prog.timestamp} className="flex items-center justify-between text-sm p-2 bg-gray-800/50 rounded">
                                <div>
                                    <p className="text-white font-semibold">{prog.metricName}</p>
                                    <p className="text-gray-400 text-xs">
                                        {prog.previousValue} → {prog.newValue} (+{prog.improvement})
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-green-400 font-bold">
                                        <Zap size={14} />
                                        +{prog.statBoostAwarded}
                                    </div>
                                    <p className="text-xs text-gray-400">{prog.percentile}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MetricsPage;
