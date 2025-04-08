"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-8 text-center border border-white/20">
      {/* Animated Warning Icon */}
      <motion.div
        className="flex justify-center mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 8 }}
      >
        <svg
          className="h-20 w-20 text-rose-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5zm1 14h-2v-2h2zm0-4h-2V7h2z"></path>
        </svg>
      </motion.div>

      {/* Title */}
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        Access Denied
      </motion.h1>

      {/* Message */}
      <motion.p
        className="text-gray-300 text-sm sm:text-lg mt-3 sm:mt-4 leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        You do not have permission to access this page. Please contact an
        administrator if you believe this is an error.
      </motion.p>

      {/* Animated Warning Box */}
      <motion.div
        className="p-3 sm:p-4 mt-4 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Unauthorized users are restricted from viewing this content.
      </motion.div>

      {/* Redirect Button */}
      <motion.div
        className="mt-6 sm:mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        <button
          onClick={() => router.push("/")}
          className="bg-rose-500 hover:bg-rose-600 transition-all duration-300 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg"
        >
          Return to Home
        </button>
      </motion.div>
    </div>
  );
}
