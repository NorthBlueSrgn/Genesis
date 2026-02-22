# Water & Step Counter - Visual Quick Reference

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD - TOP SECTION                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  APEX INDEX  │  │ WATER INTAKE │  │  STEP COUNT  │     │
│  │   [CHART]    │  │   [DROPLET]  │  │ [FOOTPRINTS] │     │
│  │   76.3%      │  │   1500 ml    │  │    7,450     │     │
│  │  Apex_Index  │  │  Hydration   │  │    Steps     │     │
│  │              │  │              │  │              │     │
│  │              │  │ ████████░░░  │  │ ███████░░░░  │     │
│  │              │  │ 75% to goal  │  │ 74% to goal  │     │
│  │              │  │              │  │              │     │
│  │              │  │ [+250][+500] │  │ [+1k] [+5k]  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Water Counter States

### Not Started (0ml)
```
┌──────────────────┐
│   💧 Droplets    │
│                  │
│     0 ml         │
│   Hydration      │
│                  │
│ ░░░░░░░░░░░░░░   │ 0% to goal
│                  │
│ [+250]  [+500]   │
└──────────────────┘
```

### In Progress (1500ml / 2000ml)
```
┌──────────────────┐
│   💧 Droplets    │ (cyan)
│                  │
│    1500 ml       │
│   Hydration      │
│                  │
│ ██████████░░░░   │ 75% to goal (cyan bar)
│                  │
│ [+250]  [+500]   │
└──────────────────┘
```

### Goal Reached (2000ml+)
```
┌──────────────────┐
│   💧 Droplets    │ (cyan)
│                  │
│    2500 ml       │
│   Hydration      │
│                  │
│ ██████████████   │ 100% (green bar)
│                  │
│ [+250]  [+500]   │
│ ✓ Goal_Hit       │ (green checkmark)
└──────────────────┘

SYSTEM LOG: "HYDRATION GOAL ACHIEVED: 2000ml reached. +5 XP, +2 Regeneration awarded."
```

## Step Counter States

### Not Started (0 steps)
```
┌──────────────────┐
│  👣 Footprints   │
│                  │
│        0         │
│      Steps       │
│                  │
│ ░░░░░░░░░░░░░░   │ 0% to goal
│                  │
│  [+1k]  [+5k]    │
└──────────────────┘
```

### In Progress (7,450 / 10,000)
```
┌──────────────────┐
│  👣 Footprints   │ (orange)
│                  │
│     7,450        │
│      Steps       │
│                  │
│ ██████████░░░░   │ 74% to goal (orange bar)
│                  │
│  [+1k]  [+5k]    │
└──────────────────┘
```

### Goal Reached (10,000+)
```
┌──────────────────┐
│  👣 Footprints   │ (orange)
│                  │
│    12,300        │
│      Steps       │
│                  │
│ ██████████████   │ 100% (green bar)
│                  │
│  [+1k]  [+5k]    │
│ ✓ Goal_Hit       │ (green checkmark)
└──────────────────┘

SYSTEM LOG: "MOVEMENT GOAL ACHIEVED: 10000 steps reached. +5 XP, +2 Endurance awarded."
```

## Reward Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     WATER GOAL FLOW                         │
└─────────────────────────────────────────────────────────────┘

User logs water → updateDailyMetrics({ waterIntake: X })
                         ↓
           Check: waterIntake >= waterGoal?
                         ↓
                    ┌────┴────┐
                    │   NO    │   YES
                    ↓         ↓
              Update bar   Check: waterGoalReachedToday?
              only              ↓
                           ┌────┴────┐
                           │   YES   │   NO
                           ↓         ↓
                      Do nothing  Award Rewards:
                                  • Set waterGoalReachedToday = true
                                  • +5 XP
                                  • +2 Vitality (Regeneration)
                                  • Add system log
                                  • Show "Goal_Hit" indicator
                                  • Turn progress bar green

┌─────────────────────────────────────────────────────────────┐
│                     STEP GOAL FLOW                          │
└─────────────────────────────────────────────────────────────┘

