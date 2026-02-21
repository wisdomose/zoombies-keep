import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { useMemo, useEffect } from "react";
import { useGameStore } from "../../store/gameStore";

export function Enemy({
  id,
  position,
}: {
  id: string;
  position: [number, number, number];
}) {
  const rbRef = useRef<RapierRigidBody>(null);
  const { removeEnemy, damageAlly } = useGameStore();
  const { scene, animations } = useGLTF(
    "/assets/Models/GLB%20format/character-vampire.glb",
  ) as any;

  // Clone the scene for independent animations
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, clone);

  useEffect(() => {
    // Play walk animation
    const walkAnim =
      names.find((n) => n.toLowerCase().includes("walk")) || names[0];
    if (walkAnim && actions[walkAnim]) {
      actions[walkAnim].reset().fadeIn(0.2).play();
    }
    return () => {
      if (walkAnim && actions[walkAnim]) actions[walkAnim].fadeOut(0.2);
    };
  }, [actions, names]);

  useFrame(() => {
    if (rbRef.current) {
      // Enemies move towards positive Z (towards player base)
      rbRef.current.setLinvel({ x: 0, y: 0, z: 4 }, true);

      const pos = rbRef.current.translation();
      if (pos.z > 30) {
        removeEnemy(id);
      }
      if (pos.y < -5) {
        console.warn(`Enemy ${id} fell through ground at`, pos);
        removeEnemy(id);
      }
    }
  });

  return (
    <RigidBody
      ref={rbRef}
      name={`enemy-${id}`}
      position={position}
      type="dynamic"
      colliders={false}
      lockRotations
      onCollisionEnter={(payload) => {
        console.log(
          `Enemy ${id} collided with:`,
          payload.other.rigidBodyObject?.name,
        );
        if (payload.other.rigidBodyObject?.name?.startsWith("ally-")) {
          const allyId = payload.other.rigidBodyObject.name.replace(
            "ally-",
            "",
          );
          console.log(
            `Enemy ${id} hit ally ${allyId}. Removing enemy and scoring.`,
          );
          damageAlly(allyId, 3);
          removeEnemy(id, true);
        }
      }}
    >
      <CuboidCollider args={[0.5, 1, 0.5]} position={[0, 1, 0]} />
      <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={3}>
        <primitive object={clone} />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/assets/Models/GLB%20format/character-vampire.glb");
