  "use client"

  import type { ReactNode } from "react"
  import { motion } from "framer-motion"

  interface ScrollRevealProps {
    children: ReactNode
    delay?: number
    className?: string
    direction?: "up" | "down" | "left" | "right"
  }

  export function ScrollReveal({ children, delay = 0, className = "", direction = "up" }: ScrollRevealProps) {
    const getInitialTransform = () => {
      switch (direction) {
        case "up":
          return { y: 40, opacity: 0 }
        case "down":
          return { y: -40, opacity: 0 }
        case "left":
          return { x: 40, opacity: 0 }
        case "right":
          return { x: -40, opacity: 0 }
      }
    }

    return (
      <motion.div
        className={className}
        initial={getInitialTransform()}
        whileInView={{ x: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 0.6,
          delay: delay * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    )
  }
