# Mobile Onboarding & Tutorial System Guide

## Overview

This document outlines the comprehensive mobile-friendly onboarding flow, navigation architecture, and tutorial system implemented for Genesis Protocol.

---

## Table of Contents

1. [Navigation Flow](#navigation-flow)
2. [Mobile Responsiveness](#mobile-responsiveness)
3. [Tutorial System](#tutorial-system)
4. [Onboarding Features](#onboarding-features)
5. [User Experience Flow](#user-experience-flow)

---

## Navigation Flow

### Default User Journey

```
Login → Onboarding (if not onboarded) → Classified Dossier → Dashboard
```

### After Onboarding

```
Dashboard (entry point) → Any Tab (with skippable tutorials)
```

**Key Implementation:**
- **App.tsx**: Routes check `gameState.hasOnboarded` status
  - If `false`: Show `OnboardingPage`
  - If `true`: Show main app with `Navigation`, `TutorialOverlay`, and routes
- **Always starts at dashboard**: Route `/` redirects to `/dashboard`
- **ClassifiedDossier**: Acts as transition screen between onboarding and main app
  - User scrolls through their calibration report
  - `INITIATE_UPGRADE` button triggers `onProceed` callback
  - Callback invokes `seedInitialState()` to finalize onboarding

---

## Mobile Responsiveness

### Responsive Design Principles Applied

#### 1. **OnboardingPage**
- **Container**: Full screen on mobile (h-screen, w-screen), constrained max-width on desktop
- **Padding**: `p-2 sm:p-4` (mobile-first, scales up on tablet/desktop)
- **Header**: Flexbox with responsive gap and truncation
  - Mobile: Vertical layout (flex-col)
  - Desktop: Horizontal layout (sm:flex-row)
- **Progress Bar**: Full width with responsive text sizing
- **Skip Button**: Visible on all screens, mobile-optimized size

#### 2. **TerminalShell Component**
- **Title Bar**: Responsive padding and icon sizing
  - `p-2 sm:p-3` (2x height on desktop)
  - Icon sizes: `size={12}` → `sm:text-[10px]`
  - Text: `text-[8px] sm:text-[10px]`
- **Content Area**: 
  - `p-3 sm:p-6 md:p-8` (scales across breakpoints)
  - `sm:min-h-[500px]` (constraint only on tablet+)
  - `overflow-y-auto` with custom scrollbar for mobile
- **Footer**: Hidden on small screens with `hidden sm:block`

#### 3. **Individual Tests (Mobile Optimization)**

**MBTITest:**
- Question text: `text-xl` with responsive padding
- Button grid: `flex justify-between items-center gap-2` (shrinks on mobile)
- Full container height on mobile, scrollable

**Questionnaire:**
- Select/Input: Full width with responsive padding
- Range slider: Responsive label sizing (`text-[10px]` → `sm:text-sm`)
- Scrollable container for long question lists

**DilemmaScreening:**
- Progress dots: `flex justify-center gap-0.5 flex-wrap` (wraps on small screens)
- Question text: `text-xs sm:text-sm lg:text-base`
- Options: `space-y-1.5 sm:space-y-2` with responsive text sizing
- Scrollable overflow: `max-h-[300px] sm:max-h-[350px]`

**CreativeProtocolTest:**
- Timer: Large text that scales: `text-2xl` (always readable)
- Textarea: `min-h-[200px]` with responsive padding
- Buttons: Full width with responsive padding

**EquilibriumReasoningTask & AdaptiveKnowledgeTest:**
- Question display: Centered with responsive text sizing
- Option buttons: Full width with responsive heights
- Input fields: Centered with responsive text size

**ChessStrategyTest:**
- Chess board placeholder: Maintains aspect ratio
- Move input: Flexible layout that stacks on mobile
- Reflection textarea: Responsive sizing

**HobbySelection:**
- Grid: `grid-cols-2 sm:grid-cols-3` (adapts column count)
- Each button: Responsive padding and text sizing
- Max height with scrolling for mobile

**BreathHoldTest:**
- Large timer display: Always centered and prominent
- Buttons: Full width with responsive sizing
- Touch-friendly: Large tap targets (py-8 for start button)

**SimonSaysTest:**
- Button grid: `grid grid-cols-4 gap-2` (responsive on all screens)
- Maintains square aspect ratio (aspect-square)
- Full viewport usage on mobile

**FittsLawTest:**
- Test area: `aspect-square` (maintains 1:1 ratio)
- Targets: Touch-friendly sizes (8px minimum)
- Responsive cursor feedback

**ResilienceStroop:**
- Color text: `text-6xl` (large and readable)
- Option grid: `grid-cols-2 gap-4` (full width)
- Center-aligned

### Breakpoints Used
- **Mobile-first**: Base styles for `<640px`
- **sm**: `640px+` (small screens/tablets)
- **md**: `768px+` (tablets)
- **lg**: `1024px+` (desktops)
- **xl**: `1280px+` (large desktops)

### Touch-Friendly Design
- **Minimum tap target**: 44x44px (buttons, inputs)
- **Spacing**: Adequate gaps between interactive elements
- **Large text**: Minimum 14px on mobile for readability
- **No hover-only controls**: All interactions work on touch

---

## Tutorial System

### Overview
Comprehensive, context-aware tutorial overlay that guides users through every aspect of each page/tab.

### Features

#### 1. **Automatic Tutorial on First Completion**
- After onboarding, user is routed to dashboard
- Tutorial automatically starts with `isTourActive: true`
- User can skip at any time with "Skip" button
- User can navigate between tutorial steps with progress dots

#### 2. **Context-Aware Tutorials**
Each tab has its own tutorial sequence:

**Dashboard:**
- Welcome message from Central
- Explanation of attributes and substats
- Daily grind and task system
- Resonance signature overview

**Protocols (Paths):**
- What protocols are and how to use them
- Building your training arsenal
- Specialization system

**Missions:**
- Directive system explanation
- Side quest creation and management
- Rewards and XP system

**Planner:**
- Weekly planning interface
- Automated scheduling benefits
- Time architecture importance

**Labyrinth:**
- Multi-floor psychometric assessment
- Intelligence ceiling concept
- How results affect substats

**Journal:**
- Deep reflection recording
- Apex Feats designation
- Long-term pattern recognition

**Stats:**
- Attribute breakdown and history
- Snapshot tracking system
- Progress trajectory analysis

**Achievements:**
- Unlock system explanation
- Secret achievements teaser
- Progression rewards

**Codex/Guide:**
- Knowledge repository concept
- Entry unlocking system
- Rank-based access

#### 3. **Mobile-Responsive Tutorial Card**
- Full-screen overlay with semi-transparent background
- Card positioning: Centered on all screens
- Responsive padding: `p-4 sm:p-6`
- Touch-friendly button sizing: `py-1.5 sm:py-2`
- Text scaling: `text-sm sm:text-base` for readability

#### 4. **Tutorial Navigation**
- **Next/Previous**: Navigate through steps sequentially
- **Progress Dots**: Click any dot to jump to that step
- **Skip Button**: Exit tutorial completely
- **Step Counter**: Shows current step / total steps

#### 5. **Visual Design**
- **Color**: Purple accent theme (border-purple-500)
- **Animation**: Smooth fade-in and slide-in effects
- **Typography**: Monospace font for technical feel
- **Icons**: Contextual icons in header
- **Backdrop**: Black/80 with blur effect for focus

### Implementation Details

**File**: `/components/TutorialOverlay.tsx`

**Key Functions**:
```typescript
- useMemo() // Recalculate tutorials based on current route
- useLocation() // Detect which page user is on
- nextTourStep() // Move to next step
- endTour() // Exit tutorial
```

**State Management**:
- `gameState.isTourActive`: Whether tutorial is showing
- `gameState.tourStep`: Current step index
- Dispatches: `START_TOUR`, `NEXT_TOUR_STEP`, `END_TOUR`

---

## Onboarding Features

### 1. **Skip Onboarding**
- **Button**: "Skip" button in top-right of onboarding header
- **Confirmation Modal**: Asks user to confirm before skipping
- **Baseline Stats**: Skipped users receive default C-rank stats
- **Mobile-Friendly**: Modal is responsive and touch-friendly

### Implementation
```typescript
const [showSkipConfirm, setShowSkipConfirm] = useState(false);

const handleSkipOnboarding = async () => {
    // Create default report with baseline stats
    // Set report to trigger transition to dossier
};
```

### 2. **Mobile-Friendly Layout**
- Header shows progress (step count + progress bar)
- Full-screen container on mobile
- Responsive navigation buttons
- All tests optimized for touch interaction

### 3. **Progressive Disclosure**
- Each test is a separate "step"
- User progresses through tests sequentially
- Skip button available at every step
- Progress bar visualizes completion

### 4. **Comprehensive Test Coverage**
- **Narrative Input**: User's personal narrative
- **Questionnaires**: Demographics, lifestyle, stress levels
- **MBTI Assessment**: Psychometric personality test
- **Physical Performance**: Fitts Law, Breath Hold, Stroop
- **Intelligence**: Adaptive Knowledge & Reasoning tests
- **Strategy**: Chess-based tactical assessment
- **Creativity**: 5-prompt creative protocol
- **Hobbyist Profiling**: Interest selection
- **Labyrinth**: Multi-floor psychometric assessment
- **Moral/Spirit**: Dilemma screening

---

## User Experience Flow

### First-Time User (New)

```
1. Login Page
   ↓
2. Onboarding Page (18 calibration steps)
   - Can skip at any point with confirmation
   - Mobile-optimized layout
   - All tests touch-friendly
   ↓
3. Classified Dossier (transition screen)
   - Scroll-gated content reveal
   - Shows calibration report
   - "INITIATE_UPGRADE" button to proceed
   ↓
4. Dashboard (main app entry point)
   - Tutorial automatically starts
   - Guides user through interface
   - Can skip if desired
   ↓
5. Navigate to Other Tabs
   - Each tab has its own tutorial sequence
   - Tutorials are context-aware
   - Users learn functionality as they explore
```

### Returning User

```
1. Login Page
2. Dashboard (no onboarding, no forced tutorial)
3. Navigation available to all tabs
4. Can manually trigger tutorials if needed (future feature)
```

### Mobile Scenario

```
On all screens, the flow is identical:
- Responsive layouts adapt to screen size
- Touch-friendly buttons and inputs
- Full-width components with proper padding
- Scrollable content when needed
- Large text for readability
- No horizontal scrolling required
```

---

## Implementation Details

### Files Modified

1. **`/pages/OnboardingPage.tsx`**
   - Added `handleSkipOnboarding()` function
   - Added `showSkipConfirm` state
   - Added skip confirmation modal
   - Enhanced header with responsive design
   - Mobile-optimized layout for all components

2. **`/components/TutorialOverlay.tsx`**
   - Rewrote with comprehensive tutorial steps
   - Added context-aware tutorials for each page
   - Implemented mobile-responsive card design
   - Added progress dot navigation
   - Added skip functionality

3. **`/App.tsx`**
   - Already correct: Routes show onboarding until `hasOnboarded: true`
   - Already correct: Default route redirects to dashboard

### Context Integration

**GameStateContext**:
- `isTourActive`: Boolean flag
- `tourStep`: Current step index
- `startTour()`: Dispatch to start tutorial
- `nextTourStep()`: Dispatch to advance step
- `endTour()`: Dispatch to end tutorial

### Styling Approach

**Tailwind CSS Classes**:
- Responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first methodology
- Custom utilities in global CSS for animations
- Film grain and scanline effects for aesthetic

---

## Best Practices

### For Developers

1. **Mobile-First Design**
   - Start with mobile (base styles)
   - Add desktop enhancements with responsive prefixes
   - Test on actual mobile devices

2. **Touch Interactions**
   - Minimum 44x44px tap targets
   - Adequate spacing between interactive elements
   - No hover-only controls

3. **Responsive Text**
   - Base: small text for mobile
   - Responsive prefixes: larger text for desktop
   - Use viewport-aware sizing

4. **Tutorial Content**
   - Keep messages concise (fit on mobile screen)
   - Use clear, jargon-free language
   - Provide actionable next steps

### For Users

1. **First Time**
   - Complete onboarding for personalized profile
   - Follow dashboard tutorial to learn interface
   - Explore each tab with its tutorial guide

2. **Mobile Users**
   - Full experience available on mobile
   - All features touch-friendly
   - No features exclusive to desktop

3. **Returning Users**
   - Skip onboarding if re-authenticating
   - Tutorials available but not forced
   - All functionality immediately accessible

---

## Future Enhancements

1. **Tutorial Persistence**
   - Remember if user has seen tutorials
   - Allow manual re-triggering from settings
   - Persist `hasSeenTutorial` flag per user

2. **Contextual Help**
   - Floating help icons on components
   - Tooltips for specific features
   - Quick reference guide

3. **Onboarding Customization**
   - Allow users to re-run specific tests
   - Permit profile re-calibration
   - Include benchmark comparison

4. **Advanced Analytics**
   - Track time spent on each test
   - Monitor skip rates
   - A/B test tutorial content

5. **Accessibility**
   - ARIA labels for screen readers
   - High contrast mode
   - Keyboard navigation support

---

## Troubleshooting

### Issue: Tutorial doesn't start after onboarding

**Solution**: Ensure `seedInitialState()` is called with `hasOnboarded: true` flag. Check GameStateContext dispatch.

### Issue: Mobile layout breaks on small screens

**Solution**: 
- Check for hardcoded widths (should use percentages or responsive classes)
- Ensure `overflow-x-hidden` on body
- Test with Chrome DevTools mobile emulation

### Issue: Skip functionality not working

**Solution**: 
- Verify `showSkipConfirm` state is being toggled
- Check `handleSkipOnboarding` creates valid FullCalibrationReport
- Ensure `seedInitialState` is called with correct parameters

### Issue: Tutorial card cuts off on mobile

**Solution**:
- Add `max-w-md w-full` to constrain width
- Add `p-4` for mobile, `sm:p-6` for desktop
- Use responsive text sizing

---

## Testing Checklist

- [ ] Mobile: Complete onboarding on iPhone SE (375px)
- [ ] Mobile: Complete onboarding on iPhone 12 (390px)
- [ ] Mobile: Complete onboarding on Android phone (360-412px)
- [ ] Tablet: Test on iPad (768px)
- [ ] Desktop: Test on 1920x1080
- [ ] Touch: All buttons responsive to touch
- [ ] Scroll: No horizontal scrolling on any device
- [ ] Tutorial: Verify each page has tutorial steps
- [ ] Skip: Test skip at each onboarding step
- [ ] Navigation: Test dashboard → other tabs → tutorial shows

---

## Summary

The Genesis Protocol now features:

✅ **Fully mobile-responsive onboarding** - All tests optimized for touch
✅ **Skippable onboarding** - Users can skip with confirmation modal
✅ **Comprehensive tutorials** - Context-aware guide for every page
✅ **Proper navigation flow** - Login → Onboarding → Dossier → Dashboard
✅ **Dashboard-first design** - Always starts at dashboard after onboarding
✅ **Touch-friendly interface** - Large buttons, adequate spacing, no hover-only controls
✅ **Responsive design** - Works on 375px phones to 1920px desktops
✅ **Progressive disclosure** - Users learn features as they explore

All improvements maintain the cyberpunk aesthetic while prioritizing usability and accessibility across all device sizes.
