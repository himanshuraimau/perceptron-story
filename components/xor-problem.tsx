"use client"

import { motion } from "framer-motion"
import { BentoBox } from "./bento-box"

export function XorProblem() {
  const xorData = [
    { x: 0, y: 0, label: -1 }, { x: 1, y: 0, label: 1 },
    { x: 0, y: 1, label: 1 }, { x: 1, y: 1, label: -1 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6">
        <h3 className="text-3xl font-black uppercase tracking-tighter text-[#ff0000]">
          System Failure
        </h3>
        <p className="text-lg leading-relaxed font-serif">
          The Perceptron has a fatal flaw. It is strictly a <span className="bg-[#2a45c2] text-white px-1">linear classifier</span>.
          When faced with the XOR problem, it enters an infinite loop, frantically searching for a line that does not exist.
        </p>
        <div className="p-4 bg-black text-green-500 font-mono text-sm border-l-4 border-[#ff0000]">
           &gt; TRAINING...<br/>
           &gt; ERROR: CONVERGENCE_FAILED<br/>
           &gt; RETRYING EPOCH 9999...
        </div>
      </div>

      <BentoBox title="XOR Visualization" accent="red">
        <svg width="100%" viewBox="-0.2 -0.2 1.4 1.4" className="bg-white border-2 border-black">
          {/* Points */}
          {xorData.map((p, i) => (
             <circle 
                key={i} cx={p.x} cy={1-p.y} r="0.08" 
                fill={p.label === 1 ? "#2a45c2" : "#ff0000"} 
                stroke="black" strokeWidth="0.01"
             />
          ))}
          
          {/* Frantic Line Animation */}
          <motion.line
             x1="-0.2" x2="1.4"
             stroke="black" strokeWidth="0.02" strokeDasharray="0.05"
             animate={{ 
                y1: [0, 1, 0.5, 0.2, 0.8], 
                y2: [0.5, 0.2, 1, 0.8, 0] 
             }}
             transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "mirror",
                ease: "easeInOut"
             }}
          />
          
          <text x="0.5" y="1.2" textAnchor="middle" fontSize="0.1" fill="#ff0000" fontWeight="bold">
             NO SOLUTION FOUND
          </text>
        </svg>
      </BentoBox>
    </div>
  )
}