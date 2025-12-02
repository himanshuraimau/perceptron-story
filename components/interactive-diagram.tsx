"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BentoBox } from "./bento-box"

interface InteractiveDiagramProps {
  title: string
  description?: string
}

export function InteractiveDiagram({ title, description }: InteractiveDiagramProps) {
  const [weights, setWeights] = useState<[number, number]>([0.5, -0.3])
  const [bias, setBias] = useState(0.2)

  // Calculate line coordinates
  const getLinePoints = () => {
    // Avoid division by zero
    const w2 = Math.abs(weights[1]) < 0.05 ? 0.05 : weights[1] 
    const x1 = -1.2
    const y1 = (-weights[0] * x1 - bias) / w2
    const x2 = 1.2
    const y2 = (-weights[0] * x2 - bias) / w2
    return { x1, y1, x2, y2 }
  }

  const line = getLinePoints()

  return (
    <BentoBox title={title} className="overflow-hidden">
      {description && <p className="text-sm text-text-muted mb-6 max-w-2xl">{description}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visualization */}
        <div className="lg:col-span-7 bg-white border-2 border-foreground relative shadow-inner p-4">
           <svg width="100%" viewBox="-1.2 -1.2 2.4 2.4" className="aspect-square">
            <defs>
               <pattern id="smallGrid" width="0.2" height="0.2" patternUnits="userSpaceOnUse">
                <path d="M 0.2 0 L 0 0 0 0.2" fill="none" stroke="#eee" strokeWidth="0.01" />
              </pattern>
            </defs>
            <rect x="-1.2" y="-1.2" width="2.4" height="2.4" fill="url(#smallGrid)" />
            
            {/* Main Axes */}
            <line x1="-1.2" y1="0" x2="1.2" y2="0" stroke="#000" strokeWidth="0.01" />
            <line x1="0" y1="-1.2" x2="0" y2="1.2" stroke="#000" strokeWidth="0.01" />

            {/* Decision boundary */}
            <motion.line
              animate={{
                x1: line.x1, y1: -line.y1, // Flip Y for SVG coords
                x2: line.x2, y2: -line.y2,
              }}
              stroke="#2a45c2"
              strokeWidth="0.04"
              strokeLinecap="round"
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
            
            {/* The "Normal" Vector indicator (optional, shows direction) */}
            <motion.line
              x1="0" y1="0"
              animate={{ x2: weights[0]*0.5, y2: -weights[1]*0.5 }}
              stroke="#ff0000" strokeWidth="0.02" strokeDasharray="0.05" opacity="0.5"
            />

            {/* Dummy Points */}
            <circle cx="-0.5" cy="0.5" r="0.06" fill="#2a45c2" stroke="white" strokeWidth="0.02" />
            <circle cx="0.5" cy="-0.5" r="0.06" fill="#ff0000" stroke="white" strokeWidth="0.02" />
          </svg>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-6">
          <ControlSlider 
            label="Weight 1 (x₁)" 
            val={weights[0]} 
            setVal={(v) => setWeights([v, weights[1]])} 
            color="text-[#2a45c2]"
          />
          <ControlSlider 
            label="Weight 2 (x₂)" 
            val={weights[1]} 
            setVal={(v) => setWeights([weights[0], v])} 
            color="text-[#2a45c2]"
          />
          <ControlSlider 
            label="Bias (b)" 
            val={bias} 
            setVal={setBias} 
            color="text-[#ff0000]"
          />

          <div className="mt-6 p-4 bg-black text-white font-mono text-sm rounded shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]">
            <div className="text-xs uppercase text-gray-400 mb-2">Equation</div>
            0 = <span className="text-[#4f6bff]">{weights[0].toFixed(2)}x₁</span> + 
            <span className="text-[#4f6bff]"> {weights[1].toFixed(2)}x₂</span> + 
            <span className="text-[#ff6b6b]"> {bias.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </BentoBox>
  )
}

function ControlSlider({ label, val, setVal, color }: { label: string, val: number, setVal: (n: number) => void, color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</label>
        <span className="font-mono text-xs bg-muted/20 px-2 rounded">{val.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min="-2"
        max="2"
        step="0.1"
        value={val}
        onChange={(e) => setVal(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
      />
    </div>
  )
}