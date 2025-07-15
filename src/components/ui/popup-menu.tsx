"use client";

import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Transition } from "react-transition-group";
import { cn } from "@/utils";

type PopupMenuContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
};

const PopupMenuContext = React.createContext<PopupMenuContextType | null>(null);

export function PopupMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  return (
    <PopupMenuContext.Provider value={{ open, setOpen, position, setPosition }}>
      {children}
    </PopupMenuContext.Provider>
  );
}

export const PopupMenuTrigger = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const context = React.useContext(PopupMenuContext);
  if (!context)
    throw new Error("PopupMenuTrigger must be used within PopupMenu");
  const { setOpen, setPosition } = context;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <div className={cn(className)} onClick={handleClick}>
      {children}
    </div>
  );
};

export const PopupMenuContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const context = React.useContext(PopupMenuContext);
  if (!context)
    throw new Error("PopupMenuContent must be used within PopupMenu");
  const { open, position, setOpen } = context;

  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  return createPortal(
    <Transition
      in={open}
      timeout={150}
      unmountOnExit
      nodeRef={nodeRef} 
    >
      {(state) => (
        <div
          ref={nodeRef}
          className={cn(
            // Base styles
            "absolute z-50 min-w-[8rem] rounded-md border bg-popover p-1 shadow-md",
            // Transition properties
            "transition-all duration-150 ease-out",
            // Animation states
            state === "entering" && "opacity-0 scale-50",
            state === "entered" && "opacity-100 scale-100",
            state === "exiting" && "opacity-0 scale-50",
            state === "exited" && "opacity-0 scale-50",
            className
          )}
          style={{ left: position.x, top: position.y, state:  }}
        >
          {children}
        </div>
      )}
    </Transition>,
    document.body
  );
};

export const PopupMenuItem = ({
  children,
  onSelect,
  className,
  disabled = false,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
  className?: string;
  disabled?: boolean;
}) => {
  const context = React.useContext(PopupMenuContext);
  if (!context) throw new Error("PopupMenuItem must be used within PopupMenu");
  const { setOpen } = context;

  const handleClick = () => {
    if (disabled) return;
    onSelect?.();
    setOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
};
