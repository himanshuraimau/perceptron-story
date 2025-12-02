"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator, CheckCircle2, XCircle } from "lucide-react"
import { MathBlock } from "./math-block"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

export function NumericalExamples() {
  const [activeExample, setActiveExample] = useState<number>(1)

  return (
    <div className="space-y-12">
      {/* Introduction */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-[#2a45c2]">
          <Calculator className="w-8 h-8" />
          <span className="font-bold uppercase tracking-widest text-sm">Numerical Examples</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-bold leading-tight">
          Step-by-Step<br />
          <span className="text-[#2a45c2]">Problem Solving</span>
        </h3>
        <p className="text-lg leading-relaxed text-gray-700 max-w-3xl">
          Let's work through concrete examples with real numbers to understand how perceptrons and multilayer networks learn.
        </p>
      </div>

      {/* Example Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 1, title: "AND Gate", type: "Single Perceptron" },
          { id: 2, title: "OR Gate", type: "Single Perceptron" },
          { id: 3, title: "XOR Problem", type: "MLP" },
          { id: 4, title: "Classification", type: "MLP" },
        ].map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            className={`p-4 border-2 border-black text-left transition-all ${
              activeExample === example.id
                ? "bg-[#2a45c2] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            }`}
          >
            <div className="text-xs uppercase font-bold tracking-widest opacity-70 mb-1">
              {example.type}
            </div>
            <div className="font-bold">{example.title}</div>
          </button>
        ))}
      </div>

      {/* Example Content */}
      <motion.div
        key={activeExample}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeExample === 1 && <ANDGateExample />}
        {activeExample === 2 && <ORGateExample />}
        {activeExample === 3 && <XORMLPExample />}
        {activeExample === 4 && <ClassificationMLPExample />}
      </motion.div>
    </div>
  )
}

// Single Perceptron Example 1: AND Gate
function ANDGateExample() {
  return (
    <div className="space-y-8">
      <ProblemCard
        title="Problem 1: Training a Perceptron for AND Gate"
        description="Train a single perceptron to learn the AND logic gate using the perceptron learning rule."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Problem Setup */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Training Data</h4>
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2">x₁</th>
                  <th className="text-left py-2">x₂</th>
                  <th className="text-left py-2">Target (y)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300"><td className="py-2">0</td><td>0</td><td>0</td></tr>
                <tr className="border-b border-gray-300"><td className="py-2">0</td><td>1</td><td>0</td></tr>
                <tr className="border-b border-gray-300"><td className="py-2">1</td><td>0</td><td>0</td></tr>
                <tr><td className="py-2">1</td><td>1</td><td>1</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Initial Parameters</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li><span className="text-[#2a45c2] font-bold">w₁ =</span> 0.0</li>
              <li><span className="text-[#2a45c2] font-bold">w₂ =</span> 0.0</li>
              <li><span className="text-[#2a45c2] font-bold">b =</span> 0.0</li>
              <li><span className="text-[#ff0000] font-bold">η (learning rate) =</span> 0.1</li>
            </ul>
          </div>
        </div>

        {/* Right: Solution Steps */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="bg-[#2a45c2] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Epoch 1, Sample (0, 0)
            </h4>
            <div className="space-y-3 text-sm font-mono">
              <div><span className="font-bold">Calculate:</span> z = w₁x₁ + w₂x₂ + b = 0(0) + 0(0) + 0 = 0</div>
              <div><span className="font-bold">Predict:</span> ŷ = sign(0) = 0</div>
              <div><span className="font-bold">Error:</span> e = y - ŷ = 0 - 0 = 0</div>
              <div className="text-green-600 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> No update needed
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="bg-[#2a45c2] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Epoch 1, Sample (1, 1)
            </h4>
            <div className="space-y-3 text-sm font-mono">
              <div><span className="font-bold">Calculate:</span> z = 0(1) + 0(1) + 0 = 0</div>
              <div><span className="font-bold">Predict:</span> ŷ = sign(0) = 0</div>
              <div><span className="font-bold">Error:</span> e = 1 - 0 = 1</div>
              <div className="text-[#ff0000] font-bold">Update weights:</div>
              <div className="pl-4 space-y-1">
                <div>w₁ = 0 + 0.1(1)(1) = <span className="text-[#2a45c2]">0.1</span></div>
                <div>w₂ = 0 + 0.1(1)(1) = <span className="text-[#2a45c2]">0.1</span></div>
                <div>b = 0 + 0.1(1) = <span className="text-[#2a45c2]">0.1</span></div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a45c2] text-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Final Result (After Convergence)</h4>
            <div className="space-y-2 font-mono text-sm">
              <div>w₁ = 0.2, w₂ = 0.2, b = -0.3</div>
              <div className="pt-3 border-t border-white/30">
                Decision boundary: 0.2x₁ + 0.2x₂ - 0.3 = 0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Single Perceptron Example 2: OR Gate
function ORGateExample() {
  return (
    <div className="space-y-8">
      <ProblemCard
        title="Problem 2: Training a Perceptron for OR Gate"
        description="Train a single perceptron to learn the OR logic gate."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Problem Setup */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Training Data</h4>
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2">x₁</th>
                  <th className="text-left py-2">x₂</th>
                  <th className="text-left py-2">Target (y)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300"><td className="py-2">0</td><td>0</td><td>0</td></tr>
                <tr className="border-b border-gray-300"><td className="py-2">0</td><td>1</td><td>1</td></tr>
                <tr className="border-b border-gray-300"><td className="py-2">1</td><td>0</td><td>1</td></tr>
                <tr><td className="py-2">1</td><td>1</td><td>1</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Initial Parameters</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li><span className="text-[#2a45c2] font-bold">w₁ =</span> 0.0</li>
              <li><span className="text-[#2a45c2] font-bold">w₂ =</span> 0.0</li>
              <li><span className="text-[#2a45c2] font-bold">b =</span> 0.0</li>
              <li><span className="text-[#ff0000] font-bold">η (learning rate) =</span> 0.1</li>
            </ul>
          </div>
        </div>

        {/* Right: Solution Steps */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="bg-[#2a45c2] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Epoch 1, Sample (0, 1)
            </h4>
            <div className="space-y-3 text-sm font-mono">
              <div><span className="font-bold">Calculate:</span> z = 0(0) + 0(1) + 0 = 0</div>
              <div><span className="font-bold">Predict:</span> ŷ = sign(0) = 0</div>
              <div><span className="font-bold">Error:</span> e = 1 - 0 = 1</div>
              <div className="text-[#ff0000] font-bold">Update weights:</div>
              <div className="pl-4 space-y-1">
                <div>w₁ = 0 + 0.1(1)(0) = <span className="text-[#2a45c2]">0.0</span></div>
                <div>w₂ = 0 + 0.1(1)(1) = <span className="text-[#2a45c2]">0.1</span></div>
                <div>b = 0 + 0.1(1) = <span className="text-[#2a45c2]">0.1</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="bg-[#2a45c2] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Epoch 1, Sample (1, 0)
            </h4>
            <div className="space-y-3 text-sm font-mono">
              <div><span className="font-bold">Calculate:</span> z = 0(1) + 0.1(0) + 0.1 = 0.1</div>
              <div><span className="font-bold">Predict:</span> ŷ = sign(0.1) = 1</div>
              <div><span className="font-bold">Error:</span> e = 1 - 1 = 0</div>
              <div className="text-green-600 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> No update needed
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="bg-[#2a45c2] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Epoch 2, Sample (1, 0)
            </h4>
            <div className="space-y-3 text-sm font-mono">
              <div><span className="font-bold">Calculate:</span> z = 0(1) + 0.1(0) + 0.1 = 0.1</div>
              <div><span className="font-bold">Predict:</span> ŷ = sign(0.1) = 1</div>
              <div><span className="font-bold">Error:</span> e = 1 - 1 = 0</div>
              <div className="text-[#ff0000] font-bold">Update weights:</div>
              <div className="pl-4 space-y-1">
                <div>w₁ = 0 + 0.1(1)(1) = <span className="text-[#2a45c2]">0.1</span></div>
                <div>w₂ = 0.1 (no change)</div>
                <div>b = 0.1 (no change)</div>
              </div>
            </div>
          </div>

          <div className="bg-[#2a45c2] text-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Final Result (After Convergence)</h4>
            <div className="space-y-2 font-mono text-sm">
              <div>w₁ = 0.2, w₂ = 0.2, b = -0.1</div>
              <div className="pt-3 border-t border-white/30">
                Decision boundary: 0.2x₁ + 0.2x₂ - 0.1 = 0
              </div>
              <div className="pt-2 text-xs opacity-80">
                This correctly classifies all OR gate inputs!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// MLP Example 1: XOR Problem
function XORMLPExample() {
  return (
    <div className="space-y-8">
      <ProblemCard
        title="Problem 3: Multi-Layer Perceptron for XOR"
        description="Solve the XOR problem using a 2-2-1 neural network with backpropagation."
      />

      <div className="space-y-8">
        {/* Architecture */}
        <div className="bg-white border-2 border-black p-6">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Network Architecture</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-sm">
            <div className="border-2 border-[#2a45c2] p-4 bg-[#2a45c2]/5">
              <div className="font-bold text-[#2a45c2] mb-2">Input Layer</div>
              <div>2 neurons (x₁, x₂)</div>
            </div>
            <div className="border-2 border-[#2a45c2] p-4 bg-[#2a45c2]/5">
              <div className="font-bold text-[#2a45c2] mb-2">Hidden Layer</div>
              <div>2 neurons</div>
              <div className="text-xs mt-1">Activation: Sigmoid</div>
            </div>
            <div className="border-2 border-[#ff0000] p-4 bg-[#ff0000]/5">
              <div className="font-bold text-[#ff0000] mb-2">Output Layer</div>
              <div>1 neuron</div>
              <div className="text-xs mt-1">Activation: Sigmoid</div>
            </div>
          </div>
        </div>

        {/* Training Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">XOR Training Data</h4>
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-2">x₁</th>
                  <th className="text-left py-2">x₂</th>
                  <th className="text-left py-2">Target (y)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300"><td className="py-2">0</td><td>0</td><td>0</td></tr>
                <tr className="border-b border-gray-300"><td className="py-2">0</td><td>1</td><td>1</td></tr>
                <tr className="border-b border-gray-300"><td className="py-2">1</td><td>0</td><td>1</td></tr>
                <tr><td className="py-2">1</td><td>1</td><td>0</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Initial Weights</h4>
            <div className="space-y-3 font-mono text-sm">
              <div className="text-[#2a45c2] font-bold">Input → Hidden:</div>
              <div className="pl-4 space-y-1">
                <div>w₁₁ = 0.5, w₁₂ = 0.5</div>
                <div>w₂₁ = 0.5, w₂₂ = 0.5</div>
                <div>b₁ = -0.5, b₂ = -0.5</div>
              </div>
              <div className="text-[#ff0000] font-bold mt-4">Hidden → Output:</div>
              <div className="pl-4 space-y-1">
                <div>v₁ = 1.0, v₂ = 1.0</div>
                <div>b₀ = -0.5</div>
              </div>
              <div className="mt-4">η = 0.5</div>
            </div>
          </div>
        </div>

        {/* Forward Pass */}
        <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="bg-[#2a45c2] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Forward Pass: Input (1, 0)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
            <div className="space-y-3">
              <div className="font-bold text-[#2a45c2]">Hidden Layer:</div>
              <div className="pl-4 space-y-2">
                <div>h₁ = σ(0.5×1 + 0.5×0 - 0.5) = σ(0) = <span className="text-[#2a45c2]">0.5</span></div>
                <div>h₂ = σ(0.5×1 + 0.5×0 - 0.5) = σ(0) = <span className="text-[#2a45c2]">0.5</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-bold text-[#ff0000]">Output Layer:</div>
              <div className="pl-4 space-y-2">
                <div>ŷ = σ(1.0×0.5 + 1.0×0.5 - 0.5)</div>
                <div>ŷ = σ(0.5) = <span className="text-[#ff0000]">0.622</span></div>
                <div className="mt-2 text-xs">Error = (1 - 0.622)² / 2 = 0.071</div>
              </div>
            </div>
          </div>
        </div>

        {/* Backward Pass */}
        <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(255,0,0,0.2)]">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="bg-[#ff0000] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Backward Pass: Gradient Descent
          </h4>
          <div className="space-y-4 text-sm font-mono">
            <div>
              <div className="font-bold mb-2">Output Layer Gradient:</div>
              <div className="pl-4">
                δ₀ = (ŷ - y) × σ'(z) = (0.622 - 1) × 0.235 = <span className="text-[#ff0000]">-0.089</span>
              </div>
            </div>
            <div>
              <div className="font-bold mb-2">Hidden Layer Gradients:</div>
              <div className="pl-4 space-y-1">
                <div>δ₁ = δ₀ × v₁ × σ'(h₁) = -0.089 × 1.0 × 0.25 = <span className="text-[#2a45c2]">-0.022</span></div>
                <div>δ₂ = δ₀ × v₂ × σ'(h₂) = -0.089 × 1.0 × 0.25 = <span className="text-[#2a45c2]">-0.022</span></div>
              </div>
            </div>
            <div>
              <div className="font-bold mb-2">Weight Updates:</div>
              <div className="pl-4 space-y-1">
                <div>v₁ = 1.0 - 0.5 × (-0.089) × 0.5 = <span className="font-bold">1.022</span></div>
                <div>w₁₁ = 0.5 - 0.5 × (-0.022) × 1 = <span className="font-bold">0.511</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Result */}
        <div className="bg-[#2a45c2] text-white border-2 border-black p-6">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">After 10,000 Epochs</h4>
          <div className="space-y-3 font-mono text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="opacity-70 text-xs mb-1">INPUT (0,0):</div>
                <div>Output ≈ 0.02 ✓</div>
              </div>
              <div>
                <div className="opacity-70 text-xs mb-1">INPUT (0,1):</div>
                <div>Output ≈ 0.98 ✓</div>
              </div>
              <div>
                <div className="opacity-70 text-xs mb-1">INPUT (1,0):</div>
                <div>Output ≈ 0.98 ✓</div>
              </div>
              <div>
                <div className="opacity-70 text-xs mb-1">INPUT (1,1):</div>
                <div>Output ≈ 0.03 ✓</div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/30 text-xs opacity-80">
              The MLP successfully learned the XOR function through backpropagation!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// MLP Example 2: Classification Problem
function ClassificationMLPExample() {
  return (
    <div className="space-y-8">
      <ProblemCard
        title="Problem 4: Binary Classification with MLP"
        description="Train a 2-3-1 neural network to classify points into two categories."
      />

      <div className="space-y-8">
        {/* Problem Statement */}
        <div className="bg-white border-2 border-black p-6">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Classification Task</h4>
          <p className="text-sm mb-4">
            Classify whether a student will pass (1) or fail (0) based on hours studied (x₁) and hours slept (x₂).
          </p>
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2">Hours Studied</th>
                <th className="text-left py-2">Hours Slept</th>
                <th className="text-left py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-300"><td className="py-2">2</td><td>4</td><td>0 (Fail)</td></tr>
              <tr className="border-b border-gray-300"><td className="py-2">4</td><td>6</td><td>1 (Pass)</td></tr>
              <tr className="border-b border-gray-300"><td className="py-2">6</td><td>8</td><td>1 (Pass)</td></tr>
              <tr><td className="py-2">8</td><td>5</td><td>1 (Pass)</td></tr>
            </tbody>
          </table>
        </div>

        {/* Network Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Network: 2-3-1</h4>
            <div className="space-y-3 font-mono text-sm">
              <div>
                <div className="text-[#2a45c2] font-bold mb-1">Input Layer:</div>
                <div className="pl-4">2 neurons (x₁, x₂)</div>
              </div>
              <div>
                <div className="text-[#2a45c2] font-bold mb-1">Hidden Layer:</div>
                <div className="pl-4">3 neurons with ReLU</div>
              </div>
              <div>
                <div className="text-[#ff0000] font-bold mb-1">Output Layer:</div>
                <div className="pl-4">1 neuron with Sigmoid</div>
              </div>
              <div className="mt-4">
                <div className="font-bold">Learning Rate: η = 0.01</div>
                <div className="font-bold">Loss: Binary Cross-Entropy</div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6">
            <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Initial Weights (Random)</h4>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="font-bold mb-1">W⁽¹⁾ (Input → Hidden):</div>
                <div className="pl-4 bg-gray-50 p-2 border border-gray-300">
                  [0.12, 0.34]<br/>
                  [0.56, 0.78]<br/>
                  [0.23, 0.45]
                </div>
              </div>
              <div>
                <div className="font-bold mb-1">W⁽²⁾ (Hidden → Output):</div>
                <div className="pl-4 bg-gray-50 p-2 border border-gray-300">
                  [0.67, 0.89, 0.12]
                </div>
              </div>
              <div>
                <div className="font-bold mb-1">Biases:</div>
                <div className="pl-4">b⁽¹⁾ = [0.1, 0.2, 0.3]</div>
                <div className="pl-4">b⁽²⁾ = [0.5]</div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Example */}
        <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="bg-[#2a45c2] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Forward Pass: Sample (4, 6) → Pass
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
            <div className="space-y-3">
              <div className="font-bold text-[#2a45c2]">Hidden Layer (ReLU):</div>
              <div className="pl-4 space-y-2 text-xs">
                <div>z₁⁽¹⁾ = 0.12×4 + 0.34×6 + 0.1 = 2.622</div>
                <div>h₁ = max(0, 2.622) = <span className="text-[#2a45c2] font-bold">2.622</span></div>
                <div className="opacity-50">...</div>
                <div>h₂ = <span className="text-[#2a45c2] font-bold">6.980</span></div>
                <div>h₃ = <span className="text-[#2a45c2] font-bold">3.622</span></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-bold text-[#ff0000]">Output Layer (Sigmoid):</div>
              <div className="pl-4 space-y-2 text-xs">
                <div>z⁽²⁾ = 0.67×2.622 + 0.89×6.980 + 0.12×3.622 + 0.5</div>
                <div>z⁽²⁾ = 8.446</div>
                <div>ŷ = σ(8.446) = <span className="text-[#ff0000] font-bold">0.9998</span></div>
                <div className="mt-3 pt-3 border-t border-gray-300">
                  <div>Target: y = 1</div>
                  <div className="font-bold">Loss = -log(0.9998) ≈ 0.0002</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backpropagation */}
        <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(255,0,0,0.2)]">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide flex items-center gap-2">
            <span className="bg-[#ff0000] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Backpropagation
          </h4>
          <div className="space-y-4 text-sm font-mono">
            <div>
              <div className="font-bold mb-2">Output Gradient:</div>
              <div className="pl-4 text-xs">
                δ⁽²⁾ = ŷ - y = 0.9998 - 1 = <span className="text-[#ff0000]">-0.0002</span>
              </div>
            </div>
            <div>
              <div className="font-bold mb-2">Hidden Layer Gradients:</div>
              <div className="pl-4 space-y-1 text-xs">
                <div>δ₁⁽¹⁾ = δ⁽²⁾ × w₁⁽²⁾ × 1 = -0.0002 × 0.67 = <span className="text-[#2a45c2]">-0.000134</span></div>
                <div>δ₂⁽¹⁾ = <span className="text-[#2a45c2]">-0.000178</span></div>
                <div>δ₃⁽¹⁾ = <span className="text-[#2a45c2]">-0.000024</span></div>
              </div>
            </div>
            <div>
              <div className="font-bold mb-2">Weight Updates (η = 0.01):</div>
              <div className="pl-4 space-y-1 text-xs">
                <div>ΔW⁽²⁾ = -0.01 × (-0.0002) × [h₁, h₂, h₃]</div>
                <div>W⁽²⁾ += [0.0000052, 0.0000140, 0.0000072]</div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-black p-4">
            <div className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2">Epoch 1</div>
            <div className="text-2xl font-bold text-[#ff0000]">Loss: 0.523</div>
            <div className="text-xs mt-1">Accuracy: 50%</div>
          </div>
          <div className="bg-white border-2 border-black p-4">
            <div className="text-xs uppercase font-bold tracking-widest text-gray-500 mb-2">Epoch 100</div>
            <div className="text-2xl font-bold text-[#2a45c2]">Loss: 0.142</div>
            <div className="text-xs mt-1">Accuracy: 75%</div>
          </div>
          <div className="bg-[#2a45c2] text-white border-2 border-black p-4">
            <div className="text-xs uppercase font-bold tracking-widest opacity-70 mb-2">Epoch 1000</div>
            <div className="text-2xl font-bold">Loss: 0.018</div>
            <div className="text-xs mt-1">Accuracy: 100% ✓</div>
          </div>
        </div>

        {/* Final Weights */}
        <div className="bg-[#2a45c2] text-white border-2 border-black p-6">
          <h4 className="font-bold text-lg mb-4 uppercase tracking-wide">Trained Network</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
            <div>
              <div className="opacity-70 text-xs mb-2">Test Prediction (5, 7):</div>
              <div className="text-lg">Output = 0.92 → <span className="font-bold">PASS ✓</span></div>
            </div>
            <div>
              <div className="opacity-70 text-xs mb-2">Test Prediction (1, 3):</div>
              <div className="text-lg">Output = 0.08 → <span className="font-bold">FAIL ✓</span></div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/30 text-xs opacity-80">
            The network learned a non-linear decision boundary to separate passing and failing students!
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Component
function ProblemCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-r from-[#2a45c2] to-[#ff0000] p-[2px]">
      <div className="bg-white p-6">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  )
}
