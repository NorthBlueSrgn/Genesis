# Decay Mechanics Visibility Report

## Current Status: ⚠️ **NOT VISIBLE TO USERS**

The Genesis Protocol app has **decay mechanics defined in constants but NOT implemented or visible** in the UI.

---

## What Exists (Backend):

### Decay Constants (constants.ts)
```typescript
export const DECAY_CONSTANTS = {
  INACTIVITY_THRESHOLD_DAYS: 3,
  DECAY_POINTS_BY_RANK: { 
      [AttributeRankName.E]: 3,    // 3 points lost
      [AttributeRankName.D]: 3,    // 3 points lost
      [AttributeRankName.C]: 2,    // 2 points lost
      [AttributeRankName.B]: 2,    // 2 points lost
      [AttributeRankName.A]: 1,    // 1 point lost
      [AttributeRankName.S]: 1,    // 1 point lost
      [AttributeRankName.SS]: 0,   // NO decay at SS
      [AttributeRankName.SS_PLUS]: 0 // NO decay at SS+
  }
};
```

**Rule:** After 3 days of inactivity, users lose stat points based on their rank.

---

## What's Missing (Frontend):

1. **No decay warning system** - Users don't see:
   - How many days since last activity
   - How many points they'll lose if inactivity continues
   - Countdown to when decay kicks in

2. **No decay feedback** - Users don't see:
   - When decay actually occurs
   - How many points were lost
   - Which stats were affected

3. **No decay visualization** - No UI elements show:
   - Inactivity status
   - Days until decay
   - Decay impact preview

4. **No decay notification** - Users don't receive:
   - Alerts about approaching decay threshold
   - Notifications when decay occurs
   - Recovery suggestions

---

## Current App Display:

### What Users See:
- ✅ **Active Days** - Total number of days with logged activity (top stat card)
- ✅ **Current Streak** - Consecutive days of activity (top stat card)
- ✅ **Neural Pulse Heatmap** - Last 28 days activity visualization

### What Users DON'T See:
- ❌ Days since last activity
- ❌ Inactivity warnings
- ❌ Decay countdown
- ❌ Points at risk
- ❌ Decay notifications

---

## Recommendation: Add Decay Visibility System

### Option 1: Minimal (Quick Add)
Add a simple "Inactivity Alert" component that shows:
```
Days Since Last Activity: 0/3
Points at Risk: 0 (E rank: 3 points)
```

### Option 2: Medium (Recommended)
Create an "Inactivity Warning System" with:
- **Dashboard Widget**: Shows inactivity status
- **Color coding**: Green (safe) → Yellow (warning) → Red (at risk)
- **Decay info card**: Days until decay, points at risk
- **Reset button**: Quick way to log activity and reset

### Option 3: Full (Complete System)
Implement comprehensive decay mechanics:
- **Real-time decay calculation** - Apply decay after 3 days
- **Decay logs** - Show decay history in SystemLog
- **Decay recovery** - Options to recover lost points
- **Decay notifications** - Push/toast alerts at thresholds
- **Decay prevention tips** - Suggest task completion
- **Streak multipliers** - Reward long streaks to offset decay

---

## Example UI Addition (Dashboard):

```tsx
<Card className="!bg-red-900/20 border-red-500/50">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-red-300 font-bold">Inactivity Status</h3>
      <p className="text-sm text-gray-400">
        {daysSinceLastActivity}/3 days without activity
      </p>
    </div>
    <div className="text-right">
      <p className="text-red-400 font-mono">
        {pointsAtRisk} points at risk
      </p>
      {daysSinceLastActivity >= 3 && (
        <p className="text-[10px] text-red-500 font-black">
          ⚠️ DECAY ACTIVE
        </p>
      )}
    </div>
  </div>
  
  {daysSinceLastActivity >= 2 && (
    <button className="mt-3 w-full bg-red-600 hover:bg-red-500 py-2 px-3 rounded">
      Log Activity Now to Prevent Decay
    </button>
  )}
</Card>
```

---

## Summary

**The decay system is defined but hidden.** Users currently have:
- ✅ Streak tracking (visible)
- ✅ Activity history (visible as heatmap)
- ❌ Inactivity warnings (NOT visible)
- ❌ Decay previews (NOT visible)
- ❌ Decay notifications (NOT visible)

This creates a situation where users might not know they're losing points due to inactivity. Adding decay visibility would:
1. **Increase engagement** - Users stay motivated to log daily
2. **Improve clarity** - Users understand the consequences
3. **Provide feedback** - Users see the impact of their actions
4. **Complete the system** - Decay constants become functional

Would you like me to implement decay visibility? If so, which option (1, 2, or 3) would you prefer?
