import { useGameStore, BOUNDARY_X, BOUNDARY_Z } from "../../store/gameStore";

export function Spawner() {
  const spawnAlly = useGameStore((state) => state.spawnAlly);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    // Spawn roughly where the user clicked on the spawner plane
    spawnAlly([e.point.x, 0.05, e.point.z]);
  };

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
}
