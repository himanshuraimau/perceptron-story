"use client";

import { useEffect, useRef } from "react";

interface MathBlockProps {
  formula: string;
  display?: boolean;
  description?: string;
  className?: string;
}

export function MathBlock({
  formula,
  display = true,
  description,
  className = "",
}: MathBlockProps) {
  const mathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mathRef.current) {
      import("katex").then((katex) => {
        if (mathRef.current) {
          katex.default.render(formula, mathRef.current, {
            displayMode: display,
            throwOnError: false,
          });
        }
      });
    }
  }, [formula, display]);

  return (
    <div className={`w-full ${className}`}>
      {/* 
         1. overflow-x-auto: Allows the math to scroll on small screens instead of breaking layout 
         2. no-scrollbar: Optional utility if you want to hide the scrollbar (requires custom css)
      */}
      <div
        ref={mathRef}
        className={`${display ? "w-full overflow-x-auto py-2" : "inline"}`}
      />

      {description && (
        <p className="text-sm font-medium text-gray-500 mt-3 text-center font-sans">
          {description}
        </p>
      )}
    </div>
  );
}
