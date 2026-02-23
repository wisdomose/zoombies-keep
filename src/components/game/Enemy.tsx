import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useGameStore } from "../../store/gameStore";
import { useModelFactory } from "./ModelFactory";
import { useWalkAnimation } from "../../hooks/useWalkAnimation";
import { parseEntityId } from "../../utils/collision";
import { Haptics } from "../../utils/haptics";
import { AudioUtils } from "../../utils/audio";
import {
  ENEMY_MOVE_SPEED,
  ENEMY_REACH_Z,
  ENTITY_FALL_Y,
  ALLY_DAMAGE_TO_ENEMY,
} from "../../constants/game";
import type { GLTFResult } from "../../types/gltf";

const NORMAL_MODEL = "/assets/Models/GLB%20format/character-vampire.glb";
const BOSS_MODEL = "/assets/Models/GLB%20format/character-zombie.glb";

const NORMAL_CONFIG = {
  colliderArgs: [0.5, 1, 0.5] as [number, number, number],
  colliderPosition: [0, 1, 0] as [number, number, number],
  scale: 3,
};

const BOSS_CONFIG = {
  colliderArgs: [1.5, 3, 1.5] as [number, number, number],
  colliderPosition: [0, 3, 0] as [number, number, number],
  scale: 9,
};

export const Enemy = React.memo(function Enemy({
  id,
  position,
  isBoss,
  speedMultiplier,
}: {
  id: string;
  position: [number, number, number];
  isBoss: boolean;
  speedMultiplier: number;
}) {
  const rbRef = useRef<RapierRigidBody>(null);
  const { removeEnemy, damageEnemy, damageAlly } = useGameStore();
  const factory = useModelFactory();

  const { animations } = useGLTF(
    isBoss ? BOSS_MODEL : NORMAL_MODEL,
  ) as GLTFResult;

  const clone = useMemo(() => {
    return isBoss ? factory.getZombie() : factory.getVampire();
  }, [factory, isBoss]);

  const { actions, names } = useAnimations(animations, clone);

  useWalkAnimation(actions, names);

  useFrame(() => {
    if (!rbRef.current) return;

    rbRef.current.setLinvel(
      { x: 0, y: 0, z: ENEMY_MOVE_SPEED * speedMultiplier },
      true,
    );

    const pos = rbRef.current.translation();
    if (pos.z > ENEMY_REACH_Z || pos.y < ENTITY_FALL_Y) {
      removeEnemy(id);
    }
  });

  function handleAllyHit(allyId: string) {
    damageAlly(allyId, ALLY_DAMAGE_TO_ENEMY);
    if (isBoss) {
      damageEnemy(id, 1);
    } else {
      removeEnemy(id, true);
    }
  }

  const config = isBoss ? BOSS_CONFIG : NORMAL_CONFIG;

  return (
    <RigidBody
      ref={rbRef}
      name={`enemy-${id}`}
      position={position}
      type="dynamic"
      colliders={false}
      lockRotations
      onCollisionEnter={({ other }) => {
        const name = other.rigidBodyObject?.name;
        const allyId = name ? parseEntityId(name, "ally-") : null;
        if (allyId) {
          Haptics.light();
          handleAllyHit(allyId);
        } else if (name?.startsWith("enemy-")) {
          AudioUtils.playBump();
        }
      }}
    >
      <CuboidCollider
        args={config.colliderArgs}
        position={config.colliderPosition}
      />
      <group scale={config.scale}>
        <primitive object={clone} />
      </group>
    </RigidBody>
  );
});

useGLTF.preload(NORMAL_MODEL);
useGLTF.preload(BOSS_MODEL);
