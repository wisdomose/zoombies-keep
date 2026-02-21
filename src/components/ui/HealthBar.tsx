import { motion } from "framer-motion";

interface HealthBarProps {
  current: number;
  max: number;
}

export function HealthBar({ current, max }: HealthBarProps) {
  const percentage = Math.max(0, (current / max) * 100);

  // Dynamic color based on health percentage
  const getColor = () => {
    if (percentage > 50) return "#22c55e"; // Green
    if (percentage > 20) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl w-full md:grow md:max-w-[280px]"
    >
      <div className="flex justify-between items-end gap-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold whitespace-nowrap">
          Base Integrity
        </span>
        <span className="text-sm font-black text-white tabular-nums whitespace-nowrap">
          {Math.ceil(current)} / {max}
        </span>
      </div>

      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: "100%" }}
          animate={{
            width: `${percentage}%`,
            backgroundColor: getColor(),
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full relative shadow-[0_0_10px_rgba(34,197,94,0.3)]"
        >
          {percentage < 30 && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-white/30"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
