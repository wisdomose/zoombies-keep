import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useGameStore } from "../../store/gameStore";
import { useModelPool } from "./ModelPool";

const MOVE_SPEED = 4;
const REACH_Z = 30;
const FALL_Y = -5;
const ALLY_DAMAGE = 3;

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
  const pool = useModelPool();

  const { animations } = useGLTF(isBoss ? BOSS_MODEL : NORMAL_MODEL) as any;

  const clone = useMemo(() => {
    return isBoss ? pool.getZombie() : pool.getVampire();
  }, [pool, isBoss]);

  const { actions, names } = useAnimations(animations, clone);

  useEffect(() => {
    const walkAnim =
      names.find((n) => n.toLowerCase().includes("walk")) ?? names[0];
    if (walkAnim && actions[walkAnim]) {
      actions[walkAnim].reset().fadeIn(0.2).play();
    }
    return () => {
      if (walkAnim && actions[walkAnim]) actions[walkAnim]?.fadeOut(0.2);
    };
  }, [actions, names]);

  useFrame(() => {
    if (!rbRef.current) return;

    rbRef.current.setLinvel(
      { x: 0, y: 0, z: MOVE_SPEED * speedMultiplier },
      true,
    );

    const pos = rbRef.current.translation();
    if (pos.z > REACH_Z || pos.y < FALL_Y) {
      removeEnemy(id);
    }
  });

  function handleAllyHit(allyId: string) {
    damageAlly(allyId, ALLY_DAMAGE);
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
        if (name?.startsWith("ally-")) {
          handleAllyHit(name.replace("ally-", ""));
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
