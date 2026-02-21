import { useEffect, useState, Suspense } from "react";
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

export function GameScene() {
  const { allies, enemies, spawnEnemy, status } = useGameStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Basic enemy wave spawner (simplistic loop)
  useEffect(() => {
    if (!isClient || status !== "playing") return;

    const interval = setInterval(() => {
      // Spawn at a random X near the far Z edge (inside graveyard)
      const randomX = (Math.random() - 0.5) * BOUNDARY_X * 0.8;
      spawnEnemy([randomX, 0.05, -BOUNDARY_Z - 8]);
    }, 2000);

    return () => clearInterval(interval);
  }, [status, spawnEnemy, isClient]);

  if (!isClient) return null;

  return (
    <Canvas
      shadows
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
        <fog attach="fog" args={["#050505", 50, 150]} />
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[10, 30, 20]}
          intensity={2.0}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Physics gravity={[0, -9.81, 0]}>
          <Environment />
          <TownEnvironment />
          <Graveyard />
          <Base />
          <Spawner />
          <MultiplierZones />

          {allies.map((ally) => (
            <Ally key={ally.id} id={ally.id} position={ally.position} />
          ))}
          {enemies.map((enemy) => (
            <Enemy key={enemy.id} id={enemy.id} position={enemy.position} />
          ))}
        </Physics>
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={50}
          blur={2}
          far={4.5}
        />
      </Suspense>
    </Canvas>
  );
}
