"use client";
import {
  Instagram,
  X,
  GitHub,
  LinkedIn,
  Facebook,
  WhatsApp,
  Telegram,
} from "@mui/icons-material";
import { Discord } from "../../../../components/icons";
import { cn } from "@/utils";
import Link from "next/link";
import { motion, useInView } from "framer-motion"; // Fixed import
import { useRef } from "react";

const SocialSection = () => {
  const socialHandles = [
    {
      name: "Github",
      icon: GitHub,
      link: "https://github.com/PRASSamin",
      className: "bg-gray-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      link: "https://facebook.com/prassamin7/",
      className: "bg-blue-600",
    },
    {
      name: "Twitter",
      icon: X,
      link: "https://twitter.com/prassamin78",
      className: "bg-sky-600",
    },
    {
      name: "Whatsapp",
      icon: WhatsApp,
      link: `/wa/${encodeURIComponent("Hello There")}`,
      className: "bg-green-600",
    },
    {
      name: "LinkedIn",
      icon: LinkedIn,
      link: "https://www.linkedin.com/in/prassamin/",
      className: "bg-sky-600",
    },
    {
      name: "Discord",
      icon: Discord,
      link: "https://discord.gg/JF9uCS3Sy8",
      className: "bg-indigo-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      link: "https://instagram.com/imprassamin/",
      className: "bg-rose-600",
    },
    {
      name: "Telegram",
      icon: Telegram,
      link: "https://t.me/prassamin",
      className: "bg-sky-600",
    },
  ];

  const socialContainerRef = useRef<HTMLDivElement | null>(null);
  const socialHeaderRef = useRef<HTMLDivElement | null>(null);
  const isInSocialContainer = useInView(socialContainerRef, {
    once: false,
    amount: 0.2,
  });
  const isInSocialHeader = useInView(socialHeaderRef, {
    once: true,
    amount: 0.2,
  });

  // Animation variants for the header
  const socialHeaderVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Animation variants for the absolute background element
  const socialBackgroundVariants = {
    hidden: { rotate: 0 },
    visible: {
      rotate: -6,
      transition: {
        duration: 0.09,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      ref={socialHeaderRef}
      initial="hidden"
      animate={isInSocialHeader ? "visible" : "hidden"}
      variants={socialHeaderVariants}
      data-section="social"
      className="flex flex-col gap-12 mt-24 xl:mt-28 w-[calc(100vw-2rem)] lg:container mx-auto"
    >
      <div className="flex flex-col gap-1 items-center">
        <h3
          data-type="title"
          className="text-center text-4xl lg:text-6xl font-semibold text-foreground"
        >
          Explore{" "}
          <span className="tracking-tight inline bg-clip-text text-transparent bg-gradient-to-b from-[#6FEE8D] to-[#17c964]">
            My
          </span>{" "}
          Online{" "}
          <span className="tracking-tight inline bg-clip-text text-transparent bg-gradient-to-b from-[#FF705B] to-[#FFB457]">
            Nexus
          </span>
        </h3>
        <p
          data-type="description"
          className="text-muted-foreground text-sm lg:text-base text-center"
        >
          Discover my presence across platforms and explore a world of
          creativity and inspiration.
        </p>
      </div>
      <motion.div
        ref={socialContainerRef}
        initial="hidden"
        animate={isInSocialContainer ? "visible" : "hidden"}
        className="flex flex-wrap select-none items-center justify-center gap-4"
      >
        {socialHandles.map((handler) => (
          <Link
            target="_blank"
            href={handler.link}
            key={handler.name}
            className="relative group"
          >
            <motion.div
              variants={socialBackgroundVariants}
              className={cn(
                "group-hover:!rotate-0 group-hover:!opacity-100 transition-all duration-300 bg-transparent rounded-xl absolute inset-0 z-[-1]",
                handler?.className
              )}
            />
            <div className="flex justify-center items-center gap-2.5 p-4 bg-background/50 group-hover:bg-transparent backdrop-blur rounded-xl shadow-lg hover:shadow-xl z-10 transition-all duration-300 border">
              <handler.icon size={18} className="text-primary" />
              <h4 className="text-base font-medium text-foreground">
                {handler.name}
              </h4>
            </div>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SocialSection;
