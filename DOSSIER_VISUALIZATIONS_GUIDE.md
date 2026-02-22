# Classified Dossier: Visual Data & Charts

**Status**: ✅ FULLY IMPLEMENTED  
**Date**: January 19, 2026

---

## Overview

The Classified Dossier includes **multiple interactive visualizations** that display your asset profile in real-time:

1. **Singularity Plot** (Custom SVG) — Your position on Talent vs Obsession grid + 6-month projection
2. **Comparative Performance Radar** (Recharts) — Your 6 core attributes vs global mean
3. **Key Metrics Cards** (Data Display) — HATI %, Talent Class, Obsession Level, Rarity Index
4. **Performance Feats Grid** (Conditional) — Extraordinary achievements if any
5. **Failure Node Diagnostics** (Text + Data) — Clinical breakdown of your weakness

---

## Visual 1: Singularity Plot (The Main Graph)

**Type**: Custom SVG Visualization  
**Location**: Tier 2 (Hardware Diagnostics) → Neural Architecture section, left side  
**Size**: Large (8/12 grid columns on desktop)

### What It Shows

A **2D grid plotting your position based on Talent Class vs Obsession Level**:

- **X-Axis**: Your Obsession Level (Lazy → Compulsive)
  - Lazy: 15
  - Average: 35
  - Locked-In: 55
  - Relentless: 80
  - Compulsive: 94

- **Y-Axis**: Your Talent Class (Laggard → Genius)
  - Laggard: 15
  - Average: 35
  - Talented Learner: 55
  - Gifted: 80
  - Genius: 94

### Key Elements

**1. Grid Background**
- 2×2 quadrant division with labels:
  - **Bottom-Left**: "Stagnant Reservoir" (Low Talent, Low Obsession)
  - **Top-Left**: "Functional Baseline" (Low Talent, High Obsession)
  - **Bottom-Right**: "Transcendent Burnout" (High Talent, Low Obsession) — burnout risk zone
  - **Top-Right**: "Apex Convergence" (High Talent, High Obsession) — singularity zone

**2. Grid Lines**
- Dark grid at 20-unit intervals (0, 20, 40, 60, 80, 100)
- Provides precise positioning reference

**3. Your Active Position (Purple Pulsing Node)**
- **Glow Circle**: Purple radial gradient around your position
- **Animated Core**: Pulsing purple dot with "ACTIVE_ASSET" label
- **Continuous Animation**: Pulses from 1.2 to 1.8 radius over 2 seconds

**4. Projection Vector (Dashed Purple Line)**
- **From**: Your current position
- **To**: Projected position in 6 months (if Obsession remains stable)
- **Calculation**: 
  - `projectedX = userX + (drive × 0.2)`
  - `projectedY = userY + drive`
  - Capped at 98 to prevent overflow

**5. Historical Reference Markers (Ghost Nodes)**
- **Leonardo da Vinci**: (95, 92) — Genius + Compulsive
- **David Goggins**: (92, 35) — High Obsession, Average Talent
- **Mean Human**: (50, 50) — Baseline (Average + Average)
- **Elite Operative**: (85, 78) — High Talent + High Obsession

All reference markers are semi-transparent (20% opacity) and positioned as benchmarks.

### Example Positioning

| Profile | Position | Meaning |
|---------|----------|---------|
| Genius + Compulsive | (94, 94) | Top-right corner = Singularity |
| Average + Average | (35, 35) | Center = Population baseline |
| Gifted + Lazy | (15, 80) | Far right/low obsession = Burnout risk |
| Laggard + Relentless | (80, 15) | High effort but low talent = Grinding required |

---

## Visual 2: Comparative Performance Radar Chart

**Type**: Recharts RadarChart component  
**Location**: Tier 2 (Hardware Diagnostics) → Neural Architecture section, right side  
**Size**: Medium (4/12 grid columns on desktop)

### What It Shows

A **spider/radar chart comparing 3 key performance dimensions**:

### The 3 Metrics

