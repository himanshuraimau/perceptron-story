"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Play, RefreshCw, Zap, Layers } from "lucide-react"
import { BentoBox } from "./bento-box"

type DescentMode = "batch" | "sgd"

interface Point {
  x: number
  y: number
  loss: number
}

export function GradientDescentVis() {
  const [mode, setMode] = useState<DescentMode>("batch")
  const [learningRate, setLearningRate] = useState(0.1)
  const [history, setHistory] = useState<Point[]>([])
  const [isRunning, setIsRunning] = useState(false)
  
  // Starting position (high error)
  const startPos = { x: -80, y: -70 }
  
  // Run simulation
  const runSimulation = () => {
    setIsRunning(true)
    let currentX = startPos.x
    let currentY = startPos.y
    const newHistory: Point[] = [{ x: currentX, y: currentY, loss: currentX**2 + currentY**2 }]
    
    // Simulate steps
    const steps = 20
    for (let i = 0; i < steps; i++) {
      // Calculate Gradient (derivative of loss function L = x^2 + y^2)
      // Grad L = [2x, 2y]
      let gradX = 2 * currentX
      let gradY = 2 * currentY

      if (mode === "sgd") {
        // Add "Stochastic" noise - simulating random data points pulling the gradient
        const noiseScale = 80 // Magnitude of chaos
        gradX += (Math.random() - 0.5) * noiseScale
        gradY += (Math.random() - 0.5) * noiseScale
      }

      // Update Weights: w = w - learning_rate * gradient
      currentX = currentX - learningRate * gradX
      currentY = currentY - learningRate * gradY
      
      newHistory.push({ x: currentX, y: currentY, loss: currentX**2 + currentY**2 })
    }

    // Animate point by point
    let stepCount = 0
    setHistory([newHistory[0]])
    
    const interval = setInterval(() => {
      stepCount++
      if (stepCount >= newHistory.length) {
        clearInterval(interval)
        setIsRunning(false)
      } else {
        setHistory(prev => [...prev, newHistory[stepCount]])
      }
    }, 200) // Speed of animation
  }

  const reset = () => {
    setHistory([])
    setIsRunning(false)
  }

  // Generate path string for SVG
  const pathData = history.length > 0
    ? `M ${history[0].x + 100} ${history[0].y + 100} ` + 
      history.slice(1).map(p => `L ${p.x + 100} ${p.y + 100}`).join(" ")
    : ""

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: The Loss Landscape (Contour Plot) */}
      <div className="lg:col-span-7">
        <BentoBox title="Loss Landscape" accent={mode === "batch" ? "blue" : "red"}>
          <div className="relative aspect-square w-full bg-[#f8f9fa] border-2 border-black overflow-hidden group">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2a45c2" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#2a45c2" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Contour Lines (The "Bowl") */}
              {[90, 70, 50, 30, 10].map((r, i) => (
                <circle 
                  key={r} cx="100" cy="100" r={r} 
                  fill={i === 4 ? "#2a45c2" : "none"}
                  fillOpacity={i === 4 ? 0.1 : 0}
                  stroke="black" 
                  strokeOpacity={0.1 + (i * 0.1)} 
                  strokeWidth="1"
                  strokeDasharray={i % 2 === 0 ? "4 2" : "none"}
                />
              ))}

              {/* Center Target (Global Minimum) */}
              <circle cx="100" cy="100" r="2" fill="black" />
              <text x="100" y="115" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#666">MINIMUM ERROR</text>

              {/* The Path Animation */}
              <motion.path
                d={pathData}
                fill="none"
                stroke={mode === "batch" ? "#2a45c2" : "#ff0000"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              />

              {/* The "Ball" (Current Weights) */}
              {history.length > 0 && (
                <motion.g 
                  initial={{ opacity: 0 }}
                  animate={{ 
                    x: history[history.length - 1].x + 100, 
                    y: history[history.length - 1].y + 100,
                    opacity: 1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <circle r="4" fill={mode === "batch" ? "#2a45c2" : "#ff0000"} stroke="white" strokeWidth="1.5" />
                  {/* Pulse effect */}
                  <motion.circle 
                    r="8" stroke={mode === "batch" ? "#2a45c2" : "#ff0000"} strokeWidth="0.5" fill="none"
                    animate={{ scale: [1, 2], opacity: [0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                </motion.g>
              )}
            </svg>

            {/* Labels */}
            <div className="absolute top-2 left-2 font-mono text-xs bg-white/80 p-1 border border-black">
              Weight 1 (w₁)
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-xs bg-white/80 p-1 border border-black">
              Weight 2 (w₂)
            </div>
          </div>
        </BentoBox>
      </div>

      {/* RIGHT: Controls & Loss Chart */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Controls */}
        <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-bold text-lg uppercase tracking-widest mb-6">Optimizer Settings</h3>
          
          {/* Mode Selection */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode("batch"); reset(); }}
              className={`flex-1 py-3 px-2 text-xs font-bold uppercase tracking-wider border-2 transition-all flex flex-col items-center gap-2 ${
                mode === "batch" 
                  ? "bg-[#2a45c2] border-[#2a45c2] text-white" 
                  : "bg-white border-black text-black hover:bg-gray-50"
              }`}
            >
              <Layers size={20} />
              Batch GD
            </button>
            <button
              onClick={() => { setMode("sgd"); reset(); }}
              className={`flex-1 py-3 px-2 text-xs font-bold uppercase tracking-wider border-2 transition-all flex flex-col items-center gap-2 ${
                mode === "sgd" 
                  ? "bg-[#ff0000] border-[#ff0000] text-white" 
                  : "bg-white border-black text-black hover:bg-gray-50"
              }`}
            >
              <Zap size={20} />
              SGD
            </button>
          </div>

          {/* Learning Rate Slider */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold uppercase">Learning Rate (Step Size)</label>
              <span className="font-mono text-xs">{learningRate.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0.01" max="0.2" step="0.01"
              value={learningRate}
              onChange={(e) => { setLearningRate(parseFloat(e.target.value)); reset(); }}
              className={`w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer ${
                mode === 'batch' ? 'accent-[#2a45c2]' : 'accent-[#ff0000]'
              }`}
            />
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`w-full py-4 text-white font-black uppercase tracking-widest transition-transform active:scale-95 flex items-center justify-center gap-2 ${
              isRunning ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-[#2a45c2]"
            }`}
          >
            {isRunning ? "Optimizing..." : <><Play size={16} fill="currentColor" /> Start Descent</>}
          </button>
        </div>

        {/* Live Loss Graph */}
        <div className="flex-1 bg-black text-white p-4 border-2 border-black min-h-[150px] relative">
           <div className="absolute top-0 right-0 p-2 text-xs font-mono opacity-50 uppercase">Loss over time</div>
           <div className="h-full flex items-end gap-1">
              {history.map((pt, i) => {
                const height = Math.min((pt.loss / (startPos.x**2 + startPos.y**2)) * 100, 100);
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className={`w-2 ${mode === 'batch' ? 'bg-[#2a45c2]' : 'bg-[#ff0000]'}`}
                  />
                )
              })}
           </div>
        </div>
        
        <p className="text-xs font-mono text-muted-foreground leading-tight">
          {mode === "batch" 
            ? "BATCH: Calculates the exact gradient using all data. Smooth path, but computationally expensive."
            : "SGD (Stochastic): Uses random single points. Noisy, erratic path ('drunk walk'), but computationally cheap and can escape local minima."}
        </p>

      </div>
    </div>
  )
}