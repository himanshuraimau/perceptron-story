"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { BentoBox } from "./bento-box"

interface WeightTrajectoryPlotProps {
  history: { w1: number, w2: number }[]
  currentWeights: [number, number]
}

export function WeightTrajectoryPlot({ history, currentWeights }: WeightTrajectoryPlotProps) {
  // SVG Dimensions
  const W = 350, H = 250
  
  // Calculate Scales (same logic as before, just kept concise here)
  const { minW1, rangeW1, minW2, rangeW2 } = useMemo(() => {
     const allW1 = [...history.map(p => p.w1), currentWeights[0]]
     const allW2 = [...history.map(p => p.w2), currentWeights[1]]
     const minW1 = Math.min(...allW1) - 1, maxW1 = Math.max(...allW1) + 1
     const minW2 = Math.min(...allW2) - 1, maxW2 = Math.max(...allW2) + 1
     return { minW1, rangeW1: maxW1 - minW1, minW2, rangeW2: maxW2 - minW2 }
  }, [history, currentWeights])

  const scaleX = (w: number) => ((w - minW1) / rangeW1) * W
  const scaleY = (w: number) => H - ((w - minW2) / rangeW2) * H

  // Generate Path
  const path = history.length 
    ? `M ${scaleX(history[0].w1)},${scaleY(history[0].w2)} ` + history.slice(1).map(p => `L ${scaleX(p.w1)},${scaleY(p.w2)}`).join(" ")
    : ""

  return (
    <BentoBox title="Weight Space Trajectory" accent="default">
      <div className="relative border border-black/10 bg-[#f4f4f5]">
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
           {/* Grid Pattern */}
           <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                 <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2a45c2" />
              </marker>
           </defs>
           <rect width="100%" height="100%" fill="url(#grid)" />

           {/* Trajectory Line with Gradient Stroke (Simulated via path mask or just simple color for now) */}
           {path && (
             <motion.path
               d={path}
               fill="none"
               stroke="#2a45c2"
               strokeWidth="2"
               strokeOpacity="0.5"
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               markerEnd="url(#arrowhead)"
             />
           )}

           {/* History Points */}
           {history.map((p, i) => (
              <circle key={i} cx={scaleX(p.w1)} cy={scaleY(p.w2)} r="2" fill="#2a45c2" opacity={i / history.length} />
           ))}

           {/* Current Point (Pulsing) */}
           <g transform={`translate(${scaleX(currentWeights[0])}, ${scaleY(currentWeights[1])})`}>
              <motion.circle 
                 r="6" fill="#ff0000" stroke="white" strokeWidth="2"
                 layoutId="current-weight"
              />
              <motion.circle
                 r="12" stroke="#ff0000" strokeWidth="1" fill="none"
                 animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
              />
           </g>
        </svg>

        <div className="absolute bottom-2 left-2 text-[10px] text-gray-900 font-mono bg-white p-1 border border-black">
           Start: ({history[0]?.w1.toFixed(2) ?? 0}, {history[0]?.w2.toFixed(2) ?? 0})
        </div>
      </div>
    </BentoBox>
  )
}