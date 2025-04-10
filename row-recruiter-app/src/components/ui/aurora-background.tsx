"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  showRadialGradient?: boolean;
}) => {
  return (
    <main>
      <div
        className={cn(
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-blue-950",
          className
        )}
        {...props}>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            "--wave-1": "repeating-linear-gradient(45deg, #3b82f6 0%, #60a5fa 10%, #93c5fd 20%, #60a5fa 30%, #3b82f6 40%)",
            "--wave-2": "repeating-linear-gradient(45deg, #1e40af 0%, #2563eb 10%, #3b82f6 20%, #2563eb 30%, #1e40af 40%)",
            "--wave-3": "repeating-linear-gradient(45deg, #1e3a8a 0%, #1e40af 10%, #2563eb 20%, #1e40af 30%, #1e3a8a 40%)",
          } as React.CSSProperties}>
          <div
            className={cn(
              `pointer-events-none absolute inset-0 opacity-30 blur-[2px] will-change-transform`,
              `[background-image:var(--wave-1)] [background-size:200%_200%] animate-wave-1`,
              `after:absolute after:inset-0 after:opacity-20 after:blur-[3px] after:will-change-transform`,
              `after:[background-image:var(--wave-2)] after:[background-size:200%_200%] after:animate-wave-2`,
              `before:absolute before:inset-0 before:opacity-10 before:blur-[4px] before:will-change-transform`,
              `before:[background-image:var(--wave-3)] before:[background-size:200%_200%] before:animate-wave-3`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_50%_50%,black_40%,transparent_70%)]`
            )}
          />
        </div>
        {children}
      </div>
    </main>
  );
}; 