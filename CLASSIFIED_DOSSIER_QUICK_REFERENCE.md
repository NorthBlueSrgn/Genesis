# Classified Dossier: Developer Quick Reference

## Component Quick Access

### Import
```tsx
import { ClassifiedDossier } from '../components/ClassifiedDossier';
```

### Props
```tsx
<ClassifiedDossier 
  report={fullCalibrationReport}
  userName="Abas"
  onProceed={() => handleProceed()}
  isModal={false}
/>
```

---

## Data Requirements: FullCalibrationReport

### Minimum Required Fields
```typescript
{
  codename: string;                    // e.g., "SENTINEL"
  tpi: number;                         // 0-100 (Threat Percentage)
  percentile: number;                  // 0-100 (Percentile rank)
  talentClass: TalentClass;            // Laggard|Average|Talented|Gifted|Genius
  obsessionLevel: ObsessionLevel;      // Lazy|Average|Locked-In|Relentless|Compulsive
  mbtiProfile: string;                 // e.g., "ISTJ"
  symbolicProfile: string;             // e.g., "The Architect"
  rarityBand: string;                  // Singularity|Outlier|Abnormality|Exceptional|Optimized
  overallRank: AttributeRankName;      // E|D|C|B|A|S|SS|SS+
  estimatedCeilingRank: AttributeRankName;
  talentDna: TalentDna;                // { BP, LV, DR } - coefficients 0-1
  traitScores: TraitScores;            // { IP, LE, RE, FO, EX, CO } - 0-100
  primaryFailureNode: string;
  failureNodeRisk: string;
  successProbability: number;          // 0-100
  dropoutProbability: number;          // 0-100
  centralInsight: string;              // Markdown prose (supports **bold** and *italic*)
  historicalPrecedent: {
    name: string;
    matchPercentage: number;           // 0-100
    alignment: string;
  };
  initialStatsSnapshot: Stat[];
  talentDna: TalentDna;                // BP, LV, DR coefficients
  noteworthyFeats?: Array<{
    label: string;
    value: string;
    rarity: 'Common' | 'Elite' | 'Mythic';
    desc: string;
  }>;
  biometrics?: {
    dateOfBirth?: string;              // e.g., "1996/05/15"
    age?: number;
    gender?: string;
    height?: string;
    weight?: string;
  };
}
```

---

## 7 Tiers at a Glance

| Tier | Component | Key Data |
|------|-----------|----------|
| 01 | Hardware Diagnostics | TPI, Talent, Obsession, Rarity, Feats |
| 02A | Psychometric Profile | MBTI, Archetype, Symbolic Alias |
| 02B | Anomaly Matrix | Tk/Ok scatter plot, quadrants, ghost nodes |
| 02C | Biometric Vectors | HATI %, Ceiling Rank, Talent DNA % |
| 02D | Risk Assessment | Failure Node, Risk Level, Success % |
| 02E | Resonance Signature | Type, Ability, Aura Manifestation |
| 03-07 | Extended Info | Neural Arch, Growth, Achievements, Classification |

---

## Styling Customization

### Color Tier System
```tsx
// In component, use these patterns:
border-purple-600    // TIER 01, 02A, 02E primary
border-cyan-600      // TIER 03
border-red-600       // TIER 02B, 04
border-green-600     // TIER 02C
border-orange-600    // TIER 02D
border-indigo-600    // TIER 05
border-yellow-600    // TIER 06
border-white         // TIER 07
```

### Font Sizes
```tsx
// Headers
text-xl font-orbitron font-black

// Subheaders
text-lg font-orbitron font-black

// Data values
text-2xl/3xl font-orbitron font-black

// Labels
text-[10px] font-mono font-black

// Body
text-[9px]/text-[10px] font-mono

// Small
text-[8px] font-mono
```

---

## Common Customizations

### Add a New Subsection
```tsx
const NewSection: React.FC<{ report: FullCalibrationReport }> = ({ report }) => {
  return (
    <div className="bg-black/60 border border-[COLOR]-900/60 p-6">
      {/* Content */}
    </div>
  );
};

// In main component:
<section className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-[NUM]">
  <div className="flex items-center gap-4 border-l-4 border-[COLOR]-600 pl-4">
    <span className="bg-[COLOR]-600 text-black px-2 py-0.5 text-[10px] font-black font-orbitron">TIER_XX</span>
    <h2 className="text-xl font-black font-orbitron text-white tracking-widest uppercase">Section Name</h2>
  </div>
  <NewSection report={report} />
</section>
```

