// components/DecayStatusWidget.tsx
import React, { useState } from 'react';
import { DecayInfo, getDecayStatusMessage, getDecayStatusColor, getDecayStatusBg } from '../services/decayService';
import { AlertTriangle, ChevronDown, Zap, Shield } from 'lucide-react';
import Card from './ui/Card';

interface DecayStatusWidgetProps {
  decayInfo: DecayInfo;
}

const DecayStatusWidget: React.FC<DecayStatusWidgetProps> = ({ decayInfo }) => {
  const [isExpanded, setIsExpanded] = useState(decayInfo.isDecayActive || decayInfo.isDecayImminent);

  const statusMessage = getDecayStatusMessage(decayInfo);
  const statusColor = getDecayStatusColor(decayInfo);
  const statusBg = getDecayStatusBg(decayInfo);
  
  // Determine icon based on status
  const getIcon = () => {
    if (decayInfo.isDecayActive) {
      return <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />;
    }
    if (decayInfo.isDecayImminent) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
    if (decayInfo.daysSinceLastActivity >= 1) {
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
    return <Shield className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <Card className={`!border-2 ${statusBg}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left flex items-center justify-between gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {getIcon()}
          <div className="min-w-0 flex-1">
            <p className={`text-sm md:text-base font-black font-orbitron uppercase tracking-wider ${statusColor}`}>
              {decayInfo.isDecayActive && '🚨 DECAY ACTIVE'}
              {decayInfo.isDecayImminent && !decayInfo.isDecayActive && '⚠️ DECAY IMMINENT'}
              {!decayInfo.isDecayActive && !decayInfo.isDecayImminent && decayInfo.daysSinceLastActivity >= 1 && '⏰ STAY ACTIVE'}
              {decayInfo.daysSinceLastActivity === 0 && '✅ SYSTEMS NOMINAL'}
            </p>
            <p className="text-[10px] md:text-xs text-gray-300 font-mono uppercase tracking-tight mt-0.5">
              {decayInfo.daysSinceLastActivity} / {3} Days
            </p>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0">
          <p className={`text-lg md:text-2xl font-black font-mono ${statusColor}`}>
            {decayInfo.daysUntilDecay}
          </p>
          <p className="text-[8px] md:text-[9px] text-gray-400 uppercase font-black">Days Left</p>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-700/30 space-y-3 animate-in slide-in-from-top-2">
          {/* Decay Info */}
          <div className="bg-black/30 border border-gray-700/30 p-3 rounded-md space-y-2">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Decay Countdown</p>
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-gray-900 rounded-full border border-gray-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      decayInfo.isDecayActive
                        ? 'bg-red-500'
                        : decayInfo.isDecayImminent
                        ? 'bg-yellow-500'
                        : decayInfo.daysSinceLastActivity >= 1
                        ? 'bg-orange-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(decayInfo.daysSinceLastActivity / 3) * 100}%` }}
                  />
                </div>
                <p className="text-[8px] text-gray-500 font-mono">
                  {decayInfo.daysSinceLastActivity} of 3 days elapsed
                </p>
              </div>
            </div>
          </div>

          {/* Points at Risk */}
          {decayInfo.affectedStats.length > 0 && (
            <div className="bg-black/30 border border-gray-700/30 p-3 rounded-md space-y-2">
              <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" /> Points at Risk of Decay
              </p>
              <div className="space-y-1.5">
                {decayInfo.decayBreakdown.map((breakdown) => (
                  <div
                    key={breakdown.stat}
                    className="flex items-center justify-between bg-black/60 border border-gray-700/40 p-2 rounded-sm"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-gray-200 uppercase">
                        {breakdown.stat}
                      </p>
                      <p className="text-[8px] text-gray-500 font-mono">
                        Rank {breakdown.rank}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black font-mono ${
                        decayInfo.isDecayActive ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        -{breakdown.pointsToLose}
                      </p>
                      <p className="text-[8px] text-gray-500 font-black uppercase">Per {decayInfo.isDecayActive ? 'Day' : 'Decay'}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {decayInfo.isDecayActive && (
                <div className="bg-red-900/30 border border-red-700/50 p-2 rounded-sm mt-2">
                  <p className="text-[8px] text-red-300 font-mono">
                    ⚠️ You are actively losing {decayInfo.pointsAtRisk.reduce((a, b) => a + b, 0)} points per day due to inactivity!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Message */}
          <div className={`p-3 rounded-md border ${
            decayInfo.isDecayActive
              ? 'bg-red-900/20 border-red-600/50'
              : decayInfo.isDecayImminent
              ? 'bg-yellow-900/20 border-yellow-600/50'
              : decayInfo.daysSinceLastActivity >= 1
              ? 'bg-orange-900/20 border-orange-600/50'
              : 'bg-emerald-900/20 border-emerald-600/50'
          }`}>
            <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight leading-relaxed ${
              decayInfo.isDecayActive ? 'text-red-300' :
              decayInfo.isDecayImminent ? 'text-yellow-300' :
              decayInfo.daysSinceLastActivity >= 1 ? 'text-orange-300' :
              'text-emerald-300'
            }`}>
              {decayInfo.isDecayActive && '🚨 CRITICAL: Log activity immediately to stop losing points!'}
              {decayInfo.isDecayImminent && !decayInfo.isDecayActive && '⚠️ WARNING: Complete at least one task in the next 24 hours to prevent decay!'}
              {!decayInfo.isDecayActive && !decayInfo.isDecayImminent && decayInfo.daysSinceLastActivity >= 1 && '⏰ REMINDER: Stay consistent to protect your progress!'}
              {decayInfo.daysSinceLastActivity === 0 && '✅ Great! Keep your streak alive by completing tasks daily.'}
            </p>
          </div>

          {/* How Decay Works */}
          <div className="bg-black/40 border border-gray-700/20 p-3 rounded-md space-y-2">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">How Decay Works</p>
            <ul className="text-[8px] text-gray-400 space-y-1 font-mono">
              <li>• 3+ days inactive → Stats lose points</li>
              <li>• Loss amount depends on current rank</li>
              <li>• Higher ranks lose fewer points</li>
              <li>• SS/SS+ ranks immune to decay</li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DecayStatusWidget;
