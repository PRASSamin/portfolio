import React from "react";

const Background = () => {
  return (
    <>
      <div className="fixed top-0 z-0 hue-rotate-60 animate-grad-travel brightness-200">
        <img
          className="w-[500px] shadow-black/5 rounded-large"
          src={"/purple.png"}
          alt="gradient"
        />
      </div>
      <div className="fixed xl:-top-[30%] -right-[60%] 2xl:-top-[60%] 2xl:-right-[45%] z-0 rotate-12">
        <img
          className=" shadow-black/5 rounded-large"
          src={"/pink-purple-grad.png"}
          alt="gradient"
        />
      </div>
      <div className="fixed -bottom-[30%] -left-[30%] z-0 ">
        <img
          className=" shadow-black/5  rounded-large"
          src={"/purple.png"}
          alt="gradient"
        />
      </div>
      <div className="w-full backdrop-blur-[50px] bg-black/50 fixed top-0 left-0 h-screen z-1" />
    </>
  );
};

export default Background;
