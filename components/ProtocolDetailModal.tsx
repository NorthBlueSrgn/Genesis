import React, { useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { X, Flame, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { ProficiencyLevel } from '../types';

interface ProtocolDetailModalProps {
  protocolId: string;
  onClose: () => void;
}

const ProtocolDetailModal: React.FC<ProtocolDetailModalProps> = ({ protocolId, onClose }) => {
  const { gameState } = useGameState();

  const protocol = useMemo(() => {
    return gameState?.paths.find(p => p.id === protocolId);
  }, [gameState?.paths, protocolId]);

  const metrics = useMemo(() => {
    return gameState?.protocolMetrics.find(m => m.protocolId === protocolId);
  }, [gameState?.protocolMetrics, protocolId]);

  const completionHistory = useMemo(() => {
    if (!gameState) return [];
    return gameState.protocolHistory
      .filter(h => h.protocolsCompleted.some(p => p.protocolId === protocolId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30); // Last 30 days
  }, [gameState?.protocolHistory, protocolId]);

  const completionRate = useMemo(() => {
    if (completionHistory.length === 0) return 0;
    const days = 30;
    return (completionHistory.length / days) * 100;
  }, [completionHistory]);

  const totalXpEarned = useMemo(() => {
    return completionHistory.reduce((sum, h) => {
      const protocolCompletions = h.protocolsCompleted.filter(p => p.protocolId === protocolId);
      return sum + protocolCompletions.reduce((pSum, p) => pSum + p.xp, 0);
    }, 0);
  }, [completionHistory, protocolId]);

  if (!protocol || !metrics) {
    return null;
  }

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-400';
    if (streak >= 14) return 'text-cyan-400';
    if (streak >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getProficiencyColor = (prof?: ProficiencyLevel) => {
    if (!prof) return 'text-gray-400';
    if (prof.includes('Master')) return 'text-purple-400';
    if (prof.includes('Advanced')) return 'text-cyan-400';
    if (prof.includes('Intermediate')) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{protocol.name}</h2>
            <p className="text-gray-400 text-sm">{protocol.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">Level</div>
              <div className="text-2xl font-bold text-white">{protocol.level}</div>
              <div className={`text-xs ${getProficiencyColor(protocol.proficiency)} mt-1`}>
                {protocol.proficiency || 'Novice'}
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1">Completions</div>
              <div className="text-2xl font-bold text-cyan-400">{metrics.totalCompletions}</div>
              <div className="text-xs text-gray-500 mt-1">All-time</div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Current Streak
              </div>
              <div className={`text-2xl font-bold ${getStreakColor(metrics.currentStreak)}`}>
                {metrics.currentStreak}
              </div>
              <div className="text-xs text-gray-500 mt-1">days</div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                <Award className="w-3 h-3" />
                Best Streak
              </div>
              <div className="text-2xl font-bold text-purple-400">{metrics.bestStreak}</div>
              <div className="text-xs text-gray-500 mt-1">days</div>
            </div>
          </div>

          {/* 30-Day Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Last 30 Days
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-2">Completion Rate</div>
                <div className="text-3xl font-bold text-cyan-400">{completionRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500 mt-1">{completionHistory.length} of 30 days</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-2">Total XP Earned</div>
                <div className="text-3xl font-bold text-purple-400">{totalXpEarned}</div>
                <div className="text-xs text-gray-500 mt-1">From this protocol</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-2">First Completed</div>
                <div className="text-lg font-bold text-white">{formatDate(metrics.firstCompleted)}</div>
                <div className="text-xs text-gray-500 mt-1">Started tracking</div>
              </div>
            </div>
          </div>

          {/* Completion Heatmap */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Recent Activity
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {completionHistory.slice(0, 28).map((history, index) => {
                const dayCompletions = history.protocolsCompleted.filter(p => p.protocolId === protocolId).length;
                const intensity = Math.min(dayCompletions / 3, 1); // Max out at 3 completions
                const bgColor = intensity > 0.66 ? 'bg-cyan-500' : intensity > 0.33 ? 'bg-cyan-600' : intensity > 0 ? 'bg-cyan-700' : 'bg-gray-800';
                
                return (
                  <div
                    key={history.date}
                    className={`aspect-square rounded ${bgColor} border border-gray-700 hover:border-cyan-400 transition-colors relative group`}
                    title={`${history.date}: ${dayCompletions} completion(s)`}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 border border-cyan-400 rounded px-2 py-1 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {new Date(history.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}<br/>
                      {dayCompletions} completion{dayCompletions !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded"></div>
                <div className="w-4 h-4 bg-cyan-700 border border-gray-700 rounded"></div>
                <div className="w-4 h-4 bg-cyan-600 border border-gray-700 rounded"></div>
                <div className="w-4 h-4 bg-cyan-500 border border-gray-700 rounded"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Current Tasks */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Current Tasks ({protocol.proficiency || 'Novice'})
            </h3>
            <div className="space-y-2">
              {protocol.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.isCompleted
                      ? 'bg-green-900/20 border-green-700/50 text-green-300'
                      : 'bg-gray-900/50 border-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {task.isCompleted ? '✓' : '○'}
                    <span className="flex-1">{task.description}</span>
                    <span className="text-xs text-gray-500">
                      +{task.xp} XP / +{task.statBoost.amount} {task.statBoost.subStat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolDetailModal;
