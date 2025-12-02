"use client"

export function AccessibilitySkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed top-4 left-4 z-50 bg-[#ff0000] text-white px-4 py-2 font-bold uppercase text-sm"
    >
      Skip to main content
    </a>
  )
}
