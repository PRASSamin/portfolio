"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export const useUser = () => {
  const { data: session, status, update } = useSession();
  const { signOut } = useAuth();
  const router = useRouter();

  const isLoaded = status !== "loading";
  const isSignedIn = status === "authenticated" && !!session?.user;

  // Update user details
  const updateUser = async (
    updates: Partial<{
      first_name: string;
      last_name: string;
      avatar: string;
      username: string;
    }>
  ) => {
    try {
      if (!session?.user) throw new Error("User not authenticated");

      const full_name = [
        updates.first_name || session.user.first_name,
        updates.last_name || session.user.last_name,
      ].join(" ");

      const { data: user } = await axios.put(
        "/api/auth/user",
        { ...updates, full_name },
        {
          headers: {
            "Content-Type": "application/json",
            "x-user-id": session.user.id,
          },
        }
      );

      await update({ user });
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  };

  // Check username availability
  const isUsernameAvailable = async (username: string) => {
    if (!username) throw new Error("Username is required");
    try {
      const { data } = await axios.get(`/api/auth/user`, {
        params: { username },
      });

      return Array.isArray(data) && data.length === 0;
    } catch (e: any) {
      if (e.response?.status === 404) {
        return true;
      }
      console.error("Error checking username availability:", e);
      return false;
    }
  };

  // Delete user account
  const deleteUser = async () => {
    try {
      if (!session?.user) throw new Error("User not authenticated");

      await axios.delete("/api/auth/user", {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session.user.id,
        },
      });

      signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return null;
    }
  };

  // Reload session data
  const reloadSession = async () => {
    await update();
    router.refresh();
  };

  const user: User = useMemo(
    () =>
      isSignedIn
        ? {
            ...session!.user,
            update: updateUser,
            delete: deleteUser,
            reload: reloadSession,
          }
        : null,
    [session, isSignedIn]
  );

  return {
    isLoaded,
    isSignedIn,
    user,
    updateUser,
    deleteUser,
    reloadSession,
    isUsernameAvailable,
  };
};
