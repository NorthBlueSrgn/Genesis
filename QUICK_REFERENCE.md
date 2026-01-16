# Quick Reference Guide - Mobile Onboarding & Tutorials

## 🚀 Quick Start

### For Users
1. **Login** with your credentials
2. **Onboarding** (18 steps - can skip)
3. **Dossier** review your profile
4. **Dashboard** explore the app
5. **Tutorials** guide available on every page

### For Developers

#### To Test Mobile
```bash
# Open DevTools in browser
F12 (or Cmd+Option+I on Mac)

# Enable device toolbar
Ctrl+Shift+M (or Cmd+Shift+M)

# Select device
iPhone SE (375px), iPad (768px), or custom size

# Test interactions
- Tap buttons
- Scroll content
- Navigate between pages
```

#### To Modify Code

**Skip Functionality:**
```tsx
// File: pages/OnboardingPage.tsx
const handleSkipOnboarding = async () => {
    // Creates default profile and proceeds
};
```

**Tutorials:**
```tsx
// File: components/TutorialOverlay.tsx
const tutorialSteps = useMemo(() => {
    // Route-aware tutorial generation
}, [location.pathname]);
```

#### To Deploy
```bash
npm run build
# Deploy dist/ folder to production
```

---

## 📱 Responsive Breakpoints

| Size | Class | Devices |
|------|-------|---------|
| <640px | Mobile | iPhone, Android |
| 640-768px | sm | Small tablets |
| 768-1024px | md | iPad, tablets |
| 1024-1280px | lg | Desktop, large tablets |
| >1280px | xl | Large desktop |

### Usage Pattern
```tsx
// Base = mobile, then enhance for larger
<div className="p-2 sm:p-4 md:p-6 lg:p-8">
  <h1 className="text-lg sm:text-xl md:text-2xl">Title</h1>
</div>
```

---

## 🎯 Key Features

### Skip Onboarding
- Button: Top-right header
- Confirmation: Modal dialog
- Result: C-rank default profile
- Status: ✅ Works on all devices

### Tutorials
- Auto-starts: After onboarding
- Pages: 9 (dashboard, protocols, missions, planner, labyrinth, journal, stats, achievements, codex)
- Navigation: Progress dots, next/skip buttons
- Responsive: Full-width on mobile, constrained on desktop

### Navigation
- Entry Point: Always dashboard
- Flow: Login → Onboarding → Dossier → Dashboard
- Access: All tabs from navigation
- State: Check `gameState.hasOnboarded`

---

## 🧪 Quick Test Checklist

```
Mobile Tests (375px):
☐ Onboarding loads
☐ Tests are readable
☐ Buttons are tappable
☐ Can skip onboarding
☐ Confirmation modal works
☐ Tutorials start
☐ Tutorial text is readable
☐ Can skip tutorials
☐ No horizontal scrolling

Tablet Tests (768px):
☐ Layout is better than mobile
☐ All buttons are visible
☐ Progress bar shows
☐ Spacing is appropriate

Desktop Tests (1920px):
☐ Content is centered/constrained
☐ No stretched layout
☐ All features work
☐ Visually appealing
```

---

## 📊 File Locations

| File | Purpose | Edit For |
|------|---------|----------|
| `pages/OnboardingPage.tsx` | Onboarding logic | Tests, skip behavior |
| `components/TutorialOverlay.tsx` | Tutorial system | Tutorial content, navigation |
| `App.tsx` | Main routing | Never needed (already correct) |
| `components/ClassifiedDossier.tsx` | Dossier display | Review screen (no changes needed) |

---

## 🐛 Troubleshooting

### Tutorial Not Starting
- Check: `gameState.isTourActive === true`
- Check: `tourStep` is 0
- Check: User completed onboarding
- Solution: Call `startTour()` dispatch

### Mobile Layout Broken
- Check: No hardcoded widths (use %)
- Check: Responsive classes used (sm:, md:)
- Check: `overflow-x-hidden` on body
- Solution: Test with DevTools device toolbar