1. **Potential** (Y-axis point)
   - Data: `report.talentDna.BP * 100` (Baseline Potential)
   - Your value vs Mean Human (45)

2. **Velocity** (Bottom-left point)
   - Data: `report.talentDna.LV * 100` (Learning Velocity)
   - Your value vs Mean Human (30)

3. **Drive** (Bottom-right point)
   - Data: `report.talentDna.DR * 100` (Drive/Obsession Factor)
   - Your value vs Mean Human (50)

### Visual Layers

**Layer 1: Mean Human (Gray Shadow)**
- Inner polygon (gray fill, 10% opacity)
- Shows baseline human performance
- Static reference for comparison

**Layer 2: Active Asset (Purple Overlay)**
- Outer polygon (purple stroke + 40% fill)
- Your actual performance
- Bold purple outline (stroke width 2)

**Layer 3: Polar Grid**
- Dark (#222) gridlines
- Radii at 0, 25, 50, 75, 100
- Angle labels: "Potential," "Velocity," "Drive"

**Layer 4: Tooltip**
- On hover: shows exact value
- Black background with subtle gray border
- Small font (10px) for clarity

### Interpretation

- **Large purple polygon outside gray**: You exceed baseline in multiple metrics
- **Purple polygon inside gray**: You underperform in specific areas
- **Balanced polygon**: Evenly distributed capabilities
- **Spiky polygon**: Specialized strength (one very high metric)

---

## Visual 3: Key Metrics Cards (Top Summary)

**Type**: Data cards with styled typography  
**Location**: Tier 1 (Hardware Diagnostics) → Top cards section  
**Size**: Grid of 4 cards (mobile: 1 column, tablet: 2×2, desktop: 1×4)

### Card 1: Apex Threat (HATI %)
```
┌─────────────────────────┐
│ APEX THREAT             │
│ 87%                     │
│ GRADE_B                 │
└─────────────────────────┘
```
- Large, rotated font
- Shows your HATI percentage (0-100%)
- Grade corresponds to HATI tier

### Card 2: Talent Class
```
┌─────────────────────────┐
│ TALENT CLASS            │
│ GIFTED                  │
│ Growth_Multiplier: x1.6 │
└─────────────────────────┘
```
- Capitalized class name
- Growth multiplier (XP scaling)
- Purple text color

### Card 3: Obsession Level
```
┌─────────────────────────┐
│ OBSESSION               │
│ RELENTLESS              │
│ Adherence_Prob: 95%     │
└─────────────────────────┘
```
- Capitalized obsession level
- Success probability
- Red text color

### Card 4: Rarity Index
```
┌─────────────────────────┐
│ RARITY INDEX            │
│ 1 in 450K               │
│ Population_Density      │
└─────────────────────────┘
```
- Population frequency
- Stat label
- Green text color

---

## Visual 4: Signature Performance Feats (Optional Grid)

**Type**: Conditional grid of achievement cards  
**Location**: Tier 1 (Hardware Diagnostics) → Signature Performance Feats section  
**Condition**: Only displays if `report.noteworthyFeats.length > 0`  
**Size**: Responsive grid (1-3 columns depending on screen)

### Feat Card Structure

```
┌─ [Icon] ──────────────────┐
│ FEAT_LABEL: Percentile    │
│ Brief description of      │
│ why this feat matters     │
└───────────────────────────┘
```

### Example Feats

| Feat | Rarity | Icon | Description |
|------|--------|------|-------------|
| Perfect Logic Accuracy | Mythic | Award | Solved entire Labyrinth with 100% accuracy under max stress |
| Exceptional Breath Hold | Epic | Shield | 95th percentile breath hold capacity (2.3x population average) |
| Reaction Speed Elite | Epic | Shield | CNS reaction time <150ms (top 2% of tested population) |
| Ethical Consistency | Rare | Shield | Perfect alignment across all moral dilemma responses |

---

## Visual 5: Failure Node Diagnostics (Text + Styled Box)

**Type**: Styled text container with color coding  
**Location**: Tier 3 (Tactical Intelligence) → System Vulnerability box  
**Color**: Red/dark red (#1a0505 background, #red-900 borders)

### Structure

```
┌──────────────────────────────────────┐
│ [AlertOctagon Icon] [SYSTEM_VULNERABILITY]
│                                      │
│ PRIMARY_FAILURE_NODE_TITLE           │
│ (e.g., "Dopamine Loop Sensitivity") │
│                                      │
│ "Trigger conditions: [risk text]"   │
│                                      │
│ Impact Severity: CRITICAL            │
└──────────────────────────────────────┘
```

### Data Fields

- **Icon**: AlertOctagon (red, 16px)
- **Header**: "[SYSTEM_VULNERABILITY]" in red
- **Title**: `report.primaryFailureNode` (large, bold red)
- **Risk Text**: `report.failureNodeRisk` (monospace, italic, red)
- **Severity**: Always "CRITICAL" for now

---

## Visual 6: Historical Precedent Card (Text + Styled Box)

**Type**: Styled information card  
**Location**: Tier 3 (Tactical Intelligence) → Historical Precedent box  
**Color**: Cyan/dark cyan (#051a1a background, #cyan-900 borders)

### Structure

```
┌──────────────────────────────────────┐
│ [History Icon] [HISTORICAL_PRECEDENT]
│                                      │
│ Comparable Profile: [% Match]        │
│ Name: [Historical Figure Name]       │
│                                      │
│ Characteristics:                     │
│ [Brief personality/capability desc]  │
└──────────────────────────────────────┘
```

### Data Fields

- **Icon**: History (cyan, 16px)
- **Header**: "[HISTORICAL_PRECEDENT]" in cyan
- **Match %**: From AI correlation
- **Name**: Historical figure (e.g., "Miyamoto Musashi")
- **Description**: Strategic summary

---

## Full Data Flow

```
Genesis Screening Test (All 3 Layers)
    ↓
Talent Class Calculation (16 substats)
    ↓
Obsession Level Calculation (11 substats)
    ↓
HATI Calculation (All 30 substats)
    ↓
Dossier Generation
    ├─ Card 1: HATI % → Displayed in card
    ├─ Card 2: Talent Class → Displayed in card
    ├─ Card 3: Obsession Level → Displayed in card
    ├─ Card 4: Rarity Index → Calculated from Talent+Obsession combo
    ├─ Singularity Plot → X/Y position from Obsession/Talent, vector from Drive
    ├─ Radar Chart → Displays BP, LV, DR
    ├─ Feats Grid → IF noteworthyFeats exist
    └─ Failure Node → From AI analysis
```

---

## Interactive Features

### Singularity Plot
- **Hover**: Reference markers slightly brighten
- **Animation**: Pulsing effect on active asset node
- **Vector Arrow**: Animated pulse along projection line
- **Responsive**: Scales with container, mobile-friendly

### Radar Chart
- **Hover**: Tooltip appears with exact value
- **Responsive**: Maintains aspect ratio on all screens
- **Dynamic Data**: Updates if report data changes

### Cards
- **Hover**: Border color changes, slight glow effect
- **Responsive**: Stack on mobile, grid on desktop
- **Color Coding**: Each card has distinct color (purple, red, green, cyan)

### Feats Grid
- **Hover**: Border changes, slight lift effect
- **Responsive**: 1-3 columns depending on screen size
- **Conditional**: Only shows if feats exist

---

## Color Palette

| Element | Color | Meaning |
|---------|-------|---------|
| Singularity Node | #a855f7 (Purple) | Your position |
| Radar Chart (You) | #a855f7 (Purple) | Your metrics |
| Radar Chart (Mean) | #444 (Gray) | Baseline |
| HATI Card | White/Cyan | Power level |
| Talent Card | Purple | Learning |
| Obsession Card | Red | Drive |
| Rarity Card | Green | Statistical |
| Failure Node | Red/Dark Red | Warning |
| Historical Precedent | Cyan/Dark Cyan | Reference |
| Grid Background | Dark (#1a1a1a) | Subtle |

---

## Technical Implementation

### Libraries
- **Recharts**: `RadarChart`, `PolarGrid`, `Radar`, `Tooltip`
- **Lucide React**: Icons (AlertOctagon, History, TrendingUp, Signal, Activity, etc.)
- **Custom SVG**: Singularity Plot (custom React component)
- **Tailwind CSS**: All card styling

### Performance
- All charts render on-demand (only when section scrolls into view)
- SVG optimized for large scale
- Radar chart uses `ResponsiveContainer` for auto-scaling
- Animations use CSS (smooth 60fps)

### Accessibility
- Tooltip text for all interactive elements
- Icon + text labels for all cards
- High contrast colors for readability
- Semantic HTML structure

---

## Example: Full Dossier Visual Output

```
═══════════════════════════════════════════════════════════════════
                    CLASSIFIED DOSSIER
                   CODENAME: Black Paradox
                    ASSET_FILE: GP-087
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                     HARDWARE DIAGNOSTICS                        │
├─────────────────────────────────────────────────────────────────┤
│
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  │APEX THREAT  │  │TALENT CLASS │  │  OBSESSION  │  │RARITY INDEX │
│  │    94%      │  │   GENIUS    │  │ COMPULSIVE  │  │ 1 in 8.2M   │
│  │  SS-RANK    │  │    x2.0     │  │   99%+      │  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
│
│  ┌─ SIGNATURE PERFORMANCE FEATS ──────────────────────────────┐
│  │ 🏆 Perfect Logic Accuracy: 100% (99.9th percentile)       │
│  │ 🏆 Exceptional Reaction Time: 142ms (top 1%)              │
│  │ 🏆 Ethical Consistency: Perfect alignment (all responses) │
│  └────────────────────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              NEURAL ARCHITECTURE MAPPING                        │
├─────────────────────────────────────────────────────────────────┤
│
│  ┌──── SINGULARITY PLOT ────┐  ┌── PERFORMANCE RADAR ────┐
│  │                          │  │                         │
│  │     [LEONARDO] •         │  │     Potential: 95%      │
│  │         •[ELITE_OP]      │  │     Velocity:  92%      │
│  │        ╱                 │  │     Drive:     98%      │
│  │       • YOUR POSITION ◉  │  │                         │
│  │       (Genius+Compulsive)│  │  [Purple polygon shows  │
│  │      ╱ ─ → projection   │  │   exceeding mean human] │
│  │ [MEAN]                  │  │                         │
│  └──────────────────────────┘  └─────────────────────────┘
│
│  Vector Analysis: Current learning trajectory of 92% efficiency.
│  System bottleneck identified at: None (fully aligned).
│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│         NEURAL FRICTION & CRITICAL FAILURES                    │
├─────────────────────────────────────────────────────────────────┤
│
│  ⚠️ [SYSTEM_VULNERABILITY]
│  PRIMARY FAILURE NODE: None Detected
│  Impact Severity: MINIMAL
│
│  📜 [HISTORICAL_PRECEDENT]
│  Correlation: 92% match to Stephen Hawking
│  Profile: Genius-tier cognitive architecture, perfectionist,
│           burnout risk despite high Obsession
│
└─────────────────────────────────────────────────────────────────┘

```

---

## Deployment Checklist

- ✅ Singularity Plot renders with correct X/Y positioning
- ✅ Projection vector calculates 6-month trajectory
- ✅ Reference markers displayed at correct positions
- ✅ Radar chart shows 3 metrics vs population mean
- ✅ Tooltip works on hover
- ✅ All cards display correctly with proper colors
- ✅ Feats grid only shows when feats exist
- ✅ Failure Node displays with clinical tone
- ✅ Historical Precedent shows correlation %
- ✅ All visuals responsive on mobile/tablet/desktop
- ✅ Animations smooth and non-distracting

---

**Status: ✅ PRODUCTION READY**

All visual elements are live, responsive, and interactive. Data flows correctly from Screening Test → Calculations → Dossier Visualization.
