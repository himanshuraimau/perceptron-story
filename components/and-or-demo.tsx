"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BentoBox } from "./bento-box"
import { cn } from "@/lib/utils"

type Problem = "and" | "or"

export function AndOrDemo() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>("and")
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  const andData = [
    { x: 0, y: 0, label: -1, name: "(0,0)" },
    { x: 1, y: 0, label: -1, name: "(1,0)" }, // Fixed order to standard truth table
    { x: 0, y: 1, label: -1, name: "(0,1)" },
    { x: 1, y: 1, label: 1, name: "(1,1)" },
  ]

  const orData = [
    { x: 0, y: 0, label: -1, name: "(0,0)" },
    { x: 1, y: 0, label: 1, name: "(1,0)" },
    { x: 0, y: 1, label: 1, name: "(0,1)" },
    { x: 1, y: 1, label: 1, name: "(1,1)" },
  ]

  const data = selectedProblem === "and" ? andData : orData

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Custom Segmented Control */}
      <div className="p-1 bg-muted/20 border-2 border-foreground rounded-lg inline-flex w-full md:w-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {(["and", "or"] as const).map((prob) => (
          <button
            key={prob}
            onClick={() => setSelectedProblem(prob)}
            className={cn(
              "flex-1 md:flex-none px-8 py-3 font-mono font-bold uppercase tracking-wide transition-all rounded-md relative",
              selectedProblem === prob
                ? "text-white bg-[#2a45c2]"
                : "text-foreground hover:bg-black/5"
            )}
          >
            {prob} GATE
            {selectedProblem === prob && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 border-2 border-transparent"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Truth Table */}
        <BentoBox title="Truth Table" accent="blue">
          <div className="space-y-3 font-mono">
            <div className="flex justify-between text-xs text-text-muted uppercase border-b pb-2">
              <span>Input (x₁, x₂)</span>
              <span>Output (y)</span>
            </div>
            {data.map((point, idx) => (
              <motion.div
                key={`${selectedProblem}-${idx}`}
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
                className={cn(
                  "p-3 border-2 transition-colors cursor-crosshair flex justify-between items-center group",
                  hoveredPoint === idx ? "border-[#2a45c2] bg-[#2a45c2]/5" : "border-transparent bg-muted/10"
                )}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <span className="font-bold">{point.name}</span>
                <span className={cn(
                  "px-2 py-0.5 text-xs font-bold border",
                  point.label > 0 
                    ? "bg-[#2a45c2] text-white border-[#2a45c2]" 
                    : "bg-white text-[#ff0000] border-[#ff0000]"
                )}>
                  {point.label > 0 ? "+1" : "-1"}
                </span>
              </motion.div>
            ))}
          </div>
        </BentoBox>

        {/* 2D Visualization */}
        <BentoBox title="Decision Space" accent="red">
          <div className="relative aspect-square w-full max-w-[300px] mx-auto">
            <svg viewBox="-0.2 -0.2 1.4 1.4" className="w-full h-full overflow-visible">
              {/* Pattern Background */}
              <defs>
                <pattern id="grid" width="0.1" height="0.1" patternUnits="userSpaceOnUse">
                  <circle cx="0.05" cy="0.05" r="0.005" fill="#e5e5e5" />
                </pattern>
              </defs>
              <rect x="-0.2" y="-0.2" width="1.4" height="1.4" fill="url(#grid)" />

              {/* Axes */}
              <line x1="0" y1="0" x2="1.1" y2="0" stroke="currentColor" strokeWidth="0.01" markerEnd="url(#arrow)" />
              <line x1="0" y1="0" x2="0" y2="1.1" stroke="currentColor" strokeWidth="0.01" markerEnd="url(#arrow)" />
              
              {/* Box Outline */}
              <rect x="0" y="0" width="1" height="1" fill="none" stroke="#e0e0e0" strokeWidth="0.01" strokeDasharray="0.05" />

              {/* Data points */}
              {data.map((point, idx) => (
                <motion.g key={`${selectedProblem}-${idx}`}>
                  {/* Halo effect on hover */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r="0.12"
                    fill="transparent"
                    stroke={point.label === 1 ? "#2a45c2" : "#ff0000"}
                    strokeWidth="0.01"
                    opacity={hoveredPoint === idx ? 0.5 : 0}
                    animate={{ scale: hoveredPoint === idx ? 1.2 : 0.8 }}
                  />
                  
                  {/* Actual Point */}
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r="0.06"
                    fill={point.label === 1 ? "#2a45c2" : "#ffffff"}
                    stroke={point.label === 1 ? "#2a45c2" : "#ff0000"}
                    strokeWidth="0.03"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, r: hoveredPoint === idx ? 0.08 : 0.06 }}
                    transition={{ type: "spring" }}
                  />
                </motion.g>
              ))}

              {/* Dynamic Decision Boundary */}
              <AnimatePresence mode="wait">
                {selectedProblem === "and" ? (
                  <motion.line
                    key="and-line"
                    x1="0.5" y1="1.2" x2="1.2" y2="0.5"
                    stroke="#2a45c2"
                    strokeWidth="0.03"
                    strokeDasharray="0.05"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <motion.line
                    key="or-line"
                    x1="-0.1" y1="0.6" x2="0.6" y2="-0.1"
                    stroke="#2a45c2"
                    strokeWidth="0.03"
                    strokeDasharray="0.05"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
            </svg>
            
            {/* Labels overlay */}
            <div className="absolute bottom-[-20px] right-0 text-xs font-mono">x₁</div>
            <div className="absolute top-0 left-[-20px] text-xs font-mono">x₂</div>
          </div>
        </BentoBox>
      </div>

      <div className="p-4 bg-[#2a45c2]/10 border-l-4 border-[#2a45c2] text-sm">
        <p className="font-bold uppercase text-[#2a45c2] mb-1">Observation</p>
        <p className="text-foreground/80 leading-relaxed">
          {selectedProblem === "and"
            ? "Notice how the blue point (+1) is isolated in the top-right corner. A single line can cut it off from the red points."
            : "The OR gate has three positive outcomes. The line separates the single negative case at (0,0) from the rest."}
        </p>
      </div>
    </div>
  )
}