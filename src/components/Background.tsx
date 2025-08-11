import React from "react";

const Background = () => {
  return (
    <>
      {/* Gradient Blob 1 */}
      <div
        className="fixed top-0 -left-1/4 w-[500px] bg-gradient-1 h-[500px] rounded-full z-0 hue-rotate-60 animate-grad-travel brightness-150 "
        style={
          {
            // filter: "blur(100px)",
          }
        }
      />
      {/* Gradient Blob 2 */}
      <div
        className="fixed -top-1/4 lg:-top-[15%] -right-1/4 lg:-right-[10%] w-[600px] bg-gradient-2 h-[600px] rounded-full z-0 rotate-12"
        style={
          {
            // filter: "blur(120px)",
          }
        }
      />
      {/* Gradient Blob 3 */}
      <div
        className="fixed -bottom-1/4 -left-1/3 lg:-bottom-[10%] lg:-left-[10%] bg-gradient-3 w-[500px] h-[500px] rounded-full z-0"
        style={
          {
            // filter: "blur(100px)",
          }
        }
      />
      {/* Glassmorphism Overlay */}
      <div className="w-full backdrop-blur-[100px] bg-black/50 fixed top-0 left-0 h-screen z-1" />
    </>
  );
};

export default Background;
