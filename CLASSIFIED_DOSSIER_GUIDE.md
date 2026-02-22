# Classified Dossier: High-Fidelity Cyberpunk Component Guide

## Overview

The **Classified Dossier** is a comprehensive, high-fidelity React component that displays user profiles in a cyberpunk-styled "classified intelligence document" format. It presents 7 distinct tiers of information with immersive visual design, film grain textures, scanlines, handwritten annotations, and blueprint grids.

---

## Component Architecture

### Main Component
- **File**: `components/ClassifiedDossier.tsx`
- **Props**: 
  - `report: FullCalibrationReport` - The complete calibration data
  - `onProceed?: () => void` - Callback for proceeding to next screen
  - `isModal?: boolean` - Whether rendered as modal
  - `userName?: string` - Display name of the user (e.g., "Abas")

### Sub-Components

#### 1. **PsychometricProfile**
Displays MBTI classification and symbolic alias mapping.
- MBTI 4-letter code and archetype name
- E/I, S/N, T/F, J/P breakdowns
- Symbolic alias mapping from report

#### 2. **AnomalyMatrix**
Scatter plot showing Tk (Technical Knowledge) vs Ok (Operational Kinetics) positioning.
- Plots user position within anomaly distribution
- Shows historical ghost nodes (dim outliers)
- Indicates quadrant classification
- Displays quadrant meanings (High Performer, Effort Hero, etc.)

#### 3. **BiometricVectors**
Displays physical and cognitive metrics.
- **HATI Index** (Hardware Adaptation Threshold Index): Based on percentile
- **Ceiling Rank**: Estimated maximum achievable rank
- **Talent DNA Score**: Base potential coefficient (0-100%)

#### 4. **RiskAssessment**
Critical vulnerability analysis and success probability.
- **Failure Node**: Primary vulnerability/weakness
- **Failure Risk Level**: CRITICAL, HIGH, or MODERATE (color-coded)
- **Trigger Conditions**: What situations activate the failure node
- **Success Probability**: Percentage likelihood of success (with visual progress bar)
- **Dropout Probability**: Inverse of success probability

#### 5. **ResonanceSignature**
Maps rarity band to resonance type and awakening status.
- **Type**: Juggernaut, Catalyst, Virtuoso, Chameleon, Cipher, Joker, or Unawakened
- **Tier**: Based on rarity band
- **Signature Ability**: Special capacity linked to resonance type
- **Aura**: Manifestation description

#### 6. **SingularityPlot** (Existing)
Grid showing Talent Class (Y-axis) vs Obsession Level (X-axis).
- Maps user position within talent/obsession space
- Shows reference points: Singularity, Stagnant, Undisciplined
- Displays quadrant backgrounds: High Performer, Effort Hero

#### 7. **Neural Architecture Mapping** (Existing)
Comparative mapping with historical precedent matching.

---

## 7 Tiers of Information

### Tier 01: Hardware Diagnostics
- Biometric fingerprinting and scan signature
- Apex Threat (TPI %)
- Talent Class with growth multiplier
- Obsession Level with adherence probability
- Rarity Index with population density
- Performance anomalies and signature feats

### Tier 02A: Psychometric Profile
- MBTI classification
- Archetype name and letter breakdown
- Symbolic alias
- Archetypal resonance mapping

### Tier 02B: Anomaly Matrix & Quadrant Mapping
- Scatter plot: Tk vs Ok positioning
- Historical ghost nodes (outliers)
- Quadrant classification system
- Anomaly type indicators

### Tier 02C: Biometric Vectors
- HATI Index (0-100%)
- Ceiling Rank (E through SS+)
- Talent DNA Score (base potential)

### Tier 02D: Risk Assessment
- Primary Failure Node
- Trigger conditions
- Risk severity levels (color-coded)
- Success probability with progress bar
- Dropout probability

### Tier 02E: Resonance Signature
- Awakened resonance type
- Signature ability
- Aura manifestation description
- Tier/rarity classification

### Tier 03: Neural Architecture & Comparative Mapping
- Talent vs Obsession Matrix (SingularityPlot)
- Performance Profile Index (Bar chart: Potential/Velocity/Drive)
- Historical precedent matching

### Tier 04: Neural Friction & Critical Failures
- System vulnerability analysis
- Failure node explanation
- Historical precedent with confidence percentage
- Central qualitative evaluation (prose analysis)

