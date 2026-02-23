import React from "react";
import { useGameStore } from "../../store/gameStore";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { parseEntityId } from "../../utils/collision";

export const MultiplierZones = React.memo(function MultiplierZones() {
  const zones = useGameStore((state) => state.zones);
  const spawnAlly = useGameStore((state) => state.spawnAlly);

  return (
    <>
      {zones.map((zone) => (
        <group key={zone.id} position={zone.position}>
          <RigidBody
            type="fixed"
            sensor
            onIntersectionEnter={(payload) => {
              const allyId = payload.other.rigidBodyObject?.name
                ? parseEntityId(payload.other.rigidBodyObject.name, "ally-")
                : null;

              if (allyId) {
                // Use getState() to avoid re-rendering the component when allies change
                const ally = useGameStore
                  .getState()
                  .allies.find((a) => a.id === allyId);

                // Only multiply if the ally can multiply
                if (ally && ally.canMultiply !== false) {
                  const pos = payload.other.rigidBody?.translation();
                  if (pos) {
                    for (let i = 0; i < zone.multiplier - 1; i++) {
                      spawnAlly(
                        [pos.x + (Math.random() - 0.5), 1, pos.z + 0.5],
                        false, // Multiplied ghosts shouldn't multiply
                      );
                    }
                  }
                }
              }
            }}
          >
            <CuboidCollider args={[zone.width / 2, 0.5, 1]} />
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[zone.width, 0.2, 2]} />
              <meshStandardMaterial color="#4ade80" transparent opacity={0.6} />
            </mesh>
          </RigidBody>
        </group>
      ))}
    </>
  );
});
