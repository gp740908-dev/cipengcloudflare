# 🚀 WEBSITE OPTIMIZATION PLAN

## Status: IN PROGRESS
**Date:** 2025-12-22  
**Goal:** Reduce bundle size, improve performance, remove heavy animations

---

## 📊 CURRENT STATE ANALYSIS

### Dependencies (package.json):
✅ **GOOD** - No unnecessary heavy libraries
- No moment.js (using date-fns - lighter)
- No lodash  
- No axios (using fetch)
- No heavy UI libraries (using Tailwind)

❌ **CAN OPTIMIZE:**
- `framer-motion` (215KB) - Heavy animation library
- `leaflet` + `react-leaflet` (only used in map - should lazy load)
- `embla-carousel-react` (only used in specific places)

### Heavy Components Found:

1. **CountUp Animation** 🎯 TARGET FOR REMOVAL
   - Used in: Features.tsx, CTASection.tsx, VillaDetails.tsx
   - Impact: Unnecessary JS animation
   - Action: Replace with static numbers

2. **Framer Motion Overuse**
   - Used everywhere for micro-animations
   - Impact: Large bundle size
   - Action: Replace simple animations with CSS

3. **Leaflet Map**
   - Heavy library for maps
   - Impact: ~145KB
   - Action: Already in dynamicComponents, ensure it's lazy loaded

4. **Large Images**
   - Some images not optimized
   - Action: Use OptimizedImage component everywhere

---

## 🎯 OPTIMIZATION TASKS

### Phase 1: Remove CountUp ✅ STARTING NOW
- [ ] Remove CountUp from Features.tsx
- [ ] Remove CountUp from CTASection.tsx  
- [ ] Remove CountUp from VillaDetails.tsx
- [ ] Delete CountUp.tsx component file
- [ ] Remove CountUp from InteractiveElements.tsx

**Expected Impact:** -5-10KB, smoother rendering

### Phase 2: Optimize Framer Motion Usage
- [ ] Audit all Framer Motion usage
- [ ] Replace simple fade/slide with CSS transitions
- [ ] Keep Framer Motion only for:
  - Complex animations (Hero carousel)
  - Page transitions
  - Gesture-based interactions
- [ ] Use CSS for: fade, slide, scale

**Expected Impact:** -30-50KB bundle reduction

### Phase 3: Lazy Load Heavy Components
- [ ] Ensure Leaflet map is dynamic import
- [ ] Lazy load Embla carousel
- [ ] Lazy load admin components
- [ ] Code split route pages

**Expected Impact:** -100KB initial bundle

### Phase 4: Image Optimization
- [ ] Replace all Image with OptimizedImage
- [ ] Add blur placeholders everywhere
- [ ] Optimize image sizes
- [ ] Convert to WebP

**Expected Impact:** -200-300KB total download

### Phase 5: CSS Optimization
- [ ] Remove unused Tailwind classes
- [ ] Purge CSS
- [ ] Inline critical CSS

**Expected Impact:** -20-30KB CSS

---

## 📈 PERFORMANCE TARGETS

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Initial Bundle | ~300KB | <180KB | 🟡 In Progress |
| FCP | ~2.5s | <1.2s | 🟡 In Progress |
| LCP | ~4.0s | <2.0s | 🟡 In Progress |
| TBT | ~600ms | <250ms | 🟡 In Progress |
| Lighthouse | ~70 | 90+ | 🟡 In Progress |

---

## 🔧 OPTIMIZATION STRATEGIES

### 1. Static Over Dynamic
Replace CountUp (JS) with plain numbers (HTML)
```tsx
// BEFORE (Heavy)
<CountUp end={100} suffix="%" />

// AFTER (Light)
<span className="animate-fade-in">100%</span>
```

### 2. CSS Over JS Animations
```css
/* Lightweight CSS animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

### 3. Lazy Loading
```tsx
// Load map only when needed
const VillaMap = dynamic(() => import('./VillaMap'), {
  ssr: false,
  loading: () => <Skeleton />
})
```

### 4. Tree Shaking
- Import specific icons: `import { Home } from 'lucide-react'`
- Not: `import * as Icons from 'lucide-react'`

---

## 📝 NOTES

- CountUp removal is priority #1 (user requested)
- Focus on perceived performance (skeletons, placeholders)
- Keep smooth animations where they add value
- Remove redundant animations

---

## ✅ CHECKLIST BEFORE DEPLOY

- [ ] Remove all CountUp usage
- [ ] Test build size: `npm run build`
- [ ] Run Lighthouse audit
- [ ] Test on slow 3G
- [ ] Check Core Web Vitals
- [ ] Verify no console errors