### Tier 05: Growth Vectors & Potential Ceiling
- Talent Class Vector with XP multiplier
- Obsession Level Vector with adherence rate
- Potential Ceiling (SINGULARITY, S+/SS, S, A-B, etc.)
- Growth trajectory analysis

### Tier 06: Signature Achievements & Rare Feats
- Notable achievements in grid layout
- Rarity badges (Common, Elite, Mythic)
- Achievement impact notes

### Tier 07: Operational Classification & Final Directive
- Classification summary grid
- Asset class, talent DNA, obsession level, rarity index
- Operational directive recommendations
- Burnout risk assessment
- Optimal pace recommendations
- Immutable profile elements

---

## Visual Design System

### Color Palette
- **Primary Accent**: Purple (`#a855f7`)
- **Cyan Highlight**: Cyan (`#06b6d4`)
- **Warning Red**: Red (`#dc2626`)
- **Success Green**: Green (`#4ade80`)
- **Caution Orange**: Orange (`#f97316`)
- **Gold/Amber**: Amber (`#fbbf24`)
- **Background**: Deep Black (`#010101`)

### Fonts
- **Orbitron** (400, 700, 900): Headlines, classifications, technical terms
- **JetBrains Mono**: Code-like sections, metrics, technical data
- **Permanent Marker**: Handwritten annotations, classified stamps
- **Rajdhani** (body): Default reading font

### Visual Effects

#### Film Grain
- Subtle noise texture overlay
- Opacity: 3-8% depending on context
- Created via SVG filter and background-image

#### Scanlines
- Horizontal repeating gradient
- Drifts downward over 8 seconds
- Creates CRT monitor effect
- Opacity: 15%

#### Blueprint Grid
- Subtle 40px x 40px grid
- Purple color with low opacity (3%)
- Background position offset creates pattern

#### Handwritten Annotations
- Red dashed borders with `#dc2626` color
- Slight rotation (-3deg)
- Uses Permanent Marker font
- Semi-transparent red text (0.8 opacity)
- Applied to critical warnings and notes

#### Classified Stamp
- Large rotated text (-15deg)
- Wavy red underline
- Pulse animation (opacity cycles 0.5-0.7)
- Permanent Marker font at 24px

#### Chromatic Aberration
- Text shadow with red (+2px) and cyan (-2px) offsets
- Applied to headers for sci-fi effect

#### Vignette Effect
- Fixed inset box-shadow
- Darkens edges of entire dossier
- Creates focused viewing experience

---

## Integration Points

### Data Sources
1. **FullCalibrationReport**: Contains all metrics and analysis
   - `report.tpi`: Apex Threat Index (0-100)
   - `report.percentile`: Percentile ranking
   - `report.talentClass`: Talent class string
   - `report.obsessionLevel`: Obsession level string
   - `report.rarityBand`: Rarity classification
   - `report.mbtiProfile`: MBTI code (e.g., "ISTJ")
   - `report.symbolicProfile`: Symbolic alias
   - `report.primaryFailureNode`: Main vulnerability
   - `report.failureNodeRisk`: Trigger description
   - `report.successProbability`: Success % (0-100)
   - `report.dropoutProbability`: Dropout % (0-100)
   - `report.historicalPrecedent`: Object with name, matchPercentage, alignment
   - `report.centralInsight`: Prose analysis with markdown formatting
   - `report.talentDna`: Object with BP, LV, DR coefficients
   - `report.traitScores`: Object with IP, LE, RE, FO, EX, CO
   - `report.biometrics`: Optional bio data (DOB, age, gender, height, weight, etc.)
   - `report.noteworthyFeats`: Array of achievements with rarity

### Page Integration
- **Used in**: `pages/OnboardingPage.tsx`, `pages/RankPage.tsx`
- **Flow**: After user completes screening/strategy test → Dossier displays → User proceeds to game initialization

---

## Customization Guidelines

### Adding New Sections
1. Create a new sub-component before the main export
2. Accept `report: FullCalibrationReport` as prop
3. Use consistent color scheme (border, text, background)
4. Add to appropriate tier in main render
5. Update tier numbering if needed

