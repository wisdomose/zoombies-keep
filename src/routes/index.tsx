import { createFileRoute } from "@tanstack/react-router";
import { GameScene } from "../components/game/GameScene";
import { HUD } from "../components/ui/HUD";
import { GameOverOverlay } from "../components/ui/GameOverOverlay";
import { useGameStore } from "../store/gameStore";
import { MainMenu } from "../components/ui/MainMenu";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const status = useGameStore((state) => state.status);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* 3D Game Canvas */}
      <GameScene />

      {/* Modern UI Layer */}
      {status === "menu" ? <MainMenu /> : <HUD />}
      <GameOverOverlay />
    </div>
  );
}
