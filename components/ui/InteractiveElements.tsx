'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, MouseEvent, ReactNode } from 'react'

interface MagneticButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    href?: string
    strength?: number
}

export function MagneticButton({ children, className = '', onClick, href, strength = 0.3 }: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const springConfig = { damping: 15, stiffness: 150 }
    const x = useSpring(position.x, springConfig)
    const y = useSpring(position.y, springConfig)

    const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2
        setPosition({
            x: (clientX - centerX) * strength,
            y: (clientY - centerY) * strength,
        })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    const Component = href ? 'a' : 'button'

    return (
        <motion.div
            ref={ref}
            style={{ x, y }}
            onMouseMove={handleMouse}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            <Component
                href={href}
                onClick={onClick}
                className={className}
            >
                {children}
            </Component>
        </motion.div>
    )
}

interface AnimatedTextProps {
    text: string
    className?: string
    delay?: number
}

export function AnimatedText({ text, className = '', delay = 0 }: AnimatedTextProps) {
    const words = text.split(' ')

    return (
        <motion.span className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    )
}

interface RevealProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
}

export function Reveal({ children, className = '', delay = 0, direction = 'up' }: RevealProps) {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { y: 0, x: 40 },
        right: { y: 0, x: -40 },
    }

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface ScaleOnHoverProps {
    children: ReactNode
    className?: string
    scale?: number
}

export function ScaleOnHover({ children, className = '', scale = 1.02 }: ScaleOnHoverProps) {
    return (
        <motion.div
            whileHover={{ scale }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface ParallaxProps {
    children: ReactNode
    className?: string
    speed?: number
}

export function Parallax({ children, className = '', speed = 0.5 }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [scrollY, setScrollY] = useState(0)

    const y = useSpring(scrollY * speed, { damping: 30, stiffness: 100 })

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface StaggerContainerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface GlowCardProps {
    children: ReactNode
    className?: string
}

export function GlowCard({ children, className = '' }: GlowCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const { left, top } = ref.current.getBoundingClientRect()
        setPosition({
            x: e.clientX - left,
            y: e.clientY - top,
        })
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative overflow-hidden ${className}`}
        >
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(93, 135, 54, 0.15), transparent 50%)`,
                    }}
                />
            )}
            {children}
        </motion.div>
    )
}
