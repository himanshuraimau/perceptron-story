"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SwissSectionProps {
  id: string
  title: string
  accent?: "default" | "red" | "blue"
  children: ReactNode
  className?: string
}

export function SwissSection({ id, title, accent = "default", children, className = "" }: SwissSectionProps) {
  const accentColor = accent === "red" ? "text-[#ff0000]" : accent === "blue" ? "text-[#2a45c2]" : "text-foreground"
  const borderColor = accent === "red" ? "border-[#ff0000]" : accent === "blue" ? "border-[#2a45c2]" : "border-foreground"

  return (
    <section id={id} className={`relative py-24 md:py-32 overflow-hidden ${className}`}>
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="container-swiss relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Section Header */}
          <div className="lg:col-span-3 lg:text-right sticky top-32 self-start">
             {/* Decorative Plus */}
            <div className={`hidden lg:block absolute -top-8 right-0 w-4 h-4 border-r-2 border-t-2 ${borderColor}`} />
            
            <h2 className={`font-black text-4xl lg:text-5xl uppercase tracking-tighter leading-[0.9] mb-4 ${accentColor}`}>
              {title}
            </h2>
            <div className={`h-2 w-12 ml-auto bg-black ${accent === 'red' ? 'bg-[#ff0000]' : accent === 'blue' ? 'bg-[#2a45c2]' : ''}`} />
          </div>

          {/* Content */}
          <div className="lg:col-span-9 lg:pl-12 lg:border-l-2 border-black/10">
            {children}
          </div>
        </div>
      </motion.div>
    </section>
  )
}