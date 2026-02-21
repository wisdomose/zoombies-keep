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
import { BOUNDARY_Z, useGameStore } from "../../store/gameStore";

export function Ally({
  id,
  position,
}: {
  id: string;
  position: [number, number, number];
}) {
  const rbRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<any>(null);
  const removeAlly = useGameStore((state) => state.removeAlly);
  const ally = useGameStore((state) => state.allies.find((a) => a.id === id));
  const prevStrength = useRef(ally?.strength || 3);

  const { scene, animations } = useGLTF(
    "/assets/Models/GLB%20format/character-ghost.glb",
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
      // Allies move towards negative Z (towards enemy spawn)
      rbRef.current.setLinvel({ x: 0, y: 0, z: -5 }, true);

      const pos = rbRef.current.translation();
      if (pos.z < -BOUNDARY_Z - 10) {
        removeAlly(id);
      }
      if (pos.y < -5) {
        console.warn(`Ally ${id} fell through ground at`, pos);
        removeAlly(id);
      }
    }

    if (groupRef.current) {
      // Always face forward (-Z)
      groupRef.current.rotation.y = Math.PI;

      // Lerp scale back to 3
      groupRef.current.scale.lerp({ x: 3, y: 3, z: 3 }, 0.1);

      // If strength dropped, pop scale
      if (ally && ally.strength < prevStrength.current) {
        groupRef.current.scale.set(4.5, 4.5, 4.5);
        prevStrength.current = ally.strength;
      }
    }
  });

  return (
    <RigidBody
      ref={rbRef}
      name={`ally-${id}`}
      position={position}
      type="dynamic"
      colliders={false}
      lockRotations
    >
      <CuboidCollider args={[0.5, 1, 0.5]} position={[0, 1, 0]} />
      <group ref={groupRef} position={[0, 0, 0]} scale={3}>
        <primitive object={clone} />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/assets/Models/GLB%20format/character-ghost.glb");