### Adjust Film Grain Intensity
```tsx
// Current: !opacity-[0.03] to !opacity-[0.08]
// Increase to: !opacity-[0.12] or !opacity-[0.15]
// Decrease to: !opacity-[0.01] or !opacity-[0.02]
<div className="absolute inset-0 bg-film-grain !opacity-[0.06]" />
```

### Change Scanline Speed
```css
/* In index.css, modify: */
.scanline-overlay {
  animation: scan-drift 8s linear infinite;  /* Change 8s to desired duration */
}
```

---

## CSS Classes Reference

### Visual Effects
```css
.bg-film-grain          /* Film grain texture */
.scanline-overlay       /* Scanline animation */
.grid-background        /* Blueprint grid */
.biometric-scan-line    /* Scan animation */
.chromatic-aberration   /* Text red/cyan shift */
.decrypting-text        /* Text reveal effect */
.classified-stamp-red   /* Red classified stamp */
.handwritten-annotation /* Permanent Marker text */
.annotation-box         /* Red dashed border box */
```

---

## Animation Timing Guide

### Stagger Delays (in main component)
```tsx
// Each section adds delay-[NUM] class:
delay-0     // Immediate
delay-100   // +100ms (Sections 2A-2E)
delay-200   // +200ms (Section 3)
delay-300   // +300ms (Section 4)
delay-400   // +400ms (Section 5)
delay-500   // +500ms (Section 6)
delay-600   // +600ms (Section 7)
```

### Custom Animations
```css
/* Scanlines drift (8s cycle) */
@keyframes scan-drift { 0% { transform: translateY(0); } 100% { transform: translateY(10px); } }

/* Stamp pulse (3s cycle) */
@keyframes stamp-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.5; } }

/* Text decrypt (0.5s one-shot) */
@keyframes decrypt { 0% { opacity: 0.3; text-shadow: 0 0 10px rgba(168, 85, 247, 0.5); } 100% { opacity: 1; text-shadow: none; } }
```

---

## Integration with GameState

### Before Component Render
```tsx
import { useGameState } from '../contexts/GameStateContext';

const MyComponent = () => {
  const gameState = useGameState();
  
  // Get alignment for customization
  const alignment = gameState.alignment;
  
  // Check if already onboarded
  if (gameState.hasOnboarded) {
    return <AlreadyComplete />;
  }
  
  return <ClassifiedDossier report={finalReport} />;
};
```

### After Component Proceed
```tsx
const onProceed = async () => {
  // Save to Firestore
  await saveUserProfile(gameState.userName, finalReport);
  
  // Seed game state with aligned stats
  seedInitialState(
    finalReport.initialStatsSnapshot,
    0,
    finalReport,
    finalReport.initialStatsSnapshot,
    gameState.userName,
    finalReport.talentDna,
    finalReport.archetypeTitle,
    biometricData
  );
  
  // Navigate to game
  navigate('/dashboard');
};
```

---

## Testing Checklist

- [ ] Component renders without errors
- [ ] All 7 tiers display in correct order
- [ ] Film grain visible (not too strong)
- [ ] Scanlines animate smoothly
- [ ] Grid background subtle
- [ ] Sections animate with stagger
- [ ] Hover effects work on cards
- [ ] Text is readable (contrast ok)
- [ ] Responsive on mobile/tablet/desktop
- [ ] onProceed callback fires correctly
- [ ] Color coding matches tier legend
- [ ] Alignment data displays correctly

---

## Performance Tips

1. **Avoid layout changes**: Use `transform` and `opacity` for animations
2. **Lazy load charts**: Use `ResponsiveContainer` from recharts
3. **Memoize sub-components**: Use `React.memo()` if heavy
4. **CSS over JS animations**: All animations use pure CSS
5. **Limit film grain opacity**: Too high = performance hit

---

## Accessibility Checklist

