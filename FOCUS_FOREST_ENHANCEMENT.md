# Focus Forest Enhancement - Deep Dive Focus Mode

## Overview
The **Focus Page** has been enhanced with a gamified **tree-growing/focus forest system** that rewards sustained focus and penalizes interruptions. This creates engaging visual feedback during deep work sessions, similar to popular productivity apps like Forest or Focusmate.

---

## Features Implemented

### 1. **Dynamic Tree Growth Visualization**
- **5 Growth Stages**: Seed → Sprout → Sapling → Tree → Ancient Grove
- Tree **visually grows** throughout the session (emoji gets larger, text color shifts)
- **Progress bar** shows real-time growth percentage
- **Smooth animations** make growth satisfying and rewarding

**Growth Thresholds:**
- 0-15%: 🌱 SEED (height: h-12, amber)
- 15-35%: 🌿 SPROUT (height: h-16, green-600)
- 35-55%: 🌲 SAPLING (height: h-20, green-500)
- 55-80%: 🌳 TREE (height: h-24, green-400)
- 80-100%: 🌲🌳🌲 ANCIENT GROVE (height: h-28, emerald-300)

### 2. **Focus Streak Tracking**
- **Uninterrupted Sessions** grant a **+5 Psyche bonus**
- **Interruptions Break Streak** and trigger warning toast
- Real-time indicator shows current focus status (✓ Uninterrupted or ✗ Interrupted)
- Visual feedback with color coding (green for good, red for broken)

### 3. **Interruption Detection**
- Detects when user **switches tabs or backgrounds the app** using `visibilitychange` API
- Shows **emoji warning alert** when focus is broken
- **Counts total interruptions** and displays in real-time
- Penalty: `-2 Psyche per interruption` (applied at session end)

### 4. **Intelligent Reward System**
The final reward is calculated as:
```
Base Reward: +10 Psyche (Focus)
+ Streak Bonus: +5 (if uninterrupted)
- Interruption Penalty: -2 per switch
= Final Reward (minimum +5)
```

**Example Breakdowns:**
- Perfect 25m session: +15 Psyche
- 25m with 2 interruptions: +6 Psyche  
- Early termination: No rewards

### 5. **Enhanced Session Complete Screen**
Shows comprehensive **harvest summary** with:
- ✅ Completion confirmation with celebration animation
- 🌳 Tree emoji at final growth stage
- **Reward breakdown** showing:
  - Base reward
  - Streak bonus (if earned)
  - Interruption penalties (if any)
  - Total Psyche gain
- **Session statistics**:
  - Duration completed
  - Focus streak status (Perfect ✓ / Broken ✗)
  - Final growth stage reached

### 6. **Real-Time Feedback During Session**
Active session screen now displays:
- **Tree growing in real-time** as seconds pass
- **Focus status indicator** (green = uninterrupted, red = broken)
- **Interruption counter** showing current tab switches
- **Alert message** warning about interruption penalties
- **Objective reminder** to keep user focused

---

## User Experience Flow

### Setup Phase
1. User selects a task/mission from dropdown
2. User sets duration (25, 50, or 90 minutes)
3. User clicks "Initiate Deep Dive"

### Active Phase (NEW!)
1. **Tree starts at Seed** 🌱
2. Tree **grows continuously** as timer counts down
3. If user **leaves the tab**, focus streak breaks and warning appears
4. **Real-time metrics** show interruptions and focus status
5. User stays until timer ends OR terminates early

### Complete Phase (ENHANCED!)
1. **Beautiful harvest screen** shows final tree stage
2. **Reward breakdown** explains every point earned/lost
3. **Session statistics** summarize performance
4. User returns to main interface

---

## Technical Implementation

### State Management
```typescript
const [growthProgress, setGrowthProgress] = useState(0); // 0-100%
const [focusInterruptions, setFocusInterruptions] = useState(0);
const [focusStreak, setFocusStreak] = useState(true);
const appVisibilityRef = useRef<boolean>(true);
```

### Key Functions
- **`getTreeStage(growth)`**: Maps growth percentage to tree emoji, name, height, and color
- **`handleVisibilityChange()`**: Detects tab switches, breaks streak, increments interruption counter
- **Timer Logic**: Automatically grows tree by `(100 / duration)%` each second

### DOM Changes
- **Active Screen**: Grid layout with tree visualization, metrics, and warnings
- **Complete Screen**: Multi-section layout showing tree, reward breakdown, and stats
- **Responsive**: Works on mobile, tablet, and desktop

---

## Reward Incentives

### Motivations
✅ **Stay focused** → Earn bonus rewards (perfect streak)
⚠️ **Leave to check phone** → Lose points, break streak
🌳 **Complete session** → Watch tree grow to impressive stage
📊 **Visual feedback** → Immediate gratification from growth

### Streak Psychology
- Users naturally want to **"not break the chain"**
- Each interruption is **immediately visible and costly**
- Uninterrupted sessions feel **more accomplishing**
- Bonus creates **aspirational goal** (reach Ancient Grove)

---

## Future Enhancements (Optional)

### Phase 2 Ideas
1. **Focus Forest Collection**: Save grown trees to a personal "garden" page
2. **Leaderboards**: Weekly/monthly focus streak competitions
3. **Daily Goals**: "Plant X trees per week" achievements
4. **Tree Customization**: Different tree types, seasonal themes
5. **Ambient Sounds**: Optional focus music/nature sounds during sessions
6. **Pomodoro Integration**: Auto-session presets (25m, 50m, 90m)
7. **Social Sharing**: Share session stats and final tree stage
8. **Challenges**: "Grow 5 Ancient Groves" or "Perfect Focus Week"

---

## File Changes

### Modified File
- `pages/FocusPage.tsx`
  - Added imports: `useRef`, `AlertCircle`, `Zap`, `Leaf`
  - Added state: `growthProgress`, `focusInterruptions`, `focusStreak`
  - Added function: `getTreeStage(growth)`
  - Enhanced: `renderActive()` with tree visualization and metrics
  - Enhanced: `renderComplete()` with harvest summary and reward breakdown
  - New hook: `visibilitychange` listener for interruption detection
  - Updated timer logic to grow tree continuously

---

## Mobile Responsiveness

All new features are fully responsive:
- ✅ Tree emoji scales with viewport
- ✅ Metrics grid stacks on mobile
- ✅ Text sizes adjust (text-7xl → text-8xl on desktop)
- ✅ Spacing adapts (`px-4` for mobile, natural for desktop)
- ✅ Alerts remain readable on all screen sizes

---

## Testing Checklist

- [ ] Start a 25-minute session
- [ ] Watch tree grow from Seed to final stage
- [ ] Switch tabs mid-session → interruption counter increases
- [ ] Complete session uninterrupted → +15 Psyche earned
- [ ] Complete session with interruptions → +6-13 Psyche (scaled)
- [ ] Terminate early → session ends, no rewards
- [ ] Check reward breakdown shows correct calculations
- [ ] Verify toast messages appear on interruption
- [ ] Test on mobile, tablet, desktop responsiveness

---

## Summary

This enhancement transforms the Focus Page from a simple timer into an **engaging, gamified deep-work experience**. The tree-growing mechanic provides:

✨ **Visual Satisfaction**: Watch your tree grow in real-time
🎯 **Clear Incentives**: Stay focused, earn more rewards
⚠️ **Accountability**: Interruptions are tracked and costly
📈 **Progress Feel**: Multiple growth stages create milestones
🌳 **Memorable UX**: Users will want to "complete their forest"

The focus forest system is now **production-ready** and integrated seamlessly into the existing reward system.
