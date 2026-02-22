# Protocol Tracking System Implementation

## Overview
A comprehensive tracking system that monitors protocol (path) completions, streaks, and historical performance data.

## Implementation Date
January 2025

## Core Features

### 1. Protocol Metrics Tracking
Each protocol now tracks:
- **Total Completions**: Lifetime count of task completions for this protocol
- **Current Streak**: Consecutive days with completions
- **Best Streak**: Highest streak ever achieved
- **Completion Rate**: Percentage over last 30 days (calculated on-demand)
- **Last Completed**: Timestamp of most recent completion
- **Weekly Completions**: Array tracking completions over last 8 weeks
- **First Completed**: When protocol was first completed

### 2. Protocol History Log
Daily log of all protocol completions including:
- Date
- Protocols completed (with full reward details)
- Total XP earned that day
- Daily completion count

### 3. Metrics History
Separate tracking for dashboard metrics:
- Water intake
- Steps
- Goal completion status

## Technical Implementation

### Types (`types.ts`)
```typescript
interface ProtocolMetrics {
    protocolId: string;
    protocolName: string;
    category: string;
    totalCompletions: number;
    currentStreak: number;
    bestStreak: number;
    completionRate: number;
    lastCompleted?: string;
    weeklyCompletions: number[];
    firstCompleted?: string;
}

interface ProtocolHistory {
    date: string;
    protocolsCompleted: {
        protocolId: string;
        protocolName: string;
        xp: number;
        statBoost: {...};
    }[];
    totalXp: number;
    dailyCompletionCount: number;
}

interface MetricsHistory {
    date: string;
    waterIntake: number;
    steps: number;
    waterGoalReached: boolean;
    stepGoalReached: boolean;
}
```

### State Management (`GameStateContext.tsx`)
Added to `GameState`:
- `protocolMetrics: ProtocolMetrics[]`
- `protocolHistory: ProtocolHistory[]`
- `metricsHistory: MetricsHistory[]`

Migration logic automatically initializes these arrays for existing users.

### Reducer Logic (`gameReducer.ts`)

#### COMPLETE_TASK Action
When a task is completed:
1. **Update Protocol Metrics**:
   - Increment total completions
   - Calculate streak (consecutive days)
   - Update best streak if current exceeds it
   - Record completion timestamp
   - Create new metric entry if protocol hasn't been tracked yet

2. **Update Protocol History**:
   - Add completion to today's history entry
   - Track XP earned and stat boosts
   - Increment daily completion count
   - Create new history entry if first completion today

#### INCREMENT_WEEKLY_TASK Action
When a weekly task is incremented:
1. **Update Protocol Metrics**:
   - Increment total completions for each increment
   - Update last completed timestamp
   - Create metric entry if needed

2. **Update Protocol History**:
   - Log partial completion with partial rewards
   - Track incremental progress towards weekly goal

## Streak Calculation Logic

```typescript
const lastCompletedDate = new Date(metric.lastCompleted);
const today = new Date();
const isConsecutiveDay = lastCompletedDate && 
    (today.getTime() - lastCompletedDate.getTime()) <= 86400000 * 2 && // Within 2 days
    today.toDateString() !== lastCompletedDate.toDateString();

currentStreak: isConsecutiveDay ? metric.currentStreak + 1 : 1
```

- Resets to 1 if gap > 2 days
- Continues streak if completed within 2 days and not same day
- Allows for 1-day buffer (e.g., complete Monday, skip Tuesday, complete Wednesday = streak continues)

## Data Structure Examples

### Protocol Metrics Entry
```json
{
  "protocolId": "path-meditation-123",
  "protocolName": "Mindfulness Meditation",
  "category": "meditation",
  "totalCompletions": 47,
  "currentStreak": 12,
  "bestStreak": 21,
  "completionRate": 87.5,
  "lastCompleted": "2025-01-28T10:30:00.000Z",
  "weeklyCompletions": [7, 6, 5, 7, 6, 5, 6, 5],
  "firstCompleted": "2024-12-01T08:00:00.000Z"
}
```

### Protocol History Entry
```json
{
  "date": "2025-01-28",
  "protocolsCompleted": [
    {
      "protocolId": "path-meditation-123",
      "protocolName": "Mindfulness Meditation",
      "xp": 50,
      "statBoost": {
        "stat": "Psyche",
        "subStat": "Focus",
        "amount": 5
      }
    },
    {
      "protocolId": "path-strength-456",
      "protocolName": "Strength Training",
      "xp": 100,
      "statBoost": {
        "stat": "Physical",
        "subStat": "Strength",
        "amount": 10
      }
    }
  ],
  "totalXp": 150,
  "dailyCompletionCount": 2
}
```

## Next Steps (Pending)

### Protocol Analytics Dashboard
- [ ] Most completed protocols (top 5)
- [ ] Active streaks visualization
- [ ] Completion heatmap calendar
- [ ] Weekly/monthly trend charts
- [ ] Category breakdown (Morning, Growth, Nightly, Void)

### Protocol Detail View/Modal
- [ ] Individual protocol stats page
- [ ] Historical performance graph
- [ ] Proficiency timeline
- [ ] Task evolution history
- [ ] Personal records and milestones

### Advanced Features
- [ ] Completion rate calculation (30-day window)
- [ ] Weekly completion tracking updates
- [ ] Protocol comparison view
- [ ] Export protocol data (CSV/JSON)
- [ ] Protocol insights and recommendations

## Benefits

1. **User Insights**: See which protocols are performing best
2. **Motivation**: Visual streak tracking encourages consistency
3. **Progress Tracking**: Historical data shows long-term growth
4. **Pattern Recognition**: Identify habits and trends
5. **Achievement Integration**: Data feeds into achievement system

## Performance Considerations

- Metrics stored per protocol (not per task) to minimize data size
- History entries only created when tasks are completed
- Weekly completions array limited to 8 weeks (rolling window)
- Streak calculation is O(1) time complexity

## Database Schema
All data stored in Firebase under:
```
users/{userId}/gameState/protocolMetrics
users/{userId}/gameState/protocolHistory
users/{userId}/gameState/metricsHistory
```

## Deployment Status
✅ **DEPLOYED** - January 28, 2025
- Protocol tracking fully functional
- Data migration complete for existing users
- Ready for analytics dashboard integration

---

*Part of Phase 2: Protocol Tracking System - Genesis Protocol Enhancement Plan*
