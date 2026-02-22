// components/SubstatProgressionGuide.tsx
import React, { useState } from 'react';
import { STAT_SUBSTAT_MAP, RANKS } from '../constants';
import { StatName, SubStatName, AttributeRankName } from '../types';
import { ChevronDown, Zap, TrendingUp, BookOpen, Award, AlertCircle } from 'lucide-react';
import Card from './ui/Card';

const rankColorMap: Record<AttributeRankName, string> = {
  'E': 'text-gray-400',
  'D': 'text-green-400',
  'C': 'text-blue-400',
  'B': 'text-purple-400',
  'A': 'text-indigo-400',
  'S': 'text-amber-400',
  'SS': 'text-red-500',
  'SS+': 'text-yellow-300',
};

const rankBgMap: Record<AttributeRankName, string> = {
  'E': 'bg-gray-900/30',
  'D': 'bg-green-900/30',
  'C': 'bg-blue-900/30',
  'B': 'bg-purple-900/30',
  'A': 'bg-indigo-900/30',
  'S': 'bg-amber-900/30',
  'SS': 'bg-red-900/30',
  'SS+': 'bg-yellow-900/30',
};

interface SubstatProgressionGuideProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const SubstatProgressionGuide: React.FC<SubstatProgressionGuideProps> = ({ isOpen = true, onClose }) => {
  const [expandedStat, setExpandedStat] = useState<StatName | null>(StatName.Physical);
  const [expandedRank, setExpandedRank] = useState<AttributeRankName | null>(AttributeRankName.E);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl max-h-[90vh] overflow-y-auto !bg-black/95 !border-purple-500/40 !rounded-lg">
        <div className="sticky top-0 bg-black/95 border-b border-purple-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-black font-orbitron text-purple-300 uppercase tracking-wider">
              Substat Progression Guide
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <div className="p-6 space-y-8">
          {/* Overview Section */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-orbitron text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-5 h-5" /> How Substats Work
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Each of your 6 main stats (Physical, Vitality, Intelligence, Creativity, Spirit, Psyche) is composed of 5 substats. 
              When you complete tasks, they award XP to specific substats, which accumulates and improves your ranks.
            </p>
            <div className="bg-gray-900/40 border border-gray-700/50 rounded-md p-4 space-y-2">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Key Concepts:</p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <span className="text-cyan-300 font-semibold">Substat XP</span> - Earned from task completion and accumulates over time</li>
                <li>• <span className="text-purple-300 font-semibold">Rank Thresholds</span> - Specific XP values required to reach each rank</li>
                <li>• <span className="text-amber-300 font-semibold">Progression Rate</span> - Depends on task completion frequency and XP amounts</li>
              </ul>
            </div>
          </section>

          {/* Stat-Substat Mapping */}
          <section className="space-y-4">
            <h3 className="text-lg font-black font-orbitron text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Stat-Substat Mapping
            </h3>
            <div className="space-y-2">
              {Object.entries(STAT_SUBSTAT_MAP).map(([stat, substats]) => (
                <button
                  key={stat}
                  onClick={() => setExpandedStat(expandedStat === stat ? null : (stat as StatName))}
                  className="w-full text-left bg-gray-900/30 border border-gray-700/50 hover:border-purple-500/50 rounded-md p-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black font-orbitron text-purple-300 uppercase tracking-wide">{stat}</h4>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedStat === stat ? 'rotate-180' : ''}`} />
                  </div>
                  {expandedStat === stat && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30 flex flex-wrap gap-2">
                      {substats.map(substat => (
                        <span key={substat} className="px-3 py-1.5 bg-purple-900/30 border border-purple-700/50 rounded-sm text-sm text-purple-200 font-semibold">
                          {substat}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Rank Progression Chart */}
          <section className="space-y-4">
            <h3 className="text-lg font-black font-orbitron text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5" /> Rank Progression Chart
            </h3>
            <p className="text-sm text-gray-400">
              Each substat follows these XP thresholds. Reaching higher ranks takes exponentially more XP and time.
            </p>
            <div className="space-y-2">
              {RANKS.map((rank) => (
                <button
                  key={rank.name}
                  onClick={() => setExpandedRank(expandedRank === rank.name ? null : rank.name)}
                  className={`w-full text-left border rounded-md p-4 transition-all ${rankBgMap[rank.name]} border-gray-700/50 hover:border-purple-500/50`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-black font-orbitron text-lg ${rankColorMap[rank.name]}`}>
                        {rank.name}
                      </span>
                      <span className="text-sm text-gray-400 font-mono">{rank.attributeThreshold.toLocaleString()} XP</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expandedRank === rank.name ? 'rotate-180' : ''}`} />
                  </div>
                  {expandedRank === rank.name && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30 space-y-2">
                      <p className="text-sm text-gray-300">
                        <span className="text-purple-300 font-semibold">Threat Level:</span> {rank.threatLevel}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="text-purple-300 font-semibold">Estimated Time:</span> {rank.timeEstimate}
                      </p>
                      <p className="text-sm text-gray-400 italic">{rank.threatDescription}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Progression Estimates */}
          <section className="space-y-4">
            <h3 className="text-lg font-black font-orbitron text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Progression Time Estimates
            </h3>
            <div className="bg-gray-900/40 border border-gray-700/50 rounded-md p-4 space-y-3">
              <p className="text-sm text-gray-300">
                Time estimates are based on <span className="text-cyan-300 font-semibold">average daily XP</span> earned from your active tasks.
                They vary based on how consistently you complete your assigned tasks.
              </p>
              <div className="space-y-2 pt-2 border-t border-gray-700/30">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Example Progression:</p>
                <div className="text-sm space-y-1 text-gray-400">
                  <p>• <span className="text-emerald-400">~3-6 months:</span> E → D (dormant to learning)</p>
                  <p>• <span className="text-cyan-400">~6-12 months:</span> D → C (learning to standard)</p>
                  <p>• <span className="text-purple-400">~1-2 years:</span> C → B (standard to elite)</p>
                  <p>• <span className="text-amber-400">~4-7 years:</span> A → S (exceptional to peak)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="space-y-4">
            <h3 className="text-lg font-black font-orbitron text-cyan-300 uppercase tracking-wider">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="text-purple-400 font-black min-w-fit">💡</span>
                <span>Complete tasks consistently to maximize daily XP accumulation and progression speed.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-black min-w-fit">📊</span>
                <span>Tasks with higher XP values accelerate progression. Focus on high-impact activities.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-black min-w-fit">🎯</span>
                <span>Check the "Estimated Time" on each substat to understand your current progression pace.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-black min-w-fit">📈</span>
                <span>Weekly counter-based tasks (e.g., "Gym 4x/week") contribute significant XP per completion.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-400 font-black min-w-fit">🚀</span>
                <span>Reaching SS+ rank (99.9%+ percentile) takes 10+ years of consistent effort—aim for realistic milestones!</span>
              </li>
            </ul>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default SubstatProgressionGuide;