### Color Customization
Modify the color scheme by changing these values in the component:
```tsx
border-purple-600  // Primary tier color
border-cyan-600    // Secondary tier color
border-red-600     // Alert/critical tier
border-green-600   // Success/biometric tier
border-orange-600  // Caution tier
```

### Animation Timings
- Stagger animations: `delay-100`, `delay-200`, `delay-300`, etc.
- Scan animation: 3s cycle
- Scanlines drift: 8s infinite
- Stamp pulse: 3s infinite

### Font Adjustments
All font sizes use Tailwind scaling:
- Headers: `text-xl` to `text-3xl` with `font-orbitron`
- Labels: `text-[10px]` to `text-[12px]` with `font-mono` or `font-orbitron`
- Body text: `text-[9px]` to `text-[11px]` with `font-mono`

---

## Accessibility Notes

### High Contrast Elements
- Critical warnings use `text-red-500` or `text-red-600`
- Important metrics use `text-purple-300` or larger
- All text has adequate shadow contrast against dark background

### Readable Formats
- No text smaller than `text-[8px]` unless decorative
- Core information uses clear, sans-serif fonts
- Color-blindness consideration: Rely on symbols + color (icons, borders, text)

### Interactive Elements
- Buttons have `hover:border-*-500` states
- Cards have `group hover:scale-105 transition-all` for feedback
- Clear visual hierarchy with tier badges and section headers

---

## Animation Triggers

1. **Component Mount**: Scanning animation (2.8s) → Dossier reveal
2. **Scroll**: Clearance level increments (0.1, 0.4, 0.7 scroll thresholds)
3. **Hover**: Individual card scale/border color changes
4. **Continuous**: Scanlines drift, film grain flicker, stamp pulse

---

## Performance Considerations

- Film grain effect uses SVG filter (lightweight)
- Scanlines use CSS gradient animation (GPU-friendly)
- Grid background uses CSS gradient (no images)
- Recharts component for anomaly scatter plot (lazy-rendered)
- All animations use `transform` and `opacity` (no layout thrashing)

---

## Example Usage

```tsx
import { ClassifiedDossier } from '../components/ClassifiedDossier';
import { FullCalibrationReport } from '../types';

const MyComponent = () => {
  const report: FullCalibrationReport = {
    codename: 'SENTINEL',
    tpi: 87,
    talentClass: 'Talented Learner',
    obsessionLevel: 'Locked-In',
    // ... rest of report data
  };

  return (
    <ClassifiedDossier 
      report={report}
      userName="Abas"
      onProceed={() => handleProceed()}
    />
  );
};
```

---

## Future Enhancements

1. **Handwritten Annotations**: Add red-ink margin notes for specific fields
2. **Seal Graphics**: Implement embossed/stamped seal overlays
3. **Audio**: Optional cyberpunk background audio/ambient sounds
4. ** 3D Elements**: WebGL-based biometric scan visualization
5. **Export**: PDF export functionality with preserved styling
6. **Comparison**: Side-by-side user comparison view

---

## Troubleshooting

### Scanlines Not Visible
- Check `opacity: 0.15` in `.scanline-overlay`
- Verify background color contrast

### Film Grain Too Strong/Weak
- Adjust `!opacity-[0.03]` to `!opacity-[0.06]` etc.
- Increase by 0.01 increments

### Font Not Loading
- Verify `@import` in `index.css`
- Check Google Fonts CDN availability
- Fallback fonts: sans-serif, monospace, cursive

### Animations Jerky
- Enable hardware acceleration: `transform: translateZ(0)`
- Check for conflicting CSS animations
- Verify browser supports CSS Grid/Flexbox

---

## File References

- **Component**: `components/ClassifiedDossier.tsx` (900+ lines)
- **Styles**: `index.css` (handwritten annotation + visual effect styles)
- **Types**: `types.ts` (FullCalibrationReport, TalentClass, etc.)
- **Data**: `data/abasProfile.ts` (example Abas profile)

---

## Related Documentation

- `ALIGNMENT_SYSTEM_AND_ABAS_PROFILE.md` - Abas profile and alignment system
- `BIOMETRICS_AND_PROTOCOLS_GUIDE.md` - Biometric data structures
- `DOSSIER_CODENAME_UPGRADE.md` - Codename and visual upgrades
- `DOSSIER_REDESIGN_SUMMARY.md` - Previous design iterations

