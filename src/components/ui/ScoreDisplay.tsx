import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreDisplayProps {
  score: number;
  highScore?: number;
}

export function ScoreDisplay({ score, highScore }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (displayScore < score) {
        setDisplayScore((prev) =>
          Math.min(prev + Math.ceil((score - prev) / 10), score),
        );
      } else if (displayScore > score) {
        setDisplayScore(score);
      }
    }, 20);
    return () => clearTimeout(timeout);
  }, [score, displayScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl ml-auto md:ml-0 min-w-40"
    >
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold leading-none">
        Total Score
      </span>
      <div className="flex flex-col gap-1">
        <motion.span
          key={score}
          initial={{ scale: 1.2, color: "#60a5fa" }}
          animate={{ scale: 1, color: "#ffffff" }}
          className="text-4xl font-black tabular-nums leading-none"
        >
          {displayScore.toLocaleString()}
        </motion.span>
        {highScore !== undefined && (
          <div className="flex justify-between items-center opacity-40">
            <span className="text-[8px] uppercase tracking-widest font-black">
              BEST
            </span>
            <span className="text-[10px] font-black tabular-nums">
              {highScore.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
