import React from "react";
import { useGLTF } from "@react-three/drei";
import { useGameStore, BOUNDARY_Z } from "../../store/gameStore";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { getMeshInfo } from "../../utils/gltf";
import { parseEntityId } from "../../utils/collision";
import { Haptics } from "../../utils/haptics";
import type { GLTFResult } from "../../types/gltf";

export const Base = React.memo(function Base() {
  const damageBase = useGameStore((state) => state.damageBase);
  const removeEnemy = useGameStore((state) => state.removeEnemy);
  const { nodes, materials } = useGLTF(
    "/assets/Models/GLB%20format/crypt.glb",
  ) as GLTFResult;

  return (
    <group position={[0, 0, BOUNDARY_Z - 2]}>
      {/* Sensor for detecting enemies reaching base */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        sensor
        onIntersectionEnter={(payload) => {
          const name = payload.other.rigidBodyObject?.name;
          const enemyId = name ? parseEntityId(name, "enemy-") : null;
          if (enemyId) {
            damageBase(10);
            Haptics.heavy();
            removeEnemy(enemyId, false); // No points for enemies reaching base
          }
        }}
      >
        <CuboidCollider args={[8, 2, 2]} position={[0, 1, 0]} />
        <group position={[0, 0, 0]} scale={8}>
          <mesh
            castShadow
            receiveShadow
            {...getMeshInfo(nodes, materials, "crypt")}
          />
        </group>
      </RigidBody>
    </group>
  );
});

useGLTF.preload("/assets/Models/GLB%20format/crypt.glb");
