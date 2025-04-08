import React from "react";
import { SVGProps } from "./types";

export const MusicIcon = React.forwardRef<SVGElement, SVGProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <svg
        width={size || 16}
        height={size || 16}
        fill="none"
        className={className}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M9 18V5l12-2v13" />
        <path d="m9 9 12-2" />
        <circle cx={6} cy={18} r={3} />
        <circle cx={18} cy={16} r={3} />
      </svg>
     
    );
  }
);

MusicIcon.displayName = "MusicIcon";