// components/SubstatLabel.tsx
import React, { useState } from 'react';
import { SubStatName, TaskType, Task, AttributeRankName } from '../types';
import { ChevronDown, Zap, TrendingUp } from 'lucide-react';
import { STAT_SUBSTAT_MAP } from '../constants';
import { getSubstatProgressionInfo } from '../services/progressionService';

interface SubstatLabelProps {
  substat: SubStatName;
  taskType: TaskType;
  currentValue: number;
  currentRank: AttributeRankName;
  tasks: Task[];
  compact?: boolean; // Show minimal version for inline use
}

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

const SubstatLabel: React.FC<SubstatLabelProps> = ({
  substat,
  taskType,
  currentValue,
  currentRank,
  tasks,
  compact = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isWeekly = taskType === TaskType.Weekly;
  
  // Get the parent stat for this substat
  const parentStat = Object.entries(STAT_SUBSTAT_MAP).find(
    ([_, substats]) => substats.includes(substat)
  )?.[0];
  
  // Get progression info
  const progressionInfo = getSubstatProgressionInfo(substat, currentValue, currentRank, tasks);
  
  if (!progressionInfo) return null;
  
  if (compact) {
    // Compact inline version
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-black/40 border border-gray-700/70 rounded-sm text-[8px] md:text-[9px]">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-semibold uppercase tracking-tight">{substat}</span>
          <span className={`font-orbitron font-bold ${rankColorMap[currentRank]}`}>{currentRank}</span>
        </div>
        <div className="w-0.5 h-3 bg-gray-700" />
        <span className="text-gray-300 font-mono text-[7px] md:text-[8px]">{progressionInfo.timeEstimate}</span>
      </div>
    );
  }
  
  // Full expandable version
  return (
    <div className="bg-black/50 border border-gray-700/50 rounded-sm overflow-hidden">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-black/70 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 flex-shrink-0 ${isWeekly ? 'text-amber-500' : 'text-cyan-500'}`} />
            <span className="text-[10px] md:text-xs font-black text-gray-300 uppercase tracking-tight">
              {substat}
            </span>
            <span className={`font-orbitron font-bold text-[9px] ${rankColorMap[currentRank]}`}>
              {currentRank}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-[8px] md:text-[9px] font-mono text-gray-400 font-semibold">
            {progressionInfo.timeEstimate}
          </span>
          <ChevronDown 
            className={`w-3 h-3 text-gray-500 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      
      {showDetails && (
        <div className="bg-black/30 border-t border-gray-700/30 px-3 py-2.5 space-y-2 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-3 text-[8px] md:text-[9px]">
            <div className="space-y-1">
              <p className="text-gray-500 font-semibold uppercase tracking-widest">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-900 rounded-full border border-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${progressionInfo.percentToNextRank}%` }}
                  />
                </div>
                <span className="text-gray-400 font-mono">
                  {Math.round(progressionInfo.percentToNextRank)}%
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-500 font-semibold uppercase tracking-widest">Points</p>
              <p className="text-gray-300 font-mono">
                {progressionInfo.pointsNeeded.toLocaleString()} / {progressionInfo.nextRankThreshold.toLocaleString()}
              </p>
            </div>
          </div>
          
          {progressionInfo.nextRank && (
            <>
              <div className="space-y-1">
                <p className="text-gray-500 font-semibold uppercase tracking-widest flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Estimated Time to Rank {progressionInfo.nextRank}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-purple-300 font-mono">
                    {progressionInfo.timeEstimate}
                  </span>
                  <span className="text-[7px] md:text-[8px] text-gray-500 font-mono">
                    @ {progressionInfo.averageDailyXp} XP/day
                  </span>
                </div>
              </div>
              
              <div className="pt-1 border-t border-gray-700/30">
                <p className="text-[7.5px] md:text-[8px] text-gray-500 italic">
                  Based on average daily XP from current active tasks. Varies with task completion rate.
                </p>
              </div>
            </>
          )}
          
          {!progressionInfo.nextRank && (
            <div className="text-center py-2 text-gray-500 font-semibold">
              ✦ Maximum Rank Achieved ✦
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubstatLabel;
