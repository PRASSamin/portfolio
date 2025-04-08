import React from "react";
import { SVGProps } from "./types";

export const NextIcon = React.forwardRef<SVGElement, SVGProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <svg
        {...props}
        width={size || 16}
        height={size || 16}
        className={className}
        strokeLinejoin="round"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <rect width="24" height="24" fill="#000" rx={"5"}></rect>
        <g clipPath="url(#clip0_53_108)">
          <path
            d="M15.945 16.5V7.5"
            stroke="url(#paint0_linear_53_108vsxrmxu21)"
            strokeWidth="1.875"
            strokeMiterlimit="1.41421"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.992 7.5013V7.5H7.118V16.5H8.992V10.45197L18.5422 22.0614C19.0679 21.718 19.565 21.3363 20.0295 20.918L8.99246 7.50125L8.992 7.5013Z"
            fill="url(#paint1_linear_53_108vsxrmxu21)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_53_108vsxrmxu21"
            x1="16.695"
            y1="7.5"
            x2="16.695"
            y2="16.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.9140625" stopColor="white" stopOpacity="0.57" />
            <stop offset="1.1953125" stopColor="white" stopOpacity="0" />
            <stop offset="1.5" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_53_108vsxrmxu21"
            x1="14.90625"
            y1="13.59375"
            x2="20.3361"
            y2="20.0998"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <clipPath id="clip0_53_108">
            <rect width="24" height="24" fill="red" />
          </clipPath>
        </defs>
      </svg>
    );
  }
);

NextIcon.displayName = "NextIcon";
