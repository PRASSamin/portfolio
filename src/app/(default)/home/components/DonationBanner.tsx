"use client";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const DonationBanner = () => {
  return (
    <Link href="/donate" className="block w-full mt-10 mb-10 group relative">
      <div className="relative w-full rounded-[32px] overflow-hidden border border-white/5 bg-[#0f0f11] p-10 md:p-14 shadow-2xl transition-all duration-500 hover:border-white/10 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
        
        {/* Buttery Smooth Mesh Gradient Base */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-1000 mix-blend-screen"
            style={{
              background: `
                radial-gradient(circle at 10% 0%, var(--theme-primary) 0%, transparent 60%),
                radial-gradient(circle at 90% 100%, var(--theme-secondary) 0%, transparent 60%),
                radial-gradient(circle at 50% 50%, var(--theme-primary) 0%, transparent 50%)
              `,
              filter: "blur(60px)",
              transform: "scale(1.2)"
            }}
          />
        </div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-10">
          <div className="flex-1 md:pr-10 z-20">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
              Support the <br />
              <span className="text-white/50">journey</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-medium max-w-lg leading-snug">
              I spend my free time building tools, writing open-source code, and creating content. If my work helps you, consider fueling the next project.
            </p>
          </div>
          
          {/* Floating Object on Right (mimicking the 3D shape) */}
          <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-10">
             <motion.div 
               animate={{ y: [-15, 15, -15], rotate: [-5, 5, -5] }}
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
               className="relative"
             >
               <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full scale-150" />
               <Coffee 
                 className="w-56 h-56 text-white/90 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                 strokeWidth={1}
               />
             </motion.div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DonationBanner;
