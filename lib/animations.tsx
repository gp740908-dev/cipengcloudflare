/**
 * Animation Performance Best Practices Guide
 * For smooth 60fps animations across the StayinUBUD website
 */

import { Variants } from 'framer-motion'

// ================================================================
// OPTIMIZED FRAMER MOTION VARIANTS
// ================================================================

/**
 * Fade In - GPU accelerated
 * Use for: Text, Cards, Elements
 */
export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
        // Use transform instead of top/bottom for GPU acceleration
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for smooth feel
        },
    },
}

/**
 * Fade In Up - Optimized for lists
 */
export const fadeInUp: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.1, // Stagger effect
            ease: [0.16, 1, 0.3, 1],
        },
    }),
}

/**
 * Scale In - For cards and images
 * Uses transform: scale for GPU acceleration
 */
export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut',
        },
    },
}

/**
 * Slide In - From left/right
 */
export const slideIn = (direction: 'left' | 'right' = 'left'): Variants => ({
    hidden: {
        opacity: 0,
        x: direction === 'left' ? -50 : 50,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
})

/**
 * Stagger Children - For lists
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

/**
 * Parallax Effect - Optimized
 */
export const parallax = (offset: number = 50): Variants => ({
    hidden: { y: 0 },
    visible: {
        y: offset,
        transition: {
            duration: 0.8,
            ease: 'linear',
        },
    },
})

// ================================================================
// PERFORMANCE RULES
// ================================================================

/**
 * DO's:
 * ✅ Use transform (translate, scale, rotate) - GPU accelerated
 * ✅ Use opacity - GPU accelerated
 * ✅ Use will-change sparingly
 * ✅ Use transform: translateZ(0) for GPU layer
 * ✅ Limit animations on scroll
 * ✅ Use viewport={{ once: true }} to prevent re-animation
 * ✅ Debounce/throttle scroll handlers
 * ✅ Use requestAnimationFrame for custom animations
 */

/**
 * DON'T's:
 * ❌ Animate width/height (causes reflow)
 * ❌ Animate top/left/bottom/right (use transform instead)
 * ❌ Animate box-shadow (expensive, use filter: drop-shadow)
 * ❌ Animate complex gradients
 * ❌ Animate blur (very expensive)
 * ❌ Too many simultaneous animations
 * ❌ Animate during scroll on mobile
 */

// ================================================================
// OPTIMIZED COMPONENT PATTERNS
// ================================================================

/**
 * Example 1: Scroll Reveal (Optimized)
 */
/*
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'

export function ScrollReveal({ children }) {
    return (
        <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // Trigger before visible
        >
            {children}
        </motion.div>
    )
}
*/

/**
 * Example 2: List with Stagger (Optimized)
 */
/*
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export function VillaGrid({ villas }) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-8"
        >
            {villas.map((villa, i) => (
                <motion.div
                    key={villa.id}
                    variants={fadeInUp}
                    custom={i}
                >
                    <VillaCard villa={villa} />
                </motion.div>
            ))}
        </motion.div>
    )
}
*/

/**
 * Example 3: Hover Animation (Optimized)
 */
/*
import { motion } from 'framer-motion'

export function Card() {
    return (
        <motion.div
            whileHover={{ 
                scale: 1.02, // Use scale, not width/height
                transition: { duration: 0.2 }
            }}
            // Use layoutId for shared element transitions
            layoutId="card"
        >
            Content
        </motion.div>
    )
}
*/

/**
 * Example 4: Parallax Scroll (Optimized)
 */
/*
import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

export function ParallaxSection() {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })
    
    // Use transform, not top/bottom
    const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])
    
    return (
        <div ref={ref} className="relative overflow-hidden">
            <motion.div style={{ y }}>
                <img src="..." alt="..." />
            </motion.div>
        </div>
    )
}
*/

// ================================================================
// CSS-BASED ANIMATIONS (Faster than JS)
// ================================================================

/**
 * For simple animations, use CSS instead of JS
 * CSS animations run on compositor thread = 60fps
 */

/*
// tailwind.config.js additions:
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
}
*/

// ================================================================
// PERFORMANCE MONITORING
// ================================================================

/**
 * Check animation performance in DevTools:
 * 1. Open Chrome DevTools
 * 2. Performance tab
 * 3. Record while scrolling/animating
 * 4. Look for:
 *    - Green bars (good - GPU accelerated)
 *    - Purple bars (bad - layout recalculation)
 *    - Yellow bars (bad - JavaScript execution)
 * 
 * Target: Consistent 60fps (16.6ms per frame)
 */

export default {
    fadeIn,
    fadeInUp,
    scaleIn,
    slideIn,
    staggerContainer,
    parallax,
}
