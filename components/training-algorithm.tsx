"use client"

import { BentoBox } from "./bento-box"
import { FormulaBox } from "./formula-box"

export function TrainingAlgorithm() {
  const steps = [
    {
      number: 1,
      title: "Initialize",
      description: "Set weights w and bias b to small random values",
    },
    {
      number: 2,
      title: "For each training point:",
      description: "Calculate output and check if it matches the target",
    },
    {
      number: 3,
      title: "If wrong:",
      description: "Update weights using the perceptron learning rule",
    },
    {
      number: 4,
      title: "Repeat",
      description: "Continue until all points are correctly classified",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Steps visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div key={step.number} className="border-2 border-foreground p-4">
            <div className="text-4xl font-bold text-[#2a45c2] mb-3">{step.number}</div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-2">{step.title}</h4>
            <p className="text-sm text-text-muted">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Learning Rule */}
      <BentoBox title="The Perceptron Learning Rule" accent>
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">
            When a point is misclassified, we update the weights and bias proportionally to the error:
          </p>

          <div className="space-y-3">
            <FormulaBox
              formula="w_new = w_old + η(t - o)x"
              label="Weight Update"
              description="η = learning rate, t = target, o = output, x = input"
            />

            <FormulaBox
              formula="b_new = b_old + η(t - o)"
              label="Bias Update"
              description="Applied to the bias independently"
            />
          </div>

          <div className="border-l-4 border-[#ff0000] bg-[#ff0000]/5 p-4 mt-4">
            <p className="text-xs font-bold uppercase tracking-widest mb-2">Key Insight</p>
            <p className="text-sm">
              The learning rate η controls how much we adjust in each step. A small η leads to slow learning, while a
              large η may overshoot the optimal values.
            </p>
          </div>
        </div>
      </BentoBox>
    </div>
  )
}
