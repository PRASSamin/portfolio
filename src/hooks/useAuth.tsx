"use client";
import { signOut as SO, SignOutParams, signIn } from "next-auth/react";
import { withSignout } from "@/utils/withSignout";
import React from "react";

export const useAuth = () => {
  const signOut = ({
    loading,
    ...params
  }: SignOutParams & {
    loading?: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    withSignout({
      async fn() {
        loading?.(true);
        await SO(params);
        loading?.(false);
      },
    });
  };

  return { signOut, signIn };
};
