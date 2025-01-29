"use client";

import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="w-[200px] h-[60px] relative z-[9999]">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          style={
            index === 1
              ? { left: "45%", animationDelay: ".1s" }
              : index === 2
              ? {
                  left: "auto",
                  right: "15%",
                  animationDelay: ".3s",
                }
              : {}
          }
          className="w-5 h-5 absolute rounded-full bg-foreground left-[15%] origin-center animate-[circle7124_0.5s_alternate_infinite_ease]"
        />
      ))}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          style={
            index === 1
              ? { left: "45%", animationDelay: ".2s" }
              : index === 2
              ? {
                  left: "auto",
                  right: "15%",
                  animationDelay: ".3s",
                }
              : {}
          }
          className="w-5 h-1 rounded-full bg-background absolute top-16 origin-center -z-10 left-[15%] animate-[shadow046_0.5s_alternate_infinite_ease]"
        />
      ))}
    </div>
  );
};

export default LoadingAnimation;
