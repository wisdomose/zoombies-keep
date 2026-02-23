import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { Play, RotateCcw, Home } from "lucide-react";

export function PauseMenu() {
  const { isPaused, togglePause, resetGame, startGame } = useGameStore();

  if (!isPaused) return null;

  const handleRestart = () => {
    startGame();
    togglePause(false);
  };

  const handleMainMenu = () => {
    resetGame();
    togglePause(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-sm w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center gap-8 shadow-2xl"
        >
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase italic">
              Paused
            </h2>
            <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-[10px]">
              Tactical observation in progress
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => togglePause(false)}
              className="flex items-center justify-center gap-3 w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-blue-50 transition-colors active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              RESUME
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-3 w-full bg-white/10 text-white font-black py-4 rounded-2xl hover:bg-white/20 transition-colors active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              RESTART
            </button>

            <button
              onClick={handleMainMenu}
              className="flex items-center justify-center gap-3 w-full bg-transparent text-white/40 font-black py-4 rounded-2xl hover:text-white transition-colors active:scale-95"
            >
              <Home className="w-5 h-5" />
              MAIN MENU
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
