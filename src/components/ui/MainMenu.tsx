import { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, Trophy, X } from "lucide-react";

export function MainMenu() {
  const { highScore, startGame } = useGameStore();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Background Glows (Moved outside card to prevent clipping) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-100 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/30 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/30 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl text-center relative"
      >
        <h1 className="text-5xl font-black text-white mb-2 italic flex flex-wrap justify-center gap-x-2">
          ZOOMBIE <span className="text-purple-500">KEEP</span>
        </h1>
        <p className="text-zinc-400 mb-8 font-medium">
          Protect the town from the eternal sleep
        </p>

        <div className="space-y-4 relative z-10">
          <button
            onClick={() => startGame()}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 shadow-lg group"
          >
            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
            START MISSION
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all active:scale-95 border border-zinc-700/50"
          >
            <BookOpen className="w-5 h-5 text-zinc-400" />
            HOW TO PLAY
          </button>
        </div>

        <div className="mt-12 p-5 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                Best Score
              </p>
              <p className="text-2xl font-black text-white tabular-nums">
                {highScore}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="px-3 py-1 bg-zinc-800/50 rounded-lg text-[10px] font-black text-zinc-500 tracking-wider uppercase border border-zinc-800">
              v1.0.4
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-110 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl relative"
            >
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3 tracking-tight italic">
                <BookOpen className="w-8 h-8 text-purple-500" />
                MISSION INTEL
              </h2>

              <div className="space-y-6 text-zinc-300">
                <section>
                  <h3 className="text-zinc-500 font-black mb-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    Objective
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Stop the vampires from reaching the Town Center. Each
                    vampire that enters the crypt damages the town's integrity.
                  </p>
                </section>

                <section>
                  <h3 className="text-zinc-500 font-black mb-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    Multiplying
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Guide your ghosts through the{" "}
                    <span className="text-green-400 font-bold italic">
                      Green Zones
                    </span>{" "}
                    to multiply their numbers. A larger swarm can take down more
                    vampires.
                  </p>
                </section>

                <section>
                  <h3 className="text-zinc-500 font-black mb-2 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    Controls
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                      <span className="block text-[10px] font-black text-zinc-600 mb-1 uppercase tracking-widest">
                        Shoot
                      </span>
                      <span className="text-white font-bold">
                        Space / Click
                      </span>
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                      <span className="block text-[10px] font-black text-zinc-600 mb-1 uppercase tracking-widest">
                        Movement
                      </span>
                      <span className="text-white font-bold">Mouse / Drag</span>
                    </div>
                  </div>
                </section>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-500 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
              >
                UNDERSTOOD
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
