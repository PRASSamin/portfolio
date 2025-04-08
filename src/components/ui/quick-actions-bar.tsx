import { cn } from "@/utils";
import React, { CSSProperties, useEffect, useState } from "react";

interface ExcludeWidthBreakpoints {
  /** Default width applied when no breakpoints match. */
  default?: number;
  /** Applied at screen width ≥ 475px */
  xs?: number;
  /** Applied at screen width ≥ 640px */
  sm?: number;
  /** Applied at screen width ≥ 768px */
  md?: number;
  /** Applied at screen width ≥ 1024px */
  lg?: number;
  /** Applied at screen width ≥ 1280px */
  xl?: number;
  /** Applied at screen width ≥ 1536px */
  "2xl"?: number;
  /** Applied at screen width ≥ 1920px */
  "3xl"?: number;
}

interface QuickActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "style"> {
  /** The child elements to be rendered inside the component. */
  children?: React.ReactNode;
  /** Vertical alignment of the bar (top, center, or bottom). */
  verticalAlignment?: "top" | "center" | "bottom";
  /** Horizontal alignment of the bar (left, center, or right). */
  horizontalAlignment?: "left" | "center" | "right";
  /** The side that has an excluded width (typically when placed next to a sidebar). */
  side?: "left" | "right";
  /** Width to exclude in pixels, either as a fixed number or per breakpoint. */
  excludeWidth?: number | ExcludeWidthBreakpoints;
}

const BREAKPOINTS = {
  default: 0,
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;

const QuickActionsBar: React.FC<QuickActionsProps> = ({
  children,
  verticalAlignment = "bottom",
  horizontalAlignment = "center",
  side,
  excludeWidth = 0,
  className,
  ...props
}) => {
  const [excludeWidthPx, setExcludeWidthPx] = useState(0);

  useEffect(() => {
    const updateExcludeWidth = () => {
      const width = window.innerWidth;

      if (typeof excludeWidth === "number") {
        setExcludeWidthPx(excludeWidth);
        return;
      }

      let currentWidth = excludeWidth.default ?? 0;
      for (const key in BREAKPOINTS) {
        if (
          key !== "default" &&
          width >= BREAKPOINTS[key as keyof typeof BREAKPOINTS] &&
          excludeWidth[key as keyof ExcludeWidthBreakpoints] !== undefined
        ) {
          currentWidth = excludeWidth[key as keyof ExcludeWidthBreakpoints]!;
        }
      }

      setExcludeWidthPx(currentWidth);
    };

    updateExcludeWidth();
    window.addEventListener("resize", updateExcludeWidth);
    return () => window.removeEventListener("resize", updateExcludeWidth);
  }, [excludeWidth]);

  const getPositionStyles = (): CSSProperties => {
    const offset = excludeWidthPx / 2;
    const baseStyles: CSSProperties = {
      maxWidth:
        excludeWidthPx > 0 ? `calc(100% - ${excludeWidthPx}px)` : undefined,
    };

    if (!side || excludeWidthPx === 0) {
      return {
        ...baseStyles,
        left:
          horizontalAlignment === "center"
            ? "50%"
            : horizontalAlignment === "left"
            ? "1rem"
            : undefined,
        right: horizontalAlignment === "right" ? "1rem" : undefined,
        transform:
          horizontalAlignment === "center" ? "translateX(-50%)" : undefined,
      };
    }

    return {
      ...baseStyles,
      left:
        side === "left"
          ? horizontalAlignment === "center"
            ? `calc(50% + ${offset}px)`
            : horizontalAlignment === "left"
            ? `calc(${excludeWidthPx}px + 1rem)`
            : undefined
          : horizontalAlignment === "center"
          ? `calc(50% - ${offset}px)`
          : horizontalAlignment === "left"
          ? "1rem"
          : undefined,
      right:
        side === "right"
          ? horizontalAlignment === "right"
            ? `calc(${excludeWidthPx}px + 1rem)`
            : undefined
          : horizontalAlignment === "right"
          ? "1rem"
          : undefined,
      transform:
        horizontalAlignment === "center" ? "translateX(-50%)" : undefined,
    };
  };

  const lockedStyles: CSSProperties = {
    position: "fixed",
    zIndex: 50,
    ...getPositionStyles(),
    ...(verticalAlignment === "top" && { top: "1rem" }),
    ...(verticalAlignment === "center" && {
      top: "50%",
      transform: `${
        getPositionStyles().transform ?? ""
      } translateY(-50%)`.trim(),
    }),
    ...(verticalAlignment === "bottom" && { bottom: "1rem" }),
  };

  return (
    <div
      {...props}
      style={lockedStyles}
      className={cn(
        "px-4 py-3 flex gap-2 items-center rounded-xl shadow-lg bg-muted-foreground/10 backdrop-blur-md border border-white/20",
        className
      )}
    >
      {children}
    </div>
  );
};

export default QuickActionsBar;
