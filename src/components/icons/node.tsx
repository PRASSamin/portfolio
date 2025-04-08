import React from "react";
import { SVGProps } from "./types";

export const NodeIcon = React.forwardRef<SVGElement, SVGProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 300"
        width={size || 16}
        height={size || 16}
        className={className}
        {...props}
      >
        <defs>
          <linearGradient
            id="a"
            x1={179.37}
            y1={88.22}
            x2={114.84}
            y2={223.92}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} />
            <stop offset={0.14} stopColor="#040404" />
            <stop offset={0.26} stopColor="#0f0f0f" />
            <stop offset={0.39} stopColor="#222" />
            <stop offset={0.51} stopColor="#3c3c3c" />
            <stop offset={0.63} stopColor="#5f5f5f" />
            <stop offset={0.75} stopColor="#898989" />
            <stop offset={0.86} stopColor="#bbb" />
            <stop offset={0.98} stopColor="#f3f3f3" />
            <stop offset={1} stopColor="#fff" />
          </linearGradient>
          <linearGradient
            id="b"
            x1={70.47}
            y1={150}
            x2={229.53}
            y2={150}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} />
            <stop offset={0.14} />
            <stop offset={0.29} stopColor="#414141" />
            <stop offset={0.45} stopColor="#848484" />
            <stop offset={0.61} stopColor="#b9b9b9" />
            <stop offset={0.74} stopColor="#dfdfdf" />
            <stop offset={0.84} stopColor="#f6f6f6" />
            <stop offset={0.91} stopColor="#fff" />
            <stop offset={1} stopColor="#fff" />
          </linearGradient>
          <linearGradient id="d" x1={139.63} y1={150} x2={304.75} y2={150} />
          <linearGradient
            id="e"
            x1={70.47}
            y1={150}
            x2={229.53}
            y2={150}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#fff" />
            <stop offset={0.09} stopColor="#fff" />
            <stop offset={0.16} stopColor="#f6f6f6" />
            <stop offset={0.26} stopColor="#dfdfdf" />
            <stop offset={0.39} stopColor="#b9b9b9" />
            <stop offset={0.55} stopColor="#848484" />
            <stop offset={0.71} stopColor="#414141" />
            <stop offset={0.86} />
            <stop offset={1} />
          </linearGradient>
          <linearGradient
            id="g"
            x1={-1189.01}
            y1={-873.66}
            x2={-1187.28}
            y2={-873.66}
            gradientTransform="matrix(97.42 0 0 -97.42 115893.25 -84958.96)"
          />
          <mask
            id="c"
            x={64.31}
            y={52.46}
            width={171.39}
            height={195.09}
            maskUnits="userSpaceOnUse"
          >
            <path
              fill="#fff"
              d="M70.47 197.25a8.8 8.8 0 0 0 2.59 2.28l62.47 36.08 10.4 6a8.8 8.8 0 0 0 5.07 1.15 9 9 0 0 0 1.73-.32l76.8-140.62a9 9 0 0 0-2-1.63L179.8 72.65l-25.2-14.5a8.4 8.4 0 0 0-2.28-.91Z"
            />
          </mask>
          <mask
            id="f"
            x={70.47}
            y={57.15}
            width={159.06}
            height={185.69}
            maskUnits="userSpaceOnUse"
          >
            <path
              fill="#fff"
              d="M229.53 197.25a8.8 8.8 0 0 1-2.59 2.28l-62.47 36.08-10.4 6a8.8 8.8 0 0 1-5.07 1.15 9 9 0 0 1-1.73-.32L70.47 101.8a9 9 0 0 1 2-1.63l47.73-27.52 25.2-14.5a8.4 8.4 0 0 1 2.28-.91Z"
            />
          </mask>
          <mask
            id="h"
            x={68.39}
            y={57.1}
            width={163.23}
            height={185.8}
            maskUnits="userSpaceOnUse"
          >
            <path
              fill="url(#a)"
              d="M231.61 107.92a8.77 8.77 0 0 0-4.4-7.61l-72.8-42a8.79 8.79 0 0 0-8.8 0l-72.82 42a8.77 8.77 0 0 0-4.4 7.61V192a8.8 8.8 0 0 0 4.39 7.62l72.83 42.06a8.81 8.81 0 0 0 8.8 0l72.81-42.06a8.8 8.8 0 0 0 4.39-7.62Z"
            />
          </mask>
          <mask
            id="i"
            x={64.31}
            y={52.46}
            width={171.39}
            height={195.09}
            maskUnits="userSpaceOnUse"
          >
            <path
              fill="url(#b)"
              d="M70.47 197.25a8.8 8.8 0 0 0 2.59 2.28l62.47 36.08 10.4 6a8.8 8.8 0 0 0 5.07 1.15 9 9 0 0 0 1.73-.32l76.8-140.62a9 9 0 0 0-2-1.63L179.8 72.65l-25.2-14.5a8.4 8.4 0 0 0-2.28-.91Z"
            />
            <g mask="url(#c)">
              <path
                fill="url(#d)"
                d="m154.63 246.31 76.45-44.17a9.23 9.23 0 0 0 4.61-8v-88.32a9.23 9.23 0 0 0-4.61-8l-76.45-44.13a9.29 9.29 0 0 0-9.24 0L68.92 97.82a9.23 9.23 0 0 0-4.61 8v88.32a9.23 9.23 0 0 0 4.61 8l76.47 44.17a9.24 9.24 0 0 0 9.24 0"
              />
            </g>
          </mask>
          <mask
            id="j"
            x={70.47}
            y={57.15}
            width={159.06}
            height={185.69}
            maskUnits="userSpaceOnUse"
          >
            <path
              fill="url(#e)"
              d="M229.53 197.25a8.8 8.8 0 0 1-2.59 2.28l-62.47 36.08-10.4 6a8.8 8.8 0 0 1-5.07 1.15 9 9 0 0 1-1.73-.32L70.47 101.8a9 9 0 0 1 2-1.63l47.73-27.52 25.2-14.5a8.4 8.4 0 0 1 2.28-.91Z"
            />
            <g mask="url(#f)">
              <path fill="url(#g)" d="M70.76 57.15h158.47v185.69H70.76z" />
            </g>
          </mask>
        </defs>
        <path
          fill="#3f873f"
          d="m145.61 58.28-72.82 42a8.77 8.77 0 0 0-4.4 7.61V192a8.8 8.8 0 0 0 4.39 7.62l72.83 42.06a8.81 8.81 0 0 0 8.8 0l72.81-42.06a8.8 8.8 0 0 0 4.39-7.62v-84.08a8.77 8.77 0 0 0-4.4-7.61l-72.8-42a8.79 8.79 0 0 0-8.8 0"
        />
        <g mask="url(#h)">
          <path
            fill="#6abf4b"
            d="m145.61 58.28-72.82 42a8.77 8.77 0 0 0-4.4 7.61V192a8.8 8.8 0 0 0 4.39 7.62l72.83 42.06a8.81 8.81 0 0 0 8.8 0l72.81-42.06a8.8 8.8 0 0 0 4.39-7.62v-84.08a8.77 8.77 0 0 0-4.4-7.61l-72.8-42a8.79 8.79 0 0 0-8.8 0"
          />
        </g>
        <g mask="url(#c)">
          <path
            fill="#3f873f"
            d="m154.63 246.31 76.45-44.17a9.23 9.23 0 0 0 4.61-8v-88.32a9.23 9.23 0 0 0-4.61-8l-76.45-44.13a9.29 9.29 0 0 0-9.24 0L68.92 97.82a9.23 9.23 0 0 0-4.61 8v88.32a9.23 9.23 0 0 0 4.61 8l76.47 44.17a9.24 9.24 0 0 0 9.24 0"
          />
        </g>
        <g mask="url(#i)">
          <path
            fill="#6abf4b"
            d="m154.63 246.31 76.45-44.17a9.23 9.23 0 0 0 4.61-8v-88.32a9.23 9.23 0 0 0-4.61-8l-76.45-44.13a9.29 9.29 0 0 0-9.24 0L68.92 97.82a9.23 9.23 0 0 0-4.61 8v88.32a9.23 9.23 0 0 0 4.61 8l76.47 44.17a9.24 9.24 0 0 0 9.24 0"
          />
        </g>
        <g mask="url(#f)">
          <path fill="#3f873f" d="M70.76 57.15h158.47v185.69H70.76z" />
        </g>
        <g mask="url(#j)">
          <path fill="#6abf4b" d="M70.76 57.15h158.47v185.69H70.76z" />
        </g>
      </svg>
    );
  }
);

NodeIcon.displayName = "NodeIcon";
