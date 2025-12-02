"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils" // Assume you created the utility above

interface BentoBoxProps {
  title?: string
  children: ReactNode
  accent?: "default" | "red" | "blue"
  className?: string
  clickable?: boolean
}

export function BentoBox({ 
  title, 
  children, 
  accent = "default", 
  className, 
  clickable = false 
}: BentoBoxProps) {
  const borderColor = accent === "red" ? "border-[#ff0000]" : accent === "blue" ? "border-[#2a45c2]" : "border-foreground";
  const titleColor = accent === "red" ? "text-[#ff0000]" : accent === "blue" ? "text-[#2a45c2]" : "text-foreground";

  return (
    <div
      className={cn(
        "relative bg-background border-2 p-6 md:p-8 transition-all duration-200",
        borderColor,
        clickable 
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none" 
          : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        className
      )}
    >
      {title && (
        <div className="mb-6 pb-4 border-b-2 border-dashed border-border/40 flex items-center justify-between">
          <h3 className={cn("font-bold text-lg uppercase tracking-widest font-mono", titleColor)}>
            {title}
          </h3>
          <div className={cn("h-3 w-3 rounded-full", accent === "red" ? "bg-[#ff0000]" : accent === "blue" ? "bg-[#2a45c2]" : "bg-foreground")} />
        </div>
      )}
      {children}
    </div>
  )
}