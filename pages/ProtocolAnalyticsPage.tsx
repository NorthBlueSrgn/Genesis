import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { ProtocolMetrics, ProtocolHistory } from '../types';
import { Activity, TrendingUp, Flame, Target, BarChart2, Calendar } from 'lucide-react';
import ProtocolDetailModal from '../components/ProtocolDetailModal';

const ProtocolAnalyticsPage: React.FC = () => {
  const { gameState } = useGameState();
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  // Calculate overview stats
  const overviewStats = useMemo(() => {
    if (!gameState) return { totalProtocols: 0, totalCompletions: 0, activeStreaks: 0, avgCompletionRate: 0, recentCompletions: 0 };
    
    const { protocolMetrics, protocolHistory } = gameState;
    
    const totalProtocols = protocolMetrics.length;
    const totalCompletions = protocolMetrics.reduce((sum: number, m: ProtocolMetrics) => sum + m.totalCompletions, 0);
    const activeStreaks = protocolMetrics.filter((m: ProtocolMetrics) => m.currentStreak > 0).length;
    const avgCompletionRate = protocolMetrics.length > 0
      ? protocolMetrics.reduce((sum: number, m: ProtocolMetrics) => sum + (m.completionRate || 0), 0) / protocolMetrics.length
      : 0;

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentHistory = protocolHistory.filter((h: ProtocolHistory) => new Date(h.date) >= sevenDaysAgo);
    const recentCompletions = recentHistory.reduce((sum: number, h: ProtocolHistory) => sum + h.dailyCompletionCount, 0);

    return {
      totalProtocols,
      totalCompletions,
      activeStreaks,
      avgCompletionRate,
      recentCompletions
    };
  }, [gameState]);

  // Top performers (most completions)
  const topPerformers = useMemo(() => {
    if (!gameState) return [];
    return [...gameState.protocolMetrics]
      .sort((a, b) => b.totalCompletions - a.totalCompletions)
      .slice(0, 5);
  }, [gameState]);

  // Longest streaks
  const longestStreaks = useMemo(() => {
    if (!gameState) return [];
    return [...gameState.protocolMetrics]
      .filter(m => m.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 5);
  }, [gameState]);

  // Category distribution
  const categoryStats = useMemo(() => {
    if (!gameState) return [];
    const distribution: Record<string, number> = {};
    gameState.protocolMetrics.forEach(metric => {
      const category = metric.category || 'custom';
      distribution[category] = (distribution[category] || 0) + metric.totalCompletions;
    });
    return Object.entries(distribution)
      .map(([category, completions]) => ({ category, completions }))
      .sort((a, b) => b.completions - a.completions);
  }, [gameState]);

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-400';
    if (streak >= 14) return 'text-cyan-400';
    if (streak >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      meditation: '🧘',
      strength: '💪',
      cardio: '🏃',
      learning: '📚',
      creativity: '🎨',
      custom: '⚡'
    };
    return icons[category] || '⚡';
  };

  if (!gameState || gameState.protocolMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <BarChart2 className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Protocol Data Yet</h2>
        <p className="text-gray-400 max-w-md">
          Complete some tasks to start tracking your protocol performance. 
          Your streaks, completions, and insights will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-cyan-400" />
          Protocol Analytics
        </h1>
        <p className="text-gray-400">Track your performance across all protocols</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Protocols</span>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white">{overviewStats.totalProtocols}</div>
          <div className="text-xs text-gray-500 mt-1">Active paths tracked</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Completions</span>
            <Target className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">{overviewStats.totalCompletions}</div>
          <div className="text-xs text-gray-500 mt-1">All-time tasks completed</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Streaks</span>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white">{overviewStats.activeStreaks}</div>
          <div className="text-xs text-gray-500 mt-1">Protocols on fire 🔥</div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Recent Activity</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">{overviewStats.recentCompletions}</div>
          <div className="text-xs text-gray-500 mt-1">Last 7 days</div>
        </div>
      </div>

      {/* Top Performers & Streaks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Performers */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Top Performers
          </h2>
          <div className="space-y-3">
            {topPerformers.map((metric, index) => (
              <div
                key={metric.protocolId}
                onClick={() => setSelectedProtocol(metric.protocolId)}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊'}</div>
                  <div>
                    <div className="text-white font-medium">{metric.protocolName}</div>
                    <div className="text-xs text-gray-500">{getCategoryIcon(metric.category)} {metric.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-cyan-400">{metric.totalCompletions}</div>
                  <div className="text-xs text-gray-500">completions</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Longest Streaks */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Active Streaks
          </h2>
          {longestStreaks.length > 0 ? (
            <div className="space-y-3">
              {longestStreaks.map((metric) => (
                <div
                  key={metric.protocolId}
                  onClick={() => setSelectedProtocol(metric.protocolId)}
                  className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Flame className={`w-6 h-6 ${getStreakColor(metric.currentStreak)}`} />
                    <div>
                      <div className="text-white font-medium">{metric.protocolName}</div>
                      <div className="text-xs text-gray-500">Best: {metric.bestStreak} days</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getStreakColor(metric.currentStreak)}`}>
                      {metric.currentStreak} days
                    </div>
                    <div className="text-xs text-gray-500">current</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Flame className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active streaks yet. Start completing tasks!</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-400" />
          Category Breakdown
        </h2>
        <div className="space-y-3">
          {categoryStats.map((stat) => {
            const percentage = (stat.completions / overviewStats.totalCompletions) * 100;
            return (
              <div key={stat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium flex items-center gap-2">
                    <span>{getCategoryIcon(stat.category)}</span>
                    {stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}
                  </span>
                  <span className="text-gray-400 text-sm">{stat.completions} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protocol Detail Modal */}
      {selectedProtocol && (
        <ProtocolDetailModal
          protocolId={selectedProtocol}
          onClose={() => setSelectedProtocol(null)}
        />
      )}
    </div>
  );
};

export default ProtocolAnalyticsPage;
