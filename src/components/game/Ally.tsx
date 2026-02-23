import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { useGLTF, useAnimations } from "@react-three/drei";

import { BOUNDARY_Z, useGameStore } from "../../store/gameStore";
import { useModelFactory } from "./ModelFactory";
import { useWalkAnimation } from "../../hooks/useWalkAnimation";
import {
  ENTITY_FALL_Y,
  ALLY_MOVE_SPEED,
  ALLY_NORMAL_SCALE,
  ALLY_HIT_SCALE,
} from "../../constants/game";
import type { GLTFResult } from "../../types/gltf";

export const Ally = React.memo(function Ally({
  id,
  position,
  strength,
}: {
  id: string;
  position: [number, number, number];
  strength: number;
}) {
  const rbRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);
  const removeAlly = useGameStore((state) => state.removeAlly);
  const prevStrength = useRef(strength);
  const factory = useModelFactory();

  const { animations } = useGLTF(
    "/assets/Models/GLB%20format/character-ghost.glb",
  ) as GLTFResult;

  // Get model from pool
  const clone = useMemo(() => factory.getGhost(), [factory]);
  const { actions, names } = useAnimations(animations, clone);

  useWalkAnimation(actions, names);

  useFrame(() => {
    if (rbRef.current) {
      // Allies move towards negative Z (towards enemy spawn)
      rbRef.current.setLinvel({ x: 0, y: 0, z: ALLY_MOVE_SPEED }, true);

      const pos = rbRef.current.translation();
      if (pos.z < -BOUNDARY_Z - 10) {
        removeAlly(id);
      }
      if (pos.y < ENTITY_FALL_Y) {
        console.warn(`Ally ${id} fell through ground at`, pos);
        removeAlly(id);
      }
    }

    if (groupRef.current) {
      // Always face forward (-Z)
      groupRef.current.rotation.y = Math.PI;

      // Lerp scale back to 3
      groupRef.current.scale.lerp(
        { x: ALLY_NORMAL_SCALE, y: ALLY_NORMAL_SCALE, z: ALLY_NORMAL_SCALE },
        0.1,
      );

      // If strength dropped, pop scale
      if (strength < prevStrength.current) {
        groupRef.current.scale.set(
          ALLY_HIT_SCALE,
          ALLY_HIT_SCALE,
          ALLY_HIT_SCALE,
        );
        prevStrength.current = strength;
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
      <group ref={groupRef} position={[0, 0, 0]} scale={ALLY_NORMAL_SCALE}>
        <primitive object={clone} />
      </group>
    </RigidBody>
  );
});

useGLTF.preload("/assets/Models/GLB%20format/character-ghost.glb");
