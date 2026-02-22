# Decay Visibility System - Quick Visual Reference

## Decay Status Colors & Icons

```
STATE               DAYS INACTIVE    ICON              COLOR       ACTION
───────────────────────────────────────────────────────────────────────────
✅ SYSTEMS NOMINAL     0 days       🛡️ Shield       🟢 Green    Keep it up!
⏰ STAY ACTIVE         1 day        ⚠️ Alert        🟠 Orange   Reminder
⚠️ DECAY IMMINENT      2 days       ⚠️ Alert(pulse) 🟡 Yellow   URGENT
🚨 DECAY ACTIVE        3+ days      ⚠️ Alert(pulse) 🔴 Red      CRITICAL
```

---

## Dashboard Widget Display

### Collapsed View (Default)
```
┌─────────────────────────────────────────────────────┐
│ ✅ SYSTEMS NOMINAL                           3 Days │
│ 0 / 3 Days                                    Left  │
│ (Optional expand indicator)                    ▼    │
└─────────────────────────────────────────────────────┘
```

### Expanded View
```
┌──────────────────────────────────────────────────────┐
│ ✅ SYSTEMS NOMINAL                           3 Days │
│ 0 / 3 Days                                    Left  │ ▲
├──────────────────────────────────────────────────────┤
│                                                      │
│ DECAY COUNTDOWN                                      │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│ 0 of 3 days elapsed                                 │
│                                                      │
│ POINTS AT RISK OF DECAY                             │
│ ┌──────────────────────────────────────────────┐    │
│ │ Physical               Rank B              -2    │
│ │ Vitality               Rank C              -2    │
│ │ Intelligence           Rank D              -3    │
│ │ Creativity             Rank E              -3    │
│ │ Spirit                 Rank E              -3    │
│ │ Psyche                 Rank B              -2    │
│ └──────────────────────────────────────────────┘    │
│                                                      │
│ ✅ Great! Keep your streak alive by completing      │
│ tasks daily.                                        │
│                                                      │
│ HOW DECAY WORKS                                      │
│ • 3+ days inactive → Stats lose points              │
│ • Loss amount depends on current rank               │
│ • Higher ranks lose fewer points                    │
│ • SS/SS+ ranks immune to decay                      │
└──────────────────────────────────────────────────────┘
```

---

## Day-by-Day Example

### Day 1 (Activity Logged)
```
✅ SYSTEMS NOMINAL
Progress: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%
Days: 0 / 3
Days Left: 3
Message: "✅ Great! Keep your streak alive by completing tasks daily."
```

### Day 2 (No Activity)
```
⏰ STAY ACTIVE
Progress: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 33%
Days: 1 / 3
Days Left: 2
Message: "⏰ REMINDER: Stay consistent to protect your progress!"
```

### Day 3 (No Activity)
```
⚠️ DECAY IMMINENT (pulsing)
Progress: ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 66%
Days: 2 / 3
Days Left: 1
Message: "⚠️ WARNING: Complete at least one task in the next 24 hours!"
```

### Day 4 (No Activity - Decay Kicks In)
```
🚨 DECAY ACTIVE (pulsing)
Progress: ███████████████████████████████████████████████████ 100%
Days: 3 / 3
Days Left: 0
Message: "🚨 CRITICAL: Log activity immediately to stop losing points!"

POINTS AT RISK OF DECAY (now being lost daily):
Physical        Rank B              -2 pts/day
Vitality        Rank C              -2 pts/day
Intelligence    Rank D              -3 pts/day
Creativity      Rank E              -3 pts/day
Spirit          Rank E              -3 pts/day
Psyche          Rank B              -2 pts/day
────────────────────────────────────
TOTAL DAILY LOSS:                   -15 pts/day
```

---

## Decay Table Reference

```
RANK    THREAT LEVEL        LOSS/DAY    IMMUNE?
────────────────────────────────────────────────
E       Echo (Dormant)      3 pts       No
D       Delta (Learning)    3 pts       No
C       Charlie (Standard)  2 pts       No
B       Bravo (Elite)       2 pts       No
A       Alpha (Command)     1 pt        No
S       The Complete One    1 pt        No
SS      Omega (Anomaly)     0 pts       YES ✅
SS+     Transcendent        0 pts       YES ✅
```

---

## Key Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| Real-time countdown | ✅ | Updates every load/refresh |
| Status colors | ✅ | Green/Orange/Yellow/Red |
| Points breakdown | ✅ | Shows each stat at risk |
| Action messages | ✅ | Clear guidance for each state |
| Expandable details | ✅ | Click to see full info |
| Mobile responsive | ✅ | Works on all devices |
| Animations | ✅ | Pulsing icons when critical |
| Educational info | ✅ | Explains how decay works |

---

## Widget Position in Dashboard

```
HEADER (Fixed)
│
DASHBOARD BODY (Scrollable)
├─ 🚨 DECAY STATUS WIDGET ← HIGH PRIORITY, TOP
├─ Companion Message
├─ Stats Cards (Apex Index, Total Volts, Active Days, Logged Days)
├─ Neural Linguistic Sync (DS Level)
├─ Neural Pulse Heatmap (28-day activity)
├─ Growth Ledger (Tasks with substat labels)
└─ Right Column (Rank + Tactical Analysis)
```

---

## How to Use

### For Users:
1. **Open Dashboard** → Immediately see decay status
2. **Check Days Left** → Know how many days before decay
3. **See Points at Risk** → Understand what you'll lose
4. **Read Action Message** → Know what to do
5. **Click to Expand** → Get detailed breakdown
6. **Complete a Task** → Reset the countdown

### For Developers:
1. **Widget** imports from `services/decayService.ts`
2. **Service** calculates based on `lastActivityDate` and `stats`
3. **Widget** handles all UI rendering and interactivity
4. **Responsive** design built in with Tailwind
5. **Colors** auto-update based on status

---

## Example Code Usage

```tsx
import { calculateDecayInfo } from '../services/decayService';

// Calculate decay info
const decayInfo = useMemo(
  () => calculateDecayInfo(lastActivityDate, stats),
  [lastActivityDate, stats]
);

// Display widget
<DecayStatusWidget decayInfo={decayInfo} />

// Access decay data
{
  daysSinceLastActivity: 2,           // Days since activity
  daysUntilDecay: 1,                  // Days until decay
  isDecayActive: false,                // Is decay happening now?
  isDecayImminent: true,               // Is decay about to happen?
  pointsAtRisk: [2, 2, 3, 3, 3, 2],   // Points per stat
  affectedStats: ['Physical', ...],    // Which stats affected
  decayBreakdown: [                    // Detailed breakdown
    { stat: 'Physical', rank: 'B', pointsToLose: 2 },
    ...
  ]
}
```

---

## Summary

**Users now have COMPLETE visibility into:**
✅ When decay will occur
✅ Which stats will be affected
✅ How many points they'll lose
✅ What action to take
✅ Real-time countdown
✅ Clear status indicators
✅ Educational information

**Decay is no longer a hidden mechanic!**
