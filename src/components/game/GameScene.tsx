import { useEffect, Suspense, useMemo } from "react";
import { PCFShadowMap, Fog } from "three";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment } from "./Environment";
import { TownEnvironment } from "./TownEnvironment";
import { Base } from "./Base";
import { Spawner } from "./Spawner";
import { MultiplierZones } from "./MultiplierZones";
import { Ally } from "./Ally";
import { Enemy } from "./Enemy";
import { Graveyard } from "./Graveyard";
import { useGameStore, BOUNDARY_X, BOUNDARY_Z } from "../../store/gameStore";
import { ContactShadows } from "@react-three/drei";
import { ModelFactoryProvider } from "./ModelFactory";

import {
  SPAWN_DELAY_NORMAL_MS,
  SPAWN_DELAY_BOSS_MS,
  NORMAL_PHASE_DURATION_MS,
  BOSS_PHASE_DURATION_MS,
  SPEED_INCREMENT_PER_WAVE,
  SPAWN_DELAY_DECAY_RATE,
  MIN_NORMAL_SPAWN_DELAY_MS,
  MIN_BOSS_SPAWN_DELAY_MS,
} from "../../constants/game";

export function GameScene() {
  const { allies, enemies, spawnEnemy, status } = useGameStore();

  const fog = useMemo(() => new Fog("#050505", 50, 150), []);

  useEffect(() => {
    if (status !== "playing") return;

    let isRunning = true;
    let waveLevel = 1;
    let inBossPhase = false;
    let lastPhaseSwitch = Date.now();

    async function spawnLoop() {
      while (isRunning) {
        const now = Date.now();
        const elapsedSinceSwitch = now - lastPhaseSwitch;

        if (!inBossPhase && elapsedSinceSwitch > NORMAL_PHASE_DURATION_MS) {
          inBossPhase = true;
          lastPhaseSwitch = now;
        } else if (inBossPhase && elapsedSinceSwitch > BOSS_PHASE_DURATION_MS) {
          inBossPhase = false;
          lastPhaseSwitch = now;
          waveLevel++;
        }

        const speedMultiplier = 1 + waveLevel * SPEED_INCREMENT_PER_WAVE;
        const normalDelay = Math.max(
          MIN_NORMAL_SPAWN_DELAY_MS,
          SPAWN_DELAY_NORMAL_MS *
            Math.pow(SPAWN_DELAY_DECAY_RATE, waveLevel - 1),
        );
        const bossDelay = Math.max(
          MIN_BOSS_SPAWN_DELAY_MS,
          SPAWN_DELAY_BOSS_MS * Math.pow(SPAWN_DELAY_DECAY_RATE, waveLevel - 1),
        );

        const spawnCount = inBossPhase
          ? 1
          : Math.min(5, 2 + Math.floor(waveLevel / 2));

        for (let i = 0; i < spawnCount; i++) {
          const randomX = (Math.random() - 0.5) * BOUNDARY_X * 0.9;
          // Add small random offset to Z to prevent perfect overlap if many spawn
          const zOffset = (Math.random() - 0.5) * 2;

          spawnEnemy([randomX, 0.05, -BOUNDARY_Z - 8 + zOffset], {
            isBoss: inBossPhase,
            speedMultiplier,
            waveLevel,
          });
        }

        const delay = inBossPhase ? bossDelay : normalDelay;
        await new Promise<void>((resolve) => setTimeout(resolve, delay));

        if (!isRunning) break;
      }
    }

    spawnLoop();

    return () => {
      isRunning = false;
    };
  }, [status, spawnEnemy]);

  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      camera={{
        position: [0, 50, 60],
        fov: 40,
      }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0, -15);
      }}
      style={{ width: "100%", height: "100%", background: "#050505" }}
    >
      <Suspense fallback={null}>
        <ModelFactoryProvider>
          <primitive object={fog} attach="fog" />
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[10, 30, 20]}
            intensity={2.0}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <Physics gravity={[0, -9.81, 0]}>
            <Environment />
            <TownEnvironment />
            <Graveyard />
            <Base />
            <Spawner />
            <MultiplierZones />

            {allies.map((ally) => (
              <Ally
                key={ally.id}
                id={ally.id}
                position={ally.position}
                strength={ally.strength}
              />
            ))}
            {enemies.map((enemy) => (
              <Enemy
                key={enemy.id}
                id={enemy.id}
                position={enemy.position}
                isBoss={enemy.isBoss}
                speedMultiplier={enemy.speedMultiplier}
              />
            ))}
          </Physics>
        </ModelFactoryProvider>
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={50}
          blur={2}
          far={4.5}
          frames={2}
        />
      </Suspense>
    </Canvas>
  );
}
