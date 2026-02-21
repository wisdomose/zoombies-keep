import { useGameStore, BOUNDARY_Z } from "../../store/gameStore";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";

export function Base() {
  const damageBase = useGameStore((state) => state.damageBase);
  const removeEnemy = useGameStore((state) => state.removeEnemy);
  const { nodes, materials } = useGLTF(
    "/assets/Models/GLB%20format/crypt.glb",
  ) as any;

  return (
    <group position={[0, 0, BOUNDARY_Z - 2]}>
      {/* Sensor for detecting enemies reaching base */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        sensor
        onIntersectionEnter={(payload) => {
          if (payload.other.rigidBodyObject?.name?.startsWith("enemy-")) {
            const enemyId = payload.other.rigidBodyObject.name.replace(
              "enemy-",
              "",
            );
            console.log(
              `Enemy ${enemyId} reached base! Dealing damage and removing.`,
            );
            damageBase(10);
            removeEnemy(enemyId, false); // No points for enemies reaching base
          }
        }}
      >
        <CuboidCollider args={[8, 2, 2]} position={[0, 1, 0]} />
        <group position={[0, 0, 0]} scale={8}>
          <mesh
            castShadow
            receiveShadow
            geometry={
              nodes["crypt"]?.geometry ||
              (Object.values(nodes) as any[]).find((n) => n.geometry)?.geometry
            }
            material={materials["*"] || Object.values(materials)[0]}
          />
        </group>
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/assets/Models/GLB%20format/crypt.glb");
