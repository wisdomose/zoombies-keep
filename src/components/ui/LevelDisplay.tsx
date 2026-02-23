import { motion } from "framer-motion";

interface LevelDisplayProps {
  level: number;
}

export function LevelDisplay({ level }: LevelDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-1 shadow-2xl"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
        Sector Level
      </span>
      <motion.span
        key={level}
        initial={{ scale: 1.5, color: "#f87171" }}
        animate={{ scale: 1, color: "#ffffff" }}
        className="text-2xl font-black tabular-nums leading-none"
      >
        L-{level.toString().padStart(2, "0")}
      </motion.span>
    </motion.div>
  );
}
