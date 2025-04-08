import React from "react";
import { SVGProps } from "./types";

export const MotionIcon = React.forwardRef<SVGElement, SVGProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <svg
        {...props}
        width={size || 16}
        height={size || 16}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 154 54"
      >
        <path
          d="M 58.148 0 L 27.72 53.952 L 0 53.952 L 23.759 11.824 C 27.442 5.294 36.633 0 44.288 0 Z M 126.125 13.488 C 126.125 6.039 132.33 0 139.985 0 C 147.64 0 153.845 6.039 153.845 13.488 C 153.845 20.937 147.64 26.976 139.985 26.976 C 132.33 26.976 126.125 20.937 126.125 13.488 Z M 63.345 0 L 91.065 0 L 60.638 53.952 L 32.918 53.952 Z M 96.085 0 L 123.805 0 L 100.046 42.128 C 96.363 48.659 87.172 53.952 79.517 53.952 L 65.657 53.952 Z"
          fill="#fff42b"
          fillRule="evenodd"
        />
      </svg>
    );
  }
);

MotionIcon.displayName = "MotionIcon";