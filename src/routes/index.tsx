import { createFileRoute } from "@tanstack/react-router";
import { GameScene } from "../components/game/GameScene";
import { HUD } from "../components/ui/HUD";
import { GameOverOverlay } from "../components/ui/GameOverOverlay";
import { useGameStore } from "../store/gameStore";
import { MainMenu } from "../components/ui/MainMenu";
import { SplashScreen } from "../components/ui/SplashScreen";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "../components/ErrorBoundary";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const status = useGameStore((state) => state.status);

  return (
    <ErrorBoundary>
      <div className="relative w-full h-dvh overflow-hidden bg-[#050505]">
        {/* 3D Game Canvas */}
        <GameScene />

        {/* Modern UI Layer */}
        <AnimatePresence mode="wait">
          {status === "splash" && <SplashScreen key="splash" />}
          {status === "menu" && <MainMenu key="menu" />}
          {status === "playing" && <HUD key="hud" />}
        </AnimatePresence>
        <GameOverOverlay />
      </div>
    </ErrorBoundary>
  );
}
