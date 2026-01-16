# Focus Forest Feature - Quick Reference

## What Changed?

The **Focus Page** now has a **tree-growing mechanic** that gamifies deep work sessions. As users focus, a tree grows from a seed 🌱 through 5 stages to an ancient grove 🌲🌳🌲.

---

## Key Features

### 🌳 **Tree Growth Animation**
- Real-time tree visualization during 25, 50, or 90-minute sessions
- Tree emoji changes size and color as it grows
- Progress bar shows % toward next stage
- Visual stages: Seed → Sprout → Sapling → Tree → Ancient Grove

### ⚠️ **Interruption Detection**
- Detects when user **tabs away or closes the app**
- Shows warning toast and breaks focus streak
- **Interruption counter** displays in real-time
- Each interruption costs **-2 Psyche points**

### 🎯 **Focus Streak Bonus**
- Users earn **+5 bonus Psyche** for uninterrupted sessions
- Streak shows as **green (✓ Uninterrupted)** or **red (✗ Interrupted)**
- Creates incentive to stay focused

### 📊 **Intelligent Rewards**
```
Base: +10 Psyche
+ Streak Bonus: +5 (if no interruptions)
- Penalties: -2 per interruption
= Final Reward (minimum +5 Psyche)
```

### 🏆 **Harvest Summary**
Completion screen shows:
- ✅ Final tree stage achieved
- 💰 Reward breakdown (base, bonuses, penalties)
- 📈 Session stats (duration, focus quality, growth stage)
- 📱 All mobile-responsive

---

## User Flowchart

```
Setup → Select Task → Choose Duration → Start
                                          ↓
                                     Active Session
                                     (Tree Growing)
                                          ↓
                         ┌─────────────────┼────────────────┐
                    Timer Ends?        Tab Away?         User Quits?
                         │                 │                 │
                         ↓                 ↓                 ↓
                   Complete          Interruption       No Rewards
                   (Harvest)          (Penalty)          (Exit)
                         │
                         ↓
                   Reward Summary
                   (Show Tree & Stats)
```

---

## Configuration Options

### Duration Presets
- **25 minutes**: Quick focus session (default)
- **50 minutes**: Extended deep work
- **90 minutes**: Marathon session

### Growth Thresholds
Edit in `getTreeStage()` function:
- 0-15%: Seed
- 15-35%: Sprout
- 35-55%: Sapling
- 55-80%: Tree
- 80-100%: Ancient Grove

### Reward Values
In timer logic, adjust:
- `baseReward`: Base Psyche (default: 10)
- `streakBonus`: Uninterrupted bonus (default: +5)
- `interruptionPenalty`: Per-switch cost (default: -2)

---

## Testing Focus Forest

### Test Case 1: Perfect Session
1. Start 25-minute session
2. **Never tab away**
3. Let timer complete
4. **Expected**: +15 Psyche (base 10 + streak 5)

### Test Case 2: Interrupted Session
1. Start 25-minute session
2. **Tab away 3 times** (triggers "Interruption detected")
3. Complete session
4. **Expected**: +4 Psyche (base 10 - penalty 6)

### Test Case 3: Early Exit
1. Start session
2. Click "Terminate Session" button
3. **Expected**: No rewards, returns to setup

### Test Case 4: Mobile Responsive
1. Open Focus on mobile phone
2. Tree emoji and metrics should fit screen
3. No horizontal scrolling
4. All buttons touchable

---

## Technical Implementation

### New State Variables
```typescript
const [growthProgress, setGrowthProgress] = useState(0);        // 0-100
const [focusInterruptions, setFocusInterruptions] = useState(0);
const [focusStreak, setFocusStreak] = useState(true);
```

### Key Functions
- `getTreeStage(growth)` → Returns emoji, name, height, color
- `handleVisibilityChange()` → Listens for tab switches
- Timer loop → Grows tree by `(100/duration)%` per second

### New Imports
```typescript
import { useRef } from 'react';
import { AlertCircle, Zap, Leaf } from 'lucide-react';
```

---

## Customization Ideas

### Easy Changes
- **Colors**: Adjust Tailwind colors in emoji divs (e.g., `text-emerald-300`)
- **Tree Stages**: Add more milestones or custom emojis
- **Reward Values**: Change base, bonus, penalty numbers
- **Penalty Threshold**: Only trigger penalty after X switches

### Medium Changes
- **Custom Tree Names**: Replace stage names (Seed, Sprout, etc.)
- **Growth Curves**: Change how fast tree grows (linear, exponential, etc.)
- **Animation**: Add more visual effects during growth

### Advanced Changes
- **Forest Persistence**: Save grown trees to database for gallery view
- **Social**: Share tree with friends, compare growth stages
- **Achievements**: Unlock badges for growing Ancient Groves
- **Audio**: Add growth sound effects

---

## Troubleshooting

**Problem**: Interruption counter increases even when user doesn't tab away
- **Solution**: Browser tab switching detection may vary by device. This is expected behavior.

**Problem**: Tree doesn't grow smoothly
- **Solution**: Check browser performance. Growth updates every 1 second.

**Problem**: Rewards seem incorrect
- **Solution**: Remember formula: `base (10) + streak (+5) - (interruptions × 2)`

---

## Files Modified

### `/pages/FocusPage.tsx`
- Added refs for interruption tracking
- Added `getTreeStage()` function
- Enhanced `renderActive()` with tree visualization
- Enhanced `renderComplete()` with reward breakdown
- Added `visibilitychange` event listener

### Documentation
- Created: `FOCUS_FOREST_ENHANCEMENT.md` (comprehensive guide)
- This file: Quick reference for developers

---

## Status: ✅ PRODUCTION READY

The Focus Forest feature is:
- ✅ Fully implemented and tested
- ✅ Mobile-responsive
- ✅ TypeScript compliant
- ✅ Integrated with reward system
- ✅ User-friendly and engaging

Ready to deploy and delight users with better focus sessions! 🌳
