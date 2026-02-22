import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { TrendingUp, CheckCircle } from 'lucide-react';
import Card from './ui/Card';
import { recordBenchmark, calculateProportionalBoost, calculatePercentile, BENCHMARK_TIERS } from '../services/benchmarkService';

interface BenchmarkLoggerProps {
    metric: keyof typeof BENCHMARK_TIERS;
    stat: string;
    subStat: string;
    unit: string;
    currentValue: number;
    onSuccess?: (boost: number) => void;
}

const BenchmarkLogger: React.FC<BenchmarkLoggerProps> = ({ 
    metric, 
    stat, 
    subStat, 
    unit, 
    currentValue,
    onSuccess 
}) => {
    const context = useGameState();
    const gameState = context.gameState;
    const dispatch = context.dispatch;
    const [newValue, setNewValue] = useState<string>(String(currentValue));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!gameState) return null;

    const tierData = BENCHMARK_TIERS[metric as keyof typeof BENCHMARK_TIERS] as any;
    if (!tierData) return null;

    const nextTierKey = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SS_PLUS'].find((_, i, arr) => {
        const val = tierData[arr[i]];
        return tierData.lowerIsBetter 
            ? (currentValue > val)
            : (currentValue < val);
    }) || 'SS_PLUS';

    const targetValue = tierData[nextTierKey] || tierData.SS_PLUS;
    const newVal = parseFloat(newValue) || currentValue;
    const boost = calculateProportionalBoost(currentValue, newVal, targetValue);
    const percentile = calculatePercentile(newVal, targetValue);

    const handleSubmit = async () => {
        if (newVal === currentValue) {
            setError('No change recorded');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const progression = await recordBenchmark(
                gameState.userName,
                `${metric}-${Date.now()}`,
                metric.replace(/([A-Z])/g, ' $1').trim(),
                stat,
                subStat,
                currentValue,
                newVal,
                targetValue,
                unit
            );

            dispatch({ type: 'RECORD_BENCHMARK', payload: progression });

            setSuccess(`✓ ${boost}+ ${stat}! (${percentile}% to next tier)`);
            setNewValue(String(newVal));
            onSuccess?.(boost);

            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to record benchmark');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-4 border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white">{metric.replace(/([A-Z])/g, ' $1').trim()}</h3>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-gray-400 uppercase">Current</label>
                        <p className="text-lg font-bold text-gray-300">{currentValue}{unit}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 uppercase">Target</label>
                        <p className="text-lg font-bold text-purple-400">{targetValue}{unit}</p>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-400 uppercase block mb-1">New Value</label>
                    <input
                        type="number"
                        step="0.1"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Enter new value"
                    />
                </div>

                {boost > 0 && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded p-2 text-sm">
                        <p className="text-green-400 font-bold">+{boost} {stat} ({percentile}% progress)</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded p-2 text-sm">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-900/30 border border-green-500/50 rounded p-2 text-sm flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-400" />
                        <p className="text-green-300">{success}</p>
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || newVal === currentValue}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white font-bold py-2 rounded transition-all"
                >
                    {isLoading ? 'Recording...' : 'Log Benchmark'}
                </button>
            </div>
        </Card>
    );
};

export default BenchmarkLogger;
