# Genesis Protocol - Feature Suggestions & Roadmap

## Current State Analysis
The app currently has:
- ✅ Substat progression tracking with time estimates
- ✅ Growth ledger with task management
- ✅ Decay mechanics (defined but now visible with DecayStatusWidget)
- ✅ Multi-stat system (6 main stats, 5 substats each)
- ✅ Resonance signatures & calibration analysis
- ✅ Tactical suggestions based on stats
- ✅ Activity heatmap (28-day history)

---

## HIGH-PRIORITY FEATURE SUGGESTIONS

### 1. **Decay Recovery System** ⚠️
**Problem:** Users see decay warnings but can't recover lost points.
**Solution:** Add a recovery mechanic that allows users to:
- Earn "Recovery Points" by completing tasks above average
- Convert Recovery Points back to lost stat points (1:1 or 2:1 ratio)
- Show recovery progress in DecayStatusWidget

**Implementation:**
```typescript
// Add to decayService.ts
export const calculateRecoveryOptions = (
  decayedStats: Stat[],
  recoveryPoints: number
) => {
  // Show which stats can be recovered and how many points needed
  // Provide recovery suggestions
};
```

**UI:** Add "Recovery Options" section to DecayStatusWidget showing:
- Which stats were decayed
- How many recovery points earned
- Recovery progress bar per stat

---

### 2. **Smart Task Suggestions** 🤖
**Problem:** Users manually choose tasks; no AI-driven recommendations based on decay risk.
**Solution:** AI-powered task recommendations that:
- Prioritize tasks affecting at-risk substats
- Suggest high-XP tasks to prevent decay
- Recommend "Quick Wins" for busy users (5-10 min tasks)

**Implementation:**
```typescript
// Add to services/taskSuggestionService.ts
export const generateSmartTaskSuggestions = (
  gameState: GameState,
  decayInfo: DecayInfo,
  availableTime: number // minutes
) => {
  // Return ranked task suggestions based on:
  // 1. Decay risk level
  // 2. Time available
  // 3. User's priority stats
  // 4. Historical completion rate
};
```

**UI:** New "Smart Suggestions" card in dashboard showing:
- Top 3 recommended tasks with reasoning
- Estimated time & XP reward
- Decay prevention impact

---

### 3. **Weekly/Monthly Challenges** 🏆
**Problem:** No long-term goals or events to drive engagement.
**Solution:** Periodic challenges with unique rewards:
- Weekly: "Achieve 7-day streak" → +50 bonus XP
- Monthly: "Reach 3 substats to B-rank" → Exclusive cosmetic
- Seasonal: Special events with limited-time tasks

**Implementation:**
```typescript
// Add to types.ts
interface Challenge {
  id: string;
  type: 'weekly' | 'monthly' | 'seasonal';
  title: string;
  description: string;
  objective: { stat: StatName; substat: SubStatName; targetRank: AttributeRankName };
  reward: { xp: number; bonus?: string };
  startDate: string;
  endDate: string;
  progress: number;
}
```

**UI:** New "Challenges" page or tab showing:
- Active challenges with progress bars
- Reward previews
- Challenge history/achievements

---

### 4. **Stat Comparison & Analytics** 📊
**Problem:** Users can't easily compare their stats or see trends.
**Solution:** Enhanced analytics showing:
- Stat growth velocity (points/day, week, month)
- Which stats grow fastest/slowest
- Substat distribution radar chart
- Comparative benchmarking ("You're in top 10% for Strength")

**Implementation:**
```typescript
// Add to services/analyticsService.ts
export const calculateGrowthVelocity = (
  statHistory: StatSnapshot[],
  period: 'day' | 'week' | 'month'
) => {
  // Return growth rate per stat
};

export const generateBenchmark = (stat: Stat) => {
  // Compare against other users or community averages
};
```

**UI:** New "Analytics" page with:
- Growth velocity charts per stat
- Heatmap showing substat distribution
- Benchmark badges ("B-rank = Top 30%")

---

