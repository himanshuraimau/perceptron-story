"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, Plus, Play, FastForward } from "lucide-react"
import { cn } from "@/lib/utils"
import { BentoBox } from "./bento-box"
import { WeightTrajectoryPlot } from "./weight-trajectory-plot"
import { ErrorConvergencePlot } from "./error-convergence-plot"

type DataPoint = {
  x: number
  y: number
  label: 1 | -1
  misclassified: boolean
}

type WeightHistoryPoint = {
  epoch: number
  w1: number
  w2: number
}

interface TrainingStep {
  epoch: number
  point: DataPoint
  error: number
  oldWeights: [number, number]
  newWeights: [number, number]
  oldBias: number
  newBias: number
  misclassifiedCount: number
  calculatedOutput: number
}

type ProblemType = "random" | "and" | "or"

export function TrainingLab() {
  // State
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [weights, setWeights] = useState<[number, number]>([0.3, -0.5])
  const [bias, setBias] = useState<number>(0.1)
  const [learningRate, setLearningRate] = useState<number>(0.1)
  const [currentEpoch, setCurrentEpoch] = useState<number>(0)
  const [isTraining, setIsTraining] = useState<boolean>(false)
  const [trainingHistory, setTrainingHistory] = useState<TrainingStep[]>([])
  const [weightHistory, setWeightHistory] = useState<WeightHistoryPoint[]>([])
  const [highlightedPoint, setHighlightedPoint] = useState<number | null>(null)
  const [hasConverged, setHasConverged] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(-1)

  // Data generation controls
  const [numPoints, setNumPoints] = useState<number>(20)
  const [noiseLevel, setNoiseLevel] = useState<number>(0)
  const [problemType, setProblemType] = useState<ProblemType>("random")

  // Generate specific problem data
  const generateProblemData = useCallback(
    (type: ProblemType, points: number) => {
      const newPoints: DataPoint[] = []

      if (type === "and") {
        // AND problem: only (1,1) is true
        return [
          { x: -0.7, y: -0.7, label: -1 as const, misclassified: false },
          { x: -0.7, y: 0.7, label: -1 as const, misclassified: false },
          { x: 0.7, y: -0.7, label: -1 as const, misclassified: false },
          { x: 0.7, y: 0.7, label: 1 as const, misclassified: false },
        ]
      }

      if (type === "or") {
        // OR problem: all except (0,0) are true
        return [
          { x: -0.7, y: -0.7, label: -1 as const, misclassified: false },
          { x: -0.7, y: 0.7, label: 1 as const, misclassified: false },
          { x: 0.7, y: -0.7, label: 1 as const, misclassified: false },
          { x: 0.7, y: 0.7, label: 1 as const, misclassified: false },
        ]
      }

      // Random linearly separable data
      const trueW1 = Math.random() * 2 - 1
      const trueW2 = Math.random() * 2 - 1
      const trueBias = Math.random() * 2 - 1

      for (let i = 0; i < points; i++) {
        const x = Math.random() * 2 - 1
        const y = Math.random() * 2 - 1
        const baseLabel = trueW1 * x + trueW2 * y + trueBias > 0 ? 1 : -1

        // Add noise - flip label with probability noiseLevel
        const shouldFlip = noiseLevel > 0 && Math.random() < noiseLevel / 100
        const trueLabel: 1 | -1 = shouldFlip ? (baseLabel === 1 ? -1 : 1) : baseLabel

        newPoints.push({
          x,
          y,
          label: trueLabel,
          misclassified: false,
        })
      }

      return newPoints
    },
    [noiseLevel],
  )

  // Generate data
  const generateData = useCallback(() => {
    const newData = generateProblemData(problemType, numPoints)
    setDataPoints(newData)
    setWeights([Math.random() * 2 - 1, Math.random() * 2 - 1])
    setBias(Math.random() * 2 - 1)
    setCurrentEpoch(0)
    setTrainingHistory([])
    setWeightHistory([])
    setHighlightedPoint(null)
    setHasConverged(false)
    setCurrentStep(-1)
  }, [problemType, numPoints, generateProblemData])

  // Calculate perceptron output
  const calculateOutput = useCallback(
    (point: DataPoint): number => {
      const sum = weights[0] * point.x + weights[1] * point.y + bias
      return sum > 0 ? 1 : -1
    },
    [weights, bias],
  )

  // Get all misclassified points
  const getMisclassifiedPoints = useCallback(() => {
    return dataPoints.map((point) => ({
      ...point,
      misclassified: calculateOutput(point) !== point.label,
    }))
  }, [dataPoints, calculateOutput])

  // Perform one training step
  const performTrainingStep = useCallback(() => {
    const updatedPoints = getMisclassifiedPoints()
    const misclassified = updatedPoints.filter((p) => p.misclassified)

    if (misclassified.length === 0) {
      setHasConverged(true)
      return
    }

    // Pick first misclassified point
    const pointToUpdate = misclassified[0]
    const pointIndex = updatedPoints.findIndex((p) => p.x === pointToUpdate.x && p.y === pointToUpdate.y)

    setHighlightedPoint(pointIndex)

    // Calculate output and error
    const output = calculateOutput(pointToUpdate)
    const error = pointToUpdate.label - output

    // Store old values
    const oldWeights: [number, number] = [...weights]
    const oldBias = bias

    // Update weights (Perceptron Learning Rule)
    const newW1 = weights[0] + learningRate * error * pointToUpdate.x
    const newW2 = weights[1] + learningRate * error * pointToUpdate.y
    const newBias = bias + learningRate * error

    // Update state
    setWeights([newW1, newW2])
    setBias(newBias)

    // Record step
    const newStep: TrainingStep = {
      epoch: currentEpoch,
      point: pointToUpdate,
      error,
      oldWeights,
      newWeights: [newW1, newW2],
      oldBias,
      newBias,
      misclassifiedCount: misclassified.length,
      calculatedOutput: output,
    }

    setTrainingHistory((prev) => [...prev, newStep])
    setWeightHistory((prev) => [...prev, { epoch: currentEpoch + 1, w1: newW1, w2: newW2 }])
    setCurrentEpoch((prev) => prev + 1)
    setCurrentStep((prev) => prev + 1)

    setTimeout(() => setHighlightedPoint(null), 800)
  }, [getMisclassifiedPoints, calculateOutput, weights, bias, learningRate, currentEpoch])

  // Auto-train for multiple steps
  const autoTrain = useCallback(
    (steps: number) => {
      setIsTraining(true)
      let stepCount = 0

      const interval = setInterval(() => {
        if (stepCount >= steps || hasConverged) {
          clearInterval(interval)
          setIsTraining(false)
          return
        }

        performTrainingStep()
        stepCount++
      }, 600)
    },
    [performTrainingStep, hasConverged],
  )

  // Reset training
  const resetTraining = useCallback(() => {
    setWeights([Math.random() * 2 - 1, Math.random() * 2 - 1])
    setBias(Math.random() * 2 - 1)
    setCurrentEpoch(0)
    setTrainingHistory([])
    setWeightHistory([])
    setHighlightedPoint(null)
    setHasConverged(false)
    setCurrentStep(-1)
  }, [])

  // Initialize on mount
  useEffect(() => {
    generateData()
  }, [])

  // Get line points for decision boundary
  const getLinePoints = () => {
    if (weights[1] === 0) return { x1: -1, x2: 1, y1: 0, y2: 0 }
    const x1 = -1.2
    const y1 = (-weights[0] * x1 - bias) / weights[1]
    const x2 = 1.2
    const y2 = (-weights[0] * x2 - bias) / weights[1]
    return { x1, y1, x2, y2 }
  }

  const line = getLinePoints()
  const updatedPoints = getMisclassifiedPoints()
  const misclassifiedCount = updatedPoints.filter((p) => p.misclassified).length
  const lastStep = currentStep >= 0 && currentStep < trainingHistory.length ? trainingHistory[currentStep] : null

  return (
    <div className="space-y-8">
      {/* Control Deck */}
      <div className="bg-foreground text-background p-6 shadow-[8px_8px_0px_0px_rgba(200,200,200,0.5)] border-2 border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ControlGroup label="Problem Type">
            <div className="flex gap-1">
              {(["random", "and", "or"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setProblemType(type)}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold uppercase tracking-wider border transition-all",
                    problemType === type ? "bg-[#2a45c2] border-[#2a45c2] text-white" : "border-white/20 hover:border-white text-white/60"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label={`Points: ${numPoints}`}>
            <input
              type="range" min="5" max="50" step="5" value={numPoints}
              onChange={(e) => setNumPoints(Number(e.target.value))}
              className="w-full accent-[#ff0000] h-1 bg-white/20 rounded-none appearance-none cursor-pointer"
            />
          </ControlGroup>

          <ControlGroup label={`Noise: ${noiseLevel}%`}>
            <input
              type="range" min="0" max="30" step="5" value={noiseLevel}
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
              className="w-full accent-[#ff0000] h-1 bg-white/20 rounded-none appearance-none cursor-pointer"
            />
          </ControlGroup>

          <div className="flex items-end">
            <button
              onClick={generateData}
              disabled={isTraining}
              className="w-full py-3 bg-white text-black font-black uppercase tracking-widest hover:bg-[#ff0000] hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Regenerate
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Visualization (Radar Style) */}
        <div className="lg:col-span-7">
          <BentoBox title="Decision Space" accent="blue" className="h-full">
            <div className="relative aspect-square w-full border-2 border-black bg-[#f8f9fa] overflow-hidden group">
              {/* Custom Grid Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "10% 10%" }} />

              <svg width="100%" viewBox="-1.3 -1.3 2.6 2.6" className="absolute inset-0">
                {/* Axes */}
                <line x1="-1.3" y1="0" x2="1.3" y2="0" stroke="black" strokeWidth="0.015" />
                <line x1="0" y1="-1.3" x2="0" y2="1.3" stroke="black" strokeWidth="0.015" />

                {/* Decision Line */}
                <motion.line
                  animate={{ x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 }}
                  stroke="#2a45c2" strokeWidth="0.04"
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
                {/* Decision Area Shading (Optional cool effect) */}
                <motion.polygon
                  points={`-2,-2 2,-2 2,2 -2,2`}
                  fill="#2a45c2"
                  opacity="0.05"
                  clipPath="url(#clip)" // You'd need a clip path for the line logic, skipping for simplicity
                />

                {/* Data Points */}
                {updatedPoints.map((point, idx) => (
                  <motion.g key={idx}>
                    {/* Ring for highlighted points */}
                    {highlightedPoint === idx && (
                      <motion.circle
                        cx={point.x} cy={point.y} r="0.1"
                        fill="none" stroke="#eab308" strokeWidth="0.02"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                    <motion.circle
                      cx={point.x} cy={point.y} r={0.05}
                      fill={point.label === 1 ? "#2a45c2" : "#ff0000"}
                      stroke="black" strokeWidth="0.01"
                      animate={{ scale: highlightedPoint === idx ? 1.5 : 1 }}
                    />
                    {point.misclassified && (
                      <line x1={point.x - 0.04} y1={point.y - 0.04} x2={point.x + 0.04} y2={point.y + 0.04} stroke="white" strokeWidth="0.02" />
                    )}
                  </motion.g>
                ))}
              </svg>

              {/* HUD Overlay */}
              <div className="absolute top-4 right-4 text-xs font-mono space-y-1 bg-white/90 p-2 border border-black shadow-sm backdrop-blur">
                <div className="flex justify-between gap-4"><span className="text-gray-500">W1</span> <b>{weights[0].toFixed(3)}</b></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500">W2</span> <b>{weights[1].toFixed(3)}</b></div>
                <div className="flex justify-between gap-4"><span className="text-gray-500">B</span> <b className="text-[#ff0000]">{bias.toFixed(3)}</b></div>
              </div>
            </div>
          </BentoBox>
        </div>

        {/* Dashboard Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Epoch" value={currentEpoch} color="blue" />
            <StatCard label="Errors" value={misclassifiedCount} color={misclassifiedCount === 0 ? "green" : "red"} total={dataPoints.length} />
          </div>

          <div className="bg-muted/30 p-6 border-2 border-dashed border-black/20 rounded-lg space-y-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-black uppercase">Learning Rate (η)</label>
              <span className="text-xs font-mono bg-black text-white px-2 py-0.5">{learningRate}</span>
            </div>
            <input
              type="range" min="0.01" max="1" step="0.05"
              value={learningRate} onChange={(e) => setLearningRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2a45c2]"
            />
          </div>

          <div className="space-y-3">
            <ActionButton
              onClick={performTrainingStep}
              disabled={isTraining || hasConverged}
              color="blue"
              icon={<Plus size={18} />}
              label="Step Forward"
            />
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                onClick={() => autoTrain(10)}
                disabled={isTraining || hasConverged}
                color="black"
                icon={<Play size={18} />}
                label="10 Steps"
              />
              <ActionButton
                onClick={() => autoTrain(100)}
                disabled={isTraining || hasConverged}
                color="red"
                icon={<FastForward size={18} />}
                label="Run Auto"
              />
            </div>
            <button
              onClick={resetTraining}
              className="w-full py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Reset Weights
            </button>
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <WeightTrajectoryPlot history={weightHistory} currentWeights={weights} />
        <ErrorConvergencePlot errors={trainingHistory.map((t) => t.misclassifiedCount)} currentEpoch={currentEpoch} />
      </div>

      {/* Step Calculations */}
      <AnimatePresence>
        {lastStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <BentoBox title={`Step ${currentStep + 1} Calculations`} accent="red">
              <div className="space-y-6">
                {/* Step Header */}
                <div className="flex justify-between items-center pb-4 border-b-2 border-dashed border-black/10">
                  <div className="font-mono text-sm">
                    <span className="text-gray-900">Epoch:</span> <b className="text-gray-900">{lastStep.epoch}</b>
                  </div>
                  <div className="px-3 py-1 bg-[#2a45c2]/10 text-[#2a45c2] text-xs font-bold uppercase border border-[#2a45c2]/20">
                    Training Step {currentStep + 1}
                  </div>
                </div>

                {/* Selected Point & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#2a45c2]/5 border-l-4 border-[#2a45c2]">
                    <div className="text-xs font-bold uppercase text-[#2a45c2] mb-2">Selected Point</div>
                    <div className="font-mono text-sm space-y-1 text-gray-900">
                      <div>x₁ = <b>{lastStep.point.x.toFixed(3)}</b></div>
                      <div>x₂ = <b>{lastStep.point.y.toFixed(3)}</b></div>
                      <div className="pt-2 border-t border-[#2a45c2]/20">
                        True Label: <b className="text-[#2a45c2]">t = {lastStep.point.label}</b>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#ff0000]/5 border-l-4 border-[#ff0000]">
                    <div className="text-xs font-bold uppercase text-[#ff0000] mb-2">Perceptron Output</div>
                    <div className="font-mono text-sm space-y-1 text-gray-900">
                      <div className="text-xs text-gray-900">
                        sum = w₁x₁ + w₂x₂ + b
                      </div>
                      <div className="text-xs text-gray-900">
                        = {lastStep.oldWeights[0].toFixed(3)} × {lastStep.point.x.toFixed(3)} + {lastStep.oldWeights[1].toFixed(3)} × {lastStep.point.y.toFixed(3)} + {lastStep.oldBias.toFixed(3)}
                      </div>
                      <div className="pt-2 border-t border-[#ff0000]/20">
                        Output: <b className="text-[#ff0000]">o = {lastStep.calculatedOutput}</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Calculation */}
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500">
                  <div className="text-xs font-bold uppercase text-yellow-700 mb-2">Error Calculation</div>
                  <div className="font-mono text-sm text-gray-900">
                    error = (t - o) = {lastStep.point.label} - ({lastStep.calculatedOutput}) = <b className="text-yellow-700 text-lg">{lastStep.error}</b>
                  </div>
                </div>

                {/* Weight Updates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#1a1a1a] text-white border-2 border-black">
                    <div className="text-xs font-bold uppercase mb-3 text-gray-400">Weight 1 Update</div>
                    <div className="font-mono text-xs space-y-2">
                      <div className="text-gray-400">Δw₁ = η × error × x₁</div>
                      <div className="text-gray-200">
                        = {learningRate.toFixed(2)} × {lastStep.error} × {lastStep.point.x.toFixed(3)}
                      </div>
                      <div className="text-[#6b9eff] font-bold">
                        = {(learningRate * lastStep.error * lastStep.point.x).toFixed(4)}
                      </div>
                      <div className="pt-2 border-t border-gray-700 text-sm">
                        <span className="text-gray-400">{lastStep.oldWeights[0].toFixed(3)}</span> → <b className="text-[#6b9eff]">{lastStep.newWeights[0].toFixed(3)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] text-white border-2 border-black">
                    <div className="text-xs font-bold uppercase mb-3 text-gray-400">Weight 2 Update</div>
                    <div className="font-mono text-xs space-y-2">
                      <div className="text-gray-400">Δw₂ = η × error × x₂</div>
                      <div className="text-gray-200">
                        = {learningRate.toFixed(2)} × {lastStep.error} × {lastStep.point.y.toFixed(3)}
                      </div>
                      <div className="text-[#6b9eff] font-bold">
                        = {(learningRate * lastStep.error * lastStep.point.y).toFixed(4)}
                      </div>
                      <div className="pt-2 border-t border-gray-700 text-sm">
                        <span className="text-gray-400">{lastStep.oldWeights[1].toFixed(3)}</span> → <b className="text-[#6b9eff]">{lastStep.newWeights[1].toFixed(3)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#1a1a1a] text-white border-2 border-black">
                    <div className="text-xs font-bold uppercase mb-3 text-gray-400">Bias Update</div>
                    <div className="font-mono text-xs space-y-2">
                      <div className="text-gray-400">Δb = η × error</div>
                      <div className="text-gray-200">
                        = {learningRate.toFixed(2)} × {lastStep.error}
                      </div>
                      <div className="text-[#ff6b6b] font-bold">
                        = {(learningRate * lastStep.error).toFixed(4)}
                      </div>
                      <div className="pt-2 border-t border-gray-700 text-sm">
                        <span className="text-gray-400">{lastStep.oldBias.toFixed(3)}</span> → <b className="text-[#ff6b6b]">{lastStep.newBias.toFixed(3)}</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step Navigation */}
                {trainingHistory.length > 1 && (
                  <div className="pt-4 border-t-2 border-dashed border-black/10">
                    <div className="text-xs font-bold uppercase mb-3 text-gray-500">Step History</div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {trainingHistory.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentStep(idx)}
                          className={cn(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-all whitespace-nowrap",
                            currentStep === idx
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-gray-300 hover:border-black"
                          )}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </BentoBox>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Convergence Banner */}
      {hasConverged && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-4 border-green-600 bg-green-50 p-8 shadow-[8px_8px_0px_0px_rgba(34,197,94,0.3)]"
        >
          <div className="text-center space-y-4">
            <div className="text-6xl">✓</div>
            <h3 className="font-black text-3xl uppercase tracking-tighter text-green-700">Converged!</h3>
            <p className="text-lg text-green-800">
              Successfully learned to separate the data in <b>{currentEpoch}</b> epochs
            </p>
            <div className="grid grid-cols-3 gap-6 mt-6 max-w-2xl mx-auto">
              <div className="p-4 bg-white border-2 border-green-600">
                <div className="text-xs uppercase font-bold text-gray-500 mb-1">Epochs</div>
                <div className="text-3xl font-black font-mono text-green-700">{currentEpoch}</div>
              </div>
              <div className="p-4 bg-white border-2 border-green-600">
                <div className="text-xs uppercase font-bold text-gray-500 mb-1">Final w₁</div>
                <div className="text-2xl font-black font-mono text-green-700">{weights[0].toFixed(3)}</div>
              </div>
              <div className="p-4 bg-white border-2 border-green-600">
                <div className="text-xs uppercase font-bold text-gray-500 mb-1">Final w₂</div>
                <div className="text-2xl font-black font-mono text-green-700">{weights[1].toFixed(3)}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Sub-components for cleaner code
function ControlGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">{label}</label>
      {children}
    </div>
  )
}

function StatCard({ label, value, color, total }: { label: string, value: number, color: string, total?: number }) {
  const bgClass = color === 'blue' ? 'bg-[#2a45c2]/10 text-[#2a45c2]' : color === 'red' ? 'bg-[#ff0000]/10 text-[#ff0000]' : 'bg-green-100 text-green-700'
  return (
    <div className={cn("p-4 border-l-4", color === 'blue' ? 'border-[#2a45c2]' : color === 'red' ? 'border-[#ff0000]' : 'border-green-600', bgClass)}>
      <div className="text-xs uppercase font-bold opacity-70 mb-1">{label}</div>
      <div className="text-3xl font-black font-mono">
        {value}{total !== undefined && <span className="text-base opacity-50">/{total}</span>}
      </div>
    </div>
  )
}

function ActionButton({ onClick, disabled, color, icon, label }: any) {
  const base = "w-full py-4 flex items-center justify-center gap-3 font-bold uppercase tracking-widest border-2 transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const styles = {
    blue: "bg-[#2a45c2] border-[#2a45c2] text-white hover:bg-[#1e34a0]",
    red: "bg-[#ff0000] border-[#ff0000] text-white hover:bg-[#d40000]",
    black: "bg-white border-black text-black hover:bg-gray-50"
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(base, styles[color as keyof typeof styles], disabled && "opacity-50 cursor-not-allowed shadow-none transform-none")}
    >
      {icon} {label}
    </button>
  )
}