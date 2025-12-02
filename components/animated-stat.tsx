"use client"

import { useEffect, useRef } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedStatProps {
  value: number
  label: string
  suffix?: string
  color?: "blue" | "red" | "black"
}

export function AnimatedStat({ value, label, suffix = "", color = "blue" }: AnimatedStatProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    if (isInView) {
      spring.set(value)
    }
  }, [isInView, value, spring])

  const colorClass = color === "red" ? "text-[#ff0000]" : color === "blue" ? "text-[#2a45c2]" : "text-foreground"

  return (
    <div ref={ref} className="text-center p-4 border-2 border-transparent hover:border-border/50 rounded-lg transition-colors">
      <motion.div 
        className={cn("font-black text-5xl md:text-6xl mb-2 font-mono tracking-tighter", colorClass)}
      >
        <motion.span>{display}</motion.span>
        {suffix}
      </motion.div>
      <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  )
}