### Skip Not Working
- Check: `showSkipConfirm` state changes
- Check: `handleSkipOnboarding` completes
- Check: `seedInitialState` is called
- Solution: Check browser console for errors

### Tutorials Show Wrong Content
- Check: `location.pathname` matches route
- Check: Tutorial map includes current page
- Check: `useLocation()` hook is being called
- Solution: Add route to tutorial map

---

## 📝 Code Snippets

### Check if User Onboarded
```tsx
const { gameState } = useGameState();
if (!gameState.hasOnboarded) {
  // Show onboarding
}
```

### Start Tutorial
```tsx
const { startTour } = useGameState();
// In useEffect
startTour();
```

### Navigate to Route
```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard');
```

### Responsive Container
```tsx
<div className="w-full p-2 sm:p-4 max-w-4xl mx-auto">
  {/* Mobile: full width, 8px padding */}
  {/* Tablet+: centered, 16px padding */}
</div>
```

---

## 🎨 Styling Reference

### Text Sizing
```tsx
// Responsive text
className="text-lg sm:text-xl lg:text-2xl"

// Always readable
// Mobile: 16px (lg)
// Tablet: 20px (xl)
// Desktop: 24px (2xl)
```

### Spacing
```tsx
// Responsive padding
className="p-2 sm:p-4 lg:p-8"

// Responsive gaps
className="gap-2 sm:gap-4 lg:gap-6"
```

### Touch Targets
```tsx
// Minimum 44px for buttons
className="w-11 h-11" // 44x44px
className="py-3 px-4" // ~44px height

// Never use:
className="w-8 h-8" // Too small
```

---

## ✅ Verification

Run these checks before deploying:

```typescript
// 1. No errors
npm run build

// 2. Types correct
// (Should compile without errors)

// 3. Mobile responsive
// Test at: 375px, 768px, 1920px

// 4. All features work
// ☐ Skip onboarding
// ☐ Default profile created
// ☐ Tutorials start
// ☐ Dashboard is entry point
// ☐ All tabs accessible
// ☐ Touch interactions work

// 5. No console errors
// Open DevTools Console
// Should be empty (no red errors)
```

---

## 📞 Support

### Common Issues
1. **Blank screen after skip** → Check `seedInitialState` call
2. **Tutorials show on wrong page** → Check route in tutorial map
3. **Layout broken on mobile** → Check responsive classes
4. **Skip button not visible** → Check header rendering

### Documentation References
- Full Guide: `MOBILE_ONBOARDING_TUTORIAL_GUIDE.md`
- Overview: `IMPLEMENTATION_SUMMARY_MOBILE.md`
- Details: `DETAILED_IMPLEMENTATION_CHANGELOG.md`

---

## 🎓 Learning Resources

### Responsive Design
- Tailwind CSS: https://tailwindcss.com/docs/responsive-design
- Mobile-First: https://www.w3.org/TR/mobile-bp/
- Touch Targets: https://www.nngroup.com/articles/touch-targets/

### React Hooks
- useLocation: React Router docs
- useMemo: React docs
- useState: React docs

### Testing
- Chrome DevTools: Built-in browser tool
- Responsive tester: https://responsively.app
- Mobile emulators: Android Studio, Xcode

---

## 🎯 Summary

| Task | Command | Time |
|------|---------|------|
| Test mobile | F12, enable device mode | 2 min |
| Check errors | npm run build | 5 min |
| Deploy | npm run build && deploy | 10 min |
| Debug | DevTools Console | varies |
| Add tutorial | Edit TutorialOverlay.tsx | 5 min |

---

## 🏆 Best Practices

✅ **DO**
- Test on actual mobile devices
- Use responsive classes (sm:, md:, lg:)
- Keep touch targets 44px+
- Mobile-first approach
- Document changes

❌ **DON'T**
- Hardcode sizes/widths
- Use hover-only controls
- Create horizontal scrolling
- Ignore accessibility
- Skip mobile testing

---

**Last Updated:** January 14, 2026
**Version:** 1.0
**Status:** ✅ Production Ready
