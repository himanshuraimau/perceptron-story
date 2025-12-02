"use client"

interface FormulaBoxProps {
  formula: string
  label?: string
  description?: string
  className?: string
}

export function FormulaBox({ formula, label, description, className = "" }: FormulaBoxProps) {
  return (
    <div className={`border-l-4 border-[#2a45c2] bg-muted/10 p-4 my-4 ${className}`}>
      {label && <p className="text-xs font-bold uppercase tracking-widest mb-2">{label}</p>}
      <p className="font-mono text-sm leading-relaxed">{formula}</p>
      {description && <p className="text-xs text-text-muted mt-2">{description}</p>}
    </div>
  )
}
