import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import { Loader2 } from "lucide-react";
import { useProgress } from "@react-three/drei";

export function SplashScreen() {
  const exitSplash = useGameStore((state) => state.exitSplash);
  const { progress, active } = useProgress();

  const isLoading = active || progress < 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => !isLoading && exitSplash()}
      className={`fixed inset-0 z-200 flex flex-col items-center justify-center bg-[#050505] p-6 overflow-hidden transition-all duration-700 ${
        isLoading ? "cursor-wait" : "cursor-pointer"
      }`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(147,51,234,0.3)] border border-purple-400/20 overflow-hidden">
            <img
              src="/favicon.jpg"
              alt="Wisdom Ose Icon"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-4">
            <h1 className="text-7xl font-black text-white tracking-tighter italic leading-[0.8]">
              ZOOMBIE
            </h1>
            <h1 className="text-7xl font-black text-purple-500 tracking-tighter italic leading-[0.8]">
              KEEP
            </h1>
          </div>

          <p className="text-zinc-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-12">
            A Wisdom Ose Production
          </p>

          {/* Progress Bar Container */}
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4 relative border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute inset-y-0 left-0 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            />
          </div>

          <div className="flex items-center gap-3 mb-16">
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Initializing Assets... {Math.round(progress)}%
                </span>
              </>
            ) : (
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Systems Ready
              </span>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-white font-black text-xs tracking-[0.2em] uppercase bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm shadow-xl"
            >
              Click to Enter
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-12 left-12 w-12 h-12 border-t-2 border-l-2 border-zinc-800" />
      <div className="absolute top-12 right-12 w-12 h-12 border-t-2 border-r-2 border-zinc-800" />
      <div className="absolute bottom-12 left-12 w-12 h-12 border-b-2 border-l-2 border-zinc-800" />
      <div className="absolute bottom-12 right-12 w-12 h-12 border-b-2 border-r-2 border-zinc-800" />
    </motion.div>
  );
}
