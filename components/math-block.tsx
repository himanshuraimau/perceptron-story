"use client"

import { useEffect, useRef } from "react"

interface MathBlockProps {
  formula: string
  display?: boolean
  description?: string
  className?: string
}

export function MathBlock({ formula, display = true, description, className = "" }: MathBlockProps) {
  const mathRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mathRef.current) {
      // Dynamically import katex only on client side
      import("katex").then((katex) => {
        if (mathRef.current) {
          katex.default.render(formula, mathRef.current, {
            displayMode: display,
            throwOnError: false,
          })
        }
      })
    }
  }, [formula, display])

  return (
    <div className={`${display ? "my-6 p-4 border-l-4 border-[#2a45c2] bg-muted/10" : "inline"} ${className}`}>
      <div ref={mathRef} className="text-center" />
      {description && <p className="text-xs text-text-muted mt-2 text-center">{description}</p>}
    </div>
  )
}
