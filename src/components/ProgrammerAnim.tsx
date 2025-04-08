"use client";
import { Component } from "react";
import Lottie from "react-lottie";
import animationData from "../animations/programmer.json";
class ProgrammerAnimation extends Component {
  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      renderer: "svg",
    };
    return (
      <Lottie
        isClickToPauseDisabled={true}
        options={defaultOptions}
        height={500}
        width={500}
      />
    );
  }
}
export default ProgrammerAnimation;
