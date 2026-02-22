# Implementation Guide: Top Priority Features

## 1. Decay Recovery System (RECOMMENDED FIRST)

### Data Model
```typescript
// Add to types.ts
interface RecoveryPoint {
  earnedDate: string;
  amount: number;
  source: 'task-completion' | 'streak-bonus' | 'challenge-reward';
}

interface RecoveryOptions {
  totalRecoveryPoints: number;
  recoveryableStats: Array<{
    stat: StatName;
    currentValue: number;
    lostPoints: number;
    recoveryPointsNeeded: number;
  }>;
  recoveryRate: number; // e.g., 1:1 or 2:1
}
```

### Service
```typescript
// services/recoveryService.ts
export const calculateRecoveryPoints = (
  tasks: Task[],
  taskPerformance: Map<string, number> // taskId -> completionCount
): number => {
  // For every 10% above target, earn 1 recovery point
  // Example: If weekly task targets 2x, user completes 3x → +1 point
  let points = 0;
  tasks.forEach(task => {
    const completions = taskPerformance.get(task.id) || 0;
    const target = task.targetCount || 1;
    if (completions > target) {
      points += Math.floor((completions - target) / Math.max(1, target / 10));
    }
  });
  return points;
};

export const getRecoveryOptions = (
  gameState: GameState,
  decayInfo: DecayInfo,
  recoveryPoints: number
): RecoveryOptions => {
  const recoveryRate = 2; // 2 recovery points = 1 stat point
  
  return {
    totalRecoveryPoints: recoveryPoints,
    recoveryableStats: gameState.stats.map(stat => ({
      stat: stat.name,
      currentValue: stat.value,
      lostPoints: decayInfo.decayedStats[stat.name]?.pointsLost || 0,
      recoveryPointsNeeded: (decayInfo.decayedStats[stat.name]?.pointsLost || 0) * recoveryRate
    })),
    recoveryRate
  };
};

export const applyRecovery = (
  stat: Stat,
  pointsToRecover: number,
  recoveryPointsCost: number
): Stat => {
  return {
    ...stat,
    value: stat.value + pointsToRecover
  };
};
```

