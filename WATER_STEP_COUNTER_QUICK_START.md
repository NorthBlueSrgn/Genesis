# Water & Step Counter - Quick Start Guide

## What Was Added

Two new tracking counters on your Genesis Protocol dashboard:

### 💧 Water Intake Counter
- Track daily water consumption in milliliters
- Default goal: 2,000ml (2 liters)
- **Rewards on goal completion**: +5 XP, +2 Vitality (Regeneration)

### 👣 Step Counter
- Track daily step count
- Default goal: 10,000 steps
- **Rewards on goal completion**: +5 XP, +2 Physical (Endurance)

## How to Use

### Logging Water
1. Navigate to Dashboard
2. Find the Water Counter (blue/cyan card with droplet icon)
3. Click increment buttons:
   - **[+250]** for a glass of water (250ml)
   - **[+500]** for a water bottle (500ml)
4. When you reach 2,000ml → **Automatic reward!**

### Logging Steps
1. Navigate to Dashboard
2. Find the Step Counter (orange card with footprints icon)
3. Click increment buttons:
   - **[+1k]** for ~10 minutes of walking
   - **[+5k]** for ~45 minutes of walking
4. When you reach 10,000 steps → **Automatic reward!**

## Rewards System

### How It Works
- Each counter has a **daily goal**
- When you reach the goal, you get rewards **once per day**
- The progress bar turns **green** when complete
- A "✓ Goal_Hit" indicator appears
- Rewards are automatically added to your stats

### Reward Details
| Counter | Goal | XP | Stat Boost |
|---------|------|-----|-----------|
| Water | 2,000ml | +5 | +2 Regeneration (Vitality) |
| Steps | 10,000 | +5 | +2 Endurance (Physical) |

## Daily Reset

Every day at **04:00**:
- Water counter resets to 0ml
- Step counter resets to 0 steps
- Goal completion flags reset
- You can earn rewards again

## Visual Indicators

### Progress Bar Colors
- **Cyan/Orange**: In progress toward goal
- **Green**: Goal reached!

### Goal Completion
When you hit your goal, you'll see:
```
✓ Goal_Hit
```
Plus a system log message confirming your reward.

## Example Day

```
07:00 - Breakfast + water: Click [+500]    → 500ml
10:00 - Mid-morning: Click [+250]          → 750ml
13:00 - Lunch: Click [+500]                → 1,250ml
17:00 - Post-workout: Click [+500] twice   → 2,250ml
        → 🎉 GOAL REACHED! +5 XP, +2 Regeneration

Morning walk: Click [+5k]     → 5,000 steps
Errands: Click [+1k]          → 6,000 steps
Evening: Click [+5k]          → 11,000 steps
        → 🎉 GOAL REACHED! +5 XP, +2 Endurance
```

## Tips for Success

### Water Intake
- **Morning**: Start with 500ml upon waking
- **Meals**: 250-500ml with each meal
- **Exercise**: Extra 500ml post-workout
- **Evening**: Final 250ml before bed

### Step Count
- **Morning walk**: 3,000-5,000 steps
- **Lunch break**: 1,000-2,000 steps
- **Evening activity**: 3,000-5,000 steps
- **General movement**: 2,000-3,000 steps

## Quick Conversions

### Water Volume
- 250ml = 1 cup / small glass
- 500ml = 1 standard water bottle
- 1,000ml = 1 liter / large water bottle
- 2,000ml = Daily goal (2 liters)

### Step Estimates
- 1,000 steps ≈ 10 minutes walking
- 5,000 steps ≈ 45 minutes walking
- 10,000 steps ≈ 90 minutes walking
- 10,000 steps ≈ 5 miles / 8 km

## Troubleshooting

### "I reached my goal but didn't get rewards"
- Rewards are given **once per day**
- If you already reached the goal today, you won't get rewards again until tomorrow (after 04:00 reset)

### "I want to change my goal"
- Currently, goals are fixed at 2,000ml (water) and 10,000 steps
- Future updates may allow custom goal setting

### "My counters reset unexpectedly"
- Counters automatically reset at 04:00 daily
- This is intentional and allows you to earn rewards again

## Integration with Other Features

### Works With:
- ✅ Daily reset system (04:00)
- ✅ XP and leveling system
- ✅ Stat progression system
- ✅ System logs
- ✅ Achievement tracking (potentially)

### Stat Impact:
- **Water → Regeneration (Vitality)**: Better recovery, health regeneration
- **Steps → Endurance (Physical)**: Better stamina, cardiovascular fitness

## Mobile Support

Fully responsive! Works perfectly on:
- 📱 iPhone / Android phones
- 💻 Tablets
- 🖥️ Desktop browsers

## Where to Find It

**Location**: Dashboard (main page after login)
**Position**: Top section, next to Apex Index
**Always visible**: Yes, always displayed on dashboard

## Future Enhancements (Potential)

- 📊 Historical tracking graphs
- 🔥 Streak counters (consecutive days)
- 🎯 Custom goal setting
- ⌚ Fitness tracker integration
- 📈 Weekly/monthly summaries
- 🏆 Special achievements for milestones

## Development Details

**Implementation Date**: January 30, 2026
**Build Status**: ✅ Successful
**Deployment Status**: ✅ Live on Firebase
**Access URL**: https://genesis-protocol-bffc2.web.app

## Files Modified
- `types.ts` - Type definitions
- `contexts/GameStateContext.tsx` - State management
- `state/gameReducer.ts` - Reward logic
- `pages/DashboardPage.tsx` - UI components

## Questions?

Check the documentation:
- **WATER_STEP_COUNTER_IMPLEMENTATION.md** - Technical details
- **WATER_STEP_COUNTER_VISUAL_GUIDE.md** - Visual reference

---

**Remember**: The Genesis Protocol is about building better habits and optimizing your performance. Use these counters to track your basic health metrics and earn rewards for taking care of your body! 💪
