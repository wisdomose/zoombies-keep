import { Pause } from "lucide-react";
import { ScoreDisplay } from "./ScoreDisplay";
import { HealthBar } from "./HealthBar";
import { LevelDisplay } from "./LevelDisplay";
import { useGameStore } from "../../store/gameStore";

export function HUD() {
  const score = useGameStore((state) => state.score);
  const highScore = useGameStore((state) => state.highScore);
  const baseHealth = useGameStore((state) => state.baseHealth);
  const level = useGameStore((state) => state.level);
  const togglePause = useGameStore((state) => state.togglePause);

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none p-3 md:p-8 z-10">
      <div className="md:hidden pointer-events-auto mb-3 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-3 min-w-0 text-[10px] font-black uppercase tracking-wider text-white/85">
          <span className="whitespace-nowrap">Base {Math.ceil(baseHealth)}%</span>
          <span className="h-3 w-px bg-white/25" />
          <span className="whitespace-nowrap">Level {level}</span>
          <span className="h-3 w-px bg-white/25" />
          <span className="whitespace-nowrap">Score {score.toLocaleString()}</span>
          <span className="h-3 w-px bg-white/25" />
          <span className="whitespace-nowrap text-white/60">
            Best {highScore.toLocaleString()}
          </span>
        </div>

        <button
          type="button"
          aria-label="Pause game"
          onClick={() => togglePause(true)}
          className="shrink-0 rounded-lg border border-white/20 bg-white/10 p-2 text-white active:scale-95"
        >
          <Pause className="h-4 w-4" />
        </button>
      </div>

      <div className="hidden md:flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <HealthBar current={baseHealth} max={100} />
          <LevelDisplay level={level} />
        </div>
        <div className="flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => togglePause(true)}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-black tracking-wide text-white/80 uppercase hover:text-white"
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>
          <ScoreDisplay score={score} highScore={highScore} />
        </div>
      </div>
    </div>
  );
}
