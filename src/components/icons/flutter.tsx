import React from "react";
import { SVGProps } from "./types";

export const FlutterIcon = React.forwardRef<SVGElement, SVGProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <svg
        {...props}
        width={size || 16}
        height={size || 16}
        fill="currentColor"
        className={className}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="15.383 18.316 18.744 15.042 27.093 15.042 19.697 22.438 15.383 18.316 15.383 18.316 15.383 18.316 15.383 18.316 15.383 18.316"
          fill="#40d0fd"
        />
        <polygon
          points="4.907 16.125 9.106 20.424 27.093 2.287 18.744 2.287 4.907 16.125"
          fill="#41d0fd"
        />
        <polygon
          points="11.176 22.479 15.435 26.675 19.697 22.438 15.383 18.316 11.176 22.479"
          fill="#1fbcfd"
        />
        <polygon
          points="15.435 26.675 19.697 22.438 26.989 29.813 18.593 29.813 15.435 26.675"
          fill="#095a9d"
        />
        <polygon
          points="15.435 26.675 19.406 25.354 18.068 24.057 15.435 26.675"
          fill="#0e5199"
        />
      </svg>
    );
  }
);

FlutterIcon.displayName = "FlutterIcon";

export const FlutterColorLessIcon = React.forwardRef<SVGElement, SVGProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <svg
        {...props}
        width={size || 16}
        height={size || 16}
        fill="currentColor"
        className={className}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline points="15.383 18.316 18.744 15.042 27.093 15.042 19.697 22.438 15.383 18.316 15.383 18.316 15.383 18.316 15.383 18.316 15.383 18.316" />
        <polygon points="4.907 16.125 9.106 20.424 27.093 2.287 18.744 2.287 4.907 16.125" />
        <polygon points="11.176 22.479 15.435 26.675 19.697 22.438 15.383 18.316 11.176 22.479" />
        <polygon points="15.435 26.675 19.697 22.438 26.989 29.813 18.593 29.813 15.435 26.675" />
        <polygon points="15.435 26.675 19.406 25.354 18.068 24.057 15.435 26.675" />
      </svg>
    );
  }
);

FlutterColorLessIcon.displayName = "FlutterColorLessIcon";