### 5. **Task Templates & Automation** 🔄
**Problem:** Users manually create similar tasks repeatedly.
**Solution:** Pre-built task templates + automation:
- "Gym Routine" template (pre-populated with variations)
- Auto-create weekly recurring tasks
- Batch task creation ("Add daily English practice + weekly speaking session")

**Implementation:**
```typescript
// Add to types.ts
interface TaskTemplate {
  id: string;
  name: string;
  category: string;
  tasks: Partial<Task>[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Service function
export const createTasksFromTemplate = (
  template: TaskTemplate,
  customizations?: Record<string, any>
) => {
  // Auto-populate tasks from template
};
```

**UI:**
- "Quick Create" modal with task templates
- Customization sliders (XP, frequency, substat focus)
- "One-click deploy" to create multiple tasks

---

### 6. **Leaderboard & Social Features** 👥
**Problem:** No community engagement or competitive motivation.
**Solution:** Optional leaderboards (with privacy controls):
- Global leaderboard (rank-based)
- Friend leaderboards (if friends system exists)
- Weekly challenges leaderboard
- Stat-specific leaderboards ("Top 10 Strength Rank S+")

**Implementation:**
```typescript
// Add Firebase functions
export const getLeaderboard = (
  type: 'global' | 'friends' | 'weekly-challenge',
  limit: number = 100
) => {
  // Fetch and rank users
};
```

**UI:** New "Leaderboard" page showing:
- Global rankings (scrollable)
- Your rank & position
- Weekly challenge standings
- Privacy toggle in settings

---

### 7. **Decay Prevention Mode** 🛡️
**Problem:** Users panic when approaching 3-day threshold.
**Solution:** Special "Protection Mode" that:
- Locks stats temporarily (no decay for 7 days)
- Costs premium currency or task completion
- Shows clear timer

**Implementation:**
```typescript
interface ProtectionMode {
  active: boolean;
  expiresAt: string;
  protectedStats?: StatName[];
}
```

**UI:**
- "Enable Protection" button in DecayStatusWidget (if < 2 days)
- Protection shield icon on protected stats
- Cost/benefit breakdown

---

### 8. **Custom Stat Profiles** 👤
**Problem:** All users have the same 6 stats; no personalization.
**Solution:** Allow users to create custom "Focus Areas":
- "Language Learning Profile" → emphasize Intelligence/Creativity
- "Fitness Profile" → emphasize Physical/Vitality
- Switch between profiles

**Implementation:**
```typescript
interface CustomProfile {
  id: string;
  name: string;
  description: string;
  statWeights: Record<StatName, number>;
  recommendedTasks: Task[];
}
```

**UI:** Settings tab for profile management

---

### 9. **Decay History & Insights** 📈
**Problem:** Users don't see decay patterns or learn from them.
**Solution:** Detailed decay analytics:
- "You've decayed 5 times in the last 3 months"
- "Decay happens most on Mondays"
- "Your weakest stat: Vitality (decays 40% of the time)"
- Recommendations to prevent future decay

**Implementation:**
```typescript
interface DecayLog {
  date: string;
  statName: StatName;
  pointsLost: number;
  preventable: boolean;
}

export const analyzeDecayPatterns = (logs: DecayLog[]) => {
  // Return patterns and insights
};
```

**UI:** New "Decay Insights" section showing:
- Decay timeline
- Stat vulnerability chart
- Prevention tips based on patterns

---

### 10. **Task Difficulty Scaling** 🎯
**Problem:** All tasks give the same XP; no difficulty variation.
**Solution:** Dynamic task difficulty:
- Easy (5 XP): Quick wins
- Medium (15 XP): Standard tasks
- Hard (30 XP): Challenging tasks with bonus multiplier
- Completion streak multiplier (+10% per day)

**Implementation:**
```typescript
enum TaskDifficulty {
  Easy = 5,
  Medium = 15,
  Hard = 30
}

export const calculateTaskXP = (
  baseXP: number,
  difficulty: TaskDifficulty,
  streakBonus: number
) => {
  return baseXP * difficulty * (1 + streakBonus * 0.1);
};
```

**UI:** Task cards show difficulty badge + XP multiplier

