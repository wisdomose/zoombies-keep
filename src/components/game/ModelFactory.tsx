import React, { createContext, useContext, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { Group } from "three";
import type { GLTFResult } from "../../types/gltf";

interface ModelFactoryContextType {
  getGhost: () => Group;
  getVampire: () => Group;
  getZombie: () => Group;
}

const ModelFactoryContext = createContext<ModelFactoryContextType | null>(null);

export function ModelFactoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ghostGLTF = useGLTF(
    "/assets/Models/GLB%20format/character-ghost.glb",
  ) as GLTFResult;
  const vampireGLTF = useGLTF(
    "/assets/Models/GLB%20format/character-vampire.glb",
  ) as GLTFResult;
  const zombieGLTF = useGLTF(
    "/assets/Models/GLB%20format/character-zombie.glb",
  ) as GLTFResult;

  const factory = useMemo(
    () => ({
      getGhost: () => SkeletonUtils.clone(ghostGLTF.scene) as Group,
      getVampire: () => SkeletonUtils.clone(vampireGLTF.scene) as Group,
      getZombie: () => SkeletonUtils.clone(zombieGLTF.scene) as Group,
    }),
    [ghostGLTF, vampireGLTF, zombieGLTF],
  );

  return (
    <ModelFactoryContext.Provider value={factory}>
      {children}
    </ModelFactoryContext.Provider>
  );
}

export function useModelFactory() {
  const context = useContext(ModelFactoryContext);
  if (!context)
    throw new Error("useModelFactory must be used within ModelFactoryProvider");
  return context;
}

// Preload all
useGLTF.preload("/assets/Models/GLB%20format/character-ghost.glb");
useGLTF.preload("/assets/Models/GLB%20format/character-vampire.glb");
useGLTF.preload("/assets/Models/GLB%20format/character-zombie.glb");
