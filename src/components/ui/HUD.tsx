import { ScoreDisplay } from "./ScoreDisplay";
import { HealthBar } from "./HealthBar";
import { LevelDisplay } from "./LevelDisplay";
import { useGameStore } from "../../store/gameStore";

export function HUD() {
  const score = useGameStore((state) => state.score);
  const highScore = useGameStore((state) => state.highScore);
  const baseHealth = useGameStore((state) => state.baseHealth);
  const level = useGameStore((state) => state.level);

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none p-4 md:p-8 z-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <HealthBar current={baseHealth} max={100} />
          <LevelDisplay level={level} />
        </div>
        <ScoreDisplay score={score} highScore={highScore} />
      </div>
    </div>
  );
}
