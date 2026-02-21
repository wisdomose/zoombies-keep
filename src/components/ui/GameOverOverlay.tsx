import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { RefreshCcw, Trophy, Target } from "lucide-react";

export function GameOverOverlay() {
  const { score, highScore, status, resetGame, startGame } = useGameStore();

  if (status !== "gameover") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-100 p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center gap-8 shadow-[0_0_100px_rgba(239,68,68,0.2)]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30"
          >
            <Trophy className="w-10 h-10 text-yellow-500" />
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tight uppercase italic">
              Game Over
            </h1>
            <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-[10px]">
              Better luck next time, commander
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-1 text-center">
              <Target className="w-5 h-5 text-red-500 mb-2 opacity-50 mx-auto" />
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                Final Score
              </span>
              <span className="text-2xl font-black text-white tabular-nums">
                {score}
              </span>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-1 text-center">
              <Trophy className="w-5 h-5 text-yellow-500 mb-2 opacity-50 mx-auto" />
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                Best Score
              </span>
              <span className="text-2xl font-black text-white tabular-nums">
                {highScore}
              </span>
            </div>
          </div>

          <button
            onClick={() => startGame()}
            className="group relative w-full overflow-hidden rounded-2xl bg-white px-8 py-5 transition-transform active:scale-95"
          >
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-10" />
            <div className="flex items-center justify-center gap-3">
              <RefreshCcw className="w-5 h-5 text-black group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-lg font-black text-black">
                DEPLOY AGAIN
              </span>
            </div>
          </button>

          <button
            onClick={() => resetGame()}
            className="text-white/20 hover:text-white/40 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Return to menu
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
