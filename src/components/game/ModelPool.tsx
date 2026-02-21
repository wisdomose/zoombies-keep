import React, { createContext, useContext, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { Group } from "three";

interface ModelPoolContextType {
  getGhost: () => Group;
  getVampire: () => Group;
  getZombie: () => Group;
}

const ModelPoolContext = createContext<ModelPoolContextType | null>(null);

export const ModelPoolProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const ghostGLTF = useGLTF(
    "/assets/Models/GLB%20format/character-ghost.glb",
  ) as any;
  const vampireGLTF = useGLTF(
    "/assets/Models/GLB%20format/character-vampire.glb",
  ) as any;
  const zombieGLTF = useGLTF(
    "/assets/Models/GLB%20format/character-zombie.glb",
  ) as any;

  const pool = useMemo(
    () => ({
      getGhost: () => SkeletonUtils.clone(ghostGLTF.scene) as Group,
      getVampire: () => SkeletonUtils.clone(vampireGLTF.scene) as Group,
      getZombie: () => SkeletonUtils.clone(zombieGLTF.scene) as Group,
    }),
    [ghostGLTF, vampireGLTF, zombieGLTF],
  );

  return (
    <ModelPoolContext.Provider value={pool}>
      {children}
    </ModelPoolContext.Provider>
  );
};

export const useModelPool = () => {
  const context = useContext(ModelPoolContext);
  if (!context)
    throw new Error("useModelPool must be used within ModelPoolProvider");
  return context;
};

// Preload all
useGLTF.preload("/assets/Models/GLB%20format/character-ghost.glb");
useGLTF.preload("/assets/Models/GLB%20format/character-vampire.glb");
useGLTF.preload("/assets/Models/GLB%20format/character-zombie.glb");