---

## MEDIUM-PRIORITY FEATURE SUGGESTIONS

### 11. **Notification System** 🔔
- Decay warning (1 day before)
- Rank-up celebration
- New challenge available
- Friend activity (if social features added)
- Daily reminder to log activity

### 12. **Dark Mode / Theme Customization** 🎨
- Already dark, but add accent color themes
- "Cyberpunk", "Ocean", "Forest", "Sunset" palettes
- Custom background patterns

### 13. **Export & Backup** 💾
- Export stats to CSV/JSON
- Backup to Google Drive / iCloud
- Compare stats across time periods

### 14. **Mobile App** 📱
- Native iOS/Android app
- Offline mode with sync
- Push notifications
- Quick-action widgets

### 15. **Guided Tutorial / Onboarding** 🎓
- Interactive tutorial for new users
- Guided first week of task creation
- Contextual tooltips
- "Tips & Tricks" section

---

## LOW-PRIORITY FEATURE SUGGESTIONS

### 16. **Cosmetics & Customization** ✨
- Stat icons customization
- Name tags for stats
- Profile themes
- Avatar system

### 17. **API Access** 🔌
- Allow users to query their stats via API
- Third-party integrations
- Webhooks for stat changes

### 18. **Multiplayer Sync** 🤝
- Family accountability groups
- Team challenges
- Shared task boards

### 19. **Advanced Filtering** 🔍
- Filter tasks by difficulty, substat, path
- Search functionality
- Sort options (XP, frequency, substat impact)

### 20. **Calendar View** 📅
- Month view of task schedule
- Drag-and-drop task rescheduling
- Recurring task visualization

---

## QUICK WINS (Easy to Implement)

These features have high user value with minimal effort:

1. **Task Search Bar** - Filter Growth Ledger by task name
2. **Dark Mode Toggle** - Theme switcher in settings
3. **Stat Name Customization** - Rename stats to user preference
4. **Quick Stats Export** - Download current stats as JSON
5. **Keyboard Shortcuts** - Complete task with keyboard shortcut
6. **Undo Last Task Completion** - Rollback last 5 minutes
7. **Duplicate Task** - Clone a task with new settings
8. **Bulk Task Creation** - Paste CSV to create multiple tasks
9. **Sort Growth Ledger** - By XP, frequency, substat
10. **Task Notes** - Add contextual notes to tasks

---

## FEATURE PRIORITY MATRIX

```
HIGH IMPACT, LOW EFFORT:
- Quick Wins (1-10)
- Decay Recovery System
- Smart Task Suggestions
- Task Difficulty Scaling

HIGH IMPACT, HIGH EFFORT:
- Leaderboard & Social Features
- Analytics & Benchmarking
- Decay History & Insights
- Mobile App

LOW IMPACT, LOW EFFORT:
- Cosmetics & Customization
- Advanced Filtering

LOW IMPACT, HIGH EFFORT:
- Multiplayer Sync
- API Access
```

---

## Recommended Next Steps (Priority Order)

### Phase 1 (This Week)
1. Implement all 10 Quick Wins
2. Add Decay Recovery System
3. Create Smart Task Suggestions

### Phase 2 (Next Week)
4. Add Weekly/Monthly Challenges
5. Build Analytics & Benchmarking
6. Implement Task Difficulty Scaling

### Phase 3 (Future)
7. Social features / Leaderboard
8. Mobile app
9. Advanced customization

---

## User Feedback Questions

Before implementing, gather feedback on:
1. "Which feature would make you use the app more?"
2. "What frustrates you most about the current system?"
3. "Would you pay for premium features? Which ones?"
4. "Do you want competitive (leaderboard) or personal (analytics) features?"
5. "How often do you check decay status?"

---

## Summary

The Genesis Protocol has a solid foundation. The next phase should focus on:
- **Engagement**: Challenges, leaderboards, notifications
- **Clarity**: Analytics, decay insights, benchmarking
- **Control**: Recovery options, smart suggestions, customization

This roadmap will transform the app from a tracking tool to an engaging, competitive personal development platform!
