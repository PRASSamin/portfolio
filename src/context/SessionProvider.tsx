"use client";
import { SessionProvider as SP } from "next-auth/react";
import React from "react";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <SP>{children}</SP>;
};
