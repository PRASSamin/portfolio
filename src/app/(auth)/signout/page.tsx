"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { AnimatedButton } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const [isLogouting, setIsLogouting] = useState<boolean>(false);
  const { signOut } = useAuth();
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!isLoaded ? (
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 rounded-xl shadow-xl p-8 max-w-md w-full border border-border"
        >
          {!isSignedIn ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Already Signed Out
              </h1>
              <p className="text-muted-foreground mb-6">
                You’re not signed in. Want to head back?
              </p>
              <AnimatedButton
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => router.push("/")}
                className="bg-purple-600 text-foreground font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-300"
              >
                Go Home
              </AnimatedButton>
            </motion.div>
          ) : (
            <>
              {/* Title */}
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-3xl font-bold text-foreground text-center mb-4"
              >
                Sign Out
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-muted-foreground text-center mb-8"
              >
                Are you sure you want to sign out? We’ll miss you!
              </motion.p>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                {/* Sign Out Button */}
                <AnimatedButton
                  whileHover={{
                    scale: 1.05,
                  }}
                  onClick={async () => {
                    setIsLogouting(true);
                    await signOut({ callbackUrl: "/" });
                    setIsLogouting(false);
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  disabled={isLogouting}
                  className={cn(
                    "bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors duration-300 overflow-hidden",
                    isLogouting
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-pink-700"
                  )}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={isLogouting ? "signing-out" : "sign-out"}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="flex items-center whitespace-nowrap"
                    >
                      {isLogouting ? (
                        <>
                          Signing Out
                          <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        </>
                      ) : (
                        "Sign Out"
                      )}
                    </motion.span>
                  </AnimatePresence>
                </AnimatedButton>

                {/* Cancel Button */}
                <AnimatedButton
                  whileHover={{
                    scale: 1.05,
                  }}
                  onClick={() => router.replace("/")}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300"
                >
                  Cancel
                </AnimatedButton>
              </div>
            </>
          )}
          {/* Subtle Glow Animation */}
          <motion.div
            className="absolute inset-0 -z-10 bg-black  backdrop-blur  rounded-xl"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
