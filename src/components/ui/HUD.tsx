import { ScoreDisplay } from "./ScoreDisplay";
import { HealthBar } from "./HealthBar";
import { useGameStore } from "../../store/gameStore";

export function HUD() {
  const score = useGameStore((state) => state.score);
  const baseHealth = useGameStore((state) => state.baseHealth);

  return (
    <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between z-10">
      {/* Top Row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <HealthBar current={baseHealth} max={100} />
        <ScoreDisplay score={score} />
      </div>
    </div>
  );
}
