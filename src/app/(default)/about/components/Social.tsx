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
import { Discord } from "@/components/icons";
import { cn } from "@/utils";
import { Link } from "@/components/Link";
import { motion, useInView, Variants } from "motion/react";
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
  const socialHeaderVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Animation variants for the absolute background element
  const socialBackgroundVariants: Variants = {
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
          className="text-center text-4xl lg:text-5xl font-semibold text-foreground"
        >
          Let&apos;s{" "}
          <span className="from-theme-primary to-theme-secondary text-4xl lg:text-6xl bg-clip-text text-transparent bg-linear-to-b">
            Connect
          </span>{" "}
          Online
        </h3>
        <p
          data-type="description"
          className="text-muted-foreground text-sm lg:text-base text-center"
        >
          Explore my profiles and follow my journey across the web.
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
                "absolute inset-0 z-[-1]"
              )}
            >
              <div className={cn("group-hover:!rotate-[6deg] bg-transparent rounded-xl w-full h-full transition-all duration-300", handler?.className)}></div>
            </motion.div>
            <div className="flex justify-center items-center gap-2.5 p-4 bg-background/50 group-hover:bg-transparent backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl z-10 transition-all duration-300 border border-border/50">
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