### UI Component
```typescript
// components/RecoveryPanel.tsx
const RecoveryPanel: React.FC<{ recoveryOptions: RecoveryOptions }> = ({ recoveryOptions }) => {
  const [selectedStat, setSelectedStat] = useState<StatName | null>(null);
  const { gameState, addToast } = useGameState();
  
  return (
    <Card className="!border-emerald-500/50 !bg-black/95">
      <h3 className="text-emerald-300 font-black mb-4 flex items-center gap-2">
        <Zap /> Recovery Available
      </h3>
      
      <div className="bg-emerald-950/20 p-3 rounded mb-4 border border-emerald-800/30">
        <p className="text-[10px] text-emerald-400 font-mono">
          Total Recovery Points: {recoveryOptions.totalRecoveryPoints}
        </p>
      </div>

      <div className="space-y-3">
        {recoveryOptions.recoveryableStats.map(item => (
          item.lostPoints > 0 && (
            <button
              key={item.stat}
              onClick={() => setSelectedStat(item.stat)}
              className={`w-full text-left p-3 rounded border transition ${
                selectedStat === item.stat
                  ? 'border-emerald-400 bg-emerald-900/30'
                  : 'border-gray-700 hover:border-emerald-400'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 font-bold">{item.stat}</span>
                <span className="text-emerald-300 text-[9px] font-mono">
                  {item.recoveryPointsNeeded} pts needed
                </span>
              </div>
              <div className="text-[8px] text-gray-500">
                Recover {item.lostPoints} points (lost to decay)
              </div>
            </button>
          )
        ))}
      </div>

      {selectedStat && (
        <button
          onClick={() => {
            // Apply recovery
            addToast(`Recovered points for ${selectedStat}!`, 'success');
          }}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 py-2 rounded font-black text-white"
        >
          RECOVER NOW
        </button>
      )}
    </Card>
  );
};
```

---

## 2. Smart Task Suggestions (HIGH IMPACT)

### Data Model
```typescript
// Add to types.ts
interface TaskSuggestion {
  task: Task;
  reason: string; // e.g., "Prevents decay on Strength"
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: number; // minutes
  xpReward: number;
  decayPreventionImpact: number; // 0-100%
}
```

### Service
```typescript
// services/smartSuggestionService.ts
export const generateTaskSuggestions = (
  gameState: GameState,
  decayInfo: DecayInfo,
  availableMinutes: number = 30
): TaskSuggestion[] => {
  const suggestions: TaskSuggestion[] = [];
  const allTasks = gameState.paths.flatMap(p => p.tasks);

  // Priority 1: Tasks for stats at decay risk
  if (decayInfo.daysSinceLastActivity >= 2) {
    const riskStats = decayInfo.statsAtRisk;
    const preventionTasks = allTasks.filter(t =>
      riskStats.some(s => t.statBoost?.stat === s.name)
    );
    
    preventionTasks.forEach(task => {
      suggestions.push({
        task,
        reason: `Prevents decay on ${task.statBoost?.stat}`,
        priority: 'critical',
        estimatedTime: 10,
        xpReward: task.xp,
        decayPreventionImpact: 85
      });
    });
  }

  // Priority 2: High-XP tasks for motivation
  const highXPTasks = allTasks
    .filter(t => t.xp >= 20 && !suggestions.find(s => s.task.id === t.id))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 3);
  
  highXPTasks.forEach(task => {
    suggestions.push({
      task,
      reason: `High reward: +${task.xp} XP`,
      priority: 'high',
      estimatedTime: 15,
      xpReward: task.xp,
      decayPreventionImpact: 30
    });
  });

  // Priority 3: Quick wins (< 5 min tasks)
  const quickWins = allTasks.filter(t =>
    t.description.toLowerCase().includes('quick') ||
    t.xp <= 10
  ).slice(0, 2);

  quickWins.forEach(task => {
    suggestions.push({
      task,
      reason: `Quick win: ~5 minutes`,
      priority: 'medium',
      estimatedTime: 5,
      xpReward: task.xp,
      decayPreventionImpact: 10
    });
  });

  return suggestions.filter(s => s.estimatedTime <= availableMinutes);
};
```

### UI Component
```typescript
// components/SmartSuggestions.tsx
const SmartSuggestions: React.FC<{ suggestions: TaskSuggestion[] }> = ({ suggestions }) => {
  const { completeTask } = useGameState();
  
  return (
    <Card className="!border-cyan-500/50 !bg-black/95">
      <h3 className="text-cyan-300 font-black mb-4 flex items-center gap-2">
        <Zap /> Recommended Now
      </h3>

      <div className="space-y-2">
        {suggestions.map((suggestion, idx) => (
          <div
            key={suggestion.task.id}
            className={`p-3 rounded border transition ${
              suggestion.priority === 'critical'
                ? 'border-red-500/50 bg-red-900/20'
                : suggestion.priority === 'high'
                ? 'border-amber-500/50 bg-amber-900/20'
                : 'border-cyan-500/30 bg-cyan-900/10'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-200 text-sm">
                  {suggestion.task.description}
                </p>
                <p className="text-[8px] text-gray-500 mt-1">
                  {suggestion.reason}
                </p>
              </div>
              <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${
                suggestion.priority === 'critical' ? 'bg-red-600 text-white' : 'bg-gray-700'
              }`}>
                {suggestion.priority}
              </span>
            </div>

            <div className="flex justify-between items-center text-[8px]">
              <span className="text-gray-400">
                ~{suggestion.estimatedTime}m | +{suggestion.xpReward}xp
              </span>
              <button
                onClick={() => completeTask(/* pathId */, suggestion.task.id)}
                className="bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded text-white font-black"
              >
                Do It
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

---

## 3. Weekly Challenges (ENGAGEMENT DRIVER)

### Data Model
```typescript
// Add to types.ts
interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'weekly' | 'monthly' | 'seasonal';
  objective: {
    type: 'reach-rank' | 'streak' | 'xp-total' | 'task-count';
    stat?: StatName;
    substat?: SubStatName;
    targetValue: number;
  };
  reward: {
    xp: number;
    bonus?: string; // cosmetic, badge, etc
  };
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  completed: boolean;
}
```

### Weekly Challenge Examples
```typescript
const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'weekly-streak-7',
    title: 'Unstoppable',
    description: 'Maintain a 7-day streak without missing a day',
    type: 'weekly',
    objective: { type: 'streak', targetValue: 7 },
    reward: { xp: 100, bonus: '🔥 Streak Master Badge' },
    startDate: new Date().toISOString(),
    endDate: addDays(new Date(), 7).toISOString(),
    progress: 0,
    completed: false
  },
  {
    id: 'weekly-substat-upgrade',
    title: 'Rank Up',
    description: 'Advance any substat to B-rank or higher',
    type: 'weekly',
    objective: { type: 'reach-rank', targetValue: 3 }, // B-rank
    reward: { xp: 75, bonus: '⭐ Climber Badge' },
    startDate: new Date().toISOString(),
    endDate: addDays(new Date(), 7).toISOString(),
    progress: 0,
    completed: false
  }
];
```

### UI Component
```typescript
// components/ChallengesWidget.tsx
const ChallengesWidget: React.FC<{ challenges: Challenge[] }> = ({ challenges }) => {
  return (
    <Card className="!border-purple-500/50 !bg-black/95">
      <h3 className="text-purple-300 font-black mb-4 flex items-center gap-2">
        <Trophy /> This Week's Challenges
      </h3>

      <div className="space-y-3">
        {challenges.map(challenge => (
          <div key={challenge.id} className="border border-gray-700 rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-200">{challenge.title}</h4>
              {challenge.completed && (
                <span className="text-emerald-400 font-black text-[10px]">✓ DONE</span>
              )}
            </div>
            
            <p className="text-[9px] text-gray-400 mb-3">{challenge.description}</p>
            
            <div className="bg-gray-900/50 rounded h-2 mb-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all"
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[8px]">
              <span className="text-gray-500">{challenge.progress}% Progress</span>
              <span className="text-purple-300 font-black">+{challenge.reward.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

---

## Implementation Priority

1. **Decay Recovery System** (2-3 days)
   - Highest impact on user retention
   - Directly addresses decay helplessness

2. **Smart Task Suggestions** (2-3 days)
   - Reduces friction to task completion
   - Increases daily engagement

3. **Weekly Challenges** (3-4 days)
   - Drives long-term engagement
   - Creates milestone moments

---

## Next Steps

Pick one feature and start with service layer + data model, then UI components. 

Which would you like to implement first? 🚀
