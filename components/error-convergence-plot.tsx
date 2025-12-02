"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { BentoBox } from "./bento-box"

interface ErrorConvergencePlotProps {
  errors: number[]
  currentEpoch: number
  className?: string
}

export function ErrorConvergencePlot({ errors, currentEpoch, className = "" }: ErrorConvergencePlotProps) {
  const maxError = useMemo(() => Math.max(...errors, 1) * 1.1, [errors])
  
  // SVG Dimensions
  const W = 350
  const H = 200

  const points = errors.map((e, i) => {
    const x = (i / Math.max(currentEpoch, 10)) * W
    const y = H - (e / maxError) * H
    return `${x},${y}`
  }).join(" ")

  return (
    <BentoBox title="Training Progress" className={className} accent="red">
      <div className="relative">
        <svg width="100%" height="250" viewBox={`-30 -10 ${W + 50} ${H + 40}`} className="overflow-visible">
          {/* Grid Background */}
          <rect x="0" y="0" width={W} height={H} fill="#f8f9fa" />
          
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
             <line 
                key={tick} 
                x1="0" y1={H * tick} x2={W} y2={H * tick} 
                stroke="#e0e0e0" strokeDasharray="4" 
             />
          ))}

          {/* Axes */}
          <line x1="0" y1={H} x2={W} y2={H} stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="0" x2="0" y2={H} stroke="currentColor" strokeWidth="2" />
          
          <text x={W} y={H + 20} textAnchor="end" fontSize="12" fontWeight="bold">Epochs</text>
          <text x="-10" y="10" textAnchor="end" fontSize="12" fontWeight="bold">Error</text>

          {/* The Line */}
          {points && (
            <motion.polyline
              points={points}
              fill="none"
              stroke="#ff0000"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          )}

          {/* Current Point Indicator */}
          {errors.length > 0 && (
             <g transform={`translate(${(errors.length - 1) / Math.max(currentEpoch, 10) * W}, ${H - (errors[errors.length-1] / maxError) * H})`}>
                <circle r="6" fill="#fff" stroke="#ff0000" strokeWidth="3" />
                <motion.circle 
                  r="10" fill="none" stroke="#ff0000" opacity="0.5"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
             </g>
          )}
        </svg>

        <div className="absolute top-2 right-2 flex gap-4">
           <div className="bg-white border-2 border-foreground p-2 shadow-sm text-center min-w-[80px]">
              <div className="text-[10px] uppercase font-bold text-gray-500">Current Error</div>
              <div className="text-xl font-bold text-[#ff0000]">{errors.length > 0 ? errors[errors.length - 1].toFixed(3) : "0.00"}</div>
           </div>
        </div>
      </div>
    </BentoBox>
  )
}