'use client';

import { motion } from "framer-motion";

export default function ModernLoader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[200px]">
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary shadow-[0_0_15px_#6a25f4]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Ring (Reverse) */}
        <motion.div
          className="absolute inset-3 rounded-full border-2 border-neon-lime/20 border-b-neon-lime shadow-[0_0_10px_#ccff00]"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Logo Pulse */}
        <motion.div
          className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_20px_#6a25f4]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="font-black text-white text-xs">R</span>
        </motion.div>
      </div>

      {/* Typing Text Effect */}
      <motion.div
        className="flex space-x-1 h-6"
        initial="hidden"
        animate="visible"
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            className="text-primary font-mono text-sm tracking-widest uppercase font-bold"
            variants={{
              hidden: { opacity: 0, y: 5 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.1, delay: index * 0.1 }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
        <motion.span
          className="w-2 h-4 bg-neon-lime inline-block ml-1"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
