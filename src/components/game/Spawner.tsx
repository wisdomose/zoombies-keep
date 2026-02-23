import React from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { useGameStore, BOUNDARY_X, BOUNDARY_Z } from "../../store/gameStore";

export const Spawner = React.memo(function Spawner() {
  const spawnAlly = useGameStore((state) => state.spawnAlly);

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    spawnAlly([e.point.x, 0.05, e.point.z]);
  }

  return (
    <mesh
      position={[0, 0.1, BOUNDARY_Z - 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerDown={handlePointerDown}
    >
      <planeGeometry args={[BOUNDARY_X * 2, 6]} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </mesh>
  );
});
