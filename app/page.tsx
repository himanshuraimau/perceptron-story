"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown, BrainCircuit, Mountain, Network, Zap } from "lucide-react"

import { SwissSection } from "@/components/swiss-section"
import { InteractiveDiagram } from "@/components/interactive-diagram"
import { AndOrDemo } from "@/components/and-or-demo"
import { TrainingAlgorithm } from "@/components/training-algorithm"
import { TrainingLab } from "@/components/training-lab"
import { XorProblem } from "@/components/xor-problem"
import { MathBlock } from "@/components/math-block"
import { AnimatedStat } from "@/components/animated-stat"
import { ScrollReveal } from "@/components/scroll-reveal"
import { BentoBox } from "@/components/bento-box"
import { GradientDescentVis } from "@/components/GradientDescentVis"

export default function Page() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0])
  const heroY = useTransform(scrollY, [0, 500], [0, 100])

  return (
    <div className="bg-noise min-h-screen selection:bg-[#2a45c2] selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section id="introduction" className="relative min-h-screen flex flex-col pt-24 border-b-4 border-black">
        <div className="absolute inset-0 bg-grid-pattern -z-10" />
        
        <div className="container-swiss flex-1 flex flex-col justify-center relative z-10">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border-2 border-black px-3 py-1 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-2 h-2 bg-[#ff0000] rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Neural Network Primitive v1.0</span>
            </div>

            {/* Headline */}
            <h1 className="text-huge uppercase text-black">
              The<br />
              <span className="text-[#2a45c2]">Percep</span>tron
            </h1>

            {/* Split Layout for Intro */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
              <div className="lg:col-span-7">
                <p className="text-xl md:text-3xl font-medium leading-tight max-w-2xl">
                  The mathematical atom of artificial intelligence. A single algorithm that draws a line in the sand to separate chaos from order.
                </p>
                
                <div className="mt-12 flex flex-wrap gap-8">
                  <AnimatedStat value={1958} label="Est." suffix="" color="black" />
                  <AnimatedStat value={1} label="Layer" suffix="" color="red" />
                  <AnimatedStat value={2} label="Classes" suffix="" color="blue" />
                </div>
              </div>

              {/* Abstract Visual */}
              <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
                 <div className="absolute inset-0 border-2 border-black/10 rotate-3" />
                 <div className="absolute inset-0 border-2 border-black/10 -rotate-2" />
                 <BrainCircuit strokeWidth={0.5} className="w-64 h-64 text-[#2a45c2] opacity-80" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* 2. MATHEMATICS */}
      <SwissSection id="mathematics" title="The Math" accent="blue">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <p className="text-2xl font-serif leading-relaxed">
                "It is a linear classifier. It takes input, weights it, and fires if the threshold is met."
              </p>
              
              <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(42,69,194,0.2)]">
                <MathBlock
                  formula="f(x) = \begin{cases} 1 & \text{if } \mathbf{w} \cdot \mathbf{x} + b > 0 \\ -1 & \text{otherwise} \end{cases}"
                  description="The Rosenblatt Activation Function"
                />
              </div>
            </div>

            <div className="grid gap-4">
              <ComponentCard 
                symbol="w" 
                title="Weights" 
                desc="The memory of the neuron. Determines the importance of inputs." 
                color="blue"
              />
              <ComponentCard 
                symbol="x" 
                title="Inputs" 
                desc="Raw data vector fed into the system." 
                color="black"
              />
              <ComponentCard 
                symbol="b" 
                title="Bias" 
                desc="The activation threshold offset. Allows the boundary to shift." 
                color="red"
              />
            </div>
          </div>
        </ScrollReveal>
      </SwissSection>

      {/* 3. INTERACTIVE DIAGRAM */}
      <SwissSection id="interactive" title="Visualization">
        <ScrollReveal>
           <BentoBox className="border-none shadow-none bg-transparent p-0">
              <InteractiveDiagram
                title="Interactive Decision Boundary"
                description="Manipulate the linear equation below. See how weights rotate the line, and bias shifts it."
              />
           </BentoBox>
        </ScrollReveal>
      </SwissSection>

      {/* 4. TRAINING ALGORITHM */}
      <SwissSection id="training-rule" title="Algorithm" accent="red">
        <ScrollReveal>
          <div className="space-y-12">
            <div className="max-w-3xl">
              <p className="text-lg text-text-muted mb-4 font-mono uppercase tracking-widest">How it learns</p>
              <h3 className="text-4xl md:text-5xl font-bold leading-none mb-8">
                Error Correction <br/> Learning Rule
              </h3>
            </div>
            
            <TrainingAlgorithm />

            <div className="mt-24 pt-12 border-t-2 border-dashed border-black/20">
              <h3 className="font-bold text-2xl uppercase tracking-widest mb-8 text-[#2a45c2]">
                Capabilities
              </h3>
              <AndOrDemo />
            </div>
          </div>
        </ScrollReveal>
      </SwissSection>

      {/* 5. TRAINING LAB (Full Width) */}
      <section id="training-lab" className="py-24 bg-black text-white relative overflow-hidden">
        {/* Background Grid for Dark Mode feel */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="container-swiss relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/20 pb-8">
            <div>
              <div className="flex items-center gap-2 text-[#ff0000] mb-2">
                <Zap className="w-5 h-5 fill-current" />
                <span className="font-mono text-sm uppercase">Live Simulation</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                Training Lab
              </h2>
            </div>
            <p className="text-white/60 max-w-md text-right font-mono text-xs mt-4 md:mt-0">
              // GENERATE DATA<br/>
              // ADJUST LEARNING RATE<br/>
              // OBSERVE CONVERGENCE
            </p>
          </div>

          <TrainingLab />
        </div>
      </section>


{/* 6. NEW: OPTIMIZATION (GRADIENT DESCENT) */}
      <SwissSection id="optimization" title="Optimization" accent="blue">
        <ScrollReveal>
          <div className="space-y-12">
             <div className="flex flex-col lg:flex-row gap-8 items-start">
               <div className="flex-1">
                 <div className="flex items-center gap-2 text-[#2a45c2] mb-4">
                    <Mountain className="w-6 h-6" />
                    <span className="font-bold uppercase tracking-widest text-sm">Gradient Descent</span>
                 </div>
                 <h3 className="text-4xl font-bold leading-tight mb-6">
                   Walking Down the <br/> Error Mountain
                 </h3>
                 <p className="text-lg leading-relaxed text-gray-700">
                   How does the network know <i>how</i> to change weights to reduce error? Imagine standing on a foggy mountain (the loss landscape) and taking a step in the steepest direction downwards.
                 </p>
               </div>
               <div className="flex-1 bg-muted p-6 border-l-4 border-black">
                 <p className="font-mono text-sm mb-2 font-bold">The Difference:</p>
                 <ul className="space-y-2 text-sm">
                   <li className="flex gap-2"><span className="text-[#2a45c2] font-black">BATCH:</span> Careful, calculated steps. Slow but smooth.</li>
                   <li className="flex gap-2"><span className="text-[#ff0000] font-black">SGD:</span> Drunk, erratic steps. Fast, chaotic, but gets the job done.</li>
                 </ul>
               </div>
             </div>

             <GradientDescentVis />
          </div>
        </ScrollReveal>
      </SwissSection>

      {/* 7. XOR LIMITATION */}
      <SwissSection id="xor-limitation" title="Fatal Flaw" accent="red">
        <ScrollReveal>
          <XorProblem />
        </ScrollReveal>
      </SwissSection>

      {/* 7. BEYOND */}
      <SwissSection id="future" title="The Future">
        <ScrollReveal>
          <div className="space-y-12">
            <p className="text-2xl md:text-4xl font-black leading-tight max-w-4xl">
              "The perceptron was the spark. <span className="text-[#2a45c2] underline decoration-4 decoration-[#ff0000]">Deep Learning</span> is the fire."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
              <FutureCard 
                title="MLP" 
                subtitle="Multi-Layer Perceptron"
                desc="Stacking perceptrons allows for non-linear decision boundaries, solving the XOR problem."
                icon={<Network />}
              />
              <FutureCard 
                title="Backprop" 
                subtitle="1986 Breakthrough"
                desc="The algorithm that allows errors to flow backward through layers to update weights."
                icon={<ArrowDown className="rotate-180" />}
                className="md:border-l-2 md:border-r-2 border-black"
              />
              <FutureCard 
                title="Deep Nets" 
                subtitle="The Modern Era"
                desc="Billions of parameters. Transformers. LLMs. All built on this simple mathematical foundation."
                icon={<BrainCircuit />}
              />
            </div>
          </div>
        </ScrollReveal>
      </SwissSection>

      {/* FOOTER */}
      <footer className="bg-[#2a45c2] text-white py-24">
        <div className="container-swiss">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
               <h2 className="text-huge leading-[0.8] font-black opacity-30 select-none">
                 END
               </h2>
            </div>
            <div className="space-y-4 font-mono text-sm text-white/80">
              <p>Designed for educational purposes.</p>
              <div className="flex gap-4 uppercase font-bold text-white">
                <a href="https://github.com/himanshuraimau" className="hover:underline decoration-2 decoration-[#ff0000]">Github</a>
                <a href="https://x.com/himanshura_i" className="hover:underline decoration-2 decoration-[#ff0000]">X</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// --- Local Components for cleaner Page.tsx ---

function ComponentCard({ symbol, title, desc, color }: { symbol: string, title: string, desc: string, color: 'blue'|'red'|'black' }) {
  const bg = color === 'blue' ? 'bg-[#2a45c2]' : color === 'red' ? 'bg-[#ff0000]' : 'bg-black'
  return (
    <div className="flex group">
      <div className={`${bg} text-white w-16 flex items-center justify-center text-2xl font-serif italic group-hover:w-20 transition-all duration-300`}>
        {symbol}
      </div>
      <div className="flex-1 border-y-2 border-r-2 border-black p-4 bg-white">
        <h4 className="font-bold uppercase tracking-widest text-xs mb-1 text-gray-500">{title}</h4>
        <p className="font-medium">{desc}</p>
      </div>
    </div>
  )
}

function FutureCard({ title, subtitle, desc, icon, className="" }: any) {
  return (
    <div className={`p-8 hover:bg-black hover:text-white transition-colors duration-300 group ${className}`}>
      <div className="mb-6 opacity-50 group-hover:opacity-100 group-hover:text-[#ff0000] transition-colors">
        {icon}
      </div>
      <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{title}</h3>
      <p className="font-mono text-xs uppercase tracking-widest mb-4 opacity-70 border-b pb-2 inline-block border-current">{subtitle}</p>
      <p className="text-sm leading-relaxed opacity-80">{desc}</p>
    </div>
  )
}