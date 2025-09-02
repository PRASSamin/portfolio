"use client";
import {
  Instagram,
  GitHub,
  Twitter,
  LinkedIn,
  Facebook,
  Email,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const socialHandles = [
    {
      name: "Github",
      link: "https://github.com/PRASSamin",
      icon: GitHub,
      color: "#fff",
    },
    {
      name: "Instagram",
      link: "https://instagram.com/imprassamin/",
      icon: Instagram,
      color: "#E1306C",
    },
    {
      name: "Facebook",
      link: "https://facebook.com/prassamin7/",
      icon: Facebook,
      color: "#1877F2",
    },
    {
      name: "Twitter",
      link: "https://twitter.com/prassamin78",
      icon: Twitter,
      color: "#1DA1F2",
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/prassamin/",
      icon: LinkedIn,
      color: "#0A66C2",
    },
    {
      name: "Email",
      link: "mailto:prassamin@gmail.com",
      icon: Email,
      color: "#EA4335",
    },
  ];
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  return (
    <div
      className="flex flex-col items-start justify-center gap-7"
      style={{ height: `${height - 64}px` }}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-6xl font-black">
          PRAS{" "}
          <span className="tracking-tight inline from-theme-primary to-theme-secondary bg-clip-text text-transparent bg-linear-to-b">
            Samin
          </span>
        </h1>
        <h2 className="text-xl md:text-4xl">Software Developer</h2>
        <p className="w-full lg:w-1/2 md:text-lg text-muted-foreground">
          I&apos;m a developer who loves to build. My passion is creating
          digital tools that are not just functional, but genuinely improve how
          people work and interact. I actively contribute to open source
          projects on platforms like npm, and within communities such as linux,
          always aiming to make a positive impact.
        </p>
      </div>
      <div className="relative p-[3px] rounded-sm transition-all duration-1000 group after:rounded-sm after:-z-10 after:absolute after:w-full after:inset-0 after:p-[3px] after:bg-linear-to-r after:from-theme-primary after:to-theme-secondary before:absolute before:inset-0 before:m-auto before:rounded-sm before:-z-10 before:transition-all before:duration-300 before:bg-linear-to-r before:from-theme-primary before:to-theme-secondary before:blur-lg hover:before:blur-xs">
        <button
          onClick={() => window.open("/resume.pdf", "_blank")}
          className="text-md py-2.5 px-3 rounded-sm border-none bg-black text-white cursor-pointer shadow-[2px_2px_3px_#000000b4]"
        >
          Resume
        </button>
      </div>
      <div className="flex items-center gap-5 flex-wrap">
        {socialHandles.map(({ name, link, icon: Icon, color }) => {
          const AnimatedIcon = motion.create(Icon);
          return (
            <a href={link} target="_blank" rel="noopener noreferrer" key={name}>
              <motion.div
                className="relative inline-block"
                whileHover="hover"
                initial="initial"
              >
                <AnimatedIcon
                  variants={{
                    initial: {},
                    hover: {
                      color: color,
                      transition: {
                        duration: 0.2,
                        delay: 0.15,
                        ease: "easeInOut",
                      },
                    },
                  }}
                  className={`text-muted-foreground`}
                />
                {/* Falling meteor effect */}
                <motion.div
                  className="absolute top-1 left-3 z-50"
                  style={{
                    width: "6px",
                    height: "20px",
                    borderRadius: "50% 50% 0 0",
                    background: `linear-gradient(to bottom, ${color}, transparent)`,
                    boxShadow: `0 0 8px ${color}, 0 0 15px ${color}`,
                  }}
                  variants={{
                    initial: {
                      x: "100vw",
                      opacity: 0.9,
                      scale: 0.8,
                      rotate: -90,
                    },
                    hover: {
                      x: 0,
                      opacity: 1,
                      scale: 1.2,
                      transition: {
                        duration: 0.2,
                        ease: "easeOut",
                        scale: { duration: 0.1, delay: 0.15 },
                      },
                      transitionEnd: { opacity: 0, scale: 1.5 },
                    },
                  }}
                />
              </motion.div>
              <span className="sr-only">{name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSection;
