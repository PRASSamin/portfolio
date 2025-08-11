"use client";
import {
  Gmail,
  Cheers,
  Discord,
  Football,
  Plane,
  Music,
  Gamepad,
  ClapperBoard,
} from "@/components/icons";
import { WhatsApp } from "@mui/icons-material";
import { Link } from "@/components/Link";
import { User } from "lucide-react";
import { cn } from "@/utils";
import ProgrammerAnimation from "@/components/ProgrammerAnim";
import { useInView, motion, Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";

const AboutMeSection = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const Interests: {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string;
  }[] = [
    {
      name: "Movie",
      icon: ClapperBoard,
      className: "bg-red-700 border-red-700/90",
    },
    {
      name: "Music",
      icon: Music,
      className: "bg-green-700 border-green-700/90",
    },
    {
      name: "Gaming",
      icon: Gamepad,
      className: "bg-blue-700 border-blue-700/90",
    },
    {
      name: "Conversation",
      icon: Discord,
      className: "bg-indigo-700 border-indigo-700/90",
    },
    {
      name: "Travel",
      icon: Plane,
      className: "bg-orange-700 border-orange-700/90",
    },
    {
      name: "Football",
      icon: Football,
      className: "bg-fuchsia-700 border-fuchsia-700/90",
    },
  ];
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      data-section="aboutme"
      className="flex flex-col gap-20 md:gap-0 md:justify-evenly w-[calc(100vw-2rem)] lg:container mx-auto pt-10 md:pt-0"
      style={{ minHeight: `${height - 64}px` }}
    >
      <div className="flex flex-col gap-1 items-center">
        <h3
          data-type="title"
          className="text-center text-4xl lg:text-6xl font-semibold text-foreground"
        >
          <span className="from-theme-primary to-theme-secondary text-4xl lg:text-6xl bg-clip-text text-transparent bg-linear-to-b">
            About
          </span>{" "}
          Me
        </h3>
        <p
          data-type="description"
          className="text-muted-foreground text-sm lg:text-base text-center"
        >
          Discover who I am, my story, and what inspires my journey through life
          and work.
        </p>
      </div>
      <div
        data-type="content"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <div className="flex flex-col gap-5 justify-center">
          <p>
            Hey there! I&apos;m <span className="font-bold">PRAS Samin</span>, a
            dedicated developer who loves bringing ideas to life through code.
            My focus is on creating digital tools that are intuitive for users
            and efficient for developers. I enjoy tackling diverse challenges,
            from crafting web applications to building strong backend systems
            and automating complex processes. I&apos;m also deeply committed to
            the open source community, contributing to platforms like npm, PyPI,
            and the Linux ecosystem, always aiming to share knowledge and make a
            positive impact.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 font-medium">
              <User size={24} />
              <Link href="/">
                <h1>PRAS Samin</h1>
              </Link>
            </div>
            <div className="flex gap-3 font-medium">
              <Gmail className="grayscale" size={24} />
              <Link
                aria-label="Email PRAS Samin"
                href="mailto:prassamin@gmail.com"
              >
                <h2>prassamin@gmail.com</h2>
              </Link>
            </div>
            <div className="flex gap-3 font-medium">
              <WhatsApp />
              <Link
                aria-label="Contact PRAS Samin"
                href={`/wa/${encodeURIComponent("Hello There")}`}
              >
                +880 1322-122109
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">My Interests</h2>
            <div className="flex flex-wrap gap-3">
              {Interests.map(({ name, icon: Icon, className }, index) => (
                <div
                  key={index}
                  className={cn(`rounded-full border`, className)}
                >
                  <span className="flex items-center gap-2 bg-black/75 backdrop-blur-sm px-4 py-1 rounded-full capitalize font-medium">
                    <Icon />
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ProgrammerAnimation />
        </div>
      </div>
    </motion.div>
  );
};

export default AboutMeSection;
