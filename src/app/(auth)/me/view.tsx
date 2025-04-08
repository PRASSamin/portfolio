"use client";
import { useState } from "react";
import { Menu, CircleUserRound } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useMobile";
import { navItems } from "@/components/nav";
import Link from "next/link";
import { cn } from "@/utils";
import { User } from "@/types";
import Tab1 from "./components/tab1";

const UserProfileView = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row items-start justify-start w-full min-h-screen relative">
      {/* Mobile Menu Button */}
      <div className="h-14 bg-muted w-full flex items-center justify-start px-4 py-2.5 md:hidden">
        <button
          className="flex gap-2 text-lg items-center justify-center h-full px-3 rounded-md font-semibold hover:text-purple-600 hover:bg-muted-foreground/10 focus-within:ring-2 focus-within:ring-muted-foreground/30 transition-all duration-300"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={18} />
          Menu
        </button>
      </div>

      {/* Sidebar Navigation*/}
      <motion.div
        initial={{ x: isMobile ? "-100%" : "0%" }}
        animate={{ x: isMobile ? (isOpen ? "0%" : "-100%") : "0%" }}
        transition={{ stiffness: 200, damping: 20 }}
        className={`bg-muted min-h-screen w-64 md:w-80 fixed top-0 left-0 md:static md:flex flex-col shadow-lg z-50  px-4 py-6`}
      >
        <div className="w-full relative">
          <h1 className="text-2xl font-bold">Account</h1>
          <p className="text-muted-foreground text-[13px]">
            Manage your account info.
          </p>
        </div>
        <ul className="flex flex-col mt-5 gap-0.5">
          <button>
            <li
              className={cn(
                "flex gap-2 px-2 py-2 items-center text-sm hover:text-purple-600 rounded-md hover:bg-muted-foreground/10 focus-within:ring-2 focus-within:ring-muted-foreground/30 transition-all duration-300",
                activeTab === 0 ? "text-purple-600 bg-muted-foreground/10" : ""
              )}
            >
              <CircleUserRound size={18} /> Profile
            </li>
          </button>
          {navItems.map((i) => (
            <Link key={i.name} href={i.href}>
              <li className="flex gap-2 px-2 py-2 items-center text-sm hover:text-purple-600 rounded-md hover:bg-muted-foreground/5 focus-within:ring-2 focus-within:ring-muted-foreground/30 transition-all duration-300">
                <i.icon size={18} /> {i.name}
              </li>
            </Link>
          ))}
        </ul>
      </motion.div>

      {/* Overlay (Click Outside to Close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Tab1 active={activeTab} user={user} />
    </div>
  );
};

export default UserProfileView;