- [ ] Color used with symbols/icons (not color-only)
- [ ] Text contrast ≥ 4.5:1 (WCAG AA)
- [ ] Min font size: 8px (decorative), 10px (readable)
- [ ] Alt text on images/icons
- [ ] Semantic HTML headings (`<h1>`, `<h2>`, etc.)
- [ ] Keyboard navigation works
- [ ] Focus states visible

---

## Common Issues & Fixes

### Scanlines not visible
```tsx
// Check opacity in .scanline-overlay
.scanline-overlay {
  opacity: 0.15;  // Increase if not visible
}
```

### Film grain too strong
```tsx
// Reduce opacity
<div className="absolute inset-0 bg-film-grain !opacity-[0.02]" />
```

### Animation choppy
```tsx
// Ensure using GPU-accelerated properties
transform: translateY(0);  // ✅ Good
opacity: 1;                // ✅ Good
width: 100%;              // ❌ Bad (layout thrashing)
```

### Font not loading
```tsx
// Check @import in index.css and Google Fonts CDN
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&...');
```

---

## File Organization

```
Genesis-Protocol/
├── components/
│   └── ClassifiedDossier.tsx      (900+ lines)
├── services/
│   ├── alignmentService.ts
│   └── firebaseService.ts
├── data/
│   └── abasProfile.ts
├── pages/
│   ├── OnboardingPage.tsx         (imports ClassifiedDossier)
│   └── RankPage.tsx               (imports ClassifiedDossier)
├── types.ts                        (FullCalibrationReport interface)
├── index.css                       (visual effect styles)
└── docs/
    ├── CLASSIFIED_DOSSIER_GUIDE.md
    ├── CLASSIFIED_DOSSIER_VISUAL_REFERENCE.md
    ├── CLASSIFIED_DOSSIER_ALIGNMENT_INTEGRATION.md
    └── CLASSIFIED_DOSSIER_IMPLEMENTATION_COMPLETE.md
```

---

## Quick Copy-Paste: Basic Render

```tsx
import { ClassifiedDossier } from '../components/ClassifiedDossier';
import { useGameState } from '../contexts/GameStateContext';

export const MyPage = () => {
  const gameState = useGameState();
  
  const exampleReport = {
    codename: 'SENTINEL',
    tpi: 87,
    percentile: 85,
    talentClass: 'Talented Learner',
    obsessionLevel: 'Locked-In',
    mbtiProfile: 'ISTJ',
    symbolicProfile: 'The Disciplined Ascetic',
    rarityBand: 'Exceptional',
    overallRank: 'B',
    estimatedCeilingRank: 'A',
    talentDna: { BP: 0.7, LV: 0.75, DR: 0.8 },
    traitScores: { IP: 70, LE: 75, RE: 60, FO: 68, EX: 55, CO: 65 },
    primaryFailureNode: 'Inflexibility',
    failureNodeRisk: 'Recursive cognitive loops when rules conflict',
    successProbability: 92,
    dropoutProbability: 8,
    centralInsight: 'Asset displays **unusual discipline** (88%). *Systematic analysis* is strength.',
    historicalPrecedent: {
      name: 'Ibn Khaldun',
      matchPercentage: 91.4,
      alignment: 'Like Ibn Khaldun, asset perceives world through cyclical, systemic logic.'
    },
    initialStatsSnapshot: [],
    noteworthyFeats: [],
  };
  
  return (
    <ClassifiedDossier 
      report={exampleReport}
      userName={gameState.userName}
      onProceed={() => console.log('Proceed!')}
    />
  );
};
```

---

## Support & Resources

- **Full Guide**: `CLASSIFIED_DOSSIER_GUIDE.md` (2000+ words)
- **Visual Reference**: `CLASSIFIED_DOSSIER_VISUAL_REFERENCE.md` (1500+ words)
- **Alignment Integration**: `CLASSIFIED_DOSSIER_ALIGNMENT_INTEGRATION.md` (1500+ words)
- **Implementation Status**: `CLASSIFIED_DOSSIER_IMPLEMENTATION_COMPLETE.md`

---

**Quick Summary**: ClassifiedDossier is a production-ready component displaying user profiles in 7 cyberpunk-styled tiers. Insert anywhere a FullCalibrationReport is available. Fully customizable via Tailwind classes and CSS variables.

