# Project Perceptron: Swiss Grid

An interactive educational website explaining the Perceptron algorithm through Swiss design principles and live interactive visualizations.

## Project Overview

This project combines rigorous mathematical explanation with hands-on interactive demonstrations to make machine learning concepts accessible. Built with Next.js 16, React 19, Tailwind CSS 4, and Framer Motion.

## Design Philosophy

**Swiss Grid Design**: Characterized by asymmetric grid layouts, mathematical precision, high contrast black/white/red color scheme, and functional information-driven design with generous whitespace.

- **Color Palette**: White, Black, Red (#FF0000), Blue (#2A45C2), Gray (#E0E0E0)
- **Typography**: Helvetica Neue (sans-serif), JetBrains Mono (monospace)
- **Spacing**: 8px baseline grid, 2-4px thick borders, geometric precision
- **No Decorative Elements**: Pure functional design with mathematical clarity

## Architecture

### Components

#### Educational Components
- **SwissSection**: Semantic section container with sticky side headers
- **BentoBox**: Bordered content containers with optional accent styling
- **MathBlock**: KaTeX-rendered mathematical formulas with styling
- **FormulaBox**: Styled formula containers with descriptions

#### Interactive Components
- **InteractiveDiagram**: Draggable weight/bias sliders with 2D decision boundary visualization
- **AndOrDemo**: Toggle between AND/OR logic gate problems with truth tables
- **TrainingAlgorithm**: Step-by-step breakdown of perceptron learning rule
- **XorProblem**: Visualization of XOR limitation and why it fails

#### Advanced Visualization
- **TrainingLab**: Core interactive simulator with:
  - Real-time 2D visualization with animated decision boundary
  - Step-by-step manual training or auto-train modes
  - Learning rate adjustment controls
  - Weight trajectory tracking plot
  - Error convergence tracking plot
  - Live calculation display

#### Animation Components
- **ScrollReveal**: Fade and slide animations triggered on scroll
- **StaggerContainer**: Staggered animation timing for child elements
- **Navigation**: Fixed header with smooth scroll navigation

### Page Structure (8 Sections)

1. **Hero**: Title, formula, scroll indicator
2. **Introduction**: What is the Perceptron with key facts
3. **Mathematics**: Anatomy broken into 4 components (inputs, weights, bias, activation)
4. **Interactive**: Manual slider-based decision boundary adjustment
5. **Representational Power**: AND/OR gate interactive demos
6. **Training Rule**: Algorithm explanation with formula breakdown
7. **Training Lab**: Full interactive training simulator
8. **XOR Limitation**: Why perceptrons fail on non-linear problems
9. **Beyond**: Evolution to multi-layer networks with architecture diagram

## Key Features

### Interactive Training Simulator
- Generate random linearly separable datasets
- Control learning rate (η) from 0.01 to 1.0
- Manual step-by-step training with "Next Step" button
- Auto-train modes (10 steps or continuous)
- Visual feedback: highlighted points during training
- Real-time decision boundary rotation
- Weight trajectory visualization (2D plot)
- Error convergence tracking (line chart)
- Convergence detection with visual indicator

### Mathematical Accuracy
- Proper perceptron learning rule: `w_new = w_old + η(t - o)x`
- Correct activation function: `sign(w·x + b)`
- Accurate decision boundary calculation
- Step-by-step calculation display

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Skip to main content link
- Keyboard navigation support
- Color contrast ratios meet WCAG AA standards
- Responsive design for mobile, tablet, desktop

### Performance
- Code splitting for heavy components (KaTeX, Framer Motion)
- Optimized SVG visualizations
- Smooth 60fps animations
- Efficient state management
- Preloaded fonts for fast rendering

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12
- **Math Rendering**: KaTeX + react-katex
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Language**: TypeScript

## Getting Started

### Installation

\`\`\`bash
# Clone or download the project
cd perceptron-swiss-grid

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Learning Outcomes

Users will understand:

1. The perceptron's basic mechanism: weighted sum + activation function
2. How the perceptron learns through the learning rule
3. Concepts of linear separability and decision boundaries
4. Limitations of single perceptrons (XOR problem)
5. Why multi-layer networks are necessary
6. The foundation for modern neural networks

## File Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Main scrollytelling page
│   └── globals.css             # Swiss design tokens
├── components/
│   ├── navigation.tsx          # Fixed header navigation
│   ├── accessibility-skip-link.tsx
│   ├── swiss-section.tsx       # Section container
│   ├── bento-box.tsx           # Content boxes
│   ├── math-block.tsx          # KaTeX rendering
│   ├── formula-box.tsx         # Formula containers
│   ├── interactive-diagram.tsx # Interactive sliders
│   ├── and-or-demo.tsx         # AND/OR gate demo
│   ├── training-algorithm.tsx  # Algorithm explanation
│   ├── xor-problem.tsx         # XOR visualization
│   ├── training-lab.tsx        # Main training simulator
│   ├── weight-trajectory-plot.tsx
│   ├── error-convergence-plot.tsx
│   ├── scroll-reveal.tsx       # Scroll animations
│   ├── stagger-container.tsx   # Stagger animations
│   └── animated-stat.tsx       # Number counters
└── public/                     # Static assets
\`\`\`

## Mathematical Concepts Covered

### Perceptron Formula
\`\`\`
f(x) = φ(w·x + b)
\`\`\`
- **w**: Weight vector
- **x**: Input vector
- **b**: Bias term
- **φ**: Activation function (step function)

### Learning Rule
\`\`\`
w_new = w_old + η(t - o)x
b_new = b_old + η(t - o)
\`\`\`
- **η**: Learning rate
- **t**: Target output
- **o**: Predicted output
- **error**: (t - o)

### Decision Boundary
\`\`\`
w·x + b = 0
\`\`\`
Linear equation that separates two classes in 2D.

## Customization

### Modifying Color Palette

Edit `app/globals.css`:
\`\`\`css
:root {
  --accent-red: #ff0000;
  --accent-blue: #2a45c2;
  /* ... */
}
\`\`\`

### Adjusting Training Parameters

Edit `components/training-lab.tsx`:
\`\`\`tsx
const [learningRate, setLearningRate] = useState<number>(0.1)
// Adjust default value or range
\`\`\`

### Adding More Problem Types

Create new component files following the `AndOrDemo.tsx` pattern and add to page.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Metrics

- Lighthouse Score: 95+ (target)
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## Future Enhancements

### Phase 2 (When Requested)
- Perceptron Playground: Full training lab as mentioned in specification
- Custom dataset generation options
- Batch vs. stochastic gradient descent comparison
- 3D gradient descent visualization
- Multi-layer perceptron training demo
- Backpropagation visualization

### Possible Additions
- Dark mode toggle
- Export training history as CSV/JSON
- Comparison modes (different algorithms)
- 3D visualizations with Three.js
- Code snippets in Python/NumPy

## License

Created for educational purposes.

## Credits

Inspired by:
- Swiss design principles (Josef Müller-Brockmann)
- Perceptron research (Frank Rosenblatt, 1958)
- Modern interactive mathematics education
