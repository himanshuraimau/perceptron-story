"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { Menu, X, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // UPDATED SECTIONS LIST
  const sections = [
    { label: "Intro", href: "#introduction" },
    { label: "Math", href: "#mathematics" },
    { label: "Visual", href: "#interactive" },
    { label: "Algorithm", href: "#training-rule" },
    { label: "Lab", href: "#training-lab" },
    { label: "Optimization", href: "#optimization" },
    { label: "Examples", href: "#numerical-examples" },
    { label: "XOR", href: "#xor-limitation" },
    { label: "Future", href: "#future" },
  ]

  const handleScroll = (href: string) => {
    setIsOpen(false)
    if (href === "#") window.scrollTo({ top: 0, behavior: "smooth" })
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2",
          isScrolled 
            ? "bg-background/90 backdrop-blur-md border-foreground py-3 shadow-md" 
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="container-swiss flex items-center justify-between">
          <button
            onClick={() => handleScroll("#")}
            className="group flex items-center gap-2 font-black text-xl uppercase tracking-tighter"
          >
            <div className="bg-[#2a45c2] text-white p-1 border-2 border-black group-hover:rotate-12 transition-transform">
              <Terminal size={20} />
            </div>
            <span>Perceptron<span className="text-[#ff0000]">.ts</span></span>
          </button>

          <div className="hidden lg:flex gap-1">
            {sections.map((section) => (
              <motion.button
                key={section.href}
                onClick={() => handleScroll(section.href)}
                className="px-3 py-2 font-bold uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black rounded-sm"
                whileTap={{ scale: 0.95 }}
              >
                {section.label}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 border-2 border-black bg-white active:bg-black active:text-white transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
        <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2a45c2] origin-left" style={{ scaleX }} />
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {sections.map((section, idx) => (
                <motion.button
                  key={section.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleScroll(section.href)}
                  className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-left border-b-2 border-black pb-4 hover:text-[#2a45c2] hover:pl-4 transition-all"
                >
                  {section.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}