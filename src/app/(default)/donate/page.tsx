"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Coffee, Heart, Loader2, Sparkles, Gift } from "lucide-react";
import { toast } from "sonner";

const PRESET_AMOUNTS = [
  { value: 5, label: "Coffee", icon: Coffee },
  { value: 10, label: "Lunch", icon: Gift },
  { value: 25, label: "Supporter", icon: Heart },
  { value: 50, label: "Legend", icon: Sparkles },
];

export default function DonatePage() {
  const [amount, setAmount] = useState<number | "">(10);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = amount === "" ? parseFloat(customAmount) : amount;

    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      toast.error("Please select or enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, name, email, message }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden selection:bg-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="container relative z-10 max-w-2xl mx-auto px-4"
      >
        <div className="text-center space-y-6 mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
              Support My Work
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto leading-relaxed">
              If my open-source projects or content helped you, consider leaving
              a tip. Every bit helps me keep shipping cool things!
            </p>
          </div>
        </div>

        <form
          onSubmit={handleDonate}
          className="relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 md:p-10 shadow-2xl overflow-hidden"
        >
          {/* Subtle glow inside the card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative space-y-8">
            {/* Amount Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground ml-1">
                Select Amount
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRESET_AMOUNTS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = amount === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        setAmount(preset.value);
                        setCustomAmount("");
                      }}
                      className={`group relative flex flex-col items-center justify-center gap-2 py-5 rounded-2xl transition-all duration-300 ease-out overflow-hidden
                        ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                            : "bg-background/50 hover:bg-muted border border-border/50 hover:border-border"
                        }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${isSelected ? "text-primary-foreground/90" : "text-muted-foreground group-hover:text-foreground"} transition-colors`}
                      />
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">
                          ${preset.value}
                        </span>
                        <span
                          className={`text-[11px] font-medium tracking-wide uppercase ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                        >
                          {preset.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-4 group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <span className="text-muted-foreground font-medium group-focus-within:text-primary transition-colors">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Or enter a custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount("");
                  }}
                  className="w-full pl-10 pr-5 py-4 rounded-2xl border-2 border-transparent bg-background/50 focus:bg-background ring-1 ring-border/50 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60 font-medium"
                />
              </div>
            </div>

            {/* Optional Details */}
            <div className="space-y-4">
              <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground ml-1">
                Your Details
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-transparent bg-background/50 focus:bg-background ring-1 ring-border/50 focus:ring-primary/30 outline-none transition-all"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-transparent bg-background/50 focus:bg-background ring-1 ring-border/50 focus:ring-primary/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <textarea
                  placeholder="Write a message and share your X/Twitter or LinkedIn URL..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-5 py-4 rounded-2xl border border-transparent bg-background/50 focus:bg-background ring-1 ring-border/50 focus:ring-primary/30 outline-none transition-all resize-none"
                />
                <p className="text-xs text-muted-foreground ml-1">
                  * Please share one of your social media URLs in the message above so I can hyperlink and showcase your support on my page!
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-5 rounded-2xl bg-foreground text-background font-bold text-lg flex items-center justify-center gap-3 overflow-hidden group hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/10"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-background/80" />
              ) : (
                <span>
                  Donate ${amount === "" ? customAmount || "0" : amount}
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