User logs steps → updateDailyMetrics({ steps: X })
                         ↓
            Check: steps >= stepGoal?
                         ↓
                    ┌────┴────┐
                    │   NO    │   YES
                    ↓         ↓
              Update bar   Check: stepGoalReachedToday?
              only              ↓
                           ┌────┴────┐
                           │   YES   │   NO
                           ↓         ↓
                      Do nothing  Award Rewards:
                                  • Set stepGoalReachedToday = true
                                  • +5 XP
                                  • +2 Physical (Endurance)
                                  • Add system log
                                  • Show "Goal_Hit" indicator
                                  • Turn progress bar green
```

## Daily Reset (04:00)

```
┌─────────────────────────────────────────────────────────────┐
│                    DAILY RESET @ 04:00                      │
└─────────────────────────────────────────────────────────────┘

Before Reset (23:59):
  waterIntake: 2500ml
  steps: 12,000
  waterGoalReachedToday: true  ✓
  stepGoalReachedToday: true   ✓

After Reset (04:00):
  waterIntake: 0ml             ← Reset to 0
  steps: 0                     ← Reset to 0
  waterGoalReachedToday: false ← Can earn reward again
  stepGoalReachedToday: false  ← Can earn reward again
```

## Color Palette

```
┌─────────────────────────────────────────────────────────────┐
│                      COLOR SCHEME                           │
└─────────────────────────────────────────────────────────────┘

Water Counter:
  • Icon: Cyan (#22d3ee)      💧
  • Progress Bar: Cyan (#22d3ee)
  • Buttons: Cyan/20 → Cyan/40 on hover
  • Border: Cyan/20 → Cyan/40 on hover
  • Background Glow: Cyan/5

Step Counter:
  • Icon: Orange (#fb923c)    👣
  • Progress Bar: Orange (#fb923c)
  • Buttons: Orange/20 → Orange/40 on hover
  • Border: Orange/20 → Orange/40 on hover
  • Background Glow: Orange/5

Goal Completion (Both):
  • Progress Bar: Green (#4ade80)
  • Checkmark: Green (#4ade80)
  • "Goal_Hit" text: Green (#4ade80)
```

## Button Behavior

### Water Buttons
```
[+250]  → Adds 250ml  (1 cup/small glass)
[+500]  → Adds 500ml  (1 standard water bottle)
```

### Step Buttons
```
[+1k]   → Adds 1,000 steps   (≈10 min walk)
[+5k]   → Adds 5,000 steps   (≈45 min walk)
```

## Interaction Examples

### Scenario 1: Morning Routine
```
07:00 - User drinks coffee + water
        Clicks [+500] on Water Counter
        Display: 500ml / 2000ml (25%)
        Bar: ████░░░░░░░░░░░░

10:00 - Mid-morning water
        Clicks [+250]
        Display: 750ml / 2000ml (37.5%)
        Bar: ██████░░░░░░░░░░

13:00 - Lunch + water
        Clicks [+500]
        Display: 1250ml / 2000ml (62.5%)
        Bar: ██████████░░░░░░

17:00 - Post-workout hydration
        Clicks [+500] then [+250]
        Display: 2000ml / 2000ml (100%)
        Bar: ██████████████ (turns GREEN)
        
        🎉 REWARD TRIGGERED!
        ✓ Goal_Hit appears
        +5 XP added
        +2 Regeneration added
        System log: "HYDRATION GOAL ACHIEVED..."
```

### Scenario 2: Active Day
```
Morning walk:     Clicks [+5k]  → 5,000 steps (50%)
Afternoon errands: Clicks [+1k] → 6,000 steps (60%)
Evening jog:      Clicks [+5k]  → 11,000 steps (100%)

🎉 REWARD TRIGGERED at 10,000!
✓ Goal_Hit appears
+5 XP added
+2 Endurance added
System log: "MOVEMENT GOAL ACHIEVED..."
```

## Mobile vs Desktop Layout

### Desktop (Large Screen)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Apex Index  │ │ Water Counter│ │ Step Counter │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Mobile (Small Screen)
```
┌──────────────┐
│  Apex Index  │
└──────────────┘
┌──────────────┐
│ Water Counter│
└──────────────┘
┌──────────────┐
│ Step Counter │
└──────────────┘
```

## Implementation Success Criteria

✅ Water counter displays correctly
✅ Step counter displays correctly
✅ Progress bars animate smoothly
✅ Increment buttons work
✅ Goals trigger rewards once per day
✅ Daily reset clears counters
✅ Visual feedback on completion
✅ System logs record achievements
✅ Mobile responsive
✅ Consistent with Genesis Protocol aesthetic
