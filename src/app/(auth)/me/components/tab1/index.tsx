"use client";

import { User } from "@/types";
import BasicProfileInfo from "./BasicProfileInfo";
import UsernameInfo from "./UsernameInfo";
import ConnectedAccountInfo from "./ConnectedAccountInfo";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Tab1({ active, user }: { active: number; user: User }) {
  const { isSignedIn, isLoaded } = useUser();
  const {signOut} = useAuth()

  return (
    <div className="bg-background/50 w-full min-h-[calc(100vh-3.5rem)] md:min-h-screen max-h-screen overflow-auto p-6">
      <h2 className="text-3xl font-semibold">
        Welcome, {user?.first_name || "User"}!
      </h2>
      <p className="text-muted-foreground mt-2">
        Here you can manage your profile details.
      </p>

      {!isLoaded ? (
        <div className="w-full min-h-[75vh] flex items-center justify-center">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      ) : isSignedIn && user ? (
        <div className="mt-6 space-y-6">
          <hr />
          <BasicProfileInfo user={user} />
          <hr />
          <UsernameInfo user={user} />
          <hr />
          <ConnectedAccountInfo user={user} />
          <hr />
          <div data-id="signout" className="mt-4 mb-6">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              Sign Out
            </h2>
            <button
              onClick={() => signOut({callbackUrl: "/"})}
              className="px-3 py-1.5 text-[13px] text-yellow-600 rounded-md hover:bg-yellow-600/5 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-300 mt-4"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full min-h-[75vh] flex flex-col items-center justify-center text-center">
          <Link href="/signin" className="hover:underline text-sm font-medium">
            Sign in to manage your profile
          </Link>
        </div>
      )}
    </div>
  );
}